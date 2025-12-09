// client/src/pages/Landing.js
import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="lp-root">
      <header className="lp-hero">
        <div className="container lp-inner">
          <div className="lp-left">
            <div className="lp-eyebrow">Expense Tracker</div>

            <h1 className="lp-title">
              Track your spending. <span className="accent">Spend smarter.</span>
            </h1>

            <p className="lp-sub">
              Minimal, private expense tracking with clean analytics, easy export,
              and a simple workflow designed to make budgeting effortless.
            </p>

            <div className="lp-cta-row">
              <Link to="/register" className="btn-primary lp-cta">Get started — Create account</Link>
              <Link to="/login" className="btn-ghost lp-cta-ghost">Sign in</Link>
            </div>

            <ul className="lp-bullets" aria-hidden>
              <li><strong>Quick add</strong> — add expenses in seconds</li>
              <li><strong>Category insights</strong> — visual breakdowns and monthly totals</li>
              <li><strong>Export</strong> — download CSV for reporting or taxes</li>
            </ul>
          </div>

          <div className="lp-right" role="img" aria-label="App preview">
            <PreviewCard />
          </div>
        </div>
      </header>

      <section className="container lp-features">
        <h2 className="section-title">Why people prefer this</h2>
        <div className="features-grid">
          <Feature emoji="⚡" title="Fast entry" desc="Add expenses quickly with keyboard-first inputs." />
          <Feature emoji="📊" title="Smart insights" desc="Category totals, monthly comparisons and visual reports." />
          <Feature emoji="💾" title="Export anytime" desc="Export CSV to save or share your data." />
          <Feature emoji="🔒" title="Private by default" desc="Local-first setup; you control your data." />
        </div>
      </section>

      <footer className="lp-footer">
        <div className="container">© {new Date().getFullYear()} Expense Tracker — Simple personal finances</div>
      </footer>
    </main>
  );
}

function Feature({ emoji, title, desc }) {
  return (
    <article className="feature">
      <div className="feature-icon" aria-hidden>{emoji}</div>
      <div>
        <div className="feature-title">{title}</div>
        <div className="feature-desc">{desc}</div>
      </div>
    </article>
  );
}

function PreviewCard() {
  // lightweight SVG + mock content, intentionally simple + high-contrast
  return (
    <div className="preview-card" aria-hidden>
      <svg className="preview-illustration" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="#dff6ff" />
            <stop offset="1" stopColor="#f0fbff" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="100%" height="100%" rx="16" fill="url(#g1)" />
        <g transform="translate(36,36)">
          <rect x="0" y="0" width="220" height="36" rx="8" fill="#fff" opacity="0.95" />
          <text x="12" y="24" style={{ fontSize: 16, fontWeight: 700, fill: "#0b1220" }}>Expense Tracker</text>

          <g transform="translate(0,64)">
            <rect x="0" y="0" width="420" height="120" rx="10" fill="#fff" opacity="0.98" />
            <text x="18" y="26" style={{ fontSize: 18, fontWeight: 800, fill: "#065f46" }}>₹ 11,100</text>

            <g transform="translate(18,42)">
              <rect x="0" y="0" width="60" height="8" rx="4" fill="#e6f6ff" />
              <rect x="0" y="18" width="140" height="8" rx="4" fill="#f0fdf4" />
              <rect x="0" y="36" width="90" height="8" rx="4" fill="#eef2ff" />
            </g>

            <g transform="translate(260,42)">
              <text x="0" y="8" style={{ fontSize: 13, fill: "#0b1220" }}>Food</text>
              <text x="0" y="26" style={{ fontSize: 13, fill: "#065f46", fontWeight:700 }}>₹550</text>
            </g>
          </g>

          <g transform="translate(0,206)" opacity="0.95">
            <rect x="0" y="0" width="420" height="42" rx="8" fill="#fff" />
            <text x="18" y="28" style={{ fontSize: 14, fill: "#0b1220" }}>Add expense • Food • ₹550</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
