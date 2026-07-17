// ====================================================
// NUTRITION MODELS – conforme à votre backend
// ====================================================

export interface UserProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  weight: number | null;
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
  id: string | number;
  description?: string | null;
  name?: string | null;
  category?: string | null;
  brand?: string | null;
  // Nutriments pour 100g (renvoyés par le backend)
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  // Champs alternatifs (utilisés par certains composants)
  calories_per_100g?: number;
  protein_per_100g?: number;
  carbs_per_100g?: number;
  fat_per_100g?: number;
  fiber_per_100g?: number;
  is_custom?: boolean;
  user_id?: string | null;
  created_at?: string;
}
export interface FoodLog {
  id: number;

  food: FoodItem;

  date: string;

  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';

  quantityG: number;

  calories: number;

  proteinG: number;

  carbsG: number;
  fatG: number;

  createdAt?: string;
}
export interface FoodLogRequest {
  foodId: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
}

export interface WeightLog {
  id: number;
  userId: string;
  weight: number;
  date: string;
  notes?: string | null;
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