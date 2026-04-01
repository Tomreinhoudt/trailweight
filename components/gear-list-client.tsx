"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  ChevronLeft,
  Trash2,
  Pencil,
  X,
  Check,
  Package,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  formatWeight,
  formatCost,
  computeListStats,
  groupItemsByCategory,
  unitToGrams,
  gramsToUnit,
} from "@/lib/utils";
import type { GearList, GearItem, WeightUnit } from "@/lib/types";
import { createItem, updateItem, deleteItem, reorderItems, moveItemToList } from "@/actions/items";
import { deleteList } from "@/actions/lists";

const WEIGHT_UNITS: WeightUnit[] = ["g", "oz", "lb", "kg"];

const SUGGESTED_CATEGORIES = [
  "Shelter",
  "Sleep System",
  "Pack & Carry",
  "Clothing",
  "Footwear",
  "Navigation",
  "Food & Water",
  "Safety & First Aid",
  "Electronics",
  "Hygiene",
  "Tools & Repair",
  "Other",
];

interface FormState {
  name: string;
  description: string;
  category: string;
  weight: string;
  cost: string;
  quantity: string;
  worn: boolean;
  consumable: boolean;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  category: "",
  weight: "0",
  cost: "",
  quantity: "1",
  worn: false,
  consumable: false,
};

function itemToForm(item: GearItem, unit: WeightUnit): FormState {
  return {
    name: item.name,
    description: item.description ?? "",
    category: item.category,
    weight: gramsToUnit(item.weight_grams, unit),
    cost: item.cost_cents > 0 ? (item.cost_cents / 100).toFixed(2) : "",
    quantity: item.quantity.toString(),
    worn: item.worn,
    consumable: item.consumable,
  };
}

function formToItemData(form: FormState, unit: WeightUnit) {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
    category: form.category.trim() || "Uncategorized",
    weight_grams: unitToGrams(parseFloat(form.weight) || 0, unit),
    cost_cents: Math.round((parseFloat(form.cost) || 0) * 100),
    quantity: Math.max(1, parseInt(form.quantity) || 1),
    worn: form.worn,
    consumable: form.consumable,
  };
}

// ─── Shared form fields ───────────────────────────────────────────────────────

function ItemFormFields({
  form,
  setForm,
  unit,
  categories,
  isPending,
  onCancel,
  submitLabel,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  unit: WeightUnit;
  categories: string[];
  isPending: boolean;
  onCancel: () => void;
  submitLabel: string;
}) {
  const inputClass =
    "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className={labelClass}>Item Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="e.g. Sleeping Bag"
            className={inputClass}
            autoFocus
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brand, model, color..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <input
            type="text"
            list="item-categories"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Select or type..."
            className={inputClass}
          />
          <datalist id="item-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label className={labelClass}>Weight ({unit})</label>
          <input
            type="number"
            min="0"
            step="any"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Cost (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Quantity</label>
          <input
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-5">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.worn}
            onChange={(e) => setForm({ ...form, worn: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Worn on body
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.consumable}
            onChange={(e) => setForm({ ...form, consumable: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Consumable
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={!form.name.trim() || isPending}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditItemModal({
  item,
  unit,
  categories,
  isPending,
  onSave,
  onClose,
}: {
  item: GearItem;
  unit: WeightUnit;
  categories: string[];
  isPending: boolean;
  onSave: (form: FormState) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => itemToForm(item, unit));

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Edit Item</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="p-6"
        >
          <ItemFormFields
            form={form}
            setForm={setForm}
            unit={unit}
            categories={categories}
            isPending={isPending}
            onCancel={onClose}
            submitLabel="Save Changes"
          />
        </form>
      </div>
    </div>
  );
}

// ─── Sortable item row ────────────────────────────────────────────────────────

function SortableItemRow({
  item,
  unit,
  deleteConfirmId,
  isPending,
  onEdit,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
  overlay,
}: {
  item: GearItem;
  unit: WeightUnit;
  deleteConfirmId: string | null;
  isPending: boolean;
  onEdit: () => void;
  onDeleteClick: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  overlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  if (overlay) {
    return (
      <tr className="bg-white shadow-lg border border-emerald-300 rounded">
        <td className="px-2 py-3 w-6">
          <GripVertical className="w-3.5 h-3.5 text-slate-300" />
        </td>
        <td className="px-4 py-3">
          <span className="font-medium text-slate-900">{item.name}</span>
        </td>
        <td className="px-3 py-3 text-right text-slate-500 whitespace-nowrap tabular-nums">
          {formatWeight(item.weight_grams, unit)}
        </td>
        <td colSpan={3} />
      </tr>
    );
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
    >
      <td className="px-2 py-3 w-6">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 touch-none"
          tabIndex={-1}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-slate-900">{item.name}</span>
          {item.worn && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
              worn
            </span>
          )}
          {item.consumable && (
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
              consumable
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
        )}
      </td>
      <td className="px-3 py-3 text-right text-slate-500 whitespace-nowrap tabular-nums">
        {formatWeight(item.weight_grams, unit)}
      </td>
      <td className="px-3 py-3 text-right text-slate-500 tabular-nums">
        {item.quantity}
      </td>
      <td className="px-3 py-3 text-right font-medium text-slate-900 whitespace-nowrap tabular-nums">
        {formatWeight(item.weight_grams * item.quantity, unit)}
      </td>
      <td className="px-3 py-3 text-right text-slate-500 whitespace-nowrap tabular-nums">
        {item.cost_cents > 0 ? formatCost(item.cost_cents * item.quantity) : "—"}
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {deleteConfirmId === item.id ? (
            <>
              <button
                onClick={onDeleteConfirm}
                disabled={isPending}
                className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                title="Confirm delete"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDeleteCancel}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={onDeleteClick}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Droppable other-list target ──────────────────────────────────────────────

function OtherListDropTarget({
  id,
  name,
  isOver,
}: {
  id: string;
  name: string;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: `list:${id}` });
  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${
        isOver
          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
          : "border-slate-200 text-slate-400"
      }`}
    >
      <Package className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium truncate">{name}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GearListClient({
  list,
  otherLists = [],
}: {
  list: GearList;
  otherLists?: { id: string; name: string }[];
}) {
  const [unit, setUnit] = useState<WeightUnit>("oz");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(emptyForm);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Local items state for optimistic drag reordering
  const [items, setItems] = useState<GearItem[]>(list.gear_items ?? []);
  useEffect(() => {
    setItems(list.gear_items ?? []);
  }, [list.gear_items]);

  // Drag state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overListId, setOverListId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("tw-unit") as WeightUnit | null;
    if (stored && WEIGHT_UNITS.includes(stored)) setUnit(stored);
  }, []);

  const changeUnit = (u: WeightUnit) => {
    setUnit(u);
    localStorage.setItem("tw-unit", u);
  };

  const stats = computeListStats(items);
  const grouped = groupItemsByCategory(items);
  const existingCats = Object.keys(grouped);
  const allCategories = [...new Set([...SUGGESTED_CATEGORIES, ...existingCats])];

  const activeItem = activeId ? items.find((i) => i.id === activeId) ?? null : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setOverListId(null);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id as string | undefined;
    if (overId?.startsWith("list:")) {
      setOverListId(overId.slice(5));
    } else {
      setOverListId(null);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setOverListId(null);

      if (!over) return;

      const activeItemId = active.id as string;
      const overId = over.id as string;

      // Dropped on another list
      if (overId.startsWith("list:")) {
        const targetListId = overId.slice(5);
        const draggedItem = items.find((i) => i.id === activeItemId);
        if (!draggedItem) return;

        setItems((prev) => prev.filter((i) => i.id !== activeItemId));
        startTransition(async () => {
          await moveItemToList(activeItemId, list.id, targetListId, draggedItem.category);
        });
        return;
      }

      // Dropped on an item in the same list — reorder
      if (activeItemId === overId) return;

      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === activeItemId);
        const newIndex = prev.findIndex((i) => i.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;

        const activeItem = prev[oldIndex];
        const overItem = prev[newIndex];

        // If crossing categories, assign the target category
        const updatedItems = arrayMove(prev, oldIndex, newIndex).map((item, idx) =>
          item.id === activeItemId && activeItem.category !== overItem.category
            ? { ...item, category: overItem.category }
            : item
        );

        startTransition(async () => {
          const actions: Promise<void>[] = [
            reorderItems(list.id, updatedItems.map((i) => i.id)),
          ];
          // If category changed, persist via updateItem
          if (activeItem.category !== overItem.category) {
            actions.push(
              updateItem(activeItemId, list.id, {
                name: activeItem.name,
                description: activeItem.description,
                category: overItem.category,
                weight_grams: activeItem.weight_grams,
                cost_cents: activeItem.cost_cents,
                quantity: activeItem.quantity,
                worn: activeItem.worn,
                consumable: activeItem.consumable,
              })
            );
          }
          await Promise.all(actions);
        });

        return updatedItems;
      });
    },
    [items, list.id]
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createItem(list.id, formToItemData(addForm, unit));
      setAddForm(emptyForm);
      setShowAddForm(false);
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
    startTransition(async () => {
      await deleteList(list.id);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back + header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-3 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          My Lists
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 truncate">{list.name}</h1>
            {list.description && (
              <p className="text-slate-500 text-sm mt-1">{list.description}</p>
            )}
          </div>
          <button
            onClick={handleDeleteList}
            disabled={isPending}
            className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete list"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Base Weight", value: formatWeight(stats.baseWeightGrams, unit), sub: "excl. worn & consumables" },
          { label: "Worn Weight", value: formatWeight(stats.wornWeightGrams, unit), sub: "clothing & footwear" },
          { label: "Pack Weight", value: formatWeight(stats.totalWeightGrams, unit), sub: "everything" },
          {
            label: "Total Cost",
            value: stats.totalCostCents > 0 ? `$${(stats.totalCostCents / 100).toFixed(0)}` : "—",
            sub: `${items.length} item${items.length !== 1 ? "s" : ""}`,
          },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {WEIGHT_UNITS.map((u) => (
            <button
              key={u}
              onClick={() => changeUnit(u)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                unit === u ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        <button
          onClick={() => { setAddForm(emptyForm); setShowAddForm(true); }}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Add item form */}
      {showAddForm && (
        <div className="bg-white border border-emerald-200 rounded-xl p-5 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Add New Item</h3>
          <form onSubmit={handleAddItem}>
            <ItemFormFields
              form={addForm}
              setForm={setAddForm}
              unit={unit}
              categories={allCategories}
              isPending={isPending}
              onCancel={() => setShowAddForm(false)}
              submitLabel="Add Item"
            />
          </form>
        </div>
      )}

      {/* Items list */}
      {items.length === 0 && !showAddForm ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
          <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            No items yet.{" "}
            <button
              onClick={() => setShowAddForm(true)}
              className="text-emerald-600 hover:underline font-medium"
            >
              Add Item
            </button>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4">
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {Object.entries(grouped).map(([category, catItems]) => {
                const catStats = computeListStats(catItems);
                return (
                  <div key={category} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    {/* Category header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                      <h3 className="text-sm font-semibold text-slate-700">{category}</h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {formatWeight(catStats.totalWeightGrams, unit)}
                      </span>
                    </div>

                    {/* Items table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[580px]">
                        <thead>
                          <tr className="text-xs text-slate-400 border-b border-slate-100">
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
                            <SortableItemRow
                              key={item.id}
                              item={item}
                              unit={unit}
                              deleteConfirmId={deleteConfirmId}
                              isPending={isPending}
                              onEdit={() => setEditingItem(item)}
                              onDeleteClick={() => setDeleteConfirmId(item.id)}
                              onDeleteConfirm={() => handleDelete(item.id)}
                              onDeleteCancel={() => setDeleteConfirmId(null)}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Category footer */}
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex justify-between text-xs text-slate-400">
                      <span>
                        {catItems.reduce((s, i) => s + i.quantity, 0)} item
                        {catItems.length !== 1 ? "s" : ""}
                      </span>
                      <span className="font-medium text-slate-600">
                        {formatWeight(catStats.totalWeightGrams, unit)}
                        {catStats.totalCostCents > 0 && ` · ${formatCost(catStats.totalCostCents)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </SortableContext>

            {/* Other lists as drop targets — only shown while dragging */}
            {activeId && otherLists.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide px-1">
                  Move to another list
                </p>
                {otherLists.map((ol) => (
                  <OtherListDropTarget
                    key={ol.id}
                    id={ol.id}
                    name={ol.name}
                    isOver={overListId === ol.id}
                  />
                ))}
              </div>
            )}

            {/* Grand total */}
            {items.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Pack Total</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Base {formatWeight(stats.baseWeightGrams, unit)}
                      {stats.wornWeightGrams > 0 && ` · Worn ${formatWeight(stats.wornWeightGrams, unit)}`}
                      {stats.consumableWeightGrams > 0 && ` · Food/Water ${formatWeight(stats.consumableWeightGrams, unit)}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-900 tabular-nums">
                      {formatWeight(stats.totalWeightGrams, unit)}
                    </p>
                    {stats.totalCostCents > 0 && (
                      <p className="text-sm text-emerald-700 mt-0.5">
                        ${(stats.totalCostCents / 100).toFixed(2)} total
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drag overlay — floating ghost row */}
          <DragOverlay>
            {activeItem && (
              <table className="w-full text-sm bg-white shadow-xl rounded-lg border border-emerald-300 opacity-95">
                <tbody>
                  <SortableItemRow
                    item={activeItem}
                    unit={unit}
                    deleteConfirmId={null}
                    isPending={false}
                    onEdit={() => {}}
                    onDeleteClick={() => {}}
                    onDeleteConfirm={() => {}}
                    onDeleteCancel={() => {}}
                    overlay
                  />
                </tbody>
              </table>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Edit modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          unit={unit}
          categories={allCategories}
          isPending={isPending}
          onSave={handleEditSave}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
