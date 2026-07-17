import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NutritionService } from '../../services/nutrition.service';
import { UserProfile } from '../../models/nutrition.models';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="onboarding-page">
      <div class="onboard-container">
        <div class="onboard-header">
          <a routerLink="/" class="logo">
            <span>🥗</span>
            <span class="logo-text">NutriAI</span>
          </a>
          <div class="step-indicator">
            <div class="step-dot" [class.active]="step() >= 1" [class.done]="step() > 1">1</div>
            <div class="step-line" [class.active]="step() > 1"></div>
            <div class="step-dot" [class.active]="step() >= 2" [class.done]="step() > 2">2</div>
            <div class="step-line" [class.active]="step() > 2"></div>
            <div class="step-dot" [class.active]="step() >= 3">3</div>
          </div>
        </div>

        @if (step() === 1) {
          <div class="onboard-card">
            <h1>Tell us about yourself</h1>
            <p>This helps us calculate your personalized nutrition targets</p>
            <div class="form-grid">
              <div class="form-group">
                <label>Full name</label>
                <input type="text" [(ngModel)]="profile.full_name" placeholder="Your name" />
              </div>
              <div class="form-group">
                <label>Age</label>
                <input type="number" [(ngModel)]="profile.age" placeholder="e.g. 28" min="16" max="100" />
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select [(ngModel)]="profile.gender">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Height (cm)</label>
                <input type="number" [(ngModel)]="profile.height_cm" placeholder="e.g. 175" min="100" max="250" />
              </div>
              <div class="form-group">
                <label>Current weight (kg)</label>
                <input type="number" [(ngModel)]="profile.weight" placeholder="e.g. 70" min="30" max="300" />
              </div>
            </div>
            <button class="btn-next" (click)="nextStep()" [disabled]="!step1Valid()">
              Continue
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        }

        @if (step() === 2) {
          <div class="onboard-card">
            <h1>Your lifestyle</h1>
            <p>Help us understand your daily activity level</p>
            <div class="activity-options">
              @for (opt of activityOptions; track opt.value) {
                <button
                  class="activity-btn"
                  [class.selected]="profile.activity_level === opt.value"
                  (click)="profile.activity_level = asActivity(opt.value)"
                >
                  <span class="activity-icon">{{ opt.icon }}</span>
                  <div>
                    <strong>{{ opt.label }}</strong>
                    <span>{{ opt.desc }}</span>
                  </div>
                </button>
              }
            </div>
            <div class="btn-row">
              <button class="btn-back" (click)="step.set(1)">Back</button>
              <button class="btn-next" (click)="nextStep()">Continue
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        }

        @if (step() === 3) {
          <div class="onboard-card">
            <h1>What's your goal?</h1>
            <p>We'll set your calorie and macro targets accordingly</p>
            <div class="goal-options">
              @for (opt of goalOptions; track opt.value) {
                <button
                  class="goal-btn"
                  [class.selected]="profile.goal === opt.value"
                  (click)="profile.goal = asGoal(opt.value)"
                >
                  <span class="goal-icon">{{ opt.icon }}</span>
                  <div>
                    <strong>{{ opt.label }}</strong>
                    <span>{{ opt.desc }}</span>
                  </div>
                  @if (profile.goal === opt.value) {
                    <div class="goal-check">✓</div>
                  }
                </button>
              }
            </div>
            @if (profile.goal && previewTargets) {
              <div class="targets-preview">
                <h3>Your estimated daily targets</h3>
                <div class="targets-grid">
                  <div class="target-item">
                    <span class="target-val">{{ previewTargets.calories }}</span>
                    <span class="target-name">Calories</span>
                  </div>
                  <div class="target-item">
                    <span class="target-val">{{ previewTargets.protein }}g</span>
                    <span class="target-name">Protein</span>
                  </div>
                  <div class="target-item">
                    <span class="target-val">{{ previewTargets.carbs }}g</span>
                    <span class="target-name">Carbs</span>
                  </div>
                  <div class="target-item">
                    <span class="target-val">{{ previewTargets.fat }}g</span>
                    <span class="target-name">Fat</span>
                  </div>
                </div>
              </div>
            }
            <div class="btn-row">
              <button class="btn-back" (click)="step.set(2)">Back</button>
              <button class="btn-next" (click)="saveProfile()" [disabled]="!profile.goal || saving()">
                @if (saving()) {
                  <span class="spinner"></span> Saving...
                } @else {
                  Get started!
                }
              </button>
            </div>
            @if (error()) {
              <div class="error-msg">{{ error() }}</div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .onboarding-page {
      min-height: 100vh;
      background: var(--neutral-50);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .onboard-container { width: 100%; max-width: 560px; }
    .onboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-size: 20px;
    }
    .logo-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      color: var(--neutral-900);
    }
    .step-indicator { display: flex; align-items: center; gap: 0; }
    .step-dot {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--neutral-200);
      color: var(--neutral-400);
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all .2s;
    }
    .step-dot.active { background: var(--primary-600); color: white; }
    .step-dot.done { background: var(--emerald-500); color: white; }
    .step-line {
      width: 40px; height: 2px;
      background: var(--neutral-200);
      transition: background .2s;
    }
    .step-line.active { background: var(--emerald-500); }
    .onboard-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid var(--neutral-100);
    }
    .onboard-card h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: var(--neutral-900);
      margin-bottom: 6px;
    }
    .onboard-card > p {
      font-size: 15px;
      color: var(--neutral-500);
      margin-bottom: 28px;
    }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group:first-child { grid-column: span 2; }
    .form-group label { font-size: 13px; font-weight: 600; color: var(--neutral-700); }
    .form-group input, .form-group select {
      padding: 11px 14px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 10px;
      font-size: 14px;
      color: var(--neutral-900);
      background: white;
      transition: border-color .15s;
      font-family: inherit;
    }
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 3px rgba(37,99,235,.08);
    }
    .activity-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
    .activity-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 12px;
      background: white;
      cursor: pointer;
      text-align: left;
      transition: all .15s;
      font-family: inherit;
    }
    .activity-btn:hover { border-color: var(--primary-300); background: var(--primary-50); }
    .activity-btn.selected { border-color: var(--primary-500); background: var(--primary-50); }
    .activity-icon { font-size: 24px; flex-shrink: 0; }
    .activity-btn strong { display: block; font-size: 14px; color: var(--neutral-900); }
    .activity-btn span { font-size: 12px; color: var(--neutral-500); }
    .goal-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
    .goal-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 12px;
      background: white;
      cursor: pointer;
      text-align: left;
      transition: all .15s;
      font-family: inherit;
      position: relative;
    }
    .goal-btn:hover { border-color: var(--primary-300); }
    .goal-btn.selected { border-color: var(--primary-500); background: var(--primary-50); }
    .goal-icon { font-size: 28px; flex-shrink: 0; }
    .goal-btn strong { display: block; font-size: 15px; color: var(--neutral-900); }
    .goal-btn span { font-size: 13px; color: var(--neutral-500); }
    .goal-check {
      margin-left: auto;
      width: 22px; height: 22px;
      background: var(--primary-600);
      border-radius: 50%;
      color: white;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .targets-preview {
      background: var(--neutral-50);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .targets-preview h3 { font-size: 13px; color: var(--neutral-600); margin-bottom: 12px; font-weight: 600; }
    .targets-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .target-item { text-align: center; }
    .target-val { display: block; font-size: 18px; font-weight: 700; color: var(--neutral-900); }
    .target-name { font-size: 11px; color: var(--neutral-500); }
    .btn-row { display: flex; gap: 10px; }
    .btn-next {
      flex: 1;
      padding: 13px;
      background: var(--primary-600);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: inherit;
    }
    .btn-next:hover:not(:disabled) { background: var(--primary-700); }
    .btn-next:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-back {
      padding: 13px 20px;
      background: white;
      color: var(--neutral-600);
      border: 1.5px solid var(--neutral-200);
      border-radius: 10px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all .15s;
      font-family: inherit;
    }
    .btn-back:hover { border-color: var(--neutral-300); }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-msg { color: var(--rose-600); font-size: 13px; margin-top: 12px; text-align: center; }
  `]
})
export class OnboardingComponent implements OnInit {
  step = signal(1);
  saving = signal(false);
  error = signal('');

  profile: Partial<UserProfile> & { id: string } = {
    id: '',
    full_name: '',
    age: undefined,
    gender: undefined,
    height_cm: undefined,
    weight: undefined,
    activity_level: 'moderately_active',
    goal: 'maintain',
  };

  get previewTargets() {
    if (!this.profile.weight || !this.profile.height_cm || !this.profile.age) return null;
    return this.nutritionService.calculateTargets(this.profile as UserProfile);
  }

  activityOptions = [
    { value: 'sedentary', icon: '🪑', label: 'Sedentary', desc: 'Desk job, little or no exercise' },
    { value: 'lightly_active', icon: '🚶', label: 'Lightly active', desc: '1-3 days of light exercise per week' },
    { value: 'moderately_active', icon: '🏃', label: 'Moderately active', desc: '3-5 days of moderate exercise' },
    { value: 'very_active', icon: '⚡', label: 'Very active', desc: '6-7 days of hard exercise' },
    { value: 'extra_active', icon: '🔥', label: 'Extra active', desc: 'Very hard exercise, physical job' },
  ];

  goalOptions = [
    { value: 'lose_weight', icon: '⚖️', label: 'Lose weight', desc: 'Reduce body fat with a calorie deficit' },
    { value: 'maintain', icon: '🎯', label: 'Maintain weight', desc: 'Stay at your current weight and optimize health' },
    { value: 'gain_muscle', icon: '💪', label: 'Gain muscle', desc: 'Build lean muscle with a calorie surplus' },
  ];

  constructor(
    private auth: AuthService,
    private nutritionService: NutritionService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) { this.router.navigate(['/login']); return; }
    this.profile.id = user.id;
  }

  step1Valid(): boolean {
    return !!(this.profile.full_name && this.profile.age && this.profile.gender && this.profile.height_cm && this.profile.weight);
  }

  nextStep() {
    this.step.update(s => s + 1);
  }

  asActivity(v: string): UserProfile['activity_level'] { return v as UserProfile['activity_level']; }
  asGoal(v: string): UserProfile['goal'] { return v as UserProfile['goal']; }

  async saveProfile() {
    this.saving.set(true);
    this.error.set('');
    try {
      const targets = this.nutritionService.calculateTargets(this.profile as UserProfile);
      await this.nutritionService.upsertProfile({
        ...this.profile,
        daily_calorie_target: targets.calories,
        daily_protein_g: targets.protein,
        daily_carbs_g: targets.carbs,
        daily_fat_g: targets.fat,
      } as UserProfile);
      this.router.navigate(['/dashboard']);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      this.saving.set(false);
    }
  }
}
