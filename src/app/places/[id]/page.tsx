import { notFound } from "next/navigation";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import PlaceDetailsContent from "./PlaceDetailsContent";
import { samplePlaces } from "@/lib/sampleData";
import { createPublicClient } from "@/lib/supabase/public";
import type { Place, Review } from "@/lib/types";

// Places and their reviews are world-readable, so this page can be cached
// rather than hitting the database once per visitor.
export const revalidate = 300;

/** Newest reviews rendered on first load; older ones are not shown. */
const REVIEW_PAGE_SIZE = 20;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PlaceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let place: Place | null = null;
  let reviews: Review[] = [];
  let queriedDatabase = false;

  if (UUID_PATTERN.test(id)) {
    try {
      const supabase = createPublicClient();

      // Both queries key off `id` alone, so there is no reason to await the
      // place before starting the reviews query.
      const [placeResult, reviewResult] = await Promise.all([
        supabase.from("places").select("*").eq("id", id).maybeSingle(),
        supabase
          // View exposing a display name only — never the reviewer's email.
          // Defined in supabase/migrations/20260726_security_hardening.sql.
          .from("reviews_with_user")
          .select("id, place_id, user_id, rating, comment, created_at, user_name")
          .eq("place_id", id)
          .order("created_at", { ascending: false })
          .limit(REVIEW_PAGE_SIZE),
      ]);

      queriedDatabase = true;
      place = (placeResult.data as Place | null) ?? null;
      reviews = (reviewResult.data as Review[] | null) ?? [];
    } catch {
      // Supabase not configured — fall through to sample data below.
    }
  }

  if (!place) {
    if (queriedDatabase) {
      // The database answered and has no such place.
      notFound();
    }
    // No database configured: fall back to bundled sample data so the UI is
    // still browsable in local development.
    const sample = samplePlaces.find((p) => p.id === id);
    if (!sample) notFound();
    place = sample as Place;
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
