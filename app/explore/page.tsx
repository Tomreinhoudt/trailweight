import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeListStats, formatWeight } from "@/lib/utils";
import type { GearItem } from "@/lib/types";

function TrailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M1.5 15.5 L5 6.5 L8 10.5 L11.5 3.5 L16.5 15.5" stroke="#C8ED40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = await createClient();
  const query = searchParams.q?.trim() ?? "";

  let req = supabase
    .from("gear_lists")
    .select("id, name, description, created_at, gear_items(*)")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(60);

  if (query) req = req.ilike("name", `%${query}%`);

  const { data: lists } = await req;

  return (
    <div className="min-h-screen bg-field-bg">
      {/* Nav */}
      <div className="border-b border-field-border bg-field-surface/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-volt-muted border border-volt/30 rounded-md flex items-center justify-center">
              <TrailIcon />
            </div>
            <span className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">TrailWeight</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-[10px] font-mono uppercase tracking-wider text-ink-3 hover:text-ink-1 transition-colors px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/signup" className="text-[10px] font-mono uppercase tracking-wider text-ink-1 bg-volt hover:bg-volt-dim text-field-bg px-3 py-1.5 rounded-lg font-display font-bold transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-ink-3 mb-2">Community</p>
          <h1 className="font-display text-3xl font-bold text-ink-1 uppercase tracking-wide">Explore Gear Lists</h1>
          <p className="text-ink-3 text-xs font-mono mt-2">Real kits from the trail community</p>
        </div>

        {/* Search */}
        <form method="get" className="mb-8">
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search lists by name..."
              className="flex-1 px-4 py-2.5 bg-field-card border border-field-border rounded-lg text-sm text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-volt hover:bg-volt-dim text-field-bg font-display font-bold text-xs rounded-lg transition-colors uppercase tracking-widest"
            >
              Search
            </button>
            {query && (
              <Link href="/explore" className="px-4 py-2.5 border border-field-border rounded-lg text-xs font-mono text-ink-3 hover:text-ink-1 hover:bg-field-elevated transition-colors uppercase tracking-wider">
                Clear
              </Link>
            )}
          </div>
        </form>

        {/* Results */}
        {!lists || lists.length === 0 ? (
          <div className="text-center py-20 text-ink-3 font-mono text-sm">
            {query ? `No public lists match "${query}"` : "No public lists yet. Be the first to share!"}
          </div>
        ) : (
          <>
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-4">
              {lists.length} list{lists.length !== 1 ? "s" : ""}{query ? ` matching "${query}"` : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lists.map((list) => {
                const items = (list.gear_items ?? []) as GearItem[];
                const stats = computeListStats(items);
                return (
                  <Link key={list.id} href={`/share/${list.id}`}>
                    <div className="bg-field-card border border-field-border rounded-xl overflow-hidden hover:border-volt/40 transition-all cursor-pointer group">
                      <div className="h-0.5 bg-volt" />
                      <div className="p-5">
                        <h3 className="font-display font-bold text-ink-1 text-sm uppercase tracking-wide truncate group-hover:text-volt transition-colors">
                          {list.name}
                        </h3>
                        {list.description && (
                          <p className="text-ink-3 text-xs mt-1 truncate font-mono">{list.description}</p>
                        )}
                        <div className="mt-4 pt-4 border-t border-field-border flex items-end justify-between">
                          <div>
                            <p className="text-2xl font-mono font-bold text-volt tabular-nums leading-none volt-glow">
                              {stats.baseWeightGrams > 0 ? formatWeight(stats.baseWeightGrams, "oz") : "—"}
                            </p>
                            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mt-1.5">Base Weight</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-ink-2 font-mono tabular-nums">
                              {items.length} <span className="text-ink-3">items</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
