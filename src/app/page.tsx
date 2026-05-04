import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import LandingContent from "./LandingContent";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let places: { place_type: string; province: string; cover_image: string | null }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("places")
      .select("place_type, province, cover_image");
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
