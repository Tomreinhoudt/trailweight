"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { importListWithItems } from "@/actions/lists";
import { formatWeight } from "@/lib/utils";

interface ParsedItem {
  name: string;
  description: string | null;
  category: string;
  weight_grams: number;
  cost_cents: number;
  quantity: number;
  worn: boolean;
  consumable: boolean;
}

interface ParseResult {
  listName: string;
  items: ParsedItem[];
  totalWeightGrams: number;
}

function toGrams(value: number, unit: string): number {
  switch (unit.toLowerCase().trim()) {
    case "oz": return value * 28.3495;
    case "lb": return value * 453.592;
    case "kg": return value * 1000;
    default: return value;
  }
}

function parseBool(value: string): boolean {
  const v = value.toLowerCase().trim();
  return v === "true" || v === "1" || v === "yes" || v === "x";
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      row.push(field); field = "";
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field || row.length > 0) { row.push(field); if (row.some((f) => f.trim())) rows.push(row); }
  return rows;
}

function parseFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length < 2) { reject(new Error("CSV has no data rows")); return; }
        const dataRows = rows.slice(1);
        const items: ParsedItem[] = [];
        for (const row of dataRows) {
          while (row.length < 10) row.push("");
          const [category, name, description, weightRaw, unit, priceRaw, , qtyRaw, wornRaw, consumableRaw] = row;
          if (!name.trim()) continue;
          const weightVal = parseFloat(weightRaw) || 0;
          const weight_grams = Math.round(toGrams(weightVal, unit || "g"));
          const price = parseFloat(priceRaw) || 0;
          const cost_cents = Math.round(price * 100);
          const quantity = Math.max(1, parseInt(qtyRaw) || 1);
          items.push({
            name: name.trim(), description: description.trim() || null,
            category: category.trim() || "Uncategorized",
            weight_grams, cost_cents, quantity,
            worn: parseBool(wornRaw), consumable: parseBool(consumableRaw),
          });
        }
        const totalWeightGrams = items.reduce((sum, item) => sum + item.weight_grams * item.quantity, 0);
        resolve({ listName: file.name.replace(/\.csv$/i, ""), items, totalWeightGrams });
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function CsvImportButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
    if (!file) return;
    try {
      const result = await parseFile(file);
      if (result.items.length === 0) { setParseError("No valid items found in CSV"); return; }
      setParseError(null);
      setParseResult(result);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to parse CSV");
    }
  };

  const handleConfirm = () => {
    if (!parseResult) return;
    setImportError(null);
    startTransition(async () => {
      try {
        const { listId } = await importListWithItems({ name: parseResult.listName, items: parseResult.items });
        router.push(`/dashboard/lists/${listId}`);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Import failed");
      }
    });
  };

  const handleClose = () => { setParseResult(null); setParseError(null); setImportError(null); };

  const modalShell = (content: React.ReactNode) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="bg-field-card border border-field-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {content}
      </div>
    </div>
  );

  return (
    <>
      <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 text-ink-2 hover:text-ink-1 border border-field-border hover:border-field-border-strong bg-field-card hover:bg-field-elevated text-xs font-mono px-4 py-2 rounded-lg transition-colors uppercase tracking-wider"
      >
        <Upload className="w-3.5 h-3.5" />
        Import CSV
      </button>

      {parseError && modalShell(
        <div className="p-6" onClick={(e) => e.stopPropagation()}>
          <div className="px-4 py-3 bg-ember-muted border border-ember/30 rounded-lg mb-4">
            <p className="text-xs text-ember font-mono">{parseError}</p>
          </div>
          <button onClick={handleClose} className="w-full py-2.5 text-xs font-mono text-ink-2 border border-field-border rounded-lg hover:bg-field-elevated transition-colors uppercase tracking-wider">
            Close
          </button>
        </div>
      )}

      {parseResult && modalShell(
        <>
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-field-border bg-field-surface">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-volt rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">Import CSV</h2>
            </div>
            <button onClick={handleClose} className="text-ink-3 hover:text-ink-1 p-1 rounded-lg hover:bg-field-elevated transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-ink-3 mb-1.5">List Name</p>
              <p className="text-sm font-display font-bold text-ink-1 uppercase tracking-wide">{parseResult.listName}</p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-field-border rounded-xl overflow-hidden border border-field-border">
              <div className="bg-field-card px-4 py-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-1">Items</p>
                <p className="text-2xl font-mono font-bold text-volt tabular-nums volt-glow">{parseResult.items.length}</p>
              </div>
              <div className="bg-field-card px-4 py-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-ink-3 mb-1">Total Weight</p>
                <p className="text-2xl font-mono font-bold text-volt tabular-nums volt-glow">
                  {parseResult.totalWeightGrams >= 1000
                    ? formatWeight(parseResult.totalWeightGrams, "kg")
                    : formatWeight(parseResult.totalWeightGrams, "g")}
                </p>
              </div>
            </div>

            {importError && (
              <div className="px-4 py-3 bg-ember-muted border border-ember/30 rounded-lg">
                <p className="text-xs text-ember font-mono">{importError}</p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 bg-volt hover:bg-volt-dim disabled:bg-field-elevated disabled:text-ink-3 text-field-bg font-display font-bold py-3 px-4 rounded-lg transition-colors text-xs uppercase tracking-widest"
              >
                {isPending ? "Importing..." : "Import List"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-4 py-3 text-xs font-mono text-ink-2 hover:text-ink-1 border border-field-border rounded-lg hover:bg-field-elevated transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
