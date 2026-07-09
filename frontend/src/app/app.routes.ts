import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { ShellComponent } from './pages/shell/shell.component';
import { DashboardHomeComponent } from './pages/dashboard/dashboard-home.component';
import { FoodLogComponent } from './pages/food-log/food-log.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { AiInsightsComponent } from './pages/ai-insights/ai-insights.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard] },
  {
    path: 'dashboard',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'log', component: FoodLogComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'ai', component: AiInsightsComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
