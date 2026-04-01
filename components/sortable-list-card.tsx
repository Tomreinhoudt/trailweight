"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import Link from "next/link";
import { formatWeight, computeListStats } from "@/lib/utils";
import type { GearList } from "@/lib/types";

export function SortableListCard({ list }: { list: GearList }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: list.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const items = list.gear_items || [];
  const stats = computeListStats(items);

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-30" : ""}>
      <div className="relative group">
        <button
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-10 p-1.5 text-ink-3 hover:text-volt opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing touch-none rounded-md hover:bg-field-elevated"
          tabIndex={-1}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <Link href={`/dashboard/lists/${list.id}`}>
          <div className="bg-field-card border border-field-border rounded-xl overflow-hidden hover:border-volt/40 transition-all cursor-pointer group">
            {/* Hi-viz top strip */}
            <div className="h-0.5 bg-volt" />

            <div className="p-5">
              <h3 className="font-display font-bold text-ink-1 text-base uppercase tracking-wide truncate pr-8 group-hover:text-volt transition-colors">
                {list.name}
              </h3>
              {list.description && (
                <p className="text-ink-3 text-xs mt-1 truncate font-mono">{list.description}</p>
              )}

              <div className="mt-4 pt-4 border-t border-field-border flex items-end justify-between">
                <div>
                  <p className="text-[28px] font-mono font-bold text-volt tabular-nums leading-none volt-glow">
                    {stats.baseWeightGrams > 0 ? formatWeight(stats.baseWeightGrams, "oz") : "—"}
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mt-1.5">
                    Base Weight
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink-2 font-mono tabular-nums">
                    {items.length} <span className="text-ink-3">items</span>
                  </p>
                  {stats.totalCostCents > 0 && (
                    <p className="text-xs text-ink-3 font-mono mt-0.5">
                      ${(stats.totalCostCents / 100).toFixed(0)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
