import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PlaceDetailsContent from "./PlaceDetailsContent";
import { samplePlaces } from "@/lib/sampleData";

export default async function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let place = null;
  let reviews: any[] = [];

  // Try Supabase first
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: placeData } = await supabase.from("places").select("*").eq("id", id).single();
    if (placeData) {
      place = placeData;
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*, user_email:user_id")
        .eq("place_id", id)
        .order("created_at", { ascending: false });
      reviews = reviewData || [];
    }
  } catch {
    // Supabase not configured
  }

  // Fallback to sample data
  if (!place) {
    place = samplePlaces.find((p) => p.id === id) || samplePlaces[0];
    reviews = [];
  }

  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20">
        <PlaceDetailsContent place={place} reviews={reviews} />
      </main>
      <Footer />
      <BottomNav />
    </Providers>
  );
}
