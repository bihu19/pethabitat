/**
 * URL safety helpers.
 *
 * Place URLs (`google_maps_url`, `website_url`, `cover_image`) are free text
 * submitted by users via place requests and by admins via the admin form. They
 * are later rendered into `href`/`src` attributes on public pages, so a stored
 * `javascript:` or `data:` URL would execute in the app's origin when clicked.
 * Everything that ends up in an attribute must pass through here first.
 */

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Returns the URL unchanged when it is a well-formed http(s) URL, otherwise
 * null. Use at render time for any `href`/`src` bound to stored data, and at
 * write time to reject bad input before it reaches the database.
 */
export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) return null;

  return parsed.toString();
}

/** True when the value is safe to store/render as an external link. */
export function isSafeExternalUrl(url: string | null | undefined): boolean {
  return safeExternalUrl(url) !== null;
}
