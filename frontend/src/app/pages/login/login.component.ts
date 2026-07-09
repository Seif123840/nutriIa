import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
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
            <h2>Your journey to better health starts with what's on your plate.</h2>
            <p>Track, analyze, and optimize your nutrition with the power of artificial intelligence.</p>
          </div>
          <div class="auth-features">
            <div class="auth-feature-item">
              <div class="check-icon">✓</div>
              <span>AI-powered personalized recommendations</span>
            </div>
            <div class="auth-feature-item">
              <div class="check-icon">✓</div>
              <span>Precise macro & calorie tracking</span>
            </div>
            <div class="auth-feature-item">
              <div class="check-icon">✓</div>
              <span>Weight progress monitoring</span>
            </div>
          </div>
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
            alt="Healthy food"
            class="auth-image"
          />
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to continue your nutrition journey</p>
          </div>

          @if (error()) {
            <div class="alert-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/>
              </svg>
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="auth-form">
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
              <label for="password">
                Password
              </label>
              <div class="input-wrapper">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Your password"
                  autocomplete="current-password"
                  required
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
            </div>

            <button type="submit" class="btn-submit" [disabled]="loading() || !email || !password">
              @if (loading()) {
                <span class="spinner"></span> Signing in...
              } @else {
                Sign in
              }
            </button>
          </form>

          <p class="auth-switch">
            Don't have an account?
            <a routerLink="/register">Create one for free</a>
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
      background: linear-gradient(135deg, var(--neutral-900) 0%, #0f2744 100%);
      padding: 40px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .auth-left::before {
      content: '';
      position: absolute;
      top: -200px; right: -200px;
      width: 500px; height: 500px;
      background: var(--primary-600);
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
    .auth-quote {
      margin-bottom: 32px;
    }
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
    .auth-feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .check-icon {
      width: 20px; height: 20px;
      background: var(--primary-500);
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

    /* Right side */
    .auth-right {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--bg-base);
    }
    .auth-card { width: 100%; max-width: 380px; }
    .auth-header { margin-bottom: 32px; }
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
    .auth-form { display: flex; flex-direction: column; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label {
      font-size: 13px;
      font-weight: 600;
      color: var(--neutral-700);
    }
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
    .form-group input:disabled, .input-wrapper input:disabled { opacity: 0.6; cursor: not-allowed; }
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
export class LoginComponent {
  email = '';
  password = '';
  error = signal('');
  loading = signal(false);
  showPassword = signal(false);

  constructor(private auth: AuthService, private router: Router) {
  }

  onSubmit(): void {

    if (!this.email || !this.password) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (response) => {

        // Save authentication data
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('email', response.email);

        // Redirect according to role
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }

        this.loading.set(false);
      },

      error: (err) => {

        this.loading.set(false);

        this.error.set(
            err.error?.message || 'Invalid email or password'
        );

      }

    });


  }
}
