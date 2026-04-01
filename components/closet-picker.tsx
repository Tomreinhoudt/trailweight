"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Package } from "lucide-react";
import { getClosetItems } from "@/actions/closet";
import { formatWeight } from "@/lib/utils";
import type { ClosetItem, WeightUnit } from "@/lib/types";

interface Props {
  unit: WeightUnit;
  onSelect: (item: ClosetItem) => void;
  onClose: () => void;
}

export function ClosetPickerModal({ unit, onSelect, onClose }: Props) {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getClosetItems().then((data) => { setItems(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.brand?.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ClosetItem[]>);
  }, [filtered]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-field-card border border-field-border rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-field-border bg-field-surface flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-volt rounded-full" />
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">Pick from Closet</h2>
          </div>
          <button onClick={onClose} className="text-ink-3 hover:text-ink-1 p-1 rounded-lg hover:bg-field-elevated transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-field-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gear..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-field-surface border border-field-border rounded-lg text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt font-mono"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-ink-3 font-mono text-xs">Loading closet...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Package className="w-8 h-8 text-ink-3" />
              <p className="text-ink-3 font-mono text-xs">
                {items.length === 0 ? "Your closet is empty. Add gear from the Closet page." : "No items match your search."}
              </p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, catItems]) => (
              <div key={category}>
                <div className="px-4 py-1.5 bg-field-surface border-b border-field-border">
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3">{category}</p>
                </div>
                {catItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-field-elevated transition-colors border-b border-field-border/50 last:border-0 group text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-mono text-ink-1 truncate group-hover:text-volt transition-colors">{item.name}</p>
                      {item.brand && <p className="text-[10px] font-mono text-ink-3 mt-0.5">{item.brand}</p>}
                    </div>
                    <span className="text-sm font-mono font-bold text-volt tabular-nums flex-shrink-0 ml-4">
                      {formatWeight(item.weight_grams, unit)}
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
