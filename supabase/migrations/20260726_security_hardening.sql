-- PetHabitat security hardening
-- Run in the Supabase SQL editor after schema.sql, storage.sql, admin.sql and
-- place-requests.sql. Every statement is idempotent and safe to re-run.
--
-- CAVEAT: sections 4 and 5 add CHECK constraints, which validate existing rows.
-- If any row already violates one (an over-length description, a non-http URL,
-- a zero weight) the ALTER will fail and name the constraint. Either clean the
-- offending rows first, or append NOT VALID to that constraint so it applies
-- only to new writes and run `ALTER TABLE ... VALIDATE CONSTRAINT ...` once the
-- backlog is fixed. Run this on a branch/staging project first.

-- ---------------------------------------------------------------------------
-- 1. Stop leaking reviewer email addresses  [CRITICAL]
-- ---------------------------------------------------------------------------
-- `reviews_with_user` joins auth.users and selects u.email. A view runs with
-- the privileges of its owner and is not itself subject to RLS, so any client
-- holding the anon key could `select * from reviews_with_user` and read the
-- email address of every user who has ever left a review — no login required.
--
-- Replace it with a view that exposes only a display name, and mark it
-- security_invoker so the caller's RLS applies to the underlying reviews table.

DROP VIEW IF EXISTS reviews_with_user;

CREATE VIEW reviews_with_user
WITH (security_invoker = true) AS
SELECT
  r.id,
  r.place_id,
  r.user_id,
  r.rating,
  r.comment,
  r.created_at,
  -- Display name only. Never the email, and never the local-part of the email
  -- (which the previous definition fell back to and which commonly identifies
  -- the person).
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data ->> 'full_name'), ''),
    'PetHabitat member'
  ) AS user_name
FROM reviews r
JOIN auth.users u ON r.user_id = u.id;

REVOKE ALL ON reviews_with_user FROM anon, authenticated;
GRANT SELECT ON reviews_with_user TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Pin the search_path on the SECURITY DEFINER helper  [HIGH]
-- ---------------------------------------------------------------------------
-- is_admin() runs as its owner. Without a fixed search_path a caller who can
-- create objects in a schema earlier in the path could shadow `user_roles` and
-- make the function return true.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Stop users self-approving their own place requests  [HIGH]
-- ---------------------------------------------------------------------------
-- The INSERT policy only checked ownership, so a user posting directly to
-- PostgREST could set status='approved' and admin_note on their own row. The
-- admin UI lists by status, so a self-approved row lands straight in the
-- "processed" tab and escapes review.

DROP POLICY IF EXISTS "Users can create requests" ON place_requests;

CREATE POLICY "Users can create requests" ON place_requests
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND admin_note IS NULL
  );

-- ---------------------------------------------------------------------------
-- 4. Reject javascript:/data: URLs at the database boundary  [HIGH]
-- ---------------------------------------------------------------------------
-- Defence in depth behind the application-level check in src/lib/safeUrl.ts.
-- These columns are rendered into href/src attributes on public pages.

CREATE OR REPLACE FUNCTION is_http_url(candidate TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
SET search_path = pg_catalog, pg_temp
AS $$
  SELECT candidate IS NULL OR candidate ~* '^https?://[^\s<>"]+$';
$$;

ALTER TABLE places
  DROP CONSTRAINT IF EXISTS places_urls_are_http,
  ADD CONSTRAINT places_urls_are_http CHECK (
    is_http_url(google_maps_url)
    AND is_http_url(website_url)
    AND is_http_url(cover_image)
  );

ALTER TABLE place_requests
  DROP CONSTRAINT IF EXISTS place_requests_urls_are_http,
  ADD CONSTRAINT place_requests_urls_are_http CHECK (
    is_http_url(google_maps_url)
    AND is_http_url(website_url)
    AND is_http_url(cover_image)
  );

-- ---------------------------------------------------------------------------
-- 5. Bound free-text and numeric input  [MEDIUM]
-- ---------------------------------------------------------------------------
-- TEXT columns are unbounded, so a client posting straight to PostgREST can
-- store multi-megabyte strings. Length caps are the cheapest defence against
-- storage-abuse by an authenticated user.

ALTER TABLE places
  DROP CONSTRAINT IF EXISTS places_text_lengths,
  ADD CONSTRAINT places_text_lengths CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(place_type) <= 200
    AND char_length(province) <= 100
    AND char_length(COALESCE(description, '')) <= 5000
    AND char_length(COALESCE(pet_fee, '')) <= 500
    AND char_length(COALESCE(pet_condition, '')) <= 2000
    AND char_length(COALESCE(pet_friendly, '')) <= 500
    AND char_length(COALESCE(google_maps_url, '')) <= 2048
    AND char_length(COALESCE(website_url, '')) <= 2048
    AND char_length(COALESCE(cover_image, '')) <= 2048
  );

ALTER TABLE places
  DROP CONSTRAINT IF EXISTS places_coords_in_range,
  ADD CONSTRAINT places_coords_in_range CHECK (
    latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180
  );

ALTER TABLE place_requests
  DROP CONSTRAINT IF EXISTS place_requests_text_lengths,
  ADD CONSTRAINT place_requests_text_lengths CHECK (
    char_length(name) BETWEEN 1 AND 200
    AND char_length(place_type) <= 200
    AND char_length(province) <= 100
    AND char_length(COALESCE(description, '')) <= 5000
    AND char_length(COALESCE(pet_fee, '')) <= 500
    AND char_length(COALESCE(pet_condition, '')) <= 2000
    AND char_length(COALESCE(pet_friendly, '')) <= 500
    AND char_length(COALESCE(admin_note, '')) <= 2000
    AND char_length(COALESCE(google_maps_url, '')) <= 2048
    AND char_length(COALESCE(website_url, '')) <= 2048
    AND char_length(COALESCE(cover_image, '')) <= 2048
  );

ALTER TABLE place_requests
  DROP CONSTRAINT IF EXISTS place_requests_coords_in_range,
  ADD CONSTRAINT place_requests_coords_in_range CHECK (
    latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180
  );

ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_comment_length,
  ADD CONSTRAINT reviews_comment_length CHECK (
    char_length(comment) BETWEEN 1 AND 4000
  );

-- One review per user per place. Without this a single account can inflate a
-- place's rating without limit.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_reviews_user_place
  ON reviews(user_id, place_id);

ALTER TABLE pets
  DROP CONSTRAINT IF EXISTS pets_field_bounds,
  ADD CONSTRAINT pets_field_bounds CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(COALESCE(breed, '')) <= 100
    AND char_length(COALESCE(special_needs, '')) <= 2000
    AND char_length(COALESCE(social_dogs, '')) <= 500
    AND char_length(COALESCE(social_cats, '')) <= 500
    AND (weight IS NULL OR (weight > 0 AND weight <= 500))
    AND (birthday IS NULL OR birthday <= CURRENT_DATE)
    AND (date_of_death IS NULL OR date_of_death <= CURRENT_DATE)
    AND (birthday IS NULL OR date_of_death IS NULL OR date_of_death >= birthday)
    AND (array_length(temperament, 1) IS NULL OR array_length(temperament, 1) <= 20)
  );

ALTER TABLE medical_records
  DROP CONSTRAINT IF EXISTS medical_records_field_bounds,
  ADD CONSTRAINT medical_records_field_bounds CHECK (
    char_length(title) BETWEEN 1 AND 200
    AND char_length(COALESCE(description, '')) <= 5000
    AND char_length(COALESCE(veterinarian, '')) <= 200
    AND char_length(COALESCE(clinic, '')) <= 200
    AND (next_due_date IS NULL OR next_due_date >= date)
  );

-- ---------------------------------------------------------------------------
-- 6. Constrain the public storage buckets  [HIGH]
-- ---------------------------------------------------------------------------
-- The buckets accept any file of any size. SVG is excluded because these
-- buckets are public: an uploaded SVG containing <script>, opened directly,
-- executes on the storage origin.

UPDATE storage.buckets
SET
  file_size_limit = 5242880, -- 5MB
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id IN ('avatars', 'pet-photos', 'place-covers');

-- ---------------------------------------------------------------------------
-- 7. Indexes matching how the app actually queries  [PERFORMANCE]
-- ---------------------------------------------------------------------------

-- /explore and the admin list both order by these.
CREATE INDEX IF NOT EXISTS idx_places_created_at ON places(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_places_name ON places(name);

-- The admin request queue reads pending rows newest-first.
CREATE INDEX IF NOT EXISTS idx_place_requests_status_created
  ON place_requests(status, created_at DESC);

-- Place detail pages page through reviews newest-first.
CREATE INDEX IF NOT EXISTS idx_reviews_place_created
  ON reviews(place_id, created_at DESC);

-- Substring search (ILIKE '%q%') cannot use a B-tree index. Trigram indexes
-- make server-side search viable as the catalogue grows.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_places_name_trgm
  ON places USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_places_description_trgm
  ON places USING GIN (description gin_trgm_ops);
