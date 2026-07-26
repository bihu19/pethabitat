"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Flushes the cached public pages after an admin changes the place catalogue.
 *
 * The landing and explore pages are statically rendered with a 5 minute
 * revalidate window, so without this an admin would not see their own edit
 * until the window expired. Call after any create/update/delete/approve.
 *
 * Server actions are reachable by any client that can guess the action id, so
 * this re-checks the caller's role rather than trusting the UI that invoked it.
 */
export async function revalidatePlaceCaches(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (roleData?.role !== "admin") return;

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/places/[id]", "page");
}
