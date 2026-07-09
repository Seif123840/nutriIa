import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <div class="sidebar-top">
          <a routerLink="/dashboard" class="logo">
            <span class="logo-icon">🥗</span>
            <span class="logo-text">NutriAI</span>
          </a>
          <nav class="nav">
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Dashboard
            </a>
            <a routerLink="/dashboard/log" routerLinkActive="active" class="nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
              </svg>
              Food Log
            </a>
            <a routerLink="/dashboard/progress" routerLinkActive="active" class="nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Progress
            </a>
            <a routerLink="/dashboard/ai" routerLinkActive="active" class="nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a9 9 0 0 1 9 9c0 5-9 13-9 13S3 16 3 11a9 9 0 0 1 9-9z"/>
                <circle cx="12" cy="11" r="3"/>
              </svg>
              AI Insights
            </a>
            <a routerLink="/dashboard/profile" routerLinkActive="active" class="nav-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </a>
          </nav>
        </div>
        <div class="sidebar-bottom">
          <div class="user-info">
            <div class="user-avatar">
              {{ initials }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ auth.currentUser?.email?.split('@')?.[0] ?? '' }}</span>
              <span class="user-email">{{ auth.currentUser?.email }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="auth.signOut()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell {
      min-height: 100vh;
      display: flex;
      background: var(--neutral-50);
    }
    .sidebar {
      width: 240px;
      background: white;
      border-right: 1px solid var(--neutral-100);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      z-index: 50;
      padding: 0;
    }
    .sidebar-top { flex: 1; padding: 24px 16px; }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      margin-bottom: 32px;
      padding: 0 4px;
    }
    .logo-icon { font-size: 22px; }
    .logo-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 18px;
      color: var(--neutral-900);
    }
    .nav { display: flex; flex-direction: column; gap: 2px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      color: var(--neutral-600);
      transition: all .15s;
    }
    .nav-item:hover { background: var(--neutral-50); color: var(--neutral-900); }
    .nav-item.active {
      background: var(--primary-50);
      color: var(--primary-700);
      font-weight: 600;
    }
    .nav-item.active svg { stroke: var(--primary-600); }
    .sidebar-bottom {
      padding: 16px;
      border-top: 1px solid var(--neutral-100);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .user-avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: var(--primary-100);
      color: var(--primary-700);
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .user-details { overflow: hidden; }
    .user-name { display: block; font-size: 13px; font-weight: 600; color: var(--neutral-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-email { display: block; font-size: 11px; color: var(--neutral-400); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 9px 12px;
      background: none;
      border: 1px solid var(--neutral-200);
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--neutral-600);
      cursor: pointer;
      transition: all .15s;
      font-family: inherit;
    }
    .logout-btn:hover { background: var(--rose-50); border-color: var(--rose-200); color: var(--rose-700); }
    .main-content {
      flex: 1;
      margin-left: 240px;
      min-height: 100vh;
    }
  `]
})
export class ShellComponent {
  constructor(public auth: AuthService) {}

  get initials(): string {
    const email = this.auth.currentUser?.email ?? '';
    return email.charAt(0).toUpperCase();
  }
}
