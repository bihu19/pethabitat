import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for reading public, unauthenticated data on the server.
 *
 * The cookie-bound client in ./server.ts calls `cookies()`, which opts the
 * route into dynamic rendering — every visitor triggers a fresh database query
 * even when the data is identical for all of them. Places and reviews are
 * world-readable (`FOR SELECT USING (true)`), so pages that only read those can
 * use this session-less client and be cached/revalidated instead.
 *
 * Only use this for data that is genuinely public. It carries no user session,
 * so RLS evaluates it as the `anon` role — anything user-scoped will come back
 * empty rather than failing loudly.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Columns the place list UI actually renders. Avoids shipping the full row. */
export const PLACE_LIST_COLUMNS =
  "id, name, place_type, province, description, pet_fee, pet_friendly, cover_image, google_maps_url, latitude, longitude";

/**
 * Upper bound on rows fetched for the explore map. The map renders every pin
 * client-side, so this is a safety cap rather than pagination — if the
 * catalogue approaches it, move filtering server-side (the trigram indexes in
 * supabase/migrations are already in place for that).
 */
export const PLACE_LIST_MAX = 2000;
