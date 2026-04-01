import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClosetClient } from "@/components/closet-client";
import type { ClosetItem } from "@/lib/types";

export default async function ClosetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("gear_closet_items")
    .select("*")
    .eq("user_id", user.id)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  return <ClosetClient initialItems={(data ?? []) as ClosetItem[]} />;
}
