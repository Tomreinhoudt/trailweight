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
    case "oz":
      return value * 28.3495;
    case "lb":
      return value * 453.592;
    case "kg":
      return value * 1000;
    default:
      return value; // g or unknown
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
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    if (row.some((f) => f.trim())) rows.push(row);
  }

  return rows;
}

function parseFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length < 2) {
          reject(new Error("CSV has no data rows"));
          return;
        }

        // Skip header row
        const dataRows = rows.slice(1);
        const items: ParsedItem[] = [];

        for (const row of dataRows) {
          // Pad row to 10 columns
          while (row.length < 10) row.push("");
          const [category, name, description, weightRaw, unit, priceRaw, , qtyRaw, wornRaw, consumableRaw] = row;

          if (!name.trim()) continue;

          const weightVal = parseFloat(weightRaw) || 0;
          const weight_grams = Math.round(toGrams(weightVal, unit || "g"));
          const price = parseFloat(priceRaw) || 0;
          const cost_cents = Math.round(price * 100);
          const quantity = Math.max(1, parseInt(qtyRaw) || 1);

          items.push({
            name: name.trim(),
            description: description.trim() || null,
            category: category.trim() || "Uncategorized",
            weight_grams,
            cost_cents,
            quantity,
            worn: parseBool(wornRaw),
            consumable: parseBool(consumableRaw),
          });
        }

        const totalWeightGrams = items.reduce(
          (sum, item) => sum + item.weight_grams * item.quantity,
          0
        );

        const listName = file.name.replace(/\.csv$/i, "");
        resolve({ listName, items, totalWeightGrams });
      } catch (err) {
        reject(err);
      }
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
      if (result.items.length === 0) {
        setParseError("No valid items found in CSV");
        return;
      }
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
        const { listId } = await importListWithItems({
          name: parseResult.listName,
          items: parseResult.items,
        });
        router.push(`/dashboard/lists/${listId}`);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Import failed");
      }
    });
  };

  const handleClose = () => {
    setParseResult(null);
    setParseError(null);
    setImportError(null);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Upload className="w-4 h-4" />
        Import CSV
      </button>

      {parseError && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-red-600 font-medium mb-4">{parseError}</p>
            <button onClick={handleClose} className="w-full py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {parseResult && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Import CSV</h2>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">List name</p>
                <p className="text-sm font-semibold text-slate-900">{parseResult.listName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Items</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">
                    {parseResult.items.length}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Total weight</p>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">
                    {parseResult.totalWeightGrams >= 1000
                      ? formatWeight(parseResult.totalWeightGrams, "kg")
                      : formatWeight(parseResult.totalWeightGrams, "g")}
                  </p>
                </div>
              </div>

              {importError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {importError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleConfirm}
                  disabled={isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
                >
                  {isPending ? "Importing..." : "Import List"}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
