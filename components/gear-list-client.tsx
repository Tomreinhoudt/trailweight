"use client";

import { useState, useTransition, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Plus, ChevronLeft, Trash2, Pencil, X, Check, Package, GripVertical, FolderPlus,
  Share2, Link2, BarChart2, List, Copy, Printer, Search, Target,
  CheckSquare, Square,
} from "lucide-react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCenter,
  useDraggable, type DragStartEvent, type DragOverEvent, type DragEndEvent, type CollisionDetection,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  formatWeight, formatCost, computeListStats, groupItemsByCategory, unitToGrams, gramsToUnit,
} from "@/lib/utils";
import type { GearList, GearItem, WeightUnit } from "@/lib/types";
import { createItem, updateItem, deleteItem, reorderItems, moveItemToList } from "@/actions/items";
import { deleteList, updateCategoryOrder, setListPublic, duplicateList, updateWeightTarget } from "@/actions/lists";
import { ListCharts } from "@/components/list-charts";
import { ClosetPickerModal } from "@/components/closet-picker";
import { convertWeight } from "@/lib/utils";

const WEIGHT_UNITS: WeightUnit[] = ["g", "oz", "lb", "kg"];

const SUGGESTED_CATEGORIES = [
  "Shelter", "Sleep System", "Pack & Carry", "Clothing", "Footwear",
  "Navigation", "Food & Water", "Safety & First Aid", "Electronics",
  "Hygiene", "Tools & Repair", "Other",
];

interface FormState {
  name: string; description: string; category: string;
  weight: string; cost: string; quantity: string;
  worn: boolean; consumable: boolean;
}

const emptyForm: FormState = {
  name: "", description: "", category: "", weight: "0", cost: "", quantity: "1", worn: false, consumable: false,
};

function itemToForm(item: GearItem, unit: WeightUnit): FormState {
  return {
    name: item.name, description: item.description ?? "", category: item.category,
    weight: gramsToUnit(item.weight_grams, unit),
    cost: item.cost_cents > 0 ? (item.cost_cents / 100).toFixed(2) : "",
    quantity: item.quantity.toString(), worn: item.worn, consumable: item.consumable,
  };
}

function formToItemData(form: FormState, unit: WeightUnit) {
  return {
    name: form.name.trim(), description: form.description.trim() || null,
    category: form.category.trim() || "Uncategorized",
    weight_grams: unitToGrams(parseFloat(form.weight) || 0, unit),
    cost_cents: Math.round((parseFloat(form.cost) || 0) * 100),
    quantity: Math.max(1, parseInt(form.quantity) || 1),
    worn: form.worn, consumable: form.consumable,
  };
}

function mergeCategories(persistedOrder: string[], itemCategories: string[]): string[] {
  const result = [...persistedOrder];
  for (const cat of itemCategories) { if (!result.includes(cat)) result.push(cat); }
  return result;
}

const collisionDetection: CollisionDetection = (args) => {
  const activeId = args.active.id.toString();
  if (activeId.startsWith("cat:")) {
    return closestCenter({ ...args, droppableContainers: args.droppableContainers.filter((c) => c.id.toString().startsWith("cat:")) });
  }
  return closestCenter({ ...args, droppableContainers: args.droppableContainers.filter((c) => !c.id.toString().startsWith("cat:")) });
};

// ─── Input / label shared classes ────────────────────────────────────────────

const inputClass = "w-full px-3 py-2 text-sm border border-field-border rounded-lg bg-field-surface text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt transition-all font-mono";
const labelClass = "block text-[10px] font-mono uppercase tracking-[0.12em] text-ink-3 mb-1.5";

// ─── Item form fields ─────────────────────────────────────────────────────────

function ItemFormFields({ form, setForm, unit, categories, isPending, onCancel, submitLabel }: {
  form: FormState; setForm: (f: FormState) => void; unit: WeightUnit; categories: string[];
  isPending: boolean; onCancel: () => void; submitLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className={labelClass}>Item Name *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            required placeholder="e.g. Sleeping Bag" className={inputClass} autoFocus />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brand, model, specs..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <input type="text" list="item-categories" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Select or type..." className={inputClass} />
          <datalist id="item-categories">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div>
          <label className={labelClass}>Weight ({unit})</label>
          <input type="number" min="0" step="any" value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Cost (USD)</label>
          <input type="number" min="0" step="0.01" value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            placeholder="0.00" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Quantity</label>
          <input type="number" min="1" value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div className="flex gap-5">
        {[
          { key: "worn" as const, label: "Worn on body" },
          { key: "consumable" as const, label: "Consumable" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 text-xs text-ink-2 cursor-pointer select-none font-mono">
            <input type="checkbox" checked={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
              className="w-3.5 h-3.5 rounded border-field-border bg-field-surface text-volt focus:ring-volt accent-[#C8ED40]" />
            {label}
          </label>
        ))}
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

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditItemModal({ item, unit, categories, isPending, onSave, onClose }: {
  item: GearItem; unit: WeightUnit; categories: string[];
  isPending: boolean; onSave: (form: FormState) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => itemToForm(item, unit));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-field-card border border-field-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-field-border bg-field-surface sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3.5 bg-volt rounded-full" />
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">Edit Item</h2>
          </div>
          <button onClick={onClose} className="text-ink-3 hover:text-ink-1 p-1 rounded-lg hover:bg-field-elevated transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6">
          <ItemFormFields form={form} setForm={setForm} unit={unit} categories={categories}
            isPending={isPending} onCancel={onClose} submitLabel="Save Changes" />
        </form>
      </div>
    </div>
  );
}

// ─── Sortable item row ────────────────────────────────────────────────────────

function SortableItemRow({ item, unit, deleteConfirmId, isPending, onEdit, onDeleteClick, onDeleteConfirm, onDeleteCancel, overlay, isSelecting, isSelected, onSelect }: {
  item: GearItem; unit: WeightUnit; deleteConfirmId: string | null; isPending: boolean;
  onEdit: () => void; onDeleteClick: () => void; onDeleteConfirm: () => void; onDeleteCancel: () => void;
  overlay?: boolean; isSelecting?: boolean; isSelected?: boolean; onSelect?: (checked: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.25 : 1 };

  if (overlay) {
    return (
      <tr className="bg-field-elevated border border-volt/40">
        <td className="px-2 py-3 w-6"><GripVertical className="w-3.5 h-3.5 text-volt/50" /></td>
        <td className="px-4 py-3"><span className="font-mono text-ink-1 text-sm">{item.name}</span></td>
        <td className="px-3 py-3 text-right font-mono text-volt text-sm whitespace-nowrap tabular-nums">{formatWeight(item.weight_grams, unit)}</td>
        <td colSpan={3} />
      </tr>
    );
  }

  return (
    <tr ref={setNodeRef} style={style}
      className="border-b border-field-border/50 last:border-0 hover:bg-field-elevated/50 transition-colors group/row">
      <td className="px-2 py-3 w-6">
        {isSelecting ? (
          <button onClick={() => onSelect?.(!isSelected)} className="text-ink-3 hover:text-volt transition-colors">
            {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-volt" /> : <Square className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <button {...attributes} {...listeners}
            className="cursor-grab active:cursor-grabbing text-ink-3 hover:text-volt touch-none transition-colors" tabIndex={-1}>
            <GripVertical className="w-3.5 h-3.5" />
          </button>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-sm text-ink-1">{item.name}</span>
          {item.worn && (
            <span className="text-[10px] bg-ember-muted text-ember px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">worn</span>
          )}
          {item.consumable && (
            <span className="text-[10px] bg-field-elevated text-ink-2 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider border border-field-border">consume</span>
          )}
        </div>
        {item.description && <p className="text-[11px] text-ink-3 mt-0.5 font-mono">{item.description}</p>}
      </td>
      <td className="px-3 py-3 text-right font-mono text-ink-2 whitespace-nowrap tabular-nums text-sm">{formatWeight(item.weight_grams, unit)}</td>
      <td className="px-3 py-3 text-right font-mono text-ink-2 tabular-nums text-sm">{item.quantity}</td>
      <td className="px-3 py-3 text-right font-mono font-bold text-volt whitespace-nowrap tabular-nums text-sm">
        {formatWeight(item.weight_grams * item.quantity, unit)}
      </td>
      <td className="px-3 py-3 text-right font-mono text-ink-3 whitespace-nowrap tabular-nums text-sm">
        {item.cost_cents > 0 ? formatCost(item.cost_cents * item.quantity) : "—"}
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={onEdit}
            className="p-1.5 text-ink-3 hover:text-volt hover:bg-field-elevated rounded-md transition-colors" title="Edit">
            <Pencil className="w-3 h-3" />
          </button>
          {deleteConfirmId === item.id ? (
            <>
              <button onClick={onDeleteConfirm} disabled={isPending}
                className="p-1.5 text-field-bg bg-red-500 hover:bg-red-600 rounded-md transition-colors" title="Confirm">
                <Check className="w-3 h-3" />
              </button>
              <button onClick={onDeleteCancel}
                className="p-1.5 text-ink-3 hover:text-ink-1 hover:bg-field-elevated rounded-md transition-colors" title="Cancel">
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <button onClick={onDeleteClick}
              className="p-1.5 text-ink-3 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors" title="Delete">
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Other list drop target ───────────────────────────────────────────────────

function OtherListDropTarget({ id, name, isOver }: { id: string; name: string; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ id: `list:${id}` });
  return (
    <div ref={setNodeRef}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${isOver ? "border-volt bg-volt-muted text-volt" : "border-field-border text-ink-3"}`}>
      <Package className="w-4 h-4 flex-shrink-0" />
      <span className="text-xs font-mono uppercase tracking-wide truncate">{name}</span>
    </div>
  );
}

// ─── Draggable category header ────────────────────────────────────────────────

function DraggableCategoryHeader({ category, weightLabel, isEmpty, isBeingDragged, onAddItem, onRemove }: {
  category: string; weightLabel: string; isEmpty: boolean; isBeingDragged: boolean;
  onAddItem: () => void; onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: `cat:${category}` });

  return (
    <div className={`flex items-center justify-between px-4 py-2.5 bg-field-surface border-b border-field-border transition-opacity ${isBeingDragged ? "opacity-30" : ""}`}>
      <div className="flex items-center gap-2">
        <div className="w-0.5 h-3.5 bg-volt rounded-full flex-shrink-0" />
        <button ref={setNodeRef} {...attributes} {...listeners}
          className="cursor-grab active:cursor-grabbing text-ink-3 hover:text-volt touch-none transition-colors" tabIndex={-1} title="Drag to reorder">
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <h3 className="text-[11px] font-display font-bold text-ink-1 uppercase tracking-[0.12em]">{category}</h3>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-mono text-ink-3">{weightLabel}</span>
        {isEmpty ? (
          <button onClick={onRemove} className="p-0.5 text-ink-3 hover:text-red-400 rounded transition-colors" title="Remove empty category">
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button onClick={onAddItem} className="p-0.5 text-ink-3 hover:text-volt rounded transition-colors" title="Add item to category">
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Droppable category section ───────────────────────────────────────────────

function DroppableCategorySection({ category, isOver, children }: {
  category: string; isOver: boolean; children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: `cat:${category}` });
  return (
    <div ref={setNodeRef}
      className={`bg-field-card border rounded-xl overflow-hidden transition-all ${isOver ? "border-volt/60 ring-1 ring-volt/20" : "border-field-border"}`}>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GearListClient({ list, otherLists = [] }: {
  list: GearList; otherLists?: { id: string; name: string }[];
}) {
  const [unit, setUnit] = useState<WeightUnit>("oz");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(emptyForm);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState<GearItem[]>(list.gear_items ?? []);
  const [categoryOrder, setCategoryOrder] = useState<string[]>(() =>
    mergeCategories(list.category_order ?? [], (list.gear_items ?? []).map((i) => i.category))
  );

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isPublic, setIsPublic] = useState(list.is_public ?? false);
  const [activeView, setActiveView] = useState<"items" | "charts">("items");
  const [copyDone, setCopyDone] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [showClosetPicker, setShowClosetPicker] = useState(false);
  const [weightTarget, setWeightTarget] = useState<number | null>(list.weight_target_grams ?? null);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState("");

  useEffect(() => {
    const newItems = list.gear_items ?? [];
    setItems(newItems);
    setCategoryOrder((prev) => mergeCategories(prev, newItems.map((i) => i.category)));
  }, [list.gear_items]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overCatId, setOverCatId] = useState<string | null>(null);
  const [overListId, setOverListId] = useState<string | null>(null);
  const categoryOrderBeforeDrag = useRef<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tw-unit") as WeightUnit | null;
    if (stored && WEIGHT_UNITS.includes(stored)) setUnit(stored);
  }, []);

  const changeUnit = (u: WeightUnit) => { setUnit(u); localStorage.setItem("tw-unit", u); };

  const stats = computeListStats(items);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const grouped = groupItemsByCategory(filteredItems);
  const existingCats = Object.keys(grouped);
  const allCategories = Array.from(new Set([...SUGGESTED_CATEGORIES, ...existingCats, ...categoryOrder]));

  const displayCategoryOrder = useMemo(() => {
    if (!activeId?.startsWith("cat:") || !overCatId) return categoryOrder;
    const activeCat = activeId.slice(4);
    const overCat = overCatId.slice(4);
    const oldIdx = categoryOrder.indexOf(activeCat);
    const newIdx = categoryOrder.indexOf(overCat);
    if (oldIdx === -1 || newIdx === -1) return categoryOrder;
    return arrayMove(categoryOrder, oldIdx, newIdx);
  }, [activeId, overCatId, categoryOrder]);

  const activeItem = activeId && !activeId.startsWith("cat:")
    ? items.find((i) => i.id === activeId) ?? null : null;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = event.active.id as string;
    setActiveId(id); setOverCatId(null); setOverListId(null);
    if (id.startsWith("cat:")) categoryOrderBeforeDrag.current = [...categoryOrder];
  }, [categoryOrder]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id as string | undefined;
    const dragId = event.active.id as string;
    if (dragId.startsWith("cat:")) {
      if (overId?.startsWith("cat:")) setOverCatId(overId);
    } else {
      if (overId?.startsWith("list:")) setOverListId(overId.slice(5));
      else setOverListId(null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    const dragId = active.id as string;
    setActiveId(null); setOverCatId(null); setOverListId(null);

    if (dragId.startsWith("cat:")) {
      if (!over) { setCategoryOrder(categoryOrderBeforeDrag.current); return; }
      const activeCat = dragId.slice(4);
      const overId = over.id as string;
      const overCat = overId.startsWith("cat:") ? overId.slice(4) : null;
      const oldIdx = categoryOrder.indexOf(activeCat);
      const newIdx = overCat !== null ? categoryOrder.indexOf(overCat) : -1;
      if (oldIdx === -1 || newIdx === -1 || oldIdx === newIdx) return;
      const finalOrder = arrayMove(categoryOrder, oldIdx, newIdx);
      setCategoryOrder(finalOrder);
      startTransition(async () => {
        try { await updateCategoryOrder(list.id, finalOrder); }
        catch (e) { console.error("Failed to reorder categories:", e); }
      });
      return;
    }

    if (!over) return;
    const activeItemId = dragId;
    const overId = over.id as string;

    if (overId.startsWith("list:")) {
      const targetListId = overId.slice(5);
      const draggedItem = items.find((i) => i.id === activeItemId);
      if (!draggedItem) return;
      setItems((prev) => prev.filter((i) => i.id !== activeItemId));
      startTransition(async () => {
        try { await moveItemToList(activeItemId, list.id, targetListId, draggedItem.category); }
        catch (e) { console.error("Failed to move item:", e); }
      });
      return;
    }

    if (activeItemId === overId) return;
    const oldIndex = items.findIndex((i) => i.id === activeItemId);
    const newIndex = items.findIndex((i) => i.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const draggedItem = items[oldIndex];
    const overItem = items[newIndex];
    const categoryChanged = draggedItem.category !== overItem.category;
    const updatedItems = arrayMove(items, oldIndex, newIndex).map((item) =>
      item.id === activeItemId && categoryChanged ? { ...item, category: overItem.category } : item
    );
    setItems(updatedItems);

    startTransition(async () => {
      try {
        const actions: Promise<void>[] = [reorderItems(list.id, updatedItems.map((i) => i.id))];
        if (categoryChanged) {
          actions.push(updateItem(activeItemId, list.id, {
            name: draggedItem.name, description: draggedItem.description,
            category: overItem.category, weight_grams: draggedItem.weight_grams,
            cost_cents: draggedItem.cost_cents, quantity: draggedItem.quantity,
            worn: draggedItem.worn, consumable: draggedItem.consumable,
          }));
        }
        await Promise.all(actions);
      } catch (e) { console.error("Failed to reorder items:", e); }
    });
  }, [items, list.id, categoryOrder]);

  const handleDragCancel = useCallback(() => {
    if (activeId?.startsWith("cat:")) setCategoryOrder(categoryOrderBeforeDrag.current);
    setActiveId(null); setOverCatId(null); setOverListId(null);
  }, [activeId]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    setNewCategoryName(""); setShowNewCategoryForm(false);
    if (categoryOrder.includes(name)) return;
    const newOrder = [...categoryOrder, name];
    setCategoryOrder(newOrder);
    startTransition(async () => {
      try { await updateCategoryOrder(list.id, newOrder); }
      catch (e) { console.error("Failed to create category:", e); }
    });
  };

  const handleRemoveCategory = (category: string) => {
    const newOrder = categoryOrder.filter((c) => c !== category);
    setCategoryOrder(newOrder);
    startTransition(async () => {
      try { await updateCategoryOrder(list.id, newOrder); }
      catch (e) { console.error("Failed to remove category:", e); }
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createItem(list.id, formToItemData(addForm, unit));
      setAddForm(emptyForm); setShowAddForm(false);
    });
  };

  const handleEditSave = (form: FormState) => {
    if (!editingItem) return;
    startTransition(async () => {
      await updateItem(editingItem.id, list.id, formToItemData(form, unit));
      setEditingItem(null);
    });
  };

  const handleDelete = (itemId: string) => {
    startTransition(async () => {
      await deleteItem(itemId, list.id);
      setDeleteConfirmId(null);
    });
  };

  const handleDeleteList = () => {
    if (!confirm(`Delete "${list.name}"? This cannot be undone.`)) return;
    startTransition(async () => { await deleteList(list.id); });
  };

  const handleTogglePublic = () => {
    const next = !isPublic;
    setIsPublic(next);
    startTransition(async () => {
      try { await setListPublic(list.id, next); }
      catch { setIsPublic(!next); }
    });
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/share/${list.id}`);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  };

  const handleDuplicate = () => {
    startTransition(async () => { await duplicateList(list.id); });
  };

  const handlePrint = () => window.print();

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selectedIds.size} item(s)? This cannot be undone.`)) return;
    const ids = Array.from(selectedIds);
    setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set()); setIsSelecting(false);
    startTransition(async () => {
      await Promise.all(ids.map((id) => import("@/actions/items").then((m) => m.deleteItem(id, list.id))));
    });
  };

  const handleBulkCategoryChange = (category: string) => {
    const ids = Array.from(selectedIds);
    setItems((prev) => prev.map((i) => selectedIds.has(i.id) ? { ...i, category } : i));
    setSelectedIds(new Set()); setIsSelecting(false);
    startTransition(async () => {
      await Promise.all(
        ids.map((id) => {
          const item = items.find((i) => i.id === id);
          if (!item) return Promise.resolve();
          return import("@/actions/items").then((m) =>
            m.updateItem(id, list.id, { ...item, category })
          );
        })
      );
    });
  };

  const handleSetWeightTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const grams = unitToGrams(parseFloat(targetInput) || 0, unit);
    const target = grams > 0 ? Math.round(grams) : null;
    setWeightTarget(target); setEditingTarget(false);
    startTransition(async () => { await updateWeightTarget(list.id, target); });
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const openAddFormForCategory = (category: string) => {
    setAddForm({ ...emptyForm, category }); setShowAddForm(true);
  };

  const hasContent = items.length > 0 || categoryOrder.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* Back + header */}
      <div className="mb-6">
        <Link href="/dashboard"
          className="inline-flex items-center text-xs text-ink-3 hover:text-volt mb-4 transition-colors font-mono uppercase tracking-wider group">
          <ChevronLeft className="w-3.5 h-3.5 mr-0.5 group-hover:-translate-x-0.5 transition-transform" />
          Gear Lists
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold text-ink-1 uppercase tracking-wide truncate">
              {list.name}
            </h1>
            {list.description && (
              <p className="text-ink-3 text-xs mt-1.5 font-mono">{list.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 no-print">
            {/* Duplicate */}
            <button onClick={handleDuplicate} disabled={isPending} title="Duplicate list"
              className="p-2 text-ink-3 hover:text-ink-1 hover:bg-field-elevated rounded-lg transition-colors border border-transparent hover:border-field-border">
              <Copy className="w-4 h-4" />
            </button>
            {/* Print */}
            <button onClick={handlePrint} title="Print / Export PDF"
              className="p-2 text-ink-3 hover:text-ink-1 hover:bg-field-elevated rounded-lg transition-colors border border-transparent hover:border-field-border">
              <Printer className="w-4 h-4" />
            </button>
            {/* Share toggle */}
            <button
              onClick={handleTogglePublic}
              disabled={isPending}
              title={isPublic ? "Make private" : "Make public & shareable"}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors uppercase tracking-wider ${
                isPublic
                  ? "bg-volt-muted border-volt/40 text-volt hover:bg-ember-muted hover:border-ember/40 hover:text-ember"
                  : "border-field-border text-ink-3 hover:text-ink-1 hover:bg-field-elevated"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPublic ? "Public" : "Share"}</span>
            </button>
            {/* Copy link (only when public) */}
            {isPublic && (
              <button
                onClick={handleCopyLink}
                title="Copy share link"
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-field-border text-ink-3 hover:text-volt hover:border-volt/40 hover:bg-field-elevated transition-colors uppercase tracking-wider"
              >
                {copyDone ? <Check className="w-3.5 h-3.5 text-volt" /> : <Link2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copyDone ? "Copied!" : "Copy Link"}</span>
              </button>
            )}
            <button onClick={handleDeleteList} disabled={isPending}
              className="p-2 text-ink-3 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="Delete list">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-6 bg-field-border border border-field-border rounded-xl overflow-hidden">
        {[
          { label: "Base Weight", value: formatWeight(stats.baseWeightGrams, unit), sub: "excl. worn & consumables", highlight: true },
          { label: "Worn Weight", value: formatWeight(stats.wornWeightGrams, unit), sub: "clothing & footwear", highlight: false },
          { label: "Pack Weight", value: formatWeight(stats.totalWeightGrams, unit), sub: "everything", highlight: false },
          {
            label: "Total Cost",
            value: stats.totalCostCents > 0 ? `$${(stats.totalCostCents / 100).toFixed(0)}` : "—",
            sub: `${items.length} item${items.length !== 1 ? "s" : ""}`,
            highlight: false,
          },
        ].map(({ label, value, sub, highlight }) => (
          <div key={label} className="bg-field-card px-4 py-4">
            <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-ink-3 mb-1.5">{label}</p>
            <p className={`text-xl font-mono font-bold tabular-nums ${highlight ? "text-volt volt-glow" : "text-ink-1"}`}>{value}</p>
            <p className="text-[9px] text-ink-3 mt-1 font-mono truncate">{sub}</p>
          </div>
        ))}
      </div>

      {/* Weight target */}
      {(weightTarget || editingTarget) && (
        <div className="mb-4 bg-field-card border border-field-border rounded-xl px-4 py-3 no-print">
          {editingTarget ? (
            <form onSubmit={handleSetWeightTarget} className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-volt flex-shrink-0" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3">Base Weight Target</span>
              <input type="number" min="0" step="any" value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder={`e.g. 10`}
                className="w-20 px-2 py-1 text-xs bg-field-surface border border-volt/40 rounded-md text-ink-1 focus:outline-none focus:ring-1 focus:ring-volt font-mono"
                autoFocus />
              <span className="text-[10px] font-mono text-ink-3">{unit}</span>
              <button type="submit" className="text-[10px] font-mono text-volt hover:text-volt-dim uppercase tracking-wider">Set</button>
              <button type="button" onClick={() => setEditingTarget(false)} className="text-[10px] font-mono text-ink-3 hover:text-ink-1 uppercase tracking-wider">Cancel</button>
            </form>
          ) : weightTarget && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-volt" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-3">Base Weight Target</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-ink-2">
                    {formatWeight(stats.baseWeightGrams, unit)} / {formatWeight(weightTarget, unit)}
                  </span>
                  <span className={`text-xs font-mono font-bold ${stats.baseWeightGrams <= weightTarget ? "text-volt" : "text-ember"}`}>
                    {stats.baseWeightGrams <= weightTarget
                      ? `${formatWeight(weightTarget - stats.baseWeightGrams, unit)} under`
                      : `${formatWeight(stats.baseWeightGrams - weightTarget, unit)} over`}
                  </span>
                  <button onClick={() => { setEditingTarget(true); setTargetInput(String(convertWeight(weightTarget, unit).toFixed(2))); }}
                    className="text-[10px] font-mono text-ink-3 hover:text-volt uppercase tracking-wider">Edit</button>
                </div>
              </div>
              <div className="h-1 bg-field-elevated rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${stats.baseWeightGrams <= weightTarget ? "bg-volt" : "bg-ember"}`}
                  style={{ width: `${Math.min(100, (stats.baseWeightGrams / weightTarget) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      )}
      {!weightTarget && !editingTarget && (
        <button onClick={() => { setEditingTarget(true); setTargetInput(""); }}
          className="mb-4 flex items-center gap-1.5 text-[10px] font-mono text-ink-3 hover:text-volt uppercase tracking-wider transition-colors no-print">
          <Target className="w-3 h-3" />
          Set weight target
        </button>
      )}

      {/* View tabs */}
      <div className="flex items-center gap-1 bg-field-surface border border-field-border rounded-lg p-1 mb-4 w-fit">
        {(["items", "charts"] as const).map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${
              activeView === view
                ? "bg-field-elevated text-volt border border-field-border-strong shadow-sm"
                : "text-ink-3 hover:text-ink-2"
            }`}
          >
            {view === "items" ? <List className="w-3 h-3" /> : <BarChart2 className="w-3 h-3" />}
            {view}
          </button>
        ))}
      </div>

      {/* Charts view */}
      {activeView === "charts" && <ListCharts items={items} unit={unit} />}

      {/* Items view content */}
      <div className={activeView !== "items" ? "hidden" : ""}>
      {/* Search bar */}
      <div className="relative mb-3 no-print">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3 pointer-events-none" />
        <input
          type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-field-card border border-field-border rounded-lg text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt font-mono"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-1">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-field-surface border border-field-border rounded-lg p-1">
            {WEIGHT_UNITS.map((u) => (
              <button key={u} onClick={() => changeUnit(u)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${u === unit ? "bg-field-elevated text-volt border border-field-border-strong shadow-sm" : "text-ink-3 hover:text-ink-2"}`}>
                {u}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setIsSelecting((v) => !v); setSelectedIds(new Set()); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors no-print ${isSelecting ? "border-volt/40 text-volt bg-volt-muted" : "border-field-border text-ink-3 hover:text-ink-1 hover:bg-field-elevated"}`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isSelecting ? "Cancel" : "Select"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => { setNewCategoryName(""); setShowNewCategoryForm(true); }}
            className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink-1 border border-field-border hover:border-field-border-strong bg-field-card hover:bg-field-elevated text-xs font-mono px-3 py-2 rounded-lg transition-colors uppercase tracking-wider flex-shrink-0"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Category</span>
          </button>
          <button
            onClick={() => { setShowClosetPicker(true); }}
            className="inline-flex items-center gap-1.5 text-ink-2 hover:text-ink-1 border border-field-border hover:border-field-border-strong bg-field-card hover:bg-field-elevated text-xs font-mono px-3 py-2 rounded-lg transition-colors uppercase tracking-wider flex-shrink-0"
          >
            <Package className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">From Closet</span>
          </button>
          <button
            onClick={() => { setAddForm(emptyForm); setShowAddForm(true); }}
            className="inline-flex items-center gap-1.5 bg-volt hover:bg-volt-dim text-field-bg font-display font-bold text-xs px-4 py-2 rounded-lg transition-colors uppercase tracking-widest flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        </div>
      </div>

      {/* New category form */}
      {showNewCategoryForm && (
        <form onSubmit={handleCreateCategory}
          className="flex gap-2 items-center mb-4 p-3 bg-field-card border border-volt/30 rounded-xl">
          <input
            type="text" value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name..."
            className="flex-1 px-3 py-2 text-sm bg-field-surface border border-field-border rounded-lg text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt font-mono"
            autoFocus
          />
          <button type="submit" disabled={!newCategoryName.trim()}
            className="bg-volt hover:bg-volt-dim disabled:bg-field-elevated disabled:text-ink-3 text-field-bg font-display font-bold text-xs px-4 py-2 rounded-lg transition-colors uppercase tracking-widest">
            Add
          </button>
          <button type="button" onClick={() => setShowNewCategoryForm(false)}
            className="text-xs font-mono text-ink-2 hover:text-ink-1 px-3 py-2 rounded-lg border border-field-border hover:bg-field-elevated transition-colors uppercase tracking-wider">
            Cancel
          </button>
        </form>
      )}

      {/* Add item form */}
      {showAddForm && (
        <div className="bg-field-card border border-volt/30 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-3.5 bg-volt rounded-full" />
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">Add New Item</h3>
          </div>
          <form onSubmit={handleAddItem}>
            <ItemFormFields form={addForm} setForm={setAddForm} unit={unit} categories={allCategories}
              isPending={isPending} onCancel={() => setShowAddForm(false)} submitLabel="Add Item" />
          </form>
        </div>
      )}

      {/* Items list */}
      {!hasContent && !showAddForm ? (
        <div className="text-center py-20 bg-field-card border border-field-border rounded-2xl topo-bg">
          <div className="w-12 h-12 bg-volt-muted border border-volt/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-5 h-5 text-volt/50" />
          </div>
          <p className="text-xs text-ink-2 font-mono mb-1">No items yet</p>
          <button onClick={() => setShowAddForm(true)}
            className="text-xs text-volt hover:text-volt-dim font-mono transition-colors">
            + Add first item
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={collisionDetection}
          onDragStart={handleDragStart} onDragOver={handleDragOver}
          onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <div className="space-y-3">
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {displayCategoryOrder.map((category) => {
                const catItems = grouped[category] ?? [];
                const catStats = computeListStats(catItems);
                const isEmpty = catItems.length === 0;
                const isBeingDragged = activeId === `cat:${category}`;
                const isDropTarget = overCatId === `cat:${category}` && !isBeingDragged;

                return (
                  <DroppableCategorySection key={category} category={category} isOver={isDropTarget}>
                    <DraggableCategoryHeader
                      category={category}
                      weightLabel={isEmpty ? "empty" : formatWeight(catStats.totalWeightGrams, unit)}
                      isEmpty={isEmpty} isBeingDragged={isBeingDragged}
                      onAddItem={() => openAddFormForCategory(category)}
                      onRemove={() => handleRemoveCategory(category)}
                    />

                    {isEmpty ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-[11px] text-ink-3 font-mono mb-1.5">No items in this category</p>
                        <button onClick={() => openAddFormForCategory(category)}
                          className="text-[11px] text-volt hover:text-volt-dim font-mono transition-colors">
                          + Add item
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm min-w-[580px]">
                            <thead>
                              <tr className="text-[9px] font-mono uppercase tracking-[0.15em] text-ink-3 border-b border-field-border/50">
                                <th className="w-6 px-2 py-2" />
                                <th className="text-left font-medium px-4 py-2 w-full">Item</th>
                                <th className="text-right font-medium px-3 py-2 whitespace-nowrap">Unit wgt</th>
                                <th className="text-right font-medium px-3 py-2">Qty</th>
                                <th className="text-right font-medium px-3 py-2 whitespace-nowrap">Total wgt</th>
                                <th className="text-right font-medium px-3 py-2">Cost</th>
                                <th className="px-3 py-2 w-16" />
                              </tr>
                            </thead>
                            <tbody>
                              {catItems.map((item) => (
                                <SortableItemRow key={item.id} item={item} unit={unit}
                                  deleteConfirmId={deleteConfirmId} isPending={isPending}
                                  onEdit={() => setEditingItem(item)}
                                  onDeleteClick={() => setDeleteConfirmId(item.id)}
                                  onDeleteConfirm={() => handleDelete(item.id)}
                                  onDeleteCancel={() => setDeleteConfirmId(null)}
                                  isSelecting={isSelecting}
                                  isSelected={selectedIds.has(item.id)}
                                  onSelect={(checked) => toggleSelect(item.id, checked)}
                                />
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="px-4 py-2 border-t border-field-border/50 bg-field-surface flex justify-between text-[10px] font-mono text-ink-3">
                          <span>{catItems.reduce((s, i) => s + i.quantity, 0)} item{catItems.length !== 1 ? "s" : ""}</span>
                          <span className="text-ink-2">
                            {formatWeight(catStats.totalWeightGrams, unit)}
                            {catStats.totalCostCents > 0 && ` · ${formatCost(catStats.totalCostCents)}`}
                          </span>
                        </div>
                      </>
                    )}
                  </DroppableCategorySection>
                );
              })}
            </SortableContext>

            {/* Other lists drop targets */}
            {activeId && !activeId.startsWith("cat:") && otherLists.length > 0 && (
              <div className="space-y-2">
                <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-ink-3 px-1">Move to another list</p>
                {otherLists.map((ol) => (
                  <OtherListDropTarget key={ol.id} id={ol.id} name={ol.name} isOver={overListId === ol.id} />
                ))}
              </div>
            )}

            {/* Pack total */}
            {items.length > 0 && (
              <div className="bg-volt-muted border border-volt/20 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-volt/70 mb-0.5">Pack Total</p>
                    <p className="text-[11px] font-mono text-ink-2">
                      Base {formatWeight(stats.baseWeightGrams, unit)}
                      {stats.wornWeightGrams > 0 && ` · Worn ${formatWeight(stats.wornWeightGrams, unit)}`}
                      {stats.consumableWeightGrams > 0 && ` · Consumables ${formatWeight(stats.consumableWeightGrams, unit)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-mono font-bold text-volt tabular-nums volt-glow">
                      {formatWeight(stats.totalWeightGrams, unit)}
                    </p>
                    {stats.totalCostCents > 0 && (
                      <p className="text-xs font-mono text-ink-2 mt-0.5">
                        ${(stats.totalCostCents / 100).toFixed(2)} total
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeItem && (
              <table className="w-full text-sm bg-field-elevated shadow-2xl rounded-lg border border-volt/40 opacity-95">
                <tbody>
                  <SortableItemRow item={activeItem} unit={unit} deleteConfirmId={null} isPending={false}
                    onEdit={() => {}} onDeleteClick={() => {}} onDeleteConfirm={() => {}} onDeleteCancel={() => {}} overlay />
                </tbody>
              </table>
            )}
            {activeId?.startsWith("cat:") && (
              <div className="bg-field-elevated border border-volt/50 rounded-xl shadow-2xl px-4 py-2.5 flex items-center gap-2">
                <div className="w-0.5 h-3 bg-volt rounded-full" />
                <GripVertical className="w-3.5 h-3.5 text-volt/60" />
                <span className="text-[11px] font-display font-bold uppercase tracking-[0.12em] text-ink-1">{activeId.slice(4)}</span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
      </div>{/* end items view */}

      {/* Bulk action bar */}
      {isSelecting && selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-field-elevated border border-field-border-strong rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 no-print">
          <span className="text-xs font-mono text-ink-2">{selectedIds.size} selected</span>
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => { if (e.target.value) { handleBulkCategoryChange(e.target.value); e.target.value = ""; } }}
              className="text-xs font-mono bg-field-surface border border-field-border rounded-lg px-2 py-1.5 text-ink-2 focus:outline-none focus:ring-1 focus:ring-volt"
              defaultValue=""
            >
              <option value="" disabled>Move to category...</option>
              {allCategories.slice(0, 20).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={handleBulkDelete}
              className="flex items-center gap-1.5 text-xs font-mono text-ember hover:text-ember/80 px-3 py-1.5 border border-ember/30 rounded-lg hover:bg-ember-muted transition-colors uppercase tracking-wider">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
            <button onClick={() => { setSelectedIds(new Set()); setIsSelecting(false); }}
              className="text-xs font-mono text-ink-3 hover:text-ink-1 px-2 py-1.5 rounded-lg hover:bg-field-elevated transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Closet picker modal */}
      {showClosetPicker && (
        <ClosetPickerModal
          unit={unit}
          onSelect={(closetItem) => {
            setAddForm({
              name: closetItem.name,
              description: closetItem.description ?? "",
              category: closetItem.category,
              weight: gramsToUnit(closetItem.weight_grams, unit),
              cost: closetItem.cost_cents > 0 ? (closetItem.cost_cents / 100).toFixed(2) : "",
              quantity: "1",
              worn: false,
              consumable: false,
            });
            setShowClosetPicker(false);
            setShowAddForm(true);
          }}
          onClose={() => setShowClosetPicker(false)}
        />
      )}

      {editingItem && (
        <EditItemModal item={editingItem} unit={unit} categories={allCategories}
          isPending={isPending} onSave={handleEditSave} onClose={() => setEditingItem(null)} />
      )}
    </div>
  );
}
