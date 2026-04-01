"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { createList } from "@/actions/lists";

export function CreateListButton() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      await createList({ name: name.trim(), description: description.trim() || null });
    });
  };

  const handleOpen = () => {
    setName("");
    setDescription("");
    setShowModal(true);
  };

  const inputClass =
    "w-full px-4 py-3 bg-field-surface border border-field-border rounded-lg text-sm text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt transition-all font-mono";

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 bg-volt hover:bg-volt-dim text-field-bg font-display font-bold text-xs px-4 py-2 rounded-lg transition-colors uppercase tracking-widest"
      >
        <Plus className="w-3.5 h-3.5" />
        New List
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-field-card border border-field-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-field-border bg-field-surface">
              <div className="flex items-center gap-2">
                <div className="w-1 h-3.5 bg-volt rounded-full" />
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">
                  New Gear List
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-ink-3 hover:text-ink-1 p-1 rounded-lg hover:bg-field-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-ink-3 mb-2">
                  List Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. John Muir Trail 2025"
                  className={inputClass}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-ink-3 mb-2">
                  Description{" "}
                  <span className="text-ink-3/50 normal-case tracking-normal">optional</span>
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Trip notes, dates, conditions..."
                  className={inputClass}
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={!name.trim() || isPending}
                  className="flex-1 bg-volt hover:bg-volt-dim disabled:bg-field-elevated disabled:text-ink-3 text-field-bg font-display font-bold py-3 px-4 rounded-lg transition-colors text-xs uppercase tracking-widest"
                >
                  {isPending ? "Creating..." : "Create List"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-3 text-xs font-mono text-ink-2 hover:text-ink-1 border border-field-border rounded-lg hover:bg-field-elevated transition-colors uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
