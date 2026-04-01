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

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        New List
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">New Gear List</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="list-name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  List Name
                </label>
                <input
                  id="list-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. John Muir Trail 2025"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="list-description"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Description{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="list-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Trip notes, dates, conditions..."
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!name.trim() || isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  {isPending ? "Creating..." : "Create List"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
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
