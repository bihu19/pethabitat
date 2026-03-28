-- Add pet_amenities field for Hotel-type places
-- Run this in Supabase SQL Editor

ALTER TABLE places ADD COLUMN IF NOT EXISTS pet_amenities TEXT;
