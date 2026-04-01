import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GearListClient } from "@/components/gear-list-client";
import type { GearList } from "@/lib/types";

export default async function ListPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: list }, { data: otherLists }] = await Promise.all([
    supabase
      .from("gear_lists")
      .select("*, gear_items(*)")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("gear_lists")
      .select("id, name")
      .eq("user_id", user.id)
      .neq("id", params.id)
      .order("sort_order", { ascending: true }),
  ]);

  if (!list) notFound();

  // Sort items by sort_order, falling back to created_at
  if (list.gear_items) {
    list.gear_items.sort(
      (a: { sort_order?: number; created_at: string }, b: { sort_order?: number; created_at: string }) => {
        const aOrder = a.sort_order ?? 9999;
        const bOrder = b.sort_order ?? 9999;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.created_at.localeCompare(b.created_at);
      }
    );
  }

  return (
    <GearListClient
      list={list as GearList}
      otherLists={(otherLists ?? []) as { id: string; name: string }[]}
    />
  );
}
