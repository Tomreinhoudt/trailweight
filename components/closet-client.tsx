"use client";

import { useState, useTransition, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Check, Search, ExternalLink, Package } from "lucide-react";
import { createClosetItem, updateClosetItem, deleteClosetItem } from "@/actions/closet";
import { formatWeight, unitToGrams, gramsToUnit } from "@/lib/utils";
import type { ClosetItem, WeightUnit } from "@/lib/types";

const WEIGHT_UNITS: WeightUnit[] = ["g", "oz", "lb", "kg"];
const SUGGESTED_CATEGORIES = [
  "Shelter", "Sleep System", "Pack & Carry", "Clothing", "Footwear",
  "Navigation", "Food & Water", "Safety & First Aid", "Electronics",
  "Hygiene", "Tools & Repair", "Other",
];

interface FormState {
  name: string; brand: string; description: string; category: string;
  weight: string; cost: string; url: string;
}

const emptyForm: FormState = { name: "", brand: "", description: "", category: "", weight: "0", cost: "", url: "" };

function closetToForm(item: ClosetItem, unit: WeightUnit): FormState {
  return {
    name: item.name, brand: item.brand ?? "", description: item.description ?? "",
    category: item.category, weight: gramsToUnit(item.weight_grams, unit),
    cost: item.cost_cents > 0 ? (item.cost_cents / 100).toFixed(2) : "",
    url: item.url ?? "",
  };
}

function formToData(form: FormState, unit: WeightUnit) {
  return {
    name: form.name.trim(),
    brand: form.brand.trim() || null,
    description: form.description.trim() || null,
    category: form.category.trim() || "Uncategorized",
    weight_grams: unitToGrams(parseFloat(form.weight) || 0, unit),
    cost_cents: Math.round((parseFloat(form.cost) || 0) * 100),
    url: form.url.trim() || null,
  };
}

const inputClass = "w-full px-3 py-2 text-sm border border-field-border rounded-lg bg-field-surface text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt transition-all font-mono";
const labelClass = "block text-[10px] font-mono uppercase tracking-[0.12em] text-ink-3 mb-1.5";

function ClosetForm({ form, setForm, unit, isPending, onCancel, submitLabel }: {
  form: FormState; setForm: (f: FormState) => void; unit: WeightUnit;
  isPending: boolean; onCancel: () => void; submitLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className={labelClass}>Item Name *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            required placeholder="e.g. Zpacks Arc Blast" className={inputClass} autoFocus />
        </div>
        <div>
          <label className={labelClass}>Brand</label>
          <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
            placeholder="e.g. Zpacks" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <input type="text" list="closet-categories" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Select or type..." className={inputClass} />
          <datalist id="closet-categories">
            {SUGGESTED_CATEGORIES.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Model, specs, notes..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Weight ({unit})</label>
          <input type="number" min="0" step="any" value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Cost (USD)</label>
          <input type="number" min="0" step="0.01" value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="0.00" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Purchase URL</label>
          <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..." className={inputClass} />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={!form.name.trim() || isPending}
          className="bg-volt hover:bg-volt-dim disabled:bg-field-elevated disabled:text-ink-3 text-field-bg font-display font-bold text-xs px-5 py-2.5 rounded-lg transition-colors uppercase tracking-widest">
          {isPending ? "Saving..." : submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="text-xs font-mono text-ink-2 hover:text-ink-1 px-4 py-2.5 rounded-lg border border-field-border hover:bg-field-elevated transition-colors uppercase tracking-wider">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function ClosetClient({ initialItems }: { initialItems: ClosetItem[] }) {
  const [items, setItems] = useState<ClosetItem[]>(initialItems);
  const [unit, setUnit] = useState<WeightUnit>("oz");
  const [query, setQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(emptyForm);
  const [editingItem, setEditingItem] = useState<ClosetItem | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.brand?.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ClosetItem[]>);
  }, [filtered]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const data = formToData(addForm, unit);
    startTransition(async () => {
      await createClosetItem(data);
      // Optimistic update
      const fakeItem: ClosetItem = { ...data, id: crypto.randomUUID(), user_id: "", url: data.url, brand: data.brand, description: data.description, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      setItems((prev) => [...prev, fakeItem].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)));
      setAddForm(emptyForm); setShowAddForm(false);
    });
  };

  const startEdit = (item: ClosetItem) => {
    setEditingItem(item);
    setEditForm(closetToForm(item, unit));
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const data = formToData(editForm, unit);
    startTransition(async () => {
      await updateClosetItem(editingItem.id, data);
      setItems((prev) => prev.map((i) => i.id === editingItem.id ? { ...i, ...data } : i));
      setEditingItem(null);
    });
  };

  const handleDelete = (itemId: string) => {
    startTransition(async () => {
      await deleteClosetItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      setDeleteConfirmId(null);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-1 uppercase tracking-wide">Gear Closet</h1>
          <p className="text-ink-3 text-xs font-mono mt-1">{items.length} item{items.length !== 1 ? "s" : ""} in your inventory</p>
        </div>
        <button
          onClick={() => { setAddForm(emptyForm); setShowAddForm(true); }}
          className="inline-flex items-center gap-2 bg-volt hover:bg-volt-dim text-field-bg font-display font-bold text-xs px-4 py-2 rounded-lg transition-colors uppercase tracking-widest flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Gear
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" />
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gear, brand, category..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-field-card border border-field-border rounded-lg text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt font-mono"
          />
        </div>
        <div className="flex items-center gap-0.5 bg-field-surface border border-field-border rounded-lg p-1 flex-shrink-0">
          {WEIGHT_UNITS.map((u) => (
            <button key={u} onClick={() => setUnit(u)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${u === unit ? "bg-field-elevated text-volt border border-field-border-strong" : "text-ink-3 hover:text-ink-2"}`}>
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-field-card border border-volt/30 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-3.5 bg-volt rounded-full" />
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">Add to Closet</h3>
          </div>
          <form onSubmit={handleAdd}>
            <ClosetForm form={addForm} setForm={setAddForm} unit={unit}
              isPending={isPending} onCancel={() => setShowAddForm(false)} submitLabel="Add to Closet" />
          </form>
        </div>
      )}

      {/* Item groups */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-field-border rounded-2xl gap-4 topo-bg">
          <Package className="w-10 h-10 text-ink-3" />
          <div className="text-center">
            <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-2">Closet is empty</p>
            <p className="text-ink-3 text-xs font-mono mt-1">Add your gear to build your master inventory</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-ink-3 font-mono text-sm">No items match "{query}"</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([category, catItems]) => (
            <div key={category} className="bg-field-card border border-field-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-2.5 bg-field-surface border-b border-field-border">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-volt rounded-full" />
                  <h2 className="font-display text-xs font-bold uppercase tracking-[0.12em] text-ink-1">{category}</h2>
                </div>
                <span className="text-[10px] font-mono text-ink-3">{catItems.length} item{catItems.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-field-border/50">
                    {catItems.map((item) => {
                      if (editingItem?.id === item.id) {
                        return (
                          <tr key={item.id} className="bg-field-elevated/50">
                            <td colSpan={6} className="px-4 py-4">
                              <form onSubmit={handleEditSave}>
                                <ClosetForm form={editForm} setForm={setEditForm} unit={unit}
                                  isPending={isPending} onCancel={() => setEditingItem(null)} submitLabel="Save" />
                              </form>
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={item.id} className="hover:bg-field-elevated/40 transition-colors group/row">
                          <td className="px-4 py-3">
                            <p className="text-sm font-mono text-ink-1">{item.name}</p>
                            {item.brand && <p className="text-[10px] font-mono text-ink-3 mt-0.5">{item.brand}</p>}
                            {item.description && <p className="text-[10px] font-mono text-ink-3 mt-0.5">{item.description}</p>}
                          </td>
                          <td className="px-3 py-3 text-right font-mono text-volt font-bold tabular-nums text-sm whitespace-nowrap">
                            {formatWeight(item.weight_grams, unit)}
                          </td>
                          <td className="px-3 py-3 text-right font-mono text-ink-3 text-sm whitespace-nowrap">
                            {item.cost_cents > 0 ? `$${(item.cost_cents / 100).toFixed(0)}` : "—"}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
                              {item.url && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer"
                                  className="p-1.5 text-ink-3 hover:text-volt hover:bg-field-elevated rounded-md transition-colors" title="View product">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <button onClick={() => startEdit(item)}
                                className="p-1.5 text-ink-3 hover:text-volt hover:bg-field-elevated rounded-md transition-colors" title="Edit">
                                <Pencil className="w-3 h-3" />
                              </button>
                              {deleteConfirmId === item.id ? (
                                <>
                                  <button onClick={() => handleDelete(item.id)} disabled={isPending}
                                    className="p-1.5 text-field-bg bg-red-500 hover:bg-red-600 rounded-md transition-colors"><Check className="w-3 h-3" /></button>
                                  <button onClick={() => setDeleteConfirmId(null)}
                                    className="p-1.5 text-ink-3 hover:text-ink-1 hover:bg-field-elevated rounded-md transition-colors"><X className="w-3 h-3" /></button>
                                </>
                              ) : (
                                <button onClick={() => setDeleteConfirmId(item.id)}
                                  className="p-1.5 text-ink-3 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors" title="Delete">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
