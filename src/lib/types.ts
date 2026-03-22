export type PlaceType = "Hotel" | "Pet Hotel" | "Cafe" | "Restaurant" | "Hospital" | "Clinic" | "Pet Supplier" | "Shopping Mall" | "Park" | "Pool" | "Pet School";

export interface Place {
  id: string;
  place_type: string;
  name: string;
  province: string;
  google_maps_url: string | null;
  website_url: string | null;
  description: string | null;
  pet_fee: string | null;
  pet_condition: string | null;
  pet_friendly: string | null;
  cover_image: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed: string | null;
  birthday: string | null;
  weight: number | null;
  temperament: string[];
  social_dogs: string | null;
  social_cats: string | null;
  special_needs: string | null;
  photo_url: string | null;
  status: "alive" | "deceased";
  date_of_death: string | null;
  created_at: string;
}

export type UserRole = "admin" | "user";

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  pet_id: string;
  record_type: "vaccination" | "checkup" | "medication" | "surgery" | "other";
  title: string;
  description: string | null;
  date: string;
  next_due_date: string | null;
  veterinarian: string | null;
  clinic: string | null;
  status: "completed" | "upcoming" | "overdue";
  created_at: string;
}
