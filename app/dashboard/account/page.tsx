import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountClient } from "@/components/account-client";

export default async function AccountPage() {
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

  return (
    <AccountClient
      email={user.email ?? ""}
      displayName={user.user_metadata?.display_name ?? ""}
      stats={{ listCount: listCount ?? 0, itemCount: itemCount ?? 0, totalWeightGrams }}
    />
  );
}
