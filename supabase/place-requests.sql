-- Place requests from users
-- Run this in Supabase SQL Editor

CREATE TABLE place_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  name TEXT NOT NULL,
  place_type TEXT NOT NULL,
  province TEXT NOT NULL,
  google_maps_url TEXT,
  website_url TEXT,
  description TEXT,
  pet_fee TEXT,
  pet_condition TEXT,
  pet_friendly TEXT,
  cover_image TEXT,
  latitude DOUBLE PRECISION NOT NULL DEFAULT 13.7563,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 100.5018,
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_place_requests_user ON place_requests(user_id);
CREATE INDEX idx_place_requests_status ON place_requests(status);

ALTER TABLE place_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own requests" ON place_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create requests
CREATE POLICY "Users can create requests" ON place_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all requests" ON place_requests
  FOR SELECT USING (is_admin());

-- Admins can update requests (approve/reject)
CREATE POLICY "Admins can update requests" ON place_requests
  FOR UPDATE USING (is_admin());

-- Admins can delete requests
CREATE POLICY "Admins can delete requests" ON place_requests
  FOR DELETE USING (is_admin());
