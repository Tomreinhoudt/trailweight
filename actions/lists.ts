"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface ImportItem {
  name: string;
  description: string | null;
  category: string;
  weight_grams: number;
  cost_cents: number;
  quantity: number;
  worn: boolean;
  consumable: boolean;
}

export async function importListWithItems(data: {
  name: string;
  items: ImportItem[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: list, error: listError } = await supabase
    .from("gear_lists")
    .insert({ name: data.name, description: null, user_id: user.id })
    .select()
    .single();

  if (listError) throw new Error(listError.message);

  if (data.items.length > 0) {
    const { error: itemsError } = await supabase.from("gear_items").insert(
      data.items.map((item) => ({
        ...item,
        list_id: list.id,
        user_id: user.id,
      }))
    );
    if (itemsError) throw new Error(itemsError.message);
  }

  revalidatePath("/dashboard");
  return { listId: list.id };
}

export async function createList(data: {
  name: string;
  description: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: list, error } = await supabase
    .from("gear_lists")
    .insert({ name: data.name, description: data.description, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  redirect(`/dashboard/lists/${list.id}`);
}

export async function deleteList(listId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_lists")
    .delete()
    .eq("id", listId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function reorderLists(orderedIds: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("gear_lists")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("user_id", user.id)
    )
  );

  revalidatePath("/dashboard");
}

export async function updateCategoryOrder(listId: string, categoryOrder: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_lists")
    .update({ category_order: categoryOrder })
    .eq("id", listId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/lists/${listId}`);
}

export async function updateList(
  listId: string,
  data: { name: string; description: string | null }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_lists")
    .update({ name: data.name, description: data.description })
    .eq("id", listId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/lists/${listId}`);
  revalidatePath("/dashboard");
}

export async function duplicateList(listId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: original } = await supabase
    .from("gear_lists")
    .select("*, gear_items(*)")
    .eq("id", listId)
    .eq("user_id", user.id)
    .single();

  if (!original) throw new Error("List not found");

  const { data: newList, error } = await supabase
    .from("gear_lists")
    .insert({
      user_id: user.id,
      name: `${original.name} (copy)`,
      description: original.description,
      category_order: original.category_order,
      weight_target_grams: original.weight_target_grams,
      is_public: false,
    })
    .select()
    .single();

  if (error || !newList) throw new Error(error?.message ?? "Failed to create list");

  if (original.gear_items?.length > 0) {
    await supabase.from("gear_items").insert(
      original.gear_items.map((item: any) => ({
        list_id: newList.id,
        user_id: user.id,
        name: item.name,
        description: item.description,
        category: item.category,
        weight_grams: item.weight_grams,
        cost_cents: item.cost_cents,
        quantity: item.quantity,
        worn: item.worn,
        consumable: item.consumable,
        sort_order: item.sort_order,
      }))
    );
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/lists/${newList.id}`);
}

export async function updateWeightTarget(listId: string, targetGrams: number | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_lists")
    .update({ weight_target_grams: targetGrams })
    .eq("id", listId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/lists/${listId}`);
}

export async function setListPublic(listId: string, isPublic: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_lists")
    .update({ is_public: isPublic })
    .eq("id", listId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/lists/${listId}`);
}
