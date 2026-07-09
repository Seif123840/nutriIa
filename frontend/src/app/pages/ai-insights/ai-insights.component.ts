import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NutritionService } from '../../services/nutrition.service';
import { AiRecommendation, UserProfile, WeightLog } from '../../models/nutrition.models';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="ai-page">
      <div class="page-header">
        <div>
          <h1>AI Insights</h1>
          <p>Personalized recommendations powered by your data</p>
        </div>
        <button class="btn-generate" (click)="generate()" [disabled]="generating()">
          @if (generating()) {
            <span class="spinner"></span> Analyzing...
          } @else {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a9 9 0 0 1 9 9c0 5-9 13-9 13S3 16 3 11a9 9 0 0 1 9-9z"/>
              <circle cx="12" cy="11" r="3"/>
            </svg>
            Generate insights
          }
        </button>
      </div>

      @if (!profile()) {
        <div class="profile-prompt">
          <div class="pp-icon">🎯</div>
          <h3>Set up your profile to get AI insights</h3>
          <p>We need your health data to generate personalized recommendations.</p>
          <a routerLink="/onboarding" class="btn-setup">Complete profile</a>
        </div>
      } @else {
        <!-- Profile Summary -->
        <div class="profile-summary">
          <div class="ps-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ profile()!.full_name }}
          </div>
          <div class="ps-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {{ profile()!.age }} years
          </div>
          <div class="ps-item goal" [class]="profile()!.goal">
            {{ goalLabel(profile()!.goal) }}
          </div>
          <div class="ps-item">
            🎯 {{ profile()!.daily_calorie_target }} kcal target
          </div>
        </div>

        @if (loading()) {
          <div class="loading-state">
            <div class="ai-loading-icon">🧠</div>
            <p>Loading your insights...</p>
          </div>
        } @else if (insights().length === 0) {
          <div class="empty-insights">
            <div class="ei-icon">💡</div>
            <h3>No insights yet</h3>
            <p>Click "Generate insights" to get personalized AI recommendations based on your current data.</p>
          </div>
        } @else {
          <div class="insights-grid">
            @for (insight of insights(); track insight.id) {
              <div class="insight-card" [class]="insight.type">
                <div class="insight-header">
                  <span class="insight-type-badge" [class]="insight.type">
                    {{ typeIcon(insight.type) }} {{ typeLabel(insight.type) }}
                  </span>
                  <span class="insight-time">{{ insight.created_at | date:'short' }}</span>
                </div>
                <p class="insight-content">{{ insight.content }}</p>
              </div>
            }
          </div>
        }

        <!-- Daily Targets Box -->
        <div class="targets-box">
          <h3>Your daily targets</h3>
          <div class="targets-grid">
            <div class="target-card cal">
              <span class="tc-val">{{ profile()!.daily_calorie_target }}</span>
              <span class="tc-key">Calories (kcal)</span>
              <div class="tc-bar"><div class="tc-fill" [style.width.%]="100"></div></div>
            </div>
            <div class="target-card prot">
              <span class="tc-val">{{ profile()!.daily_protein_g }}g</span>
              <span class="tc-key">Protein</span>
              <div class="tc-bar"><div class="tc-fill" [style.width.%]="100"></div></div>
            </div>
            <div class="target-card carb">
              <span class="tc-val">{{ profile()!.daily_carbs_g }}g</span>
              <span class="tc-key">Carbohydrates</span>
              <div class="tc-bar"><div class="tc-fill" [style.width.%]="100"></div></div>
            </div>
            <div class="target-card fat">
              <span class="tc-val">{{ profile()!.daily_fat_g }}g</span>
              <span class="tc-key">Fat</span>
              <div class="tc-bar"><div class="tc-fill" [style.width.%]="100"></div></div>
            </div>
          </div>
          <p class="targets-note">Based on your goal to <strong>{{ goalLabel(profile()!.goal).toLowerCase() }}</strong>, activity level, and body metrics using the Mifflin-St Jeor formula.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .ai-page { padding: 32px; max-width: 900px; }
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .page-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--neutral-900);
      margin-bottom: 4px;
    }
    .page-header p { font-size: 14px; color: var(--neutral-500); }
    .btn-generate {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--primary-600);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all .15s;
      font-family: inherit;
    }
    .btn-generate:hover:not(:disabled) { background: var(--primary-700); }
    .btn-generate:disabled { opacity: 0.6; cursor: not-allowed; }
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .profile-prompt {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 48px;
      text-align: center;
    }
    .pp-icon { font-size: 40px; margin-bottom: 12px; }
    .profile-prompt h3 { font-size: 18px; font-weight: 700; color: var(--neutral-900); margin-bottom: 8px; }
    .profile-prompt p { font-size: 14px; color: var(--neutral-500); margin-bottom: 20px; }
    .btn-setup {
      padding: 10px 20px;
      background: var(--primary-600);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
    }
    .profile-summary {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .ps-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: white;
      border: 1px solid var(--neutral-200);
      border-radius: 100px;
      font-size: 13px;
      color: var(--neutral-700);
    }
    .ps-item.goal.lose_weight { background: var(--rose-50); border-color: var(--rose-200); color: var(--rose-700); }
    .ps-item.goal.gain_muscle { background: var(--primary-50); border-color: var(--primary-200); color: var(--primary-700); }
    .ps-item.goal.maintain { background: var(--emerald-50); border-color: var(--emerald-200); color: var(--emerald-700); }
    .loading-state {
      text-align: center;
      padding: 48px;
    }
    .ai-loading-icon { font-size: 48px; animation: bounce 1s infinite; }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .loading-state p { font-size: 14px; color: var(--neutral-500); margin-top: 12px; }
    .empty-insights {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 48px;
      text-align: center;
      margin-bottom: 24px;
    }
    .ei-icon { font-size: 40px; margin-bottom: 12px; }
    .empty-insights h3 { font-size: 18px; font-weight: 700; color: var(--neutral-900); margin-bottom: 8px; }
    .empty-insights p { font-size: 14px; color: var(--neutral-500); }
    .insights-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    .insight-card {
      background: white;
      border-radius: 14px;
      padding: 20px;
      border: 1px solid var(--neutral-100);
    }
    .insight-card.motivation { border-left: 4px solid var(--primary-500); }
    .insight-card.tip { border-left: 4px solid var(--emerald-500); }
    .insight-card.warning { border-left: 4px solid var(--amber-400); }
    .insight-card.meal_plan { border-left: 4px solid var(--neutral-400); }
    .insight-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .insight-type-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 100px;
    }
    .insight-type-badge.motivation { background: var(--primary-50); color: var(--primary-700); }
    .insight-type-badge.tip { background: var(--emerald-50); color: var(--emerald-700); }
    .insight-type-badge.warning { background: var(--amber-50); color: var(--amber-700); }
    .insight-type-badge.meal_plan { background: var(--neutral-100); color: var(--neutral-700); }
    .insight-time { font-size: 12px; color: var(--neutral-400); }
    .insight-content { font-size: 14px; color: var(--neutral-700); line-height: 1.6; margin: 0; }
    .targets-box {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 24px;
    }
    .targets-box h3 { font-size: 15px; font-weight: 700; color: var(--neutral-900); margin-bottom: 16px; }
    .targets-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 14px; }
    .target-card { background: var(--neutral-50); border-radius: 10px; padding: 14px; }
    .tc-val { display: block; font-size: 20px; font-weight: 700; color: var(--neutral-900); margin-bottom: 2px; }
    .tc-key { display: block; font-size: 11px; color: var(--neutral-500); margin-bottom: 8px; }
    .tc-bar { height: 4px; background: var(--neutral-200); border-radius: 100px; overflow: hidden; }
    .tc-fill { height: 100%; border-radius: 100px; }
    .target-card.cal .tc-fill { background: var(--primary-500); }
    .target-card.prot .tc-fill { background: var(--primary-400); }
    .target-card.carb .tc-fill { background: var(--amber-400); }
    .target-card.fat .tc-fill { background: var(--rose-400); }
    .targets-note { font-size: 13px; color: var(--neutral-500); line-height: 1.5; }
    @media (max-width: 768px) {
      .targets-grid { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class AiInsightsComponent implements OnInit {
  profile = signal<UserProfile | null>(null);
  insights = signal<AiRecommendation[]>([]);
  loading = signal(true);
  generating = signal(false);
  private weightLogs: WeightLog[] = [];

  constructor(
      private authService: AuthService,
      private nutritionService: NutritionService
  ) {}

  async ngOnInit() {

    const user = this.authService.getCurrentUser();

    if (!user) {
      return;
    }

    this.loading.set(true);

    try {

      const [profile, recommendations, weights] = await Promise.all([

        this.nutritionService.getProfile(user.id),

        this.nutritionService.getAiRecommendations(user.id),

        this.nutritionService.getWeightLogs(user.id)

      ]);

      this.profile.set(profile);

      this.insights.set(recommendations);

      this.weightLogs = weights;

    } catch (error) {

      console.error(error);

    } finally {

      this.loading.set(false);

    }

  }

  async generate() {

    const user = this.authService.getCurrentUser();

    const profile = this.profile();

    if (!user || !profile) {
      return;
    }

    this.generating.set(true);

    try {

      const today = new Date().toISOString().split('T')[0];

      const foodLogs = await this.nutritionService.getFoodLogs(
          user.id,
          today
      );

      const totals =
          this.nutritionService.calculateDailyTotals(foodLogs);

      const generated =
          this.nutritionService.generateAiInsights(
              profile,
              totals,
              this.weightLogs
          );

      for (const insight of generated) {

        await this.nutritionService.saveAiRecommendation({

          user_id: user.id,

          type: insight.type,

          content: insight.content

        });

      }

      this.insights.set(
          await this.nutritionService.getAiRecommendations(user.id)
      );

    } catch (error) {

      console.error(error);

    } finally {

      this.generating.set(false);

    }

  }
  goalLabel(goal: string): string {
    const map: Record<string, string> = {
      lose_weight: 'Lose Weight',
      maintain: 'Maintain Weight',
      gain_muscle: 'Gain Muscle',
    };
    return map[goal] ?? goal;
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = {
      motivation: 'Motivation',
      tip: 'Tip',
      warning: 'Warning',
      meal_plan: 'Meal Plan',
    };
    return map[type] ?? type;
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = {
      motivation: '⭐',
      tip: '💡',
      warning: '⚠️',
      meal_plan: '📋',
    };
    return map[type] ?? '💬';
  }
}
