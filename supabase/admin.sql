-- Admin Role System for PetHabitat
-- Run this in Supabase SQL Editor after schema.sql and storage.sql

-- User roles table
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Everyone can read their own role
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Helper function to check admin status (used by RLS policies)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admins can manage roles
CREATE POLICY "Admins can manage roles" ON user_roles
  FOR ALL USING (is_admin());

-- Allow admins to insert/update/delete places
CREATE POLICY "Admins can insert places" ON places
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update places" ON places
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete places" ON places
  FOR DELETE USING (is_admin());

-- Storage bucket for place cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('place-covers', 'place-covers', true);

CREATE POLICY "Anyone can view place covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'place-covers');

CREATE POLICY "Admins can upload place covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'place-covers' AND (SELECT is_admin()));

CREATE POLICY "Admins can update place covers" ON storage.objects
  FOR UPDATE USING (bucket_id = 'place-covers' AND (SELECT is_admin()));

CREATE POLICY "Admins can delete place covers" ON storage.objects
  FOR DELETE USING (bucket_id = 'place-covers' AND (SELECT is_admin()));

-- Seed first admin (run AFTER sanhanat.porn@gmail.com has registered)
-- If the user hasn't registered yet, run this line later:
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'sanhanat.porn@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
