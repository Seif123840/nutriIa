import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="nav-container">
          <a routerLink="/" class="logo">
            <span class="logo-icon">🥗</span>
            <span class="logo-text">NutriAI</span>
          </a>
          <div class="nav-links">
            <a href="#features" class="nav-link">Features</a>
            <a href="#how-it-works" class="nav-link">How it works</a>
            <a href="#stats" class="nav-link">Results</a>
          </div>
          <div class="nav-cta">
            @if (auth.isAuthenticated()) {
              <a routerLink="/dashboard" class="btn-outline">Dashboard</a>
            } @else {
              <a routerLink="/login" class="btn-outline">Sign in</a>
              <a routerLink="/register" class="btn-primary">Get started free</a>
            }
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section class="hero">
        <div class="hero-bg">
          <div class="hero-blob blob-1"></div>
          <div class="hero-blob blob-2"></div>
          <div class="hero-blob blob-3"></div>
        </div>
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            AI-Powered Nutrition Intelligence
          </div>
          <h1 class="hero-title">
            Transform your health<br>
            with <span class="gradient-text">smart nutrition</span>
          </h1>
          <p class="hero-subtitle">
            Track meals, get personalized AI recommendations, monitor your progress,
            and reach your goals — all in one intelligent platform.
          </p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn-hero-primary">
              Start for free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a href="#how-it-works" class="btn-hero-ghost">
              See how it works
            </a>
          </div>
          <div class="hero-social-proof">
            <div class="avatars">
              <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" alt="user" />
              <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" alt="user" />
              <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" alt="user" />
              <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" alt="user" />
            </div>
            <p><strong>12,000+</strong> people already achieving their goals</p>
          </div>
        </div>
        <div class="hero-visual">
          <div class="dashboard-preview">
            <div class="preview-header">
              <div class="preview-dot red"></div>
              <div class="preview-dot yellow"></div>
              <div class="preview-dot green"></div>
              <span class="preview-title">Today's Overview</span>
            </div>
            <div class="preview-body">
              <div class="preview-calories">
                <div class="cal-ring">
                  <svg viewBox="0 0 100 100" class="ring-svg">
                    <circle cx="50" cy="50" r="40" class="ring-bg"/>
                    <circle cx="50" cy="50" r="40" class="ring-fill" style="stroke-dasharray: 188 251"/>
                  </svg>
                  <div class="ring-center">
                    <span class="ring-val">1,840</span>
                    <span class="ring-label">kcal</span>
                  </div>
                </div>
                <div class="cal-info">
                  <p class="cal-title">Calories</p>
                  <p class="cal-sub">Target: 2,200</p>
                  <div class="cal-remaining">360 remaining</div>
                </div>
              </div>
              <div class="preview-macros">
                <div class="macro-bar">
                  <span class="macro-name">Protein</span>
                  <div class="bar-track"><div class="bar-fill protein" style="width:72%"></div></div>
                  <span class="macro-val">108g</span>
                </div>
                <div class="macro-bar">
                  <span class="macro-name">Carbs</span>
                  <div class="bar-track"><div class="bar-fill carbs" style="width:58%"></div></div>
                  <span class="macro-val">203g</span>
                </div>
                <div class="macro-bar">
                  <span class="macro-name">Fat</span>
                  <div class="bar-track"><div class="bar-fill fat" style="width:65%"></div></div>
                  <span class="macro-val">52g</span>
                </div>
              </div>
              <div class="preview-ai-tip">
                <div class="ai-badge">AI</div>
                <p>Add a protein-rich snack before your evening workout for better performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      <section class="stats-bar" id="stats">
        <div class="stats-container">
          <div class="stat-item">
            <span class="stat-number">12K+</span>
            <span class="stat-label">Active users</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">2.4M</span>
            <span class="stat-label">Meals tracked</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">94%</span>
            <span class="stat-label">Goal achievement</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">25+</span>
            <span class="stat-label">Food database items</span>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features" id="features">
        <div class="section-container">
          <div class="section-label">Features</div>
          <h2 class="section-title">Everything you need to<br>eat smarter</h2>
          <p class="section-subtitle">A complete nutrition ecosystem powered by artificial intelligence</p>

          <div class="features-grid">
            <div class="feature-card featured">
              <div class="feature-icon icon-emerald">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                </svg>
              </div>
              <h3>Smart Food Tracking</h3>
              <p>Log meals in seconds from our comprehensive database of 25+ common foods. Track breakfast, lunch, dinner, and snacks with precise nutritional data.</p>
              <div class="feature-tag">Core feature</div>
            </div>
            <div class="feature-card">
              <div class="feature-icon icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Calorie & Macro Targets</h3>
              <p>Get personalized calorie and macro targets calculated using the Mifflin-St Jeor formula based on your age, weight, height, and activity level.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon icon-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a9 9 0 0 1 9 9c0 5-9 13-9 13S3 16 3 11a9 9 0 0 1 9-9z"/>
                  <circle cx="12" cy="11" r="3"/>
                </svg>
              </div>
              <h3>AI Recommendations</h3>
              <p>Receive real-time AI insights and meal suggestions tailored to your intake, goals, and progress. Get tips, warnings, and motivation exactly when you need them.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon icon-rose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3>Progress Tracking</h3>
              <p>Monitor your body weight over time with beautiful charts. See trends, celebrate milestones, and stay motivated on your journey.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon icon-violet">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Goal Setting</h3>
              <p>Set clear objectives — lose weight, maintain, or gain muscle — and get a custom nutrition plan that adapts to your goal automatically.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon icon-teal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </div>
              <h3>Nutritional Insights</h3>
              <p>Deep dive into your macro breakdown with visual dashboards. Understand your protein, carbohydrate, and fat consumption at a glance.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="how-it-works" id="how-it-works">
        <div class="section-container">
          <div class="section-label">Process</div>
          <h2 class="section-title">Get started in 3 simple steps</h2>
          <div class="steps-grid">
            <div class="step-card">
              <div class="step-number">01</div>
              <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop" alt="Create profile" class="step-img" />
              <h3>Create your profile</h3>
              <p>Enter your age, weight, height, activity level, and goal. Our AI instantly calculates your personalized nutrition targets.</p>
            </div>
            <div class="step-connector">
              <div class="connector-line"></div>
            </div>
            <div class="step-card">
              <div class="step-number">02</div>
              <img src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop" alt="Track meals" class="step-img" />
              <h3>Track your meals</h3>
              <p>Search and log foods from our database. Add breakfast, lunch, dinner, and snacks to see your daily nutritional intake in real-time.</p>
            </div>
            <div class="step-connector">
              <div class="connector-line"></div>
            </div>
            <div class="step-card">
              <div class="step-number">03</div>
              <img src="https://images.pexels.com/photos/6551133/pexels-photo-6551133.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop" alt="AI insights" class="step-img" />
              <h3>Get AI insights</h3>
              <p>Receive personalized recommendations, track your weight progress, and let AI guide you towards achieving your health goals.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials">
        <div class="section-container">
          <div class="section-label">Success stories</div>
          <h2 class="section-title">Real results, real people</h2>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="stars">★★★★★</div>
              <p>"I lost 12kg in 3 months using NutriAI. The AI recommendations kept me on track and the meal tracking was so easy I never missed a day."</p>
              <div class="testimonial-author">
                <img src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=48&h=48&fit=crop" alt="Sophie" />
                <div>
                  <strong>Sophie Martin</strong>
                  <span>Lost 12kg in 3 months</span>
                </div>
              </div>
            </div>
            <div class="testimonial-card featured-testimonial">
              <div class="stars">★★★★★</div>
              <p>"As a personal trainer, I recommend NutriAI to all my clients. The macro tracking is precise and the AI insights are genuinely smart and actionable."</p>
              <div class="testimonial-author">
                <img src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=48&h=48&fit=crop" alt="Marc" />
                <div>
                  <strong>Marc Dupont</strong>
                  <span>Personal trainer & nutritionist</span>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="stars">★★★★★</div>
              <p>"I gained 8kg of muscle in 4 months while keeping fat gain minimal. The AI meal plans and protein tracking made all the difference."</p>
              <div class="testimonial-author">
                <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=48&h=48&fit=crop" alt="Alex" />
                <div>
                  <strong>Alex Chen</strong>
                  <span>Gained 8kg of lean muscle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Start your transformation today</h2>
          <p>Join thousands of people who are already eating smarter with NutriAI</p>
          <div class="cta-actions">
            <a routerLink="/register" class="btn-hero-primary">Create free account</a>
            <a routerLink="/login" class="btn-hero-ghost-light">Sign in</a>
          </div>
          <p class="cta-note">No credit card required • Free forever on basic plan</p>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-brand">
            <a routerLink="/" class="logo">
              <span class="logo-icon">🥗</span>
              <span class="logo-text">NutriAI</span>
            </a>
            <p>Intelligent nutrition tracking powered by artificial intelligence.</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#stats">Results</a>
            </div>
            <div class="footer-col">
              <h4>Account</h4>
              <a routerLink="/register">Register</a>
              <a routerLink="/login">Sign in</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 NutriAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home {
      min-height: 100vh;
      background: var(--bg-base);
    }

    /* Navbar */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 0 24px;
      height: 72px;
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .logo-icon { font-size: 24px; }
    .logo-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 20px;
      color: var(--neutral-900);
    }
    .nav-links {
      display: flex;
      gap: 8px;
      flex: 1;
    }
    .nav-link {
      padding: 6px 12px;
      color: var(--neutral-600);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      transition: all .15s;
    }
    .nav-link:hover { background: var(--neutral-100); color: var(--neutral-900); }
    .nav-cta { display: flex; gap: 8px; align-items: center; }
    .btn-outline {
      padding: 8px 16px;
      border: 1.5px solid var(--neutral-200);
      border-radius: 8px;
      color: var(--neutral-700);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all .15s;
    }
    .btn-outline:hover { border-color: var(--primary-500); color: var(--primary-600); }
    .btn-primary {
      padding: 8px 16px;
      background: var(--primary-600);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all .15s;
    }
    .btn-primary:hover { background: var(--primary-700); transform: translateY(-1px); }

    /* Hero */
    .hero {
      min-height: 100vh;
      padding: 72px 24px 80px;
      display: flex;
      align-items: center;
      gap: 64px;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
    }
    .hero-bg {
      position: fixed;
      inset: 0;
      overflow: hidden;
      z-index: 0;
      pointer-events: none;
    }
    .hero-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.12;
    }
    .blob-1 {
      width: 600px; height: 600px;
      background: var(--primary-400);
      top: -100px; right: -100px;
      animation: float1 8s ease-in-out infinite;
    }
    .blob-2 {
      width: 400px; height: 400px;
      background: var(--emerald-400);
      bottom: 100px; left: -50px;
      animation: float2 10s ease-in-out infinite;
    }
    .blob-3 {
      width: 300px; height: 300px;
      background: var(--amber-400);
      top: 40%; right: 30%;
      animation: float3 12s ease-in-out infinite;
    }
    @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,30px)} }
    @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-20px)} }
    @keyframes float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,25px)} }
    .hero-content {
      flex: 1;
      z-index: 1;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--primary-50);
      border: 1px solid var(--primary-200);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-700);
      margin-bottom: 24px;
    }
    .badge-dot {
      width: 7px; height: 7px;
      background: var(--primary-500);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .hero-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 800;
      line-height: 1.1;
      color: var(--neutral-900);
      margin-bottom: 20px;
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--primary-600), var(--emerald-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-subtitle {
      font-size: 18px;
      color: var(--neutral-600);
      line-height: 1.6;
      max-width: 480px;
      margin-bottom: 32px;
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 40px;
    }
    .btn-hero-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: var(--primary-600);
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      transition: all .2s;
      box-shadow: 0 4px 14px rgba(37,99,235,.3);
    }
    .btn-hero-primary:hover { background: var(--primary-700); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,.4); }
    .btn-hero-ghost {
      padding: 14px 24px;
      color: var(--neutral-700);
      text-decoration: none;
      font-weight: 500;
      font-size: 15px;
      border-radius: 12px;
      border: 1.5px solid var(--neutral-200);
      transition: all .2s;
    }
    .btn-hero-ghost:hover { border-color: var(--primary-300); color: var(--primary-700); }
    .hero-social-proof {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatars {
      display: flex;
    }
    .avatars img {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 2px solid white;
      margin-left: -8px;
      object-fit: cover;
    }
    .avatars img:first-child { margin-left: 0; }
    .hero-social-proof p {
      font-size: 13px;
      color: var(--neutral-600);
    }
    .hero-social-proof strong { color: var(--neutral-900); }

    /* Dashboard Preview */
    .hero-visual {
      flex: 1;
      display: flex;
      justify-content: center;
      z-index: 1;
    }
    .dashboard-preview {
      width: 100%;
      max-width: 420px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.05);
      animation: floatPreview 4s ease-in-out infinite;
    }
    @keyframes floatPreview { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .preview-header {
      padding: 14px 16px;
      background: var(--neutral-50);
      border-bottom: 1px solid var(--neutral-100);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .preview-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .preview-dot.red { background: #ff5f57; }
    .preview-dot.yellow { background: #febc2e; }
    .preview-dot.green { background: #28c840; }
    .preview-title {
      margin-left: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--neutral-500);
    }
    .preview-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .preview-calories {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .cal-ring {
      position: relative;
      width: 80px; height: 80px;
      flex-shrink: 0;
    }
    .ring-svg { width: 80px; height: 80px; transform: rotate(-90deg); }
    .ring-bg { fill: none; stroke: var(--neutral-100); stroke-width: 10; }
    .ring-fill { fill: none; stroke: var(--primary-500); stroke-width: 10; stroke-linecap: round; stroke-dashoffset: 0; transition: all 1s; }
    .ring-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .ring-val { font-size: 13px; font-weight: 700; color: var(--neutral-900); }
    .ring-label { font-size: 9px; color: var(--neutral-500); }
    .cal-info p { margin: 0; }
    .cal-title { font-size: 13px; font-weight: 600; color: var(--neutral-800); }
    .cal-sub { font-size: 11px; color: var(--neutral-500); margin-top: 2px; }
    .cal-remaining {
      display: inline-block;
      margin-top: 6px;
      padding: 2px 8px;
      background: var(--primary-50);
      color: var(--primary-700);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
    }
    .preview-macros { display: flex; flex-direction: column; gap: 8px; }
    .macro-bar {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .macro-name { font-size: 11px; color: var(--neutral-600); width: 44px; flex-shrink: 0; }
    .bar-track {
      flex: 1;
      height: 6px;
      background: var(--neutral-100);
      border-radius: 100px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 100px;
      transition: width 1s;
    }
    .bar-fill.protein { background: var(--primary-500); }
    .bar-fill.carbs { background: var(--amber-400); }
    .bar-fill.fat { background: var(--rose-400); }
    .macro-val { font-size: 11px; font-weight: 600; color: var(--neutral-700); width: 32px; text-align: right; flex-shrink: 0; }
    .preview-ai-tip {
      display: flex;
      gap: 10px;
      padding: 12px;
      background: linear-gradient(135deg, var(--primary-50), var(--emerald-50));
      border-radius: 10px;
      border: 1px solid var(--primary-100);
      align-items: flex-start;
    }
    .ai-badge {
      padding: 2px 7px;
      background: var(--primary-600);
      color: white;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .preview-ai-tip p { font-size: 11px; color: var(--neutral-700); margin: 0; line-height: 1.5; }

    /* Stats Bar */
    .stats-bar {
      background: var(--neutral-900);
      padding: 32px 24px;
    }
    .stats-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
    }
    .stat-item {
      flex: 1;
      text-align: center;
      padding: 0 24px;
    }
    .stat-number {
      display: block;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 32px;
      font-weight: 800;
      color: white;
    }
    .stat-label {
      display: block;
      font-size: 13px;
      color: var(--neutral-400);
      margin-top: 4px;
    }
    .stat-divider {
      width: 1px;
      height: 48px;
      background: rgba(255,255,255,0.12);
    }

    /* Sections common */
    .section-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 24px;
    }
    .section-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: var(--primary-600);
      margin-bottom: 12px;
    }
    .section-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 800;
      color: var(--neutral-900);
      line-height: 1.15;
      margin-bottom: 12px;
    }
    .section-subtitle {
      font-size: 17px;
      color: var(--neutral-500);
      margin-bottom: 48px;
    }

    /* Features */
    .features { background: var(--neutral-50); }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .feature-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      border: 1px solid var(--neutral-100);
      transition: all .2s;
      position: relative;
    }
    .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
    .feature-card.featured {
      grid-column: span 1;
      border-color: var(--primary-200);
      background: linear-gradient(135deg, var(--primary-50), white);
    }
    .feature-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .icon-emerald { background: var(--emerald-100); color: var(--emerald-600); }
    .icon-blue { background: var(--primary-100); color: var(--primary-600); }
    .icon-amber { background: var(--amber-100); color: var(--amber-600); }
    .icon-rose { background: var(--rose-100); color: var(--rose-600); }
    .icon-violet { background: #ede9fe; color: #7c3aed; }
    .icon-teal { background: #ccfbf1; color: #0f766e; }
    .feature-card h3 {
      font-size: 16px;
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: 8px;
    }
    .feature-card p { font-size: 14px; color: var(--neutral-600); line-height: 1.6; margin: 0; }
    .feature-tag {
      display: inline-block;
      margin-top: 14px;
      padding: 3px 10px;
      background: var(--primary-100);
      color: var(--primary-700);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
    }

    /* How it works */
    .steps-grid {
      display: flex;
      align-items: center;
      gap: 0;
    }
    .step-card {
      flex: 1;
      text-align: center;
    }
    .step-connector { width: 60px; flex-shrink: 0; }
    .connector-line {
      height: 2px;
      background: linear-gradient(90deg, var(--primary-200), var(--primary-400));
      margin-top: -60px;
    }
    .step-number {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: var(--primary-500);
      margin-bottom: 16px;
      letter-spacing: .05em;
    }
    .step-img {
      width: 100%;
      aspect-ratio: 16/10;
      object-fit: cover;
      border-radius: 14px;
      margin-bottom: 20px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    .step-card h3 {
      font-size: 18px;
      font-weight: 700;
      color: var(--neutral-900);
      margin-bottom: 8px;
    }
    .step-card p { font-size: 14px; color: var(--neutral-600); line-height: 1.6; margin: 0; }

    /* Testimonials */
    .testimonials { background: var(--neutral-50); }
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .testimonial-card {
      background: white;
      border-radius: 16px;
      padding: 28px;
      border: 1px solid var(--neutral-100);
    }
    .testimonial-card.featured-testimonial {
      border-color: var(--primary-200);
      background: linear-gradient(135deg, var(--primary-50), white);
    }
    .stars { color: var(--amber-400); font-size: 16px; margin-bottom: 12px; }
    .testimonial-card p {
      font-size: 14px;
      color: var(--neutral-700);
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .testimonial-author img {
      width: 44px; height: 44px;
      border-radius: 50%;
      object-fit: cover;
    }
    .testimonial-author strong { display: block; font-size: 14px; color: var(--neutral-900); }
    .testimonial-author span { font-size: 12px; color: var(--neutral-500); }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--neutral-900) 0%, #1e3a5f 100%);
      padding: 80px 24px;
      text-align: center;
    }
    .cta-content { max-width: 600px; margin: 0 auto; }
    .cta-section h2 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 800;
      color: white;
      margin-bottom: 12px;
    }
    .cta-section p { font-size: 17px; color: var(--neutral-400); margin-bottom: 32px; }
    .cta-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 20px; }
    .btn-hero-ghost-light {
      padding: 14px 24px;
      color: var(--neutral-300);
      text-decoration: none;
      font-weight: 500;
      font-size: 15px;
      border-radius: 12px;
      border: 1.5px solid rgba(255,255,255,0.2);
      transition: all .2s;
    }
    .btn-hero-ghost-light:hover { border-color: rgba(255,255,255,0.4); color: white; }
    .cta-note { font-size: 13px; color: var(--neutral-500); }

    /* Footer */
    .footer {
      background: var(--neutral-950, #0a0a0a);
      padding: 48px 24px 0;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 64px;
      padding-bottom: 40px;
    }
    .footer-brand { flex: 1; }
    .footer-brand .logo-text { color: white; }
    .footer-brand p { font-size: 14px; color: var(--neutral-500); margin-top: 12px; max-width: 280px; line-height: 1.6; }
    .footer-links { display: flex; gap: 64px; }
    .footer-col { display: flex; flex-direction: column; gap: 10px; }
    .footer-col h4 { font-size: 13px; font-weight: 600; color: white; margin-bottom: 4px; }
    .footer-col a { font-size: 13px; color: var(--neutral-500); text-decoration: none; transition: color .15s; }
    .footer-col a:hover { color: var(--neutral-300); }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 20px 0;
      max-width: 1200px;
      margin: 0 auto;
    }
    .footer-bottom p { font-size: 13px; color: var(--neutral-600); }

    @media (max-width: 900px) {
      .hero { flex-direction: column; padding-top: 100px; }
      .hero-visual { width: 100%; }
      .nav-links { display: none; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .testimonials-grid { grid-template-columns: 1fr; }
      .steps-grid { flex-direction: column; }
      .step-connector { display: none; }
      .stats-container { flex-wrap: wrap; gap: 24px; }
      .stat-divider { display: none; }
    }
    @media (max-width: 600px) {
      .features-grid { grid-template-columns: 1fr; }
      .hero-actions { flex-direction: column; align-items: flex-start; }
      .cta-actions { flex-direction: column; align-items: center; }
      .footer-container { flex-direction: column; gap: 32px; }
      .footer-links { gap: 32px; }
    }
  `]
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}
