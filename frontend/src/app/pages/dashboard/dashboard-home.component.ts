import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NutritionService } from '../../services/nutrition.service';
import { UserProfile, FoodLog, WeightLog, DailyNutrition } from '../../models/nutrition.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  template: `
    <div class="dashboard">
      <div class="dash-header">
        <div>
          <h1>Good {{ timeGreeting }}, {{ firstName }}!</h1>
          <p>{{ today | date:'EEEE, MMMM d, y' }}</p>
        </div>
        <a routerLink="/dashboard/log" class="btn-add-food">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Log food
        </a>
      </div>

      @if (loading()) {
        <div class="loading-grid">
          @for (i of [1,2,3,4]; track i) {
            <div class="skeleton-card"></div>
          }
        </div>
      } @else {
        @if (!profile()) {
          <div class="setup-banner">
            <div class="setup-icon">👋</div>
            <div>
              <h3>Complete your profile first!</h3>
              <p>We need your height, weight, and goal to calculate your personalized nutrition targets.</p>
            </div>
            <a routerLink="/onboarding" class="btn-setup">Set up profile</a>
          </div>
        }

        <!-- Calorie Overview -->
        <div class="cards-row">
          <div class="cal-card">
            <div class="cal-ring-wrap">
              <svg viewBox="0 0 120 120" class="cal-svg">
                <circle cx="60" cy="60" r="48" class="ring-bg"/>
                <circle cx="60" cy="60" r="48" class="ring-fill"
                  [style.stroke-dasharray]="calorieArc + ' 301'"
                  [style.stroke]="calorieColor"/>
              </svg>
              <div class="cal-center">
                <span class="cal-num">{{ totals().calories | number:'1.0-0' }}</span>
                <span class="cal-unit">kcal</span>
              </div>
            </div>
            <div class="cal-details">
              <h3>Calories today</h3>
              <div class="cal-stats">
                <div class="cal-stat">
                  <span class="stat-val">{{ calorieTarget }}</span>
                  <span class="stat-key">Target</span>
                </div>
                <div class="cal-stat">
                  <span class="stat-val" [class.over]="caloriesRemaining < 0">{{ caloriesRemaining | number:'1.0-0' }}</span>
                  <span class="stat-key">{{ caloriesRemaining >= 0 ? 'Remaining' : 'Over' }}</span>
                </div>
                <div class="cal-stat">
                  <span class="stat-val">{{ logs().length }}</span>
                  <span class="stat-key">Entries</span>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="caloriePercent" [style.background]="calorieColor"></div>
              </div>
              <span class="progress-label">{{ caloriePercent | number:'1.0-0' }}% of daily target</span>
            </div>
          </div>

          <div class="macro-cards">
            <div class="macro-card protein">
              <div class="macro-icon">💪</div>
              <div class="macro-info">
                <span class="macro-val">{{ totals().protein_g | number:'1.0-0' }}g</span>
                <span class="macro-name">Protein</span>
              </div>
              <div class="macro-progress">
                <div class="mp-bar"><div class="mp-fill" [style.width.%]="proteinPercent"></div></div>
                <span>{{ proteinPercent | number:'1.0-0' }}%</span>
              </div>
            </div>
            <div class="macro-card carbs">
              <div class="macro-icon">🌾</div>
              <div class="macro-info">
                <span class="macro-val">{{ totals().carbs_g | number:'1.0-0' }}g</span>
                <span class="macro-name">Carbs</span>
              </div>
              <div class="macro-progress">
                <div class="mp-bar"><div class="mp-fill carbs-fill" [style.width.%]="carbsPercent"></div></div>
                <span>{{ carbsPercent | number:'1.0-0' }}%</span>
              </div>
            </div>
            <div class="macro-card fat">
              <div class="macro-icon">🥑</div>
              <div class="macro-info">
                <span class="macro-val">{{ totals().fat_g | number:'1.0-0' }}g</span>
                <span class="macro-name">Fat</span>
              </div>
              <div class="macro-progress">
                <div class="mp-bar"><div class="mp-fill fat-fill" [style.width.%]="fatPercent"></div></div>
                <span>{{ fatPercent | number:'1.0-0' }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Logs + AI insight -->
        <div class="bottom-row">
          <div class="recent-logs-card">
            <div class="card-header">
              <h3>Today's meals</h3>
              <a routerLink="/dashboard/log" class="link-more">View all</a>
            </div>
            @if (logs().length === 0) {
              <div class="empty-logs">
                <span class="empty-icon">🍽️</span>
                <p>No meals logged today</p>
                <a routerLink="/dashboard/log" class="btn-log-first">Log your first meal</a>
              </div>
            } @else {
              <div class="logs-list">
                @for (log of recentLogs(); track log.id) {
                  <div class="log-row">
                    <div class="log-badge" [class]="log.mealType">
                      {{ mealEmoji(log.mealType) }}
                    </div>
                    <div class="log-info">
                     <span class="log-name">
  {{ log.food?.name || log.food?.description }}
</span>
                      <span class="log-meta">
  {{ log.quantityG }}g · {{ log.mealType }}
</span>
                    </div>
                    <span class="log-cal">{{ log.calories | number:'1.0-0' }} kcal</span>
                  </div>
                }
              </div>
            }
          </div>

          <div class="ai-card">
            <div class="ai-header">
              <div class="ai-badge-header">
                <div class="ai-pulse"></div>
                AI Insight
              </div>
              <a routerLink="/dashboard/ai" class="link-more">All insights</a>
            </div>
            <div class="ai-messages">
              @for (insight of aiInsights(); track $index) {
                <div class="ai-msg" [class]="insight.type">
                  <span class="ai-msg-icon">{{ insightIcon(insight.type) }}</span>
                  <p>{{ insight.content }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Weight Quick Log -->
        <div class="weight-row">
          <div class="weight-card">
            <h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Weight progress
            </h3>
            @if (weightLogs().length > 0) {
              <div class="weight-stats">
                <div class="wstat">
                  <span class="wval">{{ weightLogs()[weightLogs().length - 1].weight}} kg</span>
                  <span class="wkey">Current</span>
                </div>
                @if (weightLogs().length > 1) {
                  <div class="wstat">
                    <span class="wval" [class.positive]="weightDelta > 0" [class.negative]="weightDelta < 0">
                      {{ weightDelta > 0 ? '+' : '' }}{{ weightDelta | number:'1.1-1' }} kg
                    </span>
                    <span class="wkey">Change</span>
                  </div>
                }
              </div>
              <div class="mini-chart">
                <svg [attr.viewBox]="'0 0 300 60'" preserveAspectRatio="none" class="chart-svg">
                  <polyline [attr.points]="chartPoints" class="chart-line"/>
                  <polyline [attr.points]="chartAreaPoints" class="chart-area"/>
                </svg>
              </div>
            } @else {
              <p class="weight-empty">No weight entries yet</p>
            }
            <a routerLink="/dashboard/progress" class="btn-log-weight">Log weight</a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 32px;
      max-width: 1100px;
    }
    .dash-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 28px;
    }
    .dash-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--neutral-900);
      margin-bottom: 4px;
    }
    .dash-header p { font-size: 14px; color: var(--neutral-500); }
    .btn-add-food {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 10px 18px;
      background: var(--primary-600);
      color: white;
      border-radius: 10px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all .2s;
    }
    .btn-add-food:hover { background: var(--primary-700); transform: translateY(-1px); }
    .loading-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .skeleton-card {
      height: 180px;
      background: var(--neutral-100);
      border-radius: 16px;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    .setup-banner {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: linear-gradient(135deg, var(--primary-50), var(--emerald-50));
      border: 1px solid var(--primary-200);
      border-radius: 14px;
      margin-bottom: 24px;
    }
    .setup-icon { font-size: 32px; }
    .setup-banner h3 { font-size: 15px; font-weight: 700; color: var(--neutral-900); margin-bottom: 2px; }
    .setup-banner p { font-size: 13px; color: var(--neutral-600); }
    .btn-setup {
      margin-left: auto;
      padding: 10px 18px;
      background: var(--primary-600);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }
    .cards-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .cal-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--neutral-100);
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .cal-ring-wrap {
      position: relative;
      width: 120px; height: 120px;
      flex-shrink: 0;
    }
    .cal-svg { width: 120px; height: 120px; transform: rotate(-90deg); }
    .ring-bg { fill: none; stroke: var(--neutral-100); stroke-width: 12; }
    .ring-fill {
      fill: none;
      stroke-width: 12;
      stroke-linecap: round;
      stroke-dashoffset: 0;
      transition: stroke-dasharray .8s ease;
    }
    .cal-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .cal-num { font-size: 22px; font-weight: 800; color: var(--neutral-900); font-family: 'Plus Jakarta Sans', sans-serif; }
    .cal-unit { font-size: 11px; color: var(--neutral-500); }
    .cal-details { flex: 1; min-width: 0; }
    .cal-details h3 { font-size: 15px; font-weight: 700; color: var(--neutral-900); margin-bottom: 12px; }
    .cal-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
    .cal-stat { text-align: center; }
    .stat-val { display: block; font-size: 16px; font-weight: 700; color: var(--neutral-900); }
    .stat-val.over { color: var(--rose-600); }
    .stat-key { display: block; font-size: 11px; color: var(--neutral-500); }
    .progress-bar {
      height: 6px;
      background: var(--neutral-100);
      border-radius: 100px;
      overflow: hidden;
      margin-bottom: 4px;
    }
    .progress-fill {
      height: 100%;
      border-radius: 100px;
      transition: width .8s ease;
      max-width: 100%;
    }
    .progress-label { font-size: 11px; color: var(--neutral-500); }
    .macro-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .macro-card {
      background: white;
      border-radius: 12px;
      padding: 14px 16px;
      border: 1px solid var(--neutral-100);
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    .macro-icon { font-size: 20px; }
    .macro-info { min-width: 70px; }
    .macro-val { display: block; font-size: 16px; font-weight: 700; color: var(--neutral-900); }
    .macro-name { display: block; font-size: 11px; color: var(--neutral-500); }
    .macro-progress {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mp-bar {
      flex: 1;
      height: 6px;
      background: var(--neutral-100);
      border-radius: 100px;
      overflow: hidden;
    }
    .mp-fill {
      height: 100%;
      background: var(--primary-500);
      border-radius: 100px;
      max-width: 100%;
      transition: width .8s;
    }
    .mp-fill.carbs-fill { background: var(--amber-400); }
    .mp-fill.fat-fill { background: var(--rose-400); }
    .macro-progress span { font-size: 11px; color: var(--neutral-500); width: 28px; text-align: right; }
    .bottom-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .recent-logs-card, .ai-card, .weight-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--neutral-100);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .card-header h3 { font-size: 15px; font-weight: 700; color: var(--neutral-900); }
    .link-more { font-size: 13px; color: var(--primary-600); text-decoration: none; font-weight: 600; }
    .link-more:hover { text-decoration: underline; }
    .empty-logs { text-align: center; padding: 24px 0; }
    .empty-icon { font-size: 32px; }
    .empty-logs p { font-size: 14px; color: var(--neutral-500); margin: 8px 0 16px; }
    .btn-log-first {
      padding: 9px 18px;
      background: var(--primary-50);
      color: var(--primary-700);
      border-radius: 8px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
    }
    .logs-list { display: flex; flex-direction: column; gap: 10px; }
    .log-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--neutral-50);
    }
    .log-row:last-child { border-bottom: none; }
    .log-badge {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: var(--neutral-100);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    .log-badge.breakfast { background: var(--amber-100); }
    .log-badge.lunch { background: var(--emerald-100); }
    .log-badge.dinner { background: var(--primary-100); }
    .log-badge.snack { background: var(--rose-100); }
    .log-info { flex: 1; min-width: 0; }
    .log-name { display: block; font-size: 13px; font-weight: 600; color: var(--neutral-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .log-meta { font-size: 11px; color: var(--neutral-500); }
    .log-cal { font-size: 13px; font-weight: 700; color: var(--neutral-700); flex-shrink: 0; }
    .ai-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .ai-badge-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 700;
      color: var(--neutral-900);
    }
    .ai-pulse {
      width: 8px; height: 8px;
      background: var(--primary-500);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.2)} }
    .ai-messages { display: flex; flex-direction: column; gap: 10px; }
    .ai-msg {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 10px 12px;
      border-radius: 10px;
    }
    .ai-msg.motivation { background: var(--primary-50); border: 1px solid var(--primary-100); }
    .ai-msg.tip { background: var(--emerald-50); border: 1px solid var(--emerald-100); }
    .ai-msg.warning { background: var(--amber-50); border: 1px solid var(--amber-100); }
    .ai-msg.meal_plan { background: var(--neutral-50); border: 1px solid var(--neutral-200); }
    .ai-msg-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
    .ai-msg p { font-size: 13px; line-height: 1.5; color: var(--neutral-700); margin: 0; }
    .weight-row { margin-bottom: 32px; }
    .weight-card h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: 16px;
    }
    .weight-stats { display: flex; gap: 24px; margin-bottom: 16px; }
    .wstat { }
    .wval { display: block; font-size: 20px; font-weight: 700; color: var(--neutral-900); }
    .wval.positive { color: var(--emerald-600); }
    .wval.negative { color: var(--rose-600); }
    .wkey { font-size: 12px; color: var(--neutral-500); }
    .mini-chart { height: 60px; margin-bottom: 16px; }
    .chart-svg { width: 100%; height: 60px; }
    .chart-line { fill: none; stroke: var(--primary-500); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .chart-area { fill: var(--primary-50); stroke: none; }
    .weight-empty { font-size: 14px; color: var(--neutral-500); margin-bottom: 12px; }
    .btn-log-weight {
      display: inline-flex;
      padding: 9px 16px;
      background: var(--primary-50);
      color: var(--primary-700);
      border-radius: 8px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      transition: all .15s;
    }
    .btn-log-weight:hover { background: var(--primary-100); }
    @media (max-width: 900px) {
      .cards-row { grid-template-columns: 1fr; }
      .bottom-row { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardHomeComponent implements OnInit {
  loading = signal(true);
  profile = signal<UserProfile | null>(null);
  logs = signal<FoodLog[]>([]);
  weightLogs = signal<WeightLog[]>([]);
  aiInsights = signal<{ type: string; content: string }[]>([]);

  today = new Date();

  constructor(private auth: AuthService, private nutritionService: NutritionService) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;
    try {
      const [prof, logs, weights] = await Promise.all([
        this.nutritionService.getProfile(user.id),
        this.nutritionService.getFoodLogs(user.id, this.todayStr),
        this.nutritionService.getWeightLogs(user.id),
      ]);
      this.profile.set(prof);
      this.logs.set(logs);
      this.weightLogs.set(weights);
      if (prof) {
        const totals = this.nutritionService.calculateDailyTotals(logs);
        this.aiInsights.set(this.nutritionService.generateAiInsights(prof, totals, weights));
      }
    } finally {
      this.loading.set(false);
    }
  }

  get todayStr(): string {
    return this.today.toISOString().split('T')[0];
  }

  get timeGreeting(): string {
    const h = this.today.getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
  }

  get firstName(): string {
    const prof = this.profile();
    if (prof?.full_name) return prof.full_name.split(' ')[0];
    return this.auth.currentUser?.email?.split('@')[0] ?? 'there';
  }

  totals = computed((): DailyNutrition => {
    return this.nutritionService.calculateDailyTotals(this.logs());
  });

  get calorieTarget(): number {
    return this.profile()?.daily_calorie_target ?? 2000;
  }

  get caloriesRemaining(): number {
    return this.calorieTarget - this.totals().calories;
  }

  get caloriePercent(): number {
    return Math.min((this.totals().calories / this.calorieTarget) * 100, 100);
  }

  get calorieArc(): number {
    return (this.caloriePercent / 100) * 301;
  }

  get calorieColor(): string {
    const pct = this.caloriePercent;
    if (pct > 100) return '#ef4444';
    if (pct > 85) return '#f59e0b';
    return '#2563eb';
  }

  get proteinPercent(): number {
    const t = this.profile()?.daily_protein_g ?? 150;
    return Math.min((this.totals().protein_g / t) * 100, 100);
  }

  get carbsPercent(): number {
    const t = this.profile()?.daily_carbs_g ?? 200;
    return Math.min((this.totals().carbs_g / t) * 100, 100);
  }

  get fatPercent(): number {
    const t = this.profile()?.daily_fat_g ?? 65;
    return Math.min((this.totals().fat_g / t) * 100, 100);
  }

  recentLogs = computed(() => this.logs().slice(-5).reverse());

  get weightDelta(): number {
    const ws = this.weightLogs();
    if (ws.length < 2) return 0;
    return ws[ws.length - 1].weight - ws[ws.length - 2].weight;
  }

  get chartPoints(): string {
    const ws = this.weightLogs();
    if (ws.length < 2) return '';
    const min = Math.min(...ws.map(w => w.weight));
    const max = Math.max(...ws.map(w => w.weight));
    const range = max - min || 1;
    return ws.map((w, i) => {
      const x = (i / (ws.length - 1)) * 300;
      const y = 55 - ((w.weight - min) / range) * 50;
      return `${x},${y}`;
    }).join(' ');
  }

  get chartAreaPoints(): string {
    const ws = this.weightLogs();
    if (ws.length < 2) return '';
    return this.chartPoints + ` 300,60 0,60`;
  }

  mealEmoji(type: string): string {
    const map: Record<string, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
    return map[type] ?? '🍽️';
  }

  insightIcon(type: string): string {
    const map: Record<string, string> = { motivation: '⭐', tip: '💡', warning: '⚠️', meal_plan: '📋' };
    return map[type] ?? '💬';
  }
}
