export type WeightUnit = "g" | "oz" | "lb" | "kg";

export interface GearList {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category_order: string[];
  is_public: boolean;
  weight_target_grams: number | null;
  created_at: string;
  updated_at: string;
  gear_items?: GearItem[];
}

export interface GearItem {
  id: string;
  list_id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string;
  weight_grams: number;
  cost_cents: number;
  quantity: number;
  worn: boolean;
  consumable: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClosetItem {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  description: string | null;
  category: string;
  weight_grams: number;
  cost_cents: number;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListStats {
  totalWeightGrams: number;
  baseWeightGrams: number;
  wornWeightGrams: number;
  consumableWeightGrams: number;
  totalCostCents: number;
  itemCount: number;
}
