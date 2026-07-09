
/*
# NutriAI Platform – Initial Schema

## Overview
Full schema for an AI-powered nutrition and food tracking platform.

## New Tables

### user_profiles
Stores user personal data needed for nutrition calculations:
- id (uuid, PK, references auth.users)
- full_name, age, gender, height_cm, weight_kg
- activity_level, goal, daily targets

### food_items
Nutritional data per 100g, public (user_id NULL) or user-private.

### food_logs
Daily food tracking entries per user, indexed by user+date.

### weight_logs
Body weight tracking per user.

### ai_recommendations
AI-generated personalized advice stored per user.

## Security
RLS enabled on all tables; authenticated-only owner-scoped CRUD policies.
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  age integer,
  gender text CHECK (gender IN ('male','female','other')),
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  activity_level text DEFAULT 'moderately_active'
    CHECK (activity_level IN ('sedentary','lightly_active','moderately_active','very_active','extra_active')),
  goal text DEFAULT 'maintain'
    CHECK (goal IN ('lose_weight','maintain','gain_muscle')),
  daily_calorie_target integer,
  daily_protein_g integer,
  daily_carbs_g integer,
  daily_fat_g integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON user_profiles;
CREATE POLICY "delete_own_profile" ON user_profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  calories_per_100g numeric(7,2) NOT NULL DEFAULT 0,
  protein_per_100g numeric(7,2) NOT NULL DEFAULT 0,
  carbs_per_100g numeric(7,2) NOT NULL DEFAULT 0,
  fat_per_100g numeric(7,2) NOT NULL DEFAULT 0,
  fiber_per_100g numeric(7,2) NOT NULL DEFAULT 0,
  is_custom boolean NOT NULL DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_food_items" ON food_items;
CREATE POLICY "select_food_items" ON food_items FOR SELECT
  TO authenticated USING (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS "insert_food_items" ON food_items;
CREATE POLICY "insert_food_items" ON food_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_food_items" ON food_items;
CREATE POLICY "update_food_items" ON food_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_food_items" ON food_items;
CREATE POLICY "delete_food_items" ON food_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS food_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  food_item_id uuid NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  quantity_g numeric(7,1) NOT NULL,
  calories numeric(7,2) NOT NULL DEFAULT 0,
  protein_g numeric(7,2) NOT NULL DEFAULT 0,
  carbs_g numeric(7,2) NOT NULL DEFAULT 0,
  fat_g numeric(7,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS food_logs_user_date ON food_logs(user_id, date);

ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_food_logs" ON food_logs;
CREATE POLICY "select_own_food_logs" ON food_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_food_logs" ON food_logs;
CREATE POLICY "insert_own_food_logs" ON food_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_food_logs" ON food_logs;
CREATE POLICY "update_own_food_logs" ON food_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_food_logs" ON food_logs;
CREATE POLICY "delete_own_food_logs" ON food_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg numeric(5,1) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS weight_logs_user_date ON weight_logs(user_id, date);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_weight_logs" ON weight_logs;
CREATE POLICY "select_own_weight_logs" ON weight_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_weight_logs" ON weight_logs;
CREATE POLICY "insert_own_weight_logs" ON weight_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_weight_logs" ON weight_logs;
CREATE POLICY "update_own_weight_logs" ON weight_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_weight_logs" ON weight_logs;
CREATE POLICY "delete_own_weight_logs" ON weight_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('meal_plan','tip','warning','motivation')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_recs_user ON ai_recommendations(user_id, created_at DESC);

ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ai_recs" ON ai_recommendations;
CREATE POLICY "select_own_ai_recs" ON ai_recommendations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_ai_recs" ON ai_recommendations;
CREATE POLICY "insert_own_ai_recs" ON ai_recommendations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_ai_recs" ON ai_recommendations;
CREATE POLICY "update_own_ai_recs" ON ai_recommendations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_ai_recs" ON ai_recommendations;
CREATE POLICY "delete_own_ai_recs" ON ai_recommendations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

INSERT INTO food_items (name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g)
SELECT name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g FROM (VALUES
  ('Chicken Breast (cooked)', 165, 31, 0, 3.6, 0),
  ('Brown Rice (cooked)', 123, 2.7, 25.6, 0.9, 1.6),
  ('Broccoli (raw)', 34, 2.8, 7, 0.4, 2.6),
  ('Egg (whole)', 143, 12.6, 0.7, 9.5, 0),
  ('Salmon (baked)', 206, 28, 0, 10, 0),
  ('Oats (dry)', 389, 16.9, 66, 6.9, 10.6),
  ('Banana', 89, 1.1, 23, 0.3, 2.6),
  ('Greek Yogurt', 97, 9, 6.5, 5, 0),
  ('Almonds', 579, 21, 22, 50, 12.5),
  ('Avocado', 160, 2, 9, 15, 7),
  ('Sweet Potato (baked)', 103, 2.3, 24, 0.1, 3.8),
  ('Spinach (raw)', 23, 2.9, 3.6, 0.4, 2.2),
  ('Quinoa (cooked)', 120, 4.4, 21.3, 1.9, 2.8),
  ('Tuna (canned in water)', 116, 26, 0, 1, 0),
  ('Lentils (cooked)', 116, 9, 20, 0.4, 7.9),
  ('Whole Milk', 61, 3.2, 4.8, 3.3, 0),
  ('Cheddar Cheese', 403, 25, 1.3, 33, 0),
  ('White Bread', 265, 9, 49, 3.2, 2.7),
  ('Apple', 52, 0.3, 14, 0.2, 2.4),
  ('Orange', 47, 0.9, 12, 0.1, 2.4),
  ('Blueberries', 57, 0.7, 14, 0.3, 2.4),
  ('Pasta (cooked)', 158, 5.8, 31, 0.9, 1.8),
  ('Beef (lean, cooked)', 215, 26, 0, 12, 0),
  ('Turkey Breast', 135, 30, 0, 1, 0),
  ('Cottage Cheese', 98, 11, 3.4, 4.3, 0)
) AS v(name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g)
WHERE NOT EXISTS (SELECT 1 FROM food_items WHERE food_items.name = v.name AND food_items.user_id IS NULL);
