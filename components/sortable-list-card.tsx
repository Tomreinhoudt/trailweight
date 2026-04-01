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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const items = list.gear_items || [];
  const stats = computeListStats(items);

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-40" : ""}>
      <div className="relative group">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 z-10 p-1 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
          tabIndex={-1}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <Link href={`/dashboard/lists/${list.id}`}>
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group">
            <h3 className="font-semibold text-slate-900 text-base truncate group-hover:text-emerald-700 transition-colors pr-6">
              {list.name}
            </h3>
            {list.description && (
              <p className="text-slate-500 text-sm mt-1 truncate">{list.description}</p>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">
                  {stats.baseWeightGrams > 0
                    ? formatWeight(stats.baseWeightGrams, "oz")
                    : "—"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">base weight</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </p>
                {stats.totalCostCents > 0 && (
                  <p className="text-xs text-slate-400">
                    ${(stats.totalCostCents / 100).toFixed(0)} total
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
