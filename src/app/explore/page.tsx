import { Suspense } from "react";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ExploreContent from "./ExploreContent";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  let places = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("places").select("*").order("name");
    places = data || [];
  } catch {
    // Supabase not configured yet, use empty array
    places = [];
  }

  return (
    <Providers>
      <Navbar />
      <main className="pt-[72px] flex h-screen overflow-hidden">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
          <ExploreContent initialPlaces={places} />
        </Suspense>
      </main>
      <BottomNav />
    </Providers>
  );
}
