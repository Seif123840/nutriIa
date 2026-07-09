import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-left-content">
          <a routerLink="/" class="logo">
            <span class="logo-icon">🥗</span>
            <span class="logo-text">NutriAI</span>
          </a>
          <div class="auth-quote">
            <h2>Start your transformation today.</h2>
            <p>Join thousands of people who are eating smarter and living healthier with AI-powered nutrition guidance.</p>
          </div>
          <div class="auth-features">
            <div class="auth-feature-item">
              <div class="check-icon">✓</div>
              <span>Free forever on the basic plan</span>
            </div>
            <div class="auth-feature-item">
              <div class="check-icon">✓</div>
              <span>No credit card required</span>
            </div>
            <div class="auth-feature-item">
              <div class="check-icon">✓</div>
              <span>Setup in under 2 minutes</span>
            </div>
          </div>
          <img
            src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
            alt="Healthy eating"
            class="auth-image"
          />
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Create your account</h1>
            <p>Start tracking your nutrition in minutes</p>
          </div>

          @if (error()) {
            <div class="alert-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/>
              </svg>
              {{ error() }}
            </div>
          }

          @if (success()) {
            <div class="alert-success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.3 5.3-4 4a.5.5 0 0 1-.7 0l-1.5-1.5a.5.5 0 0 1 .7-.7L7 9.3l3.6-3.6a.5.5 0 0 1 .7.6z"/>
              </svg>
              Account created! Redirecting to your dashboard...
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="fullName">Full name</label>
              <input
                id="fullName"
                type="text"
                [(ngModel)]="fullName"
                name="fullName"
                placeholder="John Doe"
                autocomplete="name"
                required
                [disabled]="loading()"
              />
            </div>

            <div class="form-group">
              <label for="email">Email address</label>
              <input
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="you@example.com"
                autocomplete="email"
                required
                [disabled]="loading()"
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Min. 6 characters"
                  autocomplete="new-password"
                  required
                  minlength="6"
                  [disabled]="loading()"
                />
                <button type="button" class="toggle-password" (click)="showPassword.set(!showPassword())">
                  @if (showPassword()) {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  } @else {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              @if (password.length > 0 && password.length < 6) {
                <span class="field-hint">Password must be at least 6 characters</span>
              }
            </div>

            <div class="strength-bar" [class.active]="password.length > 0">
              <div class="strength-segments">
                <div class="seg" [class.filled]="passwordStrength() >= 1" [class.weak]="passwordStrength() === 1"></div>
                <div class="seg" [class.filled]="passwordStrength() >= 2" [class.medium]="passwordStrength() === 2"></div>
                <div class="seg" [class.filled]="passwordStrength() >= 3" [class.strong]="passwordStrength() === 3"></div>
              </div>
              <span class="strength-label">{{ strengthLabel() }}</span>
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading() || !canSubmit()">
              @if (loading()) {
                <span class="spinner"></span> Creating account...
              } @else {
                Create account
              }
            </button>
          </form>

          <p class="auth-switch">
            Already have an account?
            <a routerLink="/login">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .auth-page {
      min-height: 100vh;
      display: flex;
    }
    .auth-left {
      flex: 1;
      background: linear-gradient(135deg, #0f4c29 0%, var(--neutral-900) 100%);
      padding: 40px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .auth-left::before {
      content: '';
      position: absolute;
      bottom: -200px; left: -200px;
      width: 500px; height: 500px;
      background: var(--emerald-500);
      border-radius: 50%;
      opacity: 0.08;
    }
    .auth-left-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      margin-bottom: 48px;
    }
    .logo-icon { font-size: 24px; }
    .logo-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 20px;
      color: white;
    }
    .auth-quote { margin-bottom: 32px; }
    .auth-quote h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: white;
      line-height: 1.3;
      margin-bottom: 12px;
    }
    .auth-quote p { font-size: 15px; color: var(--neutral-400); line-height: 1.6; }
    .auth-features { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
    .auth-feature-item { display: flex; align-items: center; gap: 10px; }
    .check-icon {
      width: 20px; height: 20px;
      background: var(--emerald-500);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .auth-feature-item span { font-size: 14px; color: var(--neutral-300); }
    .auth-image {
      width: 100%;
      border-radius: 16px;
      object-fit: cover;
      max-height: 240px;
      margin-top: auto;
      opacity: 0.8;
    }
    .auth-right {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--bg-base);
    }
    .auth-card { width: 100%; max-width: 380px; }
    .auth-header { margin-bottom: 28px; }
    .auth-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: var(--neutral-900);
      margin-bottom: 6px;
    }
    .auth-header p { font-size: 15px; color: var(--neutral-500); }
    .alert-error {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: var(--rose-50);
      border: 1px solid var(--rose-200);
      border-radius: 10px;
      color: var(--rose-700);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .alert-success {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: var(--emerald-50);
      border: 1px solid var(--emerald-200);
      border-radius: 10px;
      color: var(--emerald-700);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .auth-form { display: flex; flex-direction: column; gap: 18px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; font-weight: 600; color: var(--neutral-700); }
    .form-group input, .input-wrapper input {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 10px;
      font-size: 14px;
      color: var(--neutral-900);
      background: white;
      transition: border-color .15s, box-shadow .15s;
      box-sizing: border-box;
      font-family: inherit;
    }
    .form-group input:focus, .input-wrapper input:focus {
      outline: none;
      border-color: var(--primary-400);
      box-shadow: 0 0 0 3px rgba(37,99,235,.08);
    }
    .form-group input:disabled, .input-wrapper input:disabled { opacity: 0.6; }
    .input-wrapper { position: relative; }
    .input-wrapper input { padding-right: 44px; }
    .toggle-password {
      position: absolute;
      right: 12px; top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--neutral-400);
      padding: 0;
      display: flex;
      align-items: center;
    }
    .toggle-password:hover { color: var(--neutral-600); }
    .field-hint { font-size: 12px; color: var(--rose-500); }
    .strength-bar { overflow: hidden; transition: max-height .2s; max-height: 0; }
    .strength-bar.active { max-height: 40px; }
    .strength-segments { display: flex; gap: 4px; margin-bottom: 4px; }
    .seg {
      flex: 1; height: 4px;
      background: var(--neutral-200);
      border-radius: 100px;
      transition: background .2s;
    }
    .seg.filled.weak { background: var(--rose-400); }
    .seg.filled.medium { background: var(--amber-400); }
    .seg.filled.strong { background: var(--emerald-500); }
    .strength-label { font-size: 11px; color: var(--neutral-500); }
    .btn-submit {
      width: 100%;
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
    .btn-submit:hover:not(:disabled) { background: var(--primary-700); transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin .6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .auth-switch {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: var(--neutral-500);
    }
    .auth-switch a { color: var(--primary-600); text-decoration: none; font-weight: 600; }
    .auth-switch a:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      .auth-left { display: none; }
      .auth-right { width: 100%; padding: 24px; }
    }
  `]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);
  success = signal(false);
  showPassword = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  passwordStrength(): number {
    const p = this.password;
    if (p.length < 6) return 1;
    if (p.length < 10 || !/[0-9]/.test(p)) return 2;
    return 3;
  }

  strengthLabel(): string {
    switch (this.passwordStrength()) {
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      default: return '';
    }
  }

  canSubmit(): boolean {
    return !!this.fullName && !!this.email && this.password.length >= 6;
  }

  async onSubmit() {
    if (!this.canSubmit()) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.signUp(
          this.email,
          this.password,
          this.fullName
      );
      this.success.set(true);
      setTimeout(() => this.router.navigate(['/onboarding']), 1500);
    } catch (err: unknown) {
      this.error.set(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
