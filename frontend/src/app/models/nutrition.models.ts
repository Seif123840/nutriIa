export interface UserProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  daily_calorie_target: number | null;
  daily_protein_g: number | null;
  daily_carbs_g: number | null;
  daily_fat_g: number | null;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string;
  name: string;
  brand: string | null;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  is_custom: boolean;
  user_id: string | null;
  created_at: string;
}

export interface FoodLog {
  id: string;
  user_id: string;
  food_item_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
  food_item?: FoodItem;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  date: string;
  notes: string | null;
  created_at: string;
}

export interface AiRecommendation {
  id: string;
  user_id: string;
  type: 'meal_plan' | 'tip' | 'warning' | 'motivation';
  content: string;
  created_at: string;
}

export interface DailyNutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}
