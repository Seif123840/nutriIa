import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NutritionService } from '../../services/nutrition.service';
import { UserProfile } from '../../models/nutrition.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h1>Profile & Settings</h1>
        <p>Manage your health data and nutrition targets</p>
      </div>

      @if (saving() === 'success') {
        <div class="alert-success">Profile saved successfully!</div>
      }
      @if (error()) {
        <div class="alert-error">{{ error() }}</div>
      }

      <div class="profile-layout">
        <div class="profile-card">
          <div class="avatar-section">
            <div class="avatar-big">{{ initials }}</div>
            <div>
              <h2>{{ form.full_name || auth.currentUser?.email }}</h2>
              <p>{{ auth.currentUser?.email }}</p>
            </div>
          </div>
        </div>

        <form (ngSubmit)="saveProfile()" class="settings-form">
          <div class="form-section">
            <h3>Personal Information</h3>
            <div class="form-grid">
              <div class="form-group full">
                <label>Full name</label>
                <input type="text" [(ngModel)]="form.full_name" name="full_name" placeholder="Your full name" />
              </div>
              <div class="form-group">
                <label>Age</label>
                <input type="number" [(ngModel)]="form.age" name="age" min="16" max="100" placeholder="28" />
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select [(ngModel)]="form.gender" name="gender">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Height (cm)</label>
                <input type="number" [(ngModel)]="form.height_cm" name="height_cm" min="100" max="250" placeholder="175" />
              </div>
              <div class="form-group">
                <label>Weight (kg)</label>
                <input type="number" [(ngModel)]="form.weight" name="weight_kg" min="30" max="300" placeholder="70" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Activity & Goal</h3>
            <div class="form-grid">
              <div class="form-group full">
                <label>Activity level</label>
                <select [(ngModel)]="form.activity_level" name="activity_level">
                  <option value="sedentary">Sedentary (desk job, no exercise)</option>
                  <option value="lightly_active">Lightly active (1-3 days/week)</option>
                  <option value="moderately_active">Moderately active (3-5 days/week)</option>
                  <option value="very_active">Very active (6-7 days/week)</option>
                  <option value="extra_active">Extra active (physical job + exercise)</option>
                </select>
              </div>
              <div class="form-group full">
                <label>Goal</label>
                <div class="goal-options">
                  <label class="goal-opt" [class.selected]="form.goal === 'lose_weight'">
                    <input type="radio" [(ngModel)]="form.goal" name="goal" value="lose_weight" />
                    <span>⚖️ Lose weight</span>
                  </label>
                  <label class="goal-opt" [class.selected]="form.goal === 'maintain'">
                    <input type="radio" [(ngModel)]="form.goal" name="goal" value="maintain" />
                    <span>🎯 Maintain weight</span>
                  </label>
                  <label class="goal-opt" [class.selected]="form.goal === 'gain_muscle'">
                    <input type="radio" [(ngModel)]="form.goal" name="goal" value="gain_muscle" />
                    <span>💪 Gain muscle</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          @if (estimatedTargets) {
            <div class="estimated-targets">
              <h3>Calculated targets</h3>
              <p class="targets-desc">Based on your profile (Mifflin-St Jeor formula)</p>
              <div class="targets-row">
                <div class="te">
                  <span class="te-val">{{ estimatedTargets.calories }}</span>
                  <span class="te-key">Calories</span>
                </div>
                <div class="te">
                  <span class="te-val">{{ estimatedTargets.protein }}g</span>
                  <span class="te-key">Protein</span>
                </div>
                <div class="te">
                  <span class="te-val">{{ estimatedTargets.carbs }}g</span>
                  <span class="te-key">Carbs</span>
                </div>
                <div class="te">
                  <span class="te-val">{{ estimatedTargets.fat }}g</span>
                  <span class="te-key">Fat</span>
                </div>
              </div>
            </div>
          }

          <div class="form-actions">
            <button type="submit" class="btn-save" [disabled]="saving() === 'loading'">
              @if (saving() === 'loading') {
                <span class="spinner"></span> Saving...
              } @else {
                Save changes
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { padding: 32px; max-width: 800px; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--neutral-900);
      margin-bottom: 4px;
    }
    .page-header p { font-size: 14px; color: var(--neutral-500); }
    .alert-success {
      padding: 12px 16px;
      background: var(--emerald-50);
      border: 1px solid var(--emerald-200);
      border-radius: 10px;
      color: var(--emerald-700);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .alert-error {
      padding: 12px 16px;
      background: var(--rose-50);
      border: 1px solid var(--rose-200);
      border-radius: 10px;
      color: var(--rose-700);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .profile-layout { display: flex; flex-direction: column; gap: 16px; }
    .profile-card {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 24px;
    }
    .avatar-section { display: flex; align-items: center; gap: 16px; }
    .avatar-big {
      width: 64px; height: 64px;
      background: var(--primary-100);
      color: var(--primary-700);
      border-radius: 50%;
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-section h2 { font-size: 18px; font-weight: 700; color: var(--neutral-900); margin-bottom: 2px; }
    .avatar-section p { font-size: 13px; color: var(--neutral-500); }
    .settings-form {
      background: white;
      border-radius: 16px;
      border: 1px solid var(--neutral-100);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .form-section h3 { font-size: 14px; font-weight: 700; color: var(--neutral-700); margin-bottom: 16px; text-transform: uppercase; letter-spacing: .05em; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .form-group.full { grid-column: span 2; }
    .form-group label { font-size: 12px; font-weight: 600; color: var(--neutral-600); }
    .form-group input, .form-group select {
      padding: 10px 12px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 9px;
      font-size: 14px;
      font-family: inherit;
      color: var(--neutral-900);
      transition: border-color .15s;
    }
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--primary-400);
    }
    .goal-options { display: flex; gap: 10px; }
    .goal-opt {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 12px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: var(--neutral-700);
      transition: all .15s;
    }
    .goal-opt.selected { border-color: var(--primary-500); background: var(--primary-50); color: var(--primary-700); font-weight: 600; }
    .goal-opt input { display: none; }
    .estimated-targets {
      background: var(--primary-50);
      border: 1px solid var(--primary-100);
      border-radius: 12px;
      padding: 16px 20px;
    }
    .estimated-targets h3 { font-size: 13px; font-weight: 700; color: var(--primary-700); margin-bottom: 2px; }
    .targets-desc { font-size: 12px; color: var(--primary-500); margin-bottom: 12px; }
    .targets-row { display: flex; gap: 20px; }
    .te { text-align: center; }
    .te-val { display: block; font-size: 18px; font-weight: 700; color: var(--primary-700); }
    .te-key { font-size: 11px; color: var(--primary-500); }
    .form-actions { display: flex; justify-content: flex-end; }
    .btn-save {
      padding: 12px 28px;
      background: var(--primary-600);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all .15s;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-save:hover:not(:disabled) { background: var(--primary-700); }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
      .form-group.full { grid-column: span 1; }
      .goal-options { flex-direction: column; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  form: Partial<UserProfile> = {
    full_name: '',
    age: undefined,
    gender: undefined,
    height_cm: undefined,
    weight: undefined,
    activity_level: 'moderately_active',
    goal: 'maintain',
  };
  saving = signal<'idle' | 'loading' | 'success'>('idle');
  error = signal('');

  constructor(public auth: AuthService, private nutritionService: NutritionService) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;
    const prof = await this.nutritionService.getProfile(user.id);
    if (prof) {
      this.form = { ...prof };
    }
  }

  get initials(): string {
    const name = (this.form.full_name ?? '') || (this.auth.currentUser?.email ?? '');
    return name.charAt(0).toUpperCase();
  }

  get estimatedTargets() {
    if (!this.form.weight || !this.form.height_cm || !this.form.age) return null;
    return this.nutritionService.calculateTargets(this.form as UserProfile);
  }

  async saveProfile() {
    const user = this.auth.currentUser;
    if (!user) return;
    this.saving.set('loading');
    this.error.set('');
    try {
      const targets = this.estimatedTargets;
      await this.nutritionService.upsertProfile({
        ...this.form,
        id: user.id,
        ...(targets ? {
          daily_calorie_target: targets.calories,
          daily_protein_g: targets.protein,
          daily_carbs_g: targets.carbs,
          daily_fat_g: targets.fat,
        } : {}),
      } as UserProfile);
      this.saving.set('success');
      setTimeout(() => this.saving.set('idle'), 3000);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : 'Failed to save');
      this.saving.set('idle');
    }
  }
}
