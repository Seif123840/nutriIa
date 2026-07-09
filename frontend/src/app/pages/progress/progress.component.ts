import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NutritionService } from '../../services/nutrition.service';
import { WeightLog } from '../../models/nutrition.models';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DatePipe],
  template: `
    <div class="progress-page">
      <div class="page-header">
        <h1>Progress</h1>
        <p>Track your weight over time and visualize your journey</p>
      </div>

      <div class="progress-layout">
        <!-- Log weight card -->
        <div class="log-card">
          <h3>Log today's weight</h3>
          <div class="weight-form">
            <div class="form-group">
              <label>Weight (kg)</label>
              <div class="weight-input-row">
                <button class="adj-btn" (click)="newWeight = +(newWeight - 0.1).toFixed(1)">−</button>
                <input type="number" [(ngModel)]="newWeight" step="0.1" min="30" max="300" />
                <button class="adj-btn" (click)="newWeight = +(newWeight + 0.1).toFixed(1)">+</button>
              </div>
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" [(ngModel)]="logDate" />
            </div>
            <div class="form-group">
              <label>Notes (optional)</label>
              <input type="text" [(ngModel)]="notes" placeholder="e.g. After workout" />
            </div>
            <button class="btn-log" (click)="addWeight()" [disabled]="saving() || !newWeight">
              @if (saving()) { <span class="spinner"></span> Saving... }
              @else { Log weight }
            </button>
          </div>
        </div>

        <!-- Chart + stats -->
        <div class="chart-section">
          @if (weightLogs().length > 0) {
            <div class="stats-row">
              <div class="wstat-card">
                <span class="wstat-val">{{ latestWeight | number:'1.1-1' }} kg</span>
                <span class="wstat-key">Current weight</span>
              </div>
              @if (startWeight) {
                <div class="wstat-card">
                  <span class="wstat-val" [class.positive]="totalChange > 0" [class.negative]="totalChange < 0">
                    {{ totalChange > 0 ? '+' : '' }}{{ totalChange | number:'1.1-1' }} kg
                  </span>
                  <span class="wstat-key">Total change</span>
                </div>
                <div class="wstat-card">
                  <span class="wstat-val">{{ startWeight | number:'1.1-1' }} kg</span>
                  <span class="wstat-key">Starting weight</span>
                </div>
              }
              <div class="wstat-card">
                <span class="wstat-val">{{ weightLogs().length }}</span>
                <span class="wstat-key">Entries</span>
              </div>
            </div>

            <div class="chart-card">
              <h3>Weight trend (last {{ weightLogs().length }} entries)</h3>
              <div class="chart-wrap">
                <svg [attr.viewBox]="'0 0 600 200'" preserveAspectRatio="none" class="weight-chart">
                  <!-- Y axis labels -->
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.15"/>
                      <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
                    </linearGradient>
                  </defs>
                  <polygon [attr.points]="areaPoints" fill="url(#areaGrad)"/>
                  <polyline [attr.points]="linePoints" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  @for (p of dotPoints; track $index) {
                    <circle [attr.cx]="p.x" [attr.cy]="p.y" r="4" fill="#2563eb" stroke="white" stroke-width="2"/>
                  }
                </svg>
                <div class="chart-labels">
                  @for (log of weightLogs(); track log.id; let i = $index) {
                    @if (i === 0 || i === weightLogs().length - 1 || weightLogs().length <= 7) {
                      <span class="chart-label" [style.left.%]="(i / (weightLogs().length - 1)) * 100">
                        {{ log.date | date:'MMM d' }}
                      </span>
                    }
                  }
                </div>
              </div>
            </div>
          } @else {
            <div class="empty-chart">
              <div class="empty-icon">⚖️</div>
              <h3>No weight data yet</h3>
              <p>Start logging your weight to see your progress chart</p>
            </div>
          }
        </div>
      </div>

      <!-- History table -->
      @if (weightLogs().length > 0) {
        <div class="history-card">
          <h3>History</h3>
          <table class="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Change</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (log of weightLogsReversed; track log.id; let i = $index) {
                <tr>
                  <td>{{ log.date | date:'EEE, MMM d, y' }}</td>
                  <td><strong>{{ log.weight_kg | number:'1.1-1' }} kg</strong></td>
                  <td>
                    @if (i < weightLogsReversed.length - 1) {
                      <span [class.pos]="changeFor(i) > 0" [class.neg]="changeFor(i) < 0">
                        {{ changeFor(i) > 0 ? '+' : '' }}{{ changeFor(i) | number:'1.1-1' }} kg
                      </span>
                    }
                  </td>
                  <td>{{ log.notes ?? '—' }}</td>
                  <td></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .progress-page { padding: 32px; max-width: 1100px; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--neutral-900);
      margin-bottom: 4px;
    }
    .page-header p { font-size: 14px; color: var(--neutral-500); }
    .progress-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 20px;
      margin-bottom: 20px;
      align-items: start;
    }
    .log-card {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 24px;
      position: sticky;
      top: 24px;
    }
    .log-card h3 { font-size: 15px; font-weight: 700; color: var(--neutral-900); margin-bottom: 20px; }
    .weight-form { display: flex; flex-direction: column; gap: 14px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 12px; font-weight: 600; color: var(--neutral-600); }
    .weight-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .adj-btn {
      width: 36px; height: 36px;
      background: var(--neutral-100);
      border: none;
      border-radius: 8px;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .1s;
      flex-shrink: 0;
    }
    .adj-btn:hover { background: var(--neutral-200); }
    .weight-input-row input {
      flex: 1;
      text-align: center;
      padding: 9px 8px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 8px;
      font-size: 16px;
      font-weight: 700;
      font-family: inherit;
    }
    .weight-input-row input:focus { outline: none; border-color: var(--primary-400); }
    .form-group input[type="date"], .form-group input[type="text"] {
      padding: 9px 12px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
    }
    .form-group input:focus { outline: none; border-color: var(--primary-400); }
    .btn-log {
      width: 100%;
      padding: 11px;
      background: var(--primary-600);
      color: white;
      border: none;
      border-radius: 9px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background .15s;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn-log:hover:not(:disabled) { background: var(--primary-700); }
    .btn-log:disabled { opacity: 0.6; cursor: not-allowed; }
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .chart-section { display: flex; flex-direction: column; gap: 16px; }
    .stats-row { display: flex; gap: 12px; }
    .wstat-card {
      flex: 1;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--neutral-100);
      padding: 16px;
      text-align: center;
    }
    .wstat-val { display: block; font-size: 20px; font-weight: 700; color: var(--neutral-900); }
    .wstat-val.positive { color: var(--emerald-600); }
    .wstat-val.negative { color: var(--rose-600); }
    .wstat-key { font-size: 12px; color: var(--neutral-500); }
    .chart-card {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 24px;
    }
    .chart-card h3 { font-size: 15px; font-weight: 700; color: var(--neutral-900); margin-bottom: 20px; }
    .chart-wrap { position: relative; }
    .weight-chart { width: 100%; height: 200px; overflow: visible; }
    .chart-labels {
      position: relative;
      height: 24px;
      margin-top: 8px;
    }
    .chart-label {
      position: absolute;
      transform: translateX(-50%);
      font-size: 11px;
      color: var(--neutral-500);
    }
    .empty-chart {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 48px;
      text-align: center;
    }
    .empty-icon { font-size: 40px; margin-bottom: 12px; }
    .empty-chart h3 { font-size: 16px; font-weight: 700; color: var(--neutral-900); margin-bottom: 6px; }
    .empty-chart p { font-size: 14px; color: var(--neutral-500); }
    .history-card {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 24px;
    }
    .history-card h3 { font-size: 15px; font-weight: 700; color: var(--neutral-900); margin-bottom: 16px; }
    .history-table { width: 100%; border-collapse: collapse; }
    .history-table th {
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: var(--neutral-500);
      padding: 0 0 10px;
      border-bottom: 1px solid var(--neutral-100);
    }
    .history-table td {
      padding: 12px 0;
      font-size: 14px;
      color: var(--neutral-700);
      border-bottom: 1px solid var(--neutral-50);
    }
    .history-table td strong { color: var(--neutral-900); }
    .pos { color: var(--emerald-600); font-weight: 600; }
    .neg { color: var(--rose-600); font-weight: 600; }
    @media (max-width: 768px) {
      .progress-layout { grid-template-columns: 1fr; }
      .stats-row { flex-wrap: wrap; }
    }
  `]
})
export class ProgressComponent implements OnInit {
  weightLogs = signal<WeightLog[]>([]);
  newWeight = 70;
  logDate = new Date().toISOString().split('T')[0];
  notes = '';
  saving = signal(false);

  constructor(private auth: AuthService, private nutritionService: NutritionService) {}

  async ngOnInit() {
    await this.loadLogs();
  }

  async loadLogs() {
    const user = this.auth.currentUser;
    if (!user) return;
    const logs = await this.nutritionService.getWeightLogs(user.id);
    this.weightLogs.set(logs);
    if (logs.length > 0) {
      this.newWeight = logs[logs.length - 1].weight_kg;
    }
  }

  async addWeight() {
    const user = this.auth.currentUser;
    if (!user || !this.newWeight) return;
    this.saving.set(true);
    try {
      await this.nutritionService.addWeightLog({
        user_id: user.id,
        weight_kg: this.newWeight,
        date: this.logDate,
        notes: this.notes || null,
      });
      this.notes = '';
      await this.loadLogs();
    } finally {
      this.saving.set(false);
    }
  }

  get latestWeight(): number {
    const ws = this.weightLogs();
    return ws[ws.length - 1]?.weight_kg ?? 0;
  }

  get startWeight(): number | null {
    const ws = this.weightLogs();
    return ws.length > 1 ? ws[0].weight_kg : null;
  }

  get totalChange(): number {
    const ws = this.weightLogs();
    if (ws.length < 2) return 0;
    return ws[ws.length - 1].weight_kg - ws[0].weight_kg;
  }

  get weightLogsReversed(): WeightLog[] {
    return [...this.weightLogs()].reverse();
  }

  changeFor(i: number): number {
    const rev = this.weightLogsReversed;
    if (i >= rev.length - 1) return 0;
    return rev[i].weight_kg - rev[i + 1].weight_kg;
  }

  get linePoints(): string {
    const ws = this.weightLogs();
    if (ws.length < 2) return '';
    const min = Math.min(...ws.map(w => w.weight_kg));
    const max = Math.max(...ws.map(w => w.weight_kg));
    const range = max - min || 1;
    return ws.map((w, i) => {
      const x = (i / (ws.length - 1)) * 600;
      const y = 185 - ((w.weight_kg - min) / range) * 170;
      return `${x},${y}`;
    }).join(' ');
  }

  get areaPoints(): string {
    if (this.weightLogs().length < 2) return '';
    return this.linePoints + ` 600,200 0,200`;
  }

  get dotPoints(): { x: number; y: number }[] {
    const ws = this.weightLogs();
    if (ws.length < 2) return [];
    const min = Math.min(...ws.map(w => w.weight_kg));
    const max = Math.max(...ws.map(w => w.weight_kg));
    const range = max - min || 1;
    return ws.map((w, i) => ({
      x: (i / (ws.length - 1)) * 600,
      y: 185 - ((w.weight_kg - min) / range) * 170,
    }));
  }
}
