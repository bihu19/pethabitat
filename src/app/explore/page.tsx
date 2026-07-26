import { Suspense } from "react";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import ExploreContent from "./ExploreContent";
import type { Place } from "@/lib/types";
import {
  createPublicClient,
  PLACE_LIST_COLUMNS,
  PLACE_LIST_MAX,
} from "@/lib/supabase/public";

// Places are public, admin-curated data that changes rarely. Rendering this
// statically and revalidating every 5 minutes means one database query per
// window instead of one per visitor.
export const revalidate = 300;

export default async function ExplorePage() {
  let places: Place[] = [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("places")
      .select(PLACE_LIST_COLUMNS)
      .order("name")
      .limit(PLACE_LIST_MAX);
    places = (data as Place[] | null) || [];
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
