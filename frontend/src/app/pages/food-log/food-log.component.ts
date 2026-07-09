import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NutritionService } from '../../services/nutrition.service';
import { FoodItem, FoodLog } from '../../models/nutrition.models';

@Component({
  selector: 'app-food-log',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="food-log">
      <div class="page-header">
        <h1>Food Log</h1>
        <input type="date" [(ngModel)]="selectedDate" (ngModelChange)="loadLogs()" class="date-picker" />
      </div>

      <div class="log-layout">
        <!-- Add food panel -->
        <div class="add-food-panel">
          <div class="panel-header">
            <h2>Add food</h2>
          </div>
          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch()"
              placeholder="Search foods..."
              class="search-input"
            />
          </div>

          @if (searchResults().length > 0) {
            <div class="search-results">
              @for (food of searchResults(); track food.id) {
                <button class="food-result" (click)="selectFood(food)">
                  <div class="food-result-info">
                    <span class="food-result-name">{{ food.name }}</span>
                    @if (food.brand) { <span class="food-result-brand">{{ food.brand }}</span> }
                  </div>
                  <span class="food-result-cal">{{ food.calories_per_100g }} kcal/100g</span>
                </button>
              }
            </div>
          }

          @if (selectedFood()) {
            <div class="food-selected">
              <div class="selected-header">
                <h3>{{ selectedFood()!.name }}</h3>
                <button class="clear-btn" (click)="selectedFood.set(null)">✕</button>
              </div>
              <div class="nutrition-per-100">
                <span class="np">{{ selectedFood()!.calories_per_100g | number:'1.0-0' }} kcal</span>
                <span class="np">P: {{ selectedFood()!.protein_per_100g }}g</span>
                <span class="np">C: {{ selectedFood()!.carbs_per_100g }}g</span>
                <span class="np">F: {{ selectedFood()!.fat_per_100g }}g</span>
                <span class="np-label">per 100g</span>
              </div>
              <div class="add-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Quantity (g)</label>
                    <input type="number" [(ngModel)]="quantity" (ngModelChange)="updatePreview()" min="1" max="2000" placeholder="100" />
                  </div>
                  <div class="form-group">
                    <label>Meal</label>
                    <select [(ngModel)]="mealType">
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                </div>
                @if (quantity > 0) {
                  <div class="preview-nutrition">
                    <div class="pn-item">
                      <span class="pn-val">{{ preview.calories | number:'1.0-0' }}</span>
                      <span class="pn-name">kcal</span>
                    </div>
                    <div class="pn-item">
                      <span class="pn-val">{{ preview.protein_g | number:'1.0-0' }}g</span>
                      <span class="pn-name">protein</span>
                    </div>
                    <div class="pn-item">
                      <span class="pn-val">{{ preview.carbs_g | number:'1.0-0' }}g</span>
                      <span class="pn-name">carbs</span>
                    </div>
                    <div class="pn-item">
                      <span class="pn-val">{{ preview.fat_g | number:'1.0-0' }}g</span>
                      <span class="pn-name">fat</span>
                    </div>
                  </div>
                }
                <button class="btn-add" (click)="addLog()" [disabled]="adding() || quantity <= 0">
                  @if (adding()) { <span class="spinner"></span> Adding... }
                  @else { + Add to log }
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Daily log -->
        <div class="daily-log">
          <div class="daily-summary">
            <div class="summary-item calories">
              <span class="sval">{{ dailyTotals.calories | number:'1.0-0' }}</span>
              <span class="skey">kcal</span>
            </div>
            <div class="summary-item">
              <span class="sval">{{ dailyTotals.protein_g | number:'1.0-0' }}g</span>
              <span class="skey">Protein</span>
            </div>
            <div class="summary-item">
              <span class="sval">{{ dailyTotals.carbs_g | number:'1.0-0' }}g</span>
              <span class="skey">Carbs</span>
            </div>
            <div class="summary-item">
              <span class="sval">{{ dailyTotals.fat_g | number:'1.0-0' }}g</span>
              <span class="skey">Fat</span>
            </div>
          </div>

          @for (meal of meals; track meal.key) {
            <div class="meal-section">
              <div class="meal-header">
                <span class="meal-emoji">{{ meal.emoji }}</span>
                <h3>{{ meal.label }}</h3>
                <span class="meal-cal">{{ getMealCalories(meal.key) | number:'1.0-0' }} kcal</span>
              </div>
              @if (getMealLogs(meal.key).length === 0) {
                <div class="meal-empty">No foods logged</div>
              } @else {
                <div class="meal-foods">
                  @for (log of getMealLogs(meal.key); track log.id) {
                    <div class="food-row">
                      <div class="food-row-info">
                        <span class="food-row-name">{{ log.food_item?.name }}</span>
                        <span class="food-row-qty">{{ log.quantity_g }}g</span>
                      </div>
                      <div class="food-row-macros">
                        <span>{{ log.calories | number:'1.0-0' }} kcal</span>
                        <span class="macro-p">P: {{ log.protein_g | number:'1.0-0' }}g</span>
                        <span class="macro-c">C: {{ log.carbs_g | number:'1.0-0' }}g</span>
                        <span class="macro-f">F: {{ log.fat_g | number:'1.0-0' }}g</span>
                      </div>
                      <button class="delete-btn" (click)="deleteLog(log.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .food-log { padding: 32px; }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
    }
    .page-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--neutral-900);
    }
    .date-picker {
      padding: 9px 14px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 10px;
      font-size: 14px;
      color: var(--neutral-700);
      font-family: inherit;
      cursor: pointer;
    }
    .date-picker:focus { outline: none; border-color: var(--primary-400); }
    .log-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 24px;
      align-items: start;
    }
    .add-food-panel {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      position: sticky;
      top: 24px;
    }
    .panel-header {
      padding: 20px 20px 0;
    }
    .panel-header h2 { font-size: 16px; font-weight: 700; color: var(--neutral-900); margin-bottom: 12px; }
    .search-box {
      position: relative;
      padding: 0 20px 16px;
    }
    .search-icon { position: absolute; left: 32px; top: 50%; transform: translateY(-55%); color: var(--neutral-400); }
    .search-input {
      width: 100%;
      padding: 10px 12px 10px 36px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color .15s;
    }
    .search-input:focus { outline: none; border-color: var(--primary-400); }
    .search-results {
      border-top: 1px solid var(--neutral-100);
      max-height: 240px;
      overflow-y: auto;
    }
    .food-result {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 20px;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background .1s;
      font-family: inherit;
    }
    .food-result:hover { background: var(--neutral-50); }
    .food-result-name { display: block; font-size: 13px; font-weight: 600; color: var(--neutral-900); }
    .food-result-brand { font-size: 11px; color: var(--neutral-500); }
    .food-result-cal { font-size: 12px; color: var(--neutral-500); white-space: nowrap; }
    .food-selected { padding: 16px 20px 20px; border-top: 1px solid var(--neutral-100); }
    .selected-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .selected-header h3 { font-size: 14px; font-weight: 700; color: var(--neutral-900); }
    .clear-btn {
      background: none;
      border: none;
      font-size: 14px;
      color: var(--neutral-400);
      cursor: pointer;
      padding: 2px;
    }
    .clear-btn:hover { color: var(--neutral-700); }
    .nutrition-per-100 {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }
    .np {
      padding: 2px 8px;
      background: var(--neutral-100);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      color: var(--neutral-700);
    }
    .np-label { font-size: 11px; color: var(--neutral-400); align-self: center; }
    .add-form { display: flex; flex-direction: column; gap: 12px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-group label { font-size: 12px; font-weight: 600; color: var(--neutral-600); }
    .form-group input, .form-group select {
      padding: 9px 12px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
      transition: border-color .15s;
    }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--primary-400); }
    .preview-nutrition {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      padding: 10px;
      background: var(--primary-50);
      border-radius: 8px;
    }
    .pn-item { text-align: center; }
    .pn-val { display: block; font-size: 13px; font-weight: 700; color: var(--primary-700); }
    .pn-name { font-size: 10px; color: var(--primary-500); }
    .btn-add {
      width: 100%;
      padding: 11px;
      background: var(--primary-600);
      color: white;
      border: none;
      border-radius: 9px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all .15s;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn-add:hover:not(:disabled) { background: var(--primary-700); }
    .btn-add:disabled { opacity: 0.6; cursor: not-allowed; }
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .daily-log { display: flex; flex-direction: column; gap: 16px; }
    .daily-summary {
      background: white;
      border-radius: 14px;
      border: 1px solid var(--neutral-100);
      padding: 16px 20px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      text-align: center;
    }
    .summary-item.calories .sval { color: var(--primary-600); }
    .sval { display: block; font-size: 20px; font-weight: 700; color: var(--neutral-900); }
    .skey { font-size: 12px; color: var(--neutral-500); }
    .meal-section {
      background: white;
      border-radius: 14px;
      border: 1px solid var(--neutral-100);
      overflow: hidden;
    }
    .meal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      background: var(--neutral-50);
      border-bottom: 1px solid var(--neutral-100);
    }
    .meal-emoji { font-size: 18px; }
    .meal-header h3 { font-size: 14px; font-weight: 700; color: var(--neutral-800); flex: 1; }
    .meal-cal { font-size: 13px; font-weight: 600; color: var(--neutral-600); }
    .meal-empty { padding: 12px 20px; font-size: 13px; color: var(--neutral-400); }
    .meal-foods { padding: 6px 0; }
    .food-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      border-bottom: 1px solid var(--neutral-50);
      transition: background .1s;
    }
    .food-row:last-child { border-bottom: none; }
    .food-row:hover { background: var(--neutral-50); }
    .food-row-info { flex: 1; min-width: 0; }
    .food-row-name { display: block; font-size: 13px; font-weight: 600; color: var(--neutral-900); }
    .food-row-qty { font-size: 11px; color: var(--neutral-500); }
    .food-row-macros { display: flex; gap: 10px; font-size: 12px; color: var(--neutral-600); align-items: center; }
    .food-row-macros span:first-child { font-weight: 700; color: var(--neutral-800); }
    .macro-p { color: var(--primary-600); }
    .macro-c { color: var(--amber-600); }
    .macro-f { color: var(--rose-600); }
    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--neutral-300);
      padding: 4px;
      border-radius: 6px;
      transition: all .1s;
    }
    .delete-btn:hover { background: var(--rose-50); color: var(--rose-500); }
    @media (max-width: 900px) {
      .log-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class FoodLogComponent implements OnInit {
  selectedDate = new Date().toISOString().split('T')[0];
  searchQuery = '';
  searchResults = signal<FoodItem[]>([]);
  selectedFood = signal<FoodItem | null>(null);
  quantity = 100;
  mealType: FoodLog['meal_type'] = 'lunch';
  adding = signal(false);
  logs = signal<FoodLog[]>([]);
  preview = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };

  meals = [
    { key: 'breakfast' as const, label: 'Breakfast', emoji: '🌅' },
    { key: 'lunch' as const, label: 'Lunch', emoji: '☀️' },
    { key: 'dinner' as const, label: 'Dinner', emoji: '🌙' },
    { key: 'snack' as const, label: 'Snacks', emoji: '🍎' },
  ];

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private auth: AuthService, private nutritionService: NutritionService) {}

  async ngOnInit() {
    await this.loadLogs();
    const results = await this.nutritionService.searchFoods('');
    this.searchResults.set(results);
  }

  async loadLogs() {
    const user = this.auth.currentUser;
    if (!user) return;
    const logs = await this.nutritionService.getFoodLogs(user.id, this.selectedDate);
    this.logs.set(logs);
  }

  onSearch() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(async () => {
      const results = await this.nutritionService.searchFoods(this.searchQuery);
      this.searchResults.set(results);
    }, 300);
  }

  selectFood(food: FoodItem) {
    this.selectedFood.set(food);
    this.searchResults.set([]);
    this.searchQuery = '';
    this.quantity = 100;
    this.updatePreview();
  }

  updatePreview() {
    const food = this.selectedFood();
    if (!food || this.quantity <= 0) { this.preview = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }; return; }
    this.preview = this.nutritionService.calculateNutritionForQuantity(food, this.quantity);
  }

  async addLog() {
    const food = this.selectedFood();
    const user = this.auth.currentUser;
    if (!food || !user || this.quantity <= 0) return;
    this.adding.set(true);
    try {
      const nutrition = this.nutritionService.calculateNutritionForQuantity(food, this.quantity);
      await this.nutritionService.addFoodLog({
        user_id: user.id,
        food_item_id: food.id,
        date: this.selectedDate,
        meal_type: this.mealType,
        quantity_g: this.quantity,
        ...nutrition,
      });
      await this.loadLogs();
      this.selectedFood.set(null);
      this.quantity = 100;
    } finally {
      this.adding.set(false);
    }
  }

  async deleteLog(id: string) {
    await this.nutritionService.deleteFoodLog(id);
    await this.loadLogs();
  }

  getMealLogs(meal: string): FoodLog[] {
    return this.logs().filter(l => l.meal_type === meal);
  }

  getMealCalories(meal: string): number {
    return this.getMealLogs(meal).reduce((s, l) => s + l.calories, 0);
  }

  get dailyTotals() {
    return this.nutritionService.calculateDailyTotals(this.logs());
  }
}
