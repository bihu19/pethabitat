-- PetHabitat Database Schema

-- Places table
CREATE TABLE places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_type TEXT NOT NULL,
  name TEXT NOT NULL,
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
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pets table
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT 'dog' CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT,
  birthday DATE,
  weight DECIMAL(5,2),
  temperament TEXT[] DEFAULT '{}',
  social_dogs TEXT,
  social_cats TEXT,
  special_needs TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Medical records table
CREATE TABLE medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL DEFAULT 'vaccination' CHECK (record_type IN ('vaccination', 'checkup', 'medication', 'surgery', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  next_due_date DATE,
  veterinarian TEXT,
  clinic TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'upcoming', 'overdue')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Saved places (bookmarks)
CREATE TABLE saved_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, place_id)
);

-- Indexes
CREATE INDEX idx_places_type ON places(place_type);
CREATE INDEX idx_places_province ON places(province);
CREATE INDEX idx_reviews_place ON reviews(place_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_pets_user ON pets(user_id);
CREATE INDEX idx_medical_pet ON medical_records(pet_id);
CREATE INDEX idx_saved_user ON saved_places(user_id);

-- Row Level Security
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

-- Places: anyone can read
CREATE POLICY "Places are viewable by everyone" ON places FOR SELECT USING (true);

-- Reviews: anyone can read, authenticated users can create their own
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Pets: users can only access their own
CREATE POLICY "Users can view own pets" ON pets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own pets" ON pets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pets" ON pets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pets" ON pets FOR DELETE USING (auth.uid() = user_id);

-- Medical records: users can access records of their own pets
CREATE POLICY "Users can view own pet records" ON medical_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_records.pet_id AND pets.user_id = auth.uid())
);
CREATE POLICY "Users can create own pet records" ON medical_records FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_records.pet_id AND pets.user_id = auth.uid())
);
CREATE POLICY "Users can update own pet records" ON medical_records FOR UPDATE USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_records.pet_id AND pets.user_id = auth.uid())
);
CREATE POLICY "Users can delete own pet records" ON medical_records FOR DELETE USING (
  EXISTS (SELECT 1 FROM pets WHERE pets.id = medical_records.pet_id AND pets.user_id = auth.uid())
);

-- Saved places: users can only access their own
CREATE POLICY "Users can view own saved places" ON saved_places FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save places" ON saved_places FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave places" ON saved_places FOR DELETE USING (auth.uid() = user_id);

-- View for reviews with user info
CREATE OR REPLACE VIEW reviews_with_user AS
SELECT
  r.*,
  u.email as user_email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as user_name
FROM reviews r
JOIN auth.users u ON r.user_id = u.id;
