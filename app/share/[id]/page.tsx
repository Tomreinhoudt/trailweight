import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeListStats, formatWeight, groupItemsByCategory } from "@/lib/utils";
import { ListCharts } from "@/components/list-charts";
import type { GearList, GearItem, WeightUnit } from "@/lib/types";

function TrailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M1.5 15.5 L5 6.5 L8 10.5 L11.5 3.5 L16.5 15.5" stroke="#C8ED40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function SharePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: list } = await supabase
    .from("gear_lists")
    .select("*, gear_items(*)")
    .eq("id", params.id)
    .eq("is_public", true)
    .single();

  if (!list) notFound();

  const items: GearItem[] = (list.gear_items ?? []).sort(
    (a: GearItem & { sort_order?: number }, b: GearItem & { sort_order?: number }) => {
      const ao = (a as any).sort_order ?? 9999;
      const bo = (b as any).sort_order ?? 9999;
      if (ao !== bo) return ao - bo;
      return a.created_at.localeCompare(b.created_at);
    }
  );

  const stats = computeListStats(items);
  const byCategory = groupItemsByCategory(items);
  const unit: WeightUnit = "oz";

  const categoryOrder: string[] = (list as any).category_order ?? [];
  const allCats = [
    ...categoryOrder.filter((c: string) => byCategory[c]),
    ...Object.keys(byCategory).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div className="min-h-screen bg-field-bg">

      {/* Top bar */}
      <div className="border-b border-field-border bg-field-surface/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-volt-muted border border-volt/30 rounded-md flex items-center justify-center">
              <TrailIcon />
            </div>
            <span className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">TrailWeight</span>
          </div>
          <Link
            href="/signup"
            className="text-[10px] font-mono uppercase tracking-wider text-ink-3 hover:text-volt transition-colors border border-field-border rounded-lg px-3 py-1.5 hover:border-volt/40"
          >
            Build Your List
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Hero header */}
        <div className="topo-bg rounded-2xl border border-field-border p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mb-2">Gear List</p>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink-1 uppercase tracking-wide">
                {list.name}
              </h1>
              {list.description && (
                <p className="text-ink-3 text-xs font-mono mt-2">{list.description}</p>
              )}
            </div>
          </div>

          {/* Key stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl sm:text-4xl font-mono font-bold text-volt volt-glow tabular-nums leading-none">
                {stats.baseWeightGrams > 0 ? formatWeight(stats.baseWeightGrams, unit) : "—"}
              </p>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mt-1.5">Base Weight</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-mono font-bold text-ink-1 tabular-nums leading-none">
                {formatWeight(stats.totalWeightGrams, unit)}
              </p>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mt-1.5">Pack Total</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-mono font-bold text-ink-1 tabular-nums leading-none">
                {items.length}
              </p>
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mt-1.5">Items</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        {items.length > 0 && <ListCharts items={items} unit={unit} />}

        {/* Item table by category */}
        {allCats.map((category) => {
          const catItems = byCategory[category] ?? [];
          if (!catItems.length) return null;
          const catWeight = catItems.reduce((s, i) => s + i.weight_grams * i.quantity, 0);
          return (
            <div key={category} className="bg-field-card border border-field-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-field-border bg-field-surface">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-volt rounded-full" />
                  <h2 className="font-display text-xs font-bold uppercase tracking-[0.12em] text-ink-1">{category}</h2>
                </div>
                <span className="text-xs font-mono text-volt tabular-nums">{formatWeight(catWeight, unit)}</span>
              </div>
              <div className="divide-y divide-field-border">
                {catItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-ink-1 truncate">{item.name}</p>
                      {item.description && (
                        <p className="text-[10px] font-mono text-ink-3 truncate mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {item.worn && (
                        <span className="text-[9px] font-mono uppercase tracking-wider text-ember bg-ember-muted border border-ember/20 px-1.5 py-0.5 rounded">worn</span>
                      )}
                      {item.consumable && (
                        <span className="text-[9px] font-mono uppercase tracking-wider text-ink-3 bg-field-elevated border border-field-border px-1.5 py-0.5 rounded">consumable</span>
                      )}
                      {item.quantity > 1 && (
                        <span className="text-xs font-mono text-ink-3">×{item.quantity}</span>
                      )}
                      <span className="text-sm font-mono font-bold text-ink-1 tabular-nums">
                        {formatWeight(item.weight_grams * item.quantity, unit)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer CTA */}
        <div className="border-t border-field-border pt-6 text-center">
          <p className="text-xs font-mono text-ink-3 mb-3">Track your own ultralight kit</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-volt hover:bg-volt-dim text-field-bg font-display font-bold text-xs px-6 py-3 rounded-lg transition-colors uppercase tracking-widest"
          >
            Get TrailWeight — Free
          </Link>
        </div>

      </div>
    </div>
  );
}
