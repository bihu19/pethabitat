import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Resolves Google Maps short links to their final URL so the caller can pull
 * coordinates out of it.
 *
 * This endpoint makes the server fetch a URL supplied by the client, which is a
 * server-side request forgery primitive if left open. It is constrained on four
 * axes: the caller must be signed in, the hostname must be on an allowlist of
 * Google link-shortener/maps domains, redirects are followed manually with a
 * hop cap (each hop re-checked against the allowlist), and the response body is
 * never read or returned — only the final URL.
 */

export const runtime = "nodejs";

/** Hosts we are willing to issue an outbound request to. */
const ALLOWED_HOSTS = new Set([
  "goo.gl",
  "maps.app.goo.gl",
  "maps.google.com",
  "www.google.com",
  "google.com",
]);

/** Google localises maps links onto country domains (google.co.th, ...). */
const ALLOWED_HOST_PATTERN = /^(www\.|maps\.)?google\.[a-z]{2,3}(\.[a-z]{2})?$/;

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 5000;
const MAX_URL_LENGTH = 2048;

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return ALLOWED_HOSTS.has(host) || ALLOWED_HOST_PATTERN.test(host);
}

/**
 * Parses and validates a candidate URL. Returns null unless it is an https URL
 * on an allowlisted Google host.
 */
function parseAllowedUrl(raw: string): URL | null {
  if (raw.length > MAX_URL_LENGTH) return null;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  // https only: http would allow a downgrade and adds nothing here.
  if (parsed.protocol !== "https:") return null;
  if (!isAllowedHost(parsed.hostname)) return null;

  return parsed;
}

export async function POST(req: NextRequest) {
  // Only signed-in users can make the server issue outbound requests.
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id;
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const url = (body as { url?: unknown } | null)?.url;
  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  let current = parseAllowedUrl(url);
  if (!current) {
    return NextResponse.json(
      { error: "Only Google Maps links are supported" },
      { status: 400 }
    );
  }

  // Follow redirects by hand so every hop is re-validated against the
  // allowlist. `redirect: "follow"` would let the first response bounce us to
  // an arbitrary host, including internal addresses.
  try {
    for (let hop = 0; hop < MAX_REDIRECTS; hop++) {
      const response = await fetch(current, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { "User-Agent": "PetHabitat/1.0" },
      });

      const location = response.headers.get("location");
      if (!location) {
        // Terminal response — this is the resolved URL.
        return NextResponse.json({ resolvedUrl: current.toString() });
      }

      const next = parseAllowedUrl(new URL(location, current).toString());
      if (!next) {
        return NextResponse.json(
          { error: "Link redirected outside of Google Maps" },
          { status: 400 }
        );
      }
      current = next;
    }

    return NextResponse.json({ error: "Too many redirects" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to resolve URL" }, { status: 502 });
  }
}
