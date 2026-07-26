import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import LandingContent from "./LandingContent";
import { createPublicClient, PLACE_LIST_MAX } from "@/lib/supabase/public";

// Public, slow-moving data — cache it rather than querying per visitor.
export const revalidate = 300;

export default async function HomePage() {
  let places: { place_type: string; province: string; cover_image: string | null }[] = [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("places")
      .select("place_type, province, cover_image")
      .limit(PLACE_LIST_MAX);
    places = data || [];
  } catch {
    places = [];
  }

  return (
    <Providers>
      <Navbar />
      <main className="pt-20">
        <LandingContent places={places} />
      </main>
      <Footer />
      <BottomNav />
    </Providers>
  );
}
