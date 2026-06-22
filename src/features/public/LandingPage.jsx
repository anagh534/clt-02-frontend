import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, TrendingUp, Shield, Zap, Star, BarChart2, Users } from 'lucide-react';

const NAV_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For Founders', href: '#founders' },
  { label: 'For Investors', href: '#investors' },
  { label: 'FAQ', href: '#faq' },
];

const STEPS = [
  {
    number: '01',
    icon: <TrendingUp size={24} />,
    title: 'Fill your profile',
    desc: 'Answer 4 short steps about your startup — stage, metrics, team, and traction. Takes under 5 minutes.',
  },
  {
    number: '02',
    icon: <BarChart2 size={24} />,
    title: 'Get your InvestScore',
    desc: 'Our algorithm weighs 10+ signals to produce a single, investor-ready score from 0 – 100.',
  },
  {
    number: '03',
    icon: <Users size={24} />,
    title: 'Connect with investors',
    desc: 'Share your verified profile URL. Investors shortlist you, add private notes, and reach out directly.',
  },
];

const FOUNDER_BULLETS = [
  'Instantly know how investors see you',
  'Shareable profile with a unique, verified link',
  'Score updates live as you grow',
  'Understand exactly what boosts your score',
  'Stand out in a crowded deal pipeline',
];

const INVESTOR_BULLETS = [
  'Curated feed of scored, verified startups',
  'Add your own conviction score (private)',
  'Shortlist and track companies you like',
  'Filter by sector, stage, and score',
  'Save notes on every startup you review',
];

const STATS = [
  { value: '2,400+', label: 'Founders scored' },
  { value: '380+', label: 'Active investors' },
  { value: '$120M+', label: 'Capital connected' },
  { value: '68%', label: 'Response rate' },
];

const FAQS = [
  {
    q: 'How is the InvestScore calculated?',
    a: 'The score weighs stage, ARR, growth rate, customer count, founder background, and profile completeness — producing a single 0–100 signal. The algorithm is transparent: you can see exactly which inputs drive each point.',
  },
  {
    q: 'Can I update my score after submitting?',
    a: 'Yes. Return to the scoring form any time and re-submit with updated metrics. Your score recalculates instantly and your profile reflects the new number.',
  },
  {
    q: 'Is my data visible to everyone?',
    a: "Your public profile shows your score, stage, sector, and tagline. Sensitive metrics like exact ARR are only shared when you choose. Investors' private scores and notes on your startup are never visible to you.",
  },
  {
    q: 'Is InvestScore free to use?',
    a: 'Yes — creating a profile and getting your score is completely free. We charge investors for deal-flow access beyond the free tier.',
  },
  {
    q: 'How do investors verify a startup profile?',
    a: "Founders with a completed profile receive a verified badge. Investors can also request data rooms directly through the platform, which are handled outside InvestScore's core flow.",
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`lp-faq-item${open ? ' open' : ''}`}>
      <button className="lp-faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="lp-faq-a">{a}</div>}
    </div>
  );
};

const LandingPage = () => {
  return (
    <div className="lp-root">
      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-logo">InvestScore</Link>
          <div className="lp-nav-links">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="lp-nav-link">{l.label}</a>
            ))}
          </div>
          <div className="lp-nav-ctas">
            <Link to="/auth/login" className="btn btn-ghost lp-nav-signin">Sign In</Link>
            <Link to="/auth/login" className="btn btn-accent lp-nav-cta">Get My Score →</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <div className="lp-eyebrow">
              <Zap size={13} />
              <span>The investor-readiness score for ambitious founders</span>
            </div>
            <h1 className="lp-h1">
              Know exactly how<br />
              investors see your<br />
              <span className="lp-h1-accent">startup</span>
            </h1>
            <p className="lp-hero-sub">
              InvestScore turns your traction, team, and metrics into a single
              verified score — so you walk into every meeting already ahead.
            </p>
            <div className="lp-hero-btns">
              <Link to="/auth/login" className="btn btn-accent lp-hero-cta">Get My Free Score</Link>
              <a href="#how-it-works" className="btn btn-ghost">See how it works</a>
            </div>
            <div className="lp-trust">
              <div className="lp-trust-avatars">
                {['A', 'B', 'C', 'D'].map((l, i) => (
                  <div key={i} className="lp-trust-av">{l}</div>
                ))}
              </div>
              <span className="lp-trust-text">Joined by <strong>2,400+ founders</strong> this year</span>
            </div>
          </div>

          <div className="lp-hero-card">
            <div className="lp-score-card">
              <div className="lp-score-card-head">
                <div className="lp-score-card-logo">T</div>
                <div>
                  <div className="lp-score-card-name">TechFlow AI</div>
                  <div className="lp-score-card-tag">SaaS · Series A</div>
                </div>
                <div className="lp-score-card-badge">✓ Verified</div>
              </div>
              <div className="lp-score-ring-wrap">
                <div className="lp-score-ring">
                  <span className="lp-score-num">87</span>
                  <span className="lp-score-label">InvestScore</span>
                </div>
              </div>
              <div className="lp-score-bars">
                {[
                  { name: 'Financial Health', val: 92 },
                  { name: 'Team', val: 88 },
                  { name: 'Traction', val: 81 },
                  { name: 'Market', val: 79 },
                ].map(b => (
                  <div className="lp-score-bar-row" key={b.name}>
                    <div className="lp-score-bar-head">
                      <span>{b.name}</span><span>{b.val}</span>
                    </div>
                    <div className="lp-score-bar-track">
                      <div className="lp-score-bar-fill" style={{ width: `${b.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-section" id="how-it-works">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <div className="lp-eyebrow"><span>How it works</span></div>
            <h2 className="lp-h2">Score in under 5 minutes</h2>
            <p className="lp-section-sub">Three steps to a verified investor-ready profile.</p>
          </div>
          <div className="lp-steps">
            {STEPS.map(s => (
              <div className="lp-step" key={s.number}>
                <div className="lp-step-num">{s.number}</div>
                <div className="lp-step-icon">{s.icon}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE CARDS */}
      <section className="lp-section lp-audience-section" id="founders">
        <div className="lp-section-inner">
          <div className="lp-section-head">
            <h2 className="lp-h2">Built for both sides of the table</h2>
          </div>
          <div className="lp-audience-grid" id="investors">
            <div className="lp-audience-card">
              <div className="lp-audience-icon">
                <TrendingUp size={22} />
              </div>
              <div className="lp-audience-role">For Founders</div>
              <div className="lp-audience-title">Stop guessing what investors think</div>
              <ul className="lp-audience-list">
                {FOUNDER_BULLETS.map(b => (
                  <li key={b}>
                    <span className="lp-check">✓</span>{b}
                  </li>
                ))}
              </ul>
              <Link to="/auth/login" className="btn btn-accent btn-full lp-audience-cta">
                Get My Score →
              </Link>
            </div>

            <div className="lp-audience-card lp-audience-card-alt">
              <div className="lp-audience-icon lp-audience-icon-alt">
                <Shield size={22} />
              </div>
              <div className="lp-audience-role lp-audience-role-alt">For Investors</div>
              <div className="lp-audience-title">Discover scored, verified deal flow</div>
              <ul className="lp-audience-list">
                {INVESTOR_BULLETS.map(b => (
                  <li key={b}>
                    <span className="lp-check lp-check-alt">✓</span>{b}
                  </li>
                ))}
              </ul>
              <Link to="/auth/login" className="btn btn-outline btn-full lp-audience-cta">
                Explore Deal Flow →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="lp-stats-strip">
        <div className="lp-stats-inner">
          {STATS.map(s => (
            <div className="lp-stat" key={s.label}>
              <div className="lp-stat-val">{s.value}</div>
              <div className="lp-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section" id="faq">
        <div className="lp-section-inner lp-faq-section">
          <div className="lp-section-head">
            <div className="lp-eyebrow"><span>FAQ</span></div>
            <h2 className="lp-h2">Common questions</h2>
          </div>
          <div className="lp-faq-list">
            {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-final-cta">
        <div className="lp-final-cta-inner">
          <div className="lp-final-star"><Star size={32} fill="currentColor" /></div>
          <h2 className="lp-h2">Ready to know your score?</h2>
          <p className="lp-final-sub">
            Join 2,400+ founders who already know how investors see them.
            Free forever for founders.
          </p>
          <Link to="/auth/login" className="btn btn-accent lp-final-btn">
            Get My Free Score →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-left">
            <div className="lp-logo lp-footer-logo">InvestScore</div>
            <div className="lp-footer-copy">© 2026 InvestScore. All rights reserved.</div>
          </div>
          <div className="lp-footer-links">
            <a href="#how-it-works" className="lp-footer-link">How it works</a>
            <a href="#faq" className="lp-footer-link">FAQ</a>
            <Link to="/auth/login" className="lp-footer-link">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
