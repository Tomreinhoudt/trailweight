import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateListButton } from "@/components/create-list-button";
import { CsvImportButton } from "@/components/csv-import-button";
import { SortableListsGrid } from "@/components/sortable-lists-grid";
import type { GearList } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink-1">
            Gear Lists
          </h1>
          <p className="text-xs text-ink-3 font-mono uppercase tracking-widest mt-1.5">
            {lists && lists.length > 0
              ? `${lists.length} list${lists.length !== 1 ? "s" : ""} configured`
              : "No lists yet — build your first kit"}
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
        <div className="text-center py-24 bg-field-card border border-field-border rounded-2xl topo-bg">
          <div className="w-14 h-14 bg-volt-muted border border-volt/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M3 22 L8 9 L13 15 L18 5 L23 22" stroke="#C8ED40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display text-lg font-bold uppercase tracking-widest text-ink-1 mb-2">
            No Gear Lists
          </h2>
          <p className="text-xs text-ink-2 font-mono mb-8 max-w-xs mx-auto leading-relaxed">
            Build your first kit list to start tracking pack weight
          </p>
          <CreateListButton />
        </div>
      )}
    </div>
  );
}
