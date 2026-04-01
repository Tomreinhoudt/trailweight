"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ClosetItem } from "@/lib/types";

interface ClosetItemData {
  name: string;
  brand: string | null;
  description: string | null;
  category: string;
  weight_grams: number;
  cost_cents: number;
  url: string | null;
}

export async function getClosetItems(): Promise<ClosetItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("gear_closet_items")
    .select("*")
    .eq("user_id", user.id)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  return (data ?? []) as ClosetItem[];
}

export async function createClosetItem(data: ClosetItemData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("gear_closet_items").insert({ user_id: user.id, ...data });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/closet");
}

export async function updateClosetItem(itemId: string, data: ClosetItemData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_closet_items").update(data).eq("id", itemId).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/closet");
}

export async function deleteClosetItem(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_closet_items").delete().eq("id", itemId).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/closet");
}
