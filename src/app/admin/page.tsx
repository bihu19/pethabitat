import { redirect } from "next/navigation";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import AdminContent from "./AdminContent";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let isAdmin = false;
  let places: any[] = [];

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    isAdmin = roleData?.role === "admin";
    if (!isAdmin) redirect("/");

    const { data } = await supabase.from("places").select("*").order("created_at", { ascending: false });
    places = data || [];
  } catch {
    redirect("/login");
  }

  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <AdminContent initialPlaces={places} />
      </main>
      <BottomNav />
    </Providers>
  );
}
