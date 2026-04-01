"use client";

import { useMemo } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { computeListStats, groupItemsByCategory, convertWeight } from "@/lib/utils";
import type { GearItem, WeightUnit } from "@/lib/types";

interface Props {
  items: GearItem[];
  unit: WeightUnit;
}

const VOLT    = "#C8ED40";
const EMBER   = "#F25C20";
const INK2    = "#9BBF9D";
const INK3    = "#627A64";
const CAT_COLORS = [VOLT, "#6BA8D4", EMBER, "#D4A06B", INK2, "#C46BD4", "#6BD4C4", "#D46B6B", "#A8D46B"];

function fmt(grams: number, unit: WeightUnit) {
  const v = convertWeight(grams, unit);
  if (unit === "g")  return `${Math.round(v)}g`;
  if (unit === "oz") return `${v.toFixed(1)}oz`;
  if (unit === "lb") return `${v.toFixed(2)}lb`;
  return `${v.toFixed(3)}kg`;
}

function round(grams: number, unit: WeightUnit) {
  const v = convertWeight(grams, unit);
  if (unit === "g")  return Math.round(v);
  if (unit === "oz") return parseFloat(v.toFixed(1));
  if (unit === "lb") return parseFloat(v.toFixed(2));
  return parseFloat(v.toFixed(3));
}

function BreakdownTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-field-elevated border border-field-border-strong rounded-lg px-3 py-2 shadow-2xl">
      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-0.5">{payload[0].name}</p>
      <p className="text-sm font-mono font-bold text-volt">{payload[0].value}</p>
    </div>
  );
}

function CategoryTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string; count: number } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-field-elevated border border-field-border-strong rounded-lg px-3 py-2 shadow-2xl">
      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-0.5">{payload[0].payload.name}</p>
      <p className="text-sm font-mono font-bold text-volt">{payload[0].value}</p>
      <p className="text-[10px] font-mono text-ink-3 mt-0.5">{payload[0].payload.count} items</p>
    </div>
  );
}

export function ListCharts({ items, unit }: Props) {
  const stats = computeListStats(items);
  const byCategory = groupItemsByCategory(items);

  const breakdownData = useMemo(() => {
    const d = [];
    if (stats.baseWeightGrams > 0)
      d.push({ name: "Base", value: round(stats.baseWeightGrams, unit), color: VOLT });
    if (stats.wornWeightGrams > 0)
      d.push({ name: "Worn", value: round(stats.wornWeightGrams, unit), color: EMBER });
    if (stats.consumableWeightGrams > 0)
      d.push({ name: "Consumable", value: round(stats.consumableWeightGrams, unit), color: INK2 });
    return d;
  }, [stats, unit]);

  const categoryData = useMemo(() => {
    return Object.entries(byCategory)
      .map(([name, catItems]) => ({
        name,
        weight: round(catItems.reduce((s, i) => s + i.weight_grams * i.quantity, 0), unit),
        count: catItems.reduce((s, i) => s + i.quantity, 0),
      }))
      .sort((a, b) => b.weight - a.weight);
  }, [byCategory, unit]);

  const totalForPct = convertWeight(stats.totalWeightGrams, unit);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-3 font-mono text-sm border border-field-border rounded-xl bg-field-card">
        Add items to see visualizations
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Weight breakdown donut */}
      {breakdownData.length > 0 && (
        <div className="bg-field-card border border-field-border rounded-xl p-5">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mb-5">Weight Breakdown</p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-44 h-44 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdownData}
                    cx="50%" cy="50%"
                    innerRadius={44} outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    startAngle={90} endAngle={-270}
                  >
                    {breakdownData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<BreakdownTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full space-y-3">
              {breakdownData.map((entry) => {
                const pct = Math.round((entry.value / (convertWeight(stats.totalWeightGrams, unit) || 1)) * 100);
                return (
                  <div key={entry.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs font-mono text-ink-2 uppercase tracking-wider">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold" style={{ color: entry.color }}>
                          {fmt(entry.name === "Base" ? stats.baseWeightGrams : entry.name === "Worn" ? stats.wornWeightGrams : stats.consumableWeightGrams, unit)}
                        </span>
                        <span className="text-[10px] font-mono text-ink-3 w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-0.5 bg-field-elevated rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: entry.color }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-1 border-t border-field-border mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-3 uppercase tracking-wider">Pack Total</span>
                  <span className="text-sm font-mono font-bold text-ink-1">{fmt(stats.totalWeightGrams, unit)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category weight bar chart */}
      {categoryData.length > 1 && (
        <div className="bg-field-card border border-field-border rounded-xl p-5">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mb-5">Weight by Category</p>
          <ResponsiveContainer width="100%" height={Math.max(160, categoryData.length * 38)}>
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 0, right: 70, left: 0, bottom: 0 }}
              barCategoryGap="35%"
            >
              <XAxis
                type="number"
                tickFormatter={(v) => `${v}${unit}`}
                tick={{ fill: INK3, fontSize: 9, fontFamily: "var(--font-jetbrains)" }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                type="category" dataKey="name" width={100}
                tick={{ fill: INK2, fontSize: 10, fontFamily: "var(--font-jetbrains)" }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CategoryTooltip />} cursor={{ fill: "rgba(200,237,64,0.04)" }} />
              <Bar dataKey="weight" radius={[0, 3, 3, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category breakdown progress bars */}
      {categoryData.length > 0 && (
        <div className="bg-field-card border border-field-border rounded-xl p-5">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-3 mb-4">Category Distribution</p>
          <div className="space-y-3">
            {categoryData.map((cat, i) => {
              const pct = totalForPct > 0 ? Math.round((cat.weight / totalForPct) * 100) : 0;
              const color = CAT_COLORS[i % CAT_COLORS.length];
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs font-mono text-ink-2">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-ink-3">{cat.count} item{cat.count !== 1 ? "s" : ""}</span>
                      <span className="text-xs font-mono font-bold text-ink-1 tabular-nums w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-0.5 bg-field-elevated rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
