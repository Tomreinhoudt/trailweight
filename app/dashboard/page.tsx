import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateListButton } from "@/components/create-list-button";
import { CsvImportButton } from "@/components/csv-import-button";
import { SortableListsGrid } from "@/components/sortable-lists-grid";
import type { GearList } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: lists } = await supabase
    .from("gear_lists")
    .select("*, gear_items(*)")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Gear Lists</h1>
          <p className="text-slate-500 text-sm mt-1">
            {lists && lists.length > 0
              ? `${lists.length} list${lists.length !== 1 ? "s" : ""}`
              : "Plan your next adventure"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CsvImportButton />
          <CreateListButton />
        </div>
      </div>

      {lists && lists.length > 0 ? (
        <SortableListsGrid initialLists={lists as GearList[]} />
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl">
          <div className="text-5xl mb-4">🎒</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            No gear lists yet
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Create your first list to start tracking your ultralight setup
          </p>
          <CreateListButton />
        </div>
      )}
    </div>
  );
}
