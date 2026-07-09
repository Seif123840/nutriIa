import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  UserProfile,
  FoodItem,
  FoodLog,
  WeightLog,
  AiRecommendation,
  DailyNutrition
} from '../models/nutrition.models';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // ===========================
  // USER PROFILE
  // ===========================

  async getProfile(userId: string): Promise<UserProfile> {
    return await firstValueFrom(
        this.http.get<UserProfile>(`${this.apiUrl}/profiles/${userId}`)
    );
  }

  async upsertProfile(profile: UserProfile): Promise<UserProfile> {
    return await firstValueFrom(
        this.http.put<UserProfile>(
            `${this.apiUrl}/profiles/${profile.id}`,
            profile
        )
    );
  }

  // ===========================
  // FOODS
  // ===========================

  async searchFoods(query: string): Promise<FoodItem[]> {

    if (!query.trim()) {
      return [];
    }

    return await firstValueFrom(
        this.http.get<FoodItem[]>(
            `${this.apiUrl}/foods/search?name=${query}`
        )
    );
  }

  // ===========================
  // FOOD LOGS
  // ===========================

  async getFoodLogs(userId: string, date: string): Promise<FoodLog[]> {

    return await firstValueFrom(
        this.http.get<FoodLog[]>(
            `${this.apiUrl}/foodlogs/${userId}/${date}`
        )
    );

  }

  async addFoodLog(
      log: Omit<FoodLog, 'id' | 'created_at' | 'food_item'>
  ): Promise<FoodLog> {

    return await firstValueFrom(
        this.http.post<FoodLog>(
            `${this.apiUrl}/foodlogs`,
            log
        )
    );

  }

  async deleteFoodLog(id: string): Promise<void> {

    await firstValueFrom(
        this.http.delete<void>(
            `${this.apiUrl}/foodlogs/${id}`
        )
    );

  }

  // ===========================
  // WEIGHT
  // ===========================

  async getWeightLogs(userId: string): Promise<WeightLog[]> {

    return await firstValueFrom(
        this.http.get<WeightLog[]>(
            `${this.apiUrl}/weights/${userId}`
        )
    );

  }

  async addWeightLog(
      log: Omit<WeightLog, 'id' | 'created_at'>
  ): Promise<WeightLog> {

    return await firstValueFrom(
        this.http.post<WeightLog>(
            `${this.apiUrl}/weights`,
            log
        )
    );

  }

  // ===========================
  // AI RECOMMENDATIONS
  // ===========================

  async getAiRecommendations(userId: string): Promise<AiRecommendation[]> {

    return await firstValueFrom(
        this.http.get<AiRecommendation[]>(
            `${this.apiUrl}/recommendations/${userId}`
        )
    );

  }

  async saveAiRecommendation(
      rec: Omit<AiRecommendation, 'id' | 'created_at'>
  ): Promise<void> {

    await firstValueFrom(
        this.http.post<void>(
            `${this.apiUrl}/recommendations`,
            rec
        )
    );

  }

  // ===========================
  // CALCULATIONS
  // ===========================

  calculateDailyTotals(logs: FoodLog[]): DailyNutrition {

    return logs.reduce(

        (acc, log) => ({

          calories: acc.calories + (log.calories ?? 0),

          protein_g: acc.protein_g + (log.protein_g ?? 0),

          carbs_g: acc.carbs_g + (log.carbs_g ?? 0),

          fat_g: acc.fat_g + (log.fat_g ?? 0),

        }),

        {

          calories: 0,

          protein_g: 0,

          carbs_g: 0,

          fat_g: 0

        }

    );

  }

  calculateNutritionForQuantity(
      food: FoodItem,
      quantityG: number
  ): DailyNutrition {

    const factor = quantityG / 100;

    return {

      calories: Math.round(food.calories_per_100g * factor * 10) / 10,

      protein_g: Math.round(food.protein_per_100g * factor * 10) / 10,

      carbs_g: Math.round(food.carbs_per_100g * factor * 10) / 10,

      fat_g: Math.round(food.fat_per_100g * factor * 10) / 10

    };

  }

  calculateBMR(profile: UserProfile): number {

    if (!profile.weight_kg || !profile.height_cm || !profile.age) {
      return 0;
    }

    if (profile.gender === 'male') {

      return (
          10 * profile.weight_kg +
          6.25 * profile.height_cm -
          5 * profile.age +
          5
      );

    }

    return (
        10 * profile.weight_kg +
        6.25 * profile.height_cm -
        5 * profile.age -
        161
    );

  }

  calculateTDEE(profile: UserProfile): number {

    const bmr = this.calculateBMR(profile);

    const activityFactors: Record<string, number> = {

      sedentary: 1.2,

      lightly_active: 1.375,

      moderately_active: 1.55,

      very_active: 1.725,

      extra_active: 1.9

    };

    return Math.round(

        bmr * (activityFactors[profile.activity_level] ?? 1.55)

    );

  }

  calculateTargets(profile: UserProfile) {

    const tdee = this.calculateTDEE(profile);

    let calories = tdee;

    if (profile.goal === 'lose_weight') {

      calories -= 500;

    }

    if (profile.goal === 'gain_muscle') {

      calories += 300;

    }

    const weight = profile.weight_kg ?? 70;

    const protein = Math.round(weight * 2);

    const fat = Math.round((calories * 0.25) / 9);

    const carbs = Math.max(
        0,
        Math.round((calories - protein * 4 - fat * 9) / 4)
    );

    return {

      calories,

      protein,

      carbs,

      fat

    };

  }

  // ===========================
  // AI INSIGHTS
  // ===========================

  generateAiInsights(
      profile: UserProfile,
      todayTotals: DailyNutrition,
      weightLogs: WeightLog[]
  ): { type: AiRecommendation['type']; content: string }[] {

    const insights: {
      type: AiRecommendation['type'];
      content: string;
    }[] = [];

    const target = profile.daily_calorie_target ?? 2000;

    const consumed = todayTotals.calories;

    const remaining = target - consumed;

    if (consumed === 0) {

      insights.push({

        type: 'motivation',

        content:
            'Start tracking your meals today! Every logged meal brings you closer to your goals.'

      });

    } else if (remaining > 500) {

      insights.push({

        type: 'tip',

        content: `You still have ${remaining} kcal remaining today.`

      });

    } else if (remaining < -200) {

      insights.push({

        type: 'warning',

        content: `You exceeded your calorie target by ${Math.abs(
            remaining
        )} kcal.`

      });

    } else {

      insights.push({

        type: 'motivation',

        content: 'Excellent tracking today!'

      });

    }

    const proteinTarget = profile.daily_protein_g ?? 150;

    if (
        todayTotals.protein_g < proteinTarget * 0.5 &&
        consumed > 0
    ) {

      insights.push({

        type: 'tip',

        content:
            'Increase your protein intake with eggs, chicken, fish or yogurt.'

      });

    }

    if (weightLogs.length >= 2) {

      const latest = weightLogs[weightLogs.length - 1].weight_kg;

      const previous = weightLogs[weightLogs.length - 2].weight_kg;

      const diff = latest - previous;

      if (profile.goal === 'lose_weight' && diff < 0) {

        insights.push({

          type: 'motivation',

          content: `Great! You lost ${Math.abs(diff).toFixed(1)} kg.`

        });

      }

      if (profile.goal === 'gain_muscle' && diff > 0) {

        insights.push({

          type: 'motivation',

          content: `Great! You gained ${diff.toFixed(1)} kg.`

        });

      }

    }

    return insights;

  }

}