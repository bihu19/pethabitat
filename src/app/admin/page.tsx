import { redirect } from "next/navigation";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import AdminContent from "./AdminContent";
import { createClient } from "@/lib/supabase/server";
import type { Place, PlaceRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Cap on rows loaded into the admin UI. Both lists are filtered client-side,
 * so without a bound these grow with the catalogue and with user submissions.
 */
const ADMIN_PAGE_SIZE = 200;

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  // `redirect()` signals by throwing, so it must not sit inside a try/catch
  // that swallows the error — the previous version caught its own redirect and
  // sent non-admin users to /login instead of home.
  if (roleData?.role !== "admin") redirect("/");

  const [placesResult, requestsResult] = await Promise.all([
    supabase
      .from("places")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(ADMIN_PAGE_SIZE),
    supabase
      .from("place_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(ADMIN_PAGE_SIZE),
  ]);

  const places = (placesResult.data as Place[] | null) ?? [];
  const requests = (requestsResult.data as PlaceRequest[] | null) ?? [];

  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <AdminContent initialPlaces={places} initialRequests={requests} />
      </main>
      <BottomNav />
    </Providers>
  );
}
