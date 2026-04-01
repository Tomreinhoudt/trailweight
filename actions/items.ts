"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface ItemData {
  name: string;
  description: string | null;
  category: string;
  weight_grams: number;
  cost_cents: number;
  quantity: number;
  worn: boolean;
  consumable: boolean;
}

export async function createItem(listId: string, data: ItemData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("gear_items").insert({
    list_id: listId,
    user_id: user.id,
    ...data,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/lists/${listId}`);
}

export async function updateItem(
  itemId: string,
  listId: string,
  data: ItemData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_items")
    .update(data)
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/lists/${listId}`);
}

export async function deleteItem(itemId: string, listId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/lists/${listId}`);
}

// orderedIds: item IDs in their new order (all items in the list)
export async function reorderItems(listId: string, orderedIds: string[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("gear_items")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("user_id", user.id)
    )
  );

  revalidatePath(`/dashboard/lists/${listId}`);
}

export async function moveItemToList(
  itemId: string,
  fromListId: string,
  toListId: string,
  category: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("gear_items")
    .update({ list_id: toListId, category })
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/lists/${fromListId}`);
  revalidatePath(`/dashboard/lists/${toListId}`);
}
