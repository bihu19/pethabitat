-- Add pet status fields
-- Run this in Supabase SQL Editor

ALTER TABLE pets ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'alive' CHECK (status IN ('alive', 'deceased'));
ALTER TABLE pets ADD COLUMN IF NOT EXISTS date_of_death DATE;
