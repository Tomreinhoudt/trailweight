"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateDisplayName(displayName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.auth.updateUser({
    data: { display_name: displayName.trim() },
  });
  if (error) throw new Error(error.message);
}

export async function updateEmail(newEmail: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
  if (error) throw new Error(error.message);
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export async function getAccountStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ count: listCount }, { count: itemCount }, { data: items }] = await Promise.all([
    supabase.from("gear_lists").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("gear_items").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("gear_items").select("weight_grams, quantity").eq("user_id", user.id),
  ]);

  const totalWeightGrams = (items || []).reduce(
    (sum, item) => sum + item.weight_grams * item.quantity, 0
  );

  return { listCount: listCount ?? 0, itemCount: itemCount ?? 0, totalWeightGrams };
}
