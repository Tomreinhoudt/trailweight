import type { GearItem, ListStats, WeightUnit } from "./types";

export function convertWeight(grams: number, unit: WeightUnit): number {
  switch (unit) {
    case "g":
      return grams;
    case "oz":
      return grams / 28.3495;
    case "lb":
      return grams / 453.592;
    case "kg":
      return grams / 1000;
  }
}

export function formatWeight(grams: number, unit: WeightUnit): string {
  if (grams === 0) return "—";
  const value = convertWeight(grams, unit);
  switch (unit) {
    case "g":
      return `${Math.round(value)}g`;
    case "oz":
      return `${value.toFixed(1)}oz`;
    case "lb":
      return `${value.toFixed(2)}lb`;
    case "kg":
      return `${value.toFixed(3)}kg`;
  }
}

export function formatCost(cents: number): string {
  if (cents === 0) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

export function unitToGrams(value: number, unit: WeightUnit): number {
  switch (unit) {
    case "g":
      return value;
    case "oz":
      return value * 28.3495;
    case "lb":
      return value * 453.592;
    case "kg":
      return value * 1000;
  }
}

export function gramsToUnit(grams: number, unit: WeightUnit): string {
  const value = convertWeight(grams, unit);
  switch (unit) {
    case "g":
      return grams.toString();
    case "oz":
      return value.toFixed(2);
    case "lb":
      return value.toFixed(3);
    case "kg":
      return value.toFixed(3);
  }
}

export function computeListStats(items: GearItem[]): ListStats {
  return items.reduce(
    (acc, item) => {
      const itemWeight = item.weight_grams * item.quantity;
      acc.totalWeightGrams += itemWeight;
      if (item.worn) {
        acc.wornWeightGrams += itemWeight;
      } else if (item.consumable) {
        acc.consumableWeightGrams += itemWeight;
      } else {
        acc.baseWeightGrams += itemWeight;
      }
      acc.totalCostCents += item.cost_cents * item.quantity;
      acc.itemCount += item.quantity;
      return acc;
    },
    {
      totalWeightGrams: 0,
      baseWeightGrams: 0,
      wornWeightGrams: 0,
      consumableWeightGrams: 0,
      totalCostCents: 0,
      itemCount: 0,
    }
  );
}

export function groupItemsByCategory(
  items: GearItem[]
): Record<string, GearItem[]> {
  return items.reduce(
    (acc, item) => {
      const cat = item.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, GearItem[]>
  );
}
