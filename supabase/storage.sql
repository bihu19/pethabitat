-- Supabase Storage buckets for image uploads
-- Run this in Supabase SQL Editor after schema.sql

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('pet-photos', 'pet-photos', true);

-- Avatars: users can upload/update/delete their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars are publicly viewable" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Pet photos: users can upload/update/delete photos for their own pets
CREATE POLICY "Users can upload pet photos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update pet photos" ON storage.objects FOR UPDATE
  USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete pet photos" ON storage.objects FOR DELETE
  USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Pet photos are publicly viewable" ON storage.objects FOR SELECT
  USING (bucket_id = 'pet-photos');
