import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, TrendingUp, Shield, Zap, Star,
  BarChart2, Users, Check, ArrowRight, Brain, Shuffle,
  LineChart, Share2, Globe, Lock,
} from 'lucide-react';

/* ── Data ─────────────────────────────────────────────────── */
const FEATURES = [
  { icon: <Brain size={20} />, label: 'Free', title: 'AI Startup Score', desc: '100-point score across 6 categories so investors see you clearly.' },
  { icon: <Shuffle size={20} />, label: 'Free', title: 'AI Investor Matching', desc: 'Matched to investors whose thesis fits your stage and sector.' },
  { icon: <LineChart size={20} />, label: 'Fund OS', title: 'Deal Flow Intelligence', desc: 'Investment memos and deal-flow analytics in one place.' },
  { icon: <Share2 size={20} />, label: 'Free', title: 'Share & invite', desc: 'Share your fundraise profile with a single verified link.' },
  { icon: <Globe size={20} />, label: 'Fund OS', title: 'Global infrastructure', desc: 'Operate across 150+ countries with built-in compliance.' },
  { icon: <Lock size={20} />, label: 'Fund OS', title: 'Bank-grade security', desc: 'SOC 2 ready · GDPR compliant · end-to-end encrypted.' },
];

const FOUNDER_STEPS = [
  { n: '01', title: 'Create your profile', desc: 'Answer 4 short sections about your startup — stage, metrics, team, and traction. Takes under 10 minutes.' },
  { n: '02', title: 'Get your AI Score', desc: 'Our algorithm weighs 10+ signals to produce a single, investor-ready 100-point breakdown.' },
  { n: '03', title: 'Share with investors', desc: 'Publish your profile. Investors are alerted when you match their thesis.' },
  { n: '04', title: 'Close your round', desc: 'Manage your pipeline, track interest, and close with full visibility.' },
];

const INVESTOR_STEPS = [
  { n: '01', title: 'Set your thesis', desc: 'Define your focus: sector, stage, check size, and geography.' },
  { n: '02', title: 'Get matched deals', desc: 'AI surfaces startups that fit your criteria — scored and verified.' },
  { n: '03', title: 'Score & track', desc: 'Add your private conviction score and notes on every startup.' },
  { n: '04', title: 'Move fast', desc: 'Signal interest directly. Founders see your intent immediately.' },
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
  { value: '380+',   label: 'Active investors' },
  { value: '$120M+', label: 'Capital connected' },
  { value: '68%',    label: 'Response rate' },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    sub: '/month',
    desc: 'Everything a founder needs to get started.',
    cta: 'Start fundraising — it\'s free',
    ctaStyle: 'outline',
    features: [
      '1 active round',
      '1 AI Startup Score',
      'Investor matching',
      'Shareable profile link',
      'Basic analytics',
    ],
  },
  {
    name: 'Fundraise OS',
    price: '$49',
    sub: '/month',
    desc: 'Full fundraising infrastructure for serious rounds.',
    cta: 'Get started',
    ctaStyle: 'accent',
    highlight: true,
    features: [
      '1 active round',
      '5 AI Startup Scores',
      'Unlimited pipeline tracking',
      'Deal-flow analytics',
      'Priority investor matching',
      'Bank-grade security',
    ],
  },
];

const FAQS = [
  { q: 'How is the InvestScore calculated?', a: 'The score weighs stage, ARR, growth rate, customer count, founder background, and profile completeness — producing a single 0–100 signal. The algorithm is transparent: you can see exactly which inputs drive each point.' },
  { q: 'Can I update my score after submitting?', a: 'Yes. Return to the scoring form any time and re-submit with updated metrics. Your score recalculates instantly and your profile reflects the new number.' },
  { q: 'Is my data visible to everyone?', a: 'Your public profile shows your score, stage, sector, and tagline. Sensitive metrics like exact ARR are only shared when you choose. Investors\' private scores and notes on your startup are never visible to you.' },
  { q: 'Is InvestScore free to use?', a: 'Yes — creating a profile and getting your score is completely free. We charge investors for deal-flow access beyond the free tier.' },
  { q: 'How do investors verify a startup profile?', a: 'Founders with a completed profile receive a verified badge. Investors can also request data rooms directly through the platform.' },
];

/* ── Sub-components ───────────────────────────────────────── */
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fvc-faq-item">
      <button className="fvc-faq-q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="fvc-faq-a">{a}</div>}
    </div>
  );
};

const HowItWorksTab = ({ steps }) => (
  <div className="fvc-steps">
    {steps.map(s => (
      <div className="fvc-step" key={s.n}>
        <div className="fvc-step-n">{s.n}</div>
        <div className="fvc-step-body">
          <div className="fvc-step-title">{s.title}</div>
          <div className="fvc-step-desc">{s.desc}</div>
        </div>
      </div>
    ))}
  </div>
);

/* ── Main Component ───────────────────────────────────────── */
const LandingPage = () => {
  const [tab, setTab] = useState('founders');

  return (
    <div className="fvc-root">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="fvc-nav">
        <div className="fvc-nav-inner">
          <Link to="/" className="fvc-logo">
            <span className="fvc-logo-mark">◆</span>
            InvestScore
          </Link>
          <div className="fvc-nav-links">
            <a href="#features" className="fvc-nav-link">Product</a>
            <a href="#pricing"  className="fvc-nav-link">Pricing</a>
            <a href="#faq"      className="fvc-nav-link">About</a>
          </div>
          <div className="fvc-nav-ctas">
            <Link to="/auth/login"  className="fvc-nav-login">Log in</Link>
            <Link to="/auth/signup" className="fvc-nav-cta">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="fvc-hero">
        <div className="fvc-hero-inner">

          {/* Left copy */}
          <div className="fvc-hero-copy">
            <div className="fvc-eyebrow">
              <Zap size={12} />
              AI-powered fundraising infrastructure
            </div>
            <h1 className="fvc-h1">
              Where the world's best startups meet the capital they deserve
            </h1>
            <p className="fvc-hero-sub">
              InvestScore connects founders and investors through AI-powered matching,
              transparent deal flow, and institutional-grade infrastructure.
            </p>
            <div className="fvc-hero-btns">
              <Link to="/auth/signup?role=founder" className="fvc-btn-primary">
                Start fundraising — it's free
              </Link>
              <Link to="/auth/signup?role=investor" className="fvc-btn-secondary">
                I'm an investor
              </Link>
            </div>
            <div className="fvc-hero-badges">
              <span className="fvc-badge"><Check size={11} /> Free for founders</span>
              <span className="fvc-badge"><Check size={11} /> AI Startup Score</span>
              <span className="fvc-badge"><Check size={11} /> Investor matching</span>
            </div>
          </div>

          {/* Right card — Lumen Health mock */}
          <div className="fvc-hero-card">
            <div className="fvc-startup-card">
              {/* card header */}
              <div className="fvc-sc-head">
                <div className="fvc-sc-logo" style={{ background: 'linear-gradient(135deg,#F5D76E,#D4AF37)', color: '#080808' }}>L</div>
                <div className="fvc-sc-info">
                  <div className="fvc-sc-name">Lumen Health</div>
                  <div className="fvc-sc-meta">Healthtech · Seed</div>
                </div>
                <div className="fvc-sc-score-wrap">
                  <div className="fvc-sc-score">72</div>
                  <div className="fvc-sc-score-lbl">Score</div>
                </div>
              </div>

              {/* metrics row */}
              <div className="fvc-sc-metrics">
                <div className="fvc-sc-metric">
                  <div className="fvc-sc-metric-lbl">MRR</div>
                  <div className="fvc-sc-metric-val">$45,000</div>
                </div>
                <div className="fvc-sc-metric">
                  <div className="fvc-sc-metric-lbl">Runway</div>
                  <div className="fvc-sc-metric-val">18 mo</div>
                </div>
                <div className="fvc-sc-metric">
                  <div className="fvc-sc-metric-lbl">Round</div>
                  <div className="fvc-sc-metric-val">$500K SAFE</div>
                </div>
              </div>

              {/* investors matched */}
              <div className="fvc-sc-footer">
                <div className="fvc-sc-avatars">
                  {['JD','SK','MR'].map(i => (
                    <div className="fvc-sc-av" key={i}>{i}</div>
                  ))}
                </div>
                <div className="fvc-sc-matched">3 investors matched</div>
                <div className="fvc-sc-signal">3 signalled</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="fvc-section" id="features">
        <div className="fvc-section-inner">
          <div className="fvc-section-head">
            <div className="fvc-eyebrow">Features</div>
            <h2 className="fvc-h2">Everything you need to raise</h2>
            <p className="fvc-section-sub">
              Built for both sides of the table — from your first score to your final close.
            </p>
          </div>
          <div className="fvc-features-grid">
            {FEATURES.map(f => (
              <div className="fvc-feature-card" key={f.title}>
                <div className="fvc-feature-top">
                  <div className="fvc-feature-icon">{f.icon}</div>
                  <span className="fvc-feature-label">{f.label}</span>
                </div>
                <div className="fvc-feature-title">{f.title}</div>
                <div className="fvc-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="fvc-section fvc-hiw-section" id="how-it-works">
        <div className="fvc-section-inner">
          <div className="fvc-section-head">
            <div className="fvc-eyebrow">How it works</div>
            <h2 className="fvc-h2">From profile to close</h2>
            <p className="fvc-section-sub">Four steps — for founders and investors alike.</p>
          </div>

          {/* tabs */}
          <div className="fvc-tabs">
            <button
              className={`fvc-tab${tab === 'founders' ? ' active' : ''}`}
              onClick={() => setTab('founders')}
            >
              <TrendingUp size={15} /> For Founders
            </button>
            <button
              className={`fvc-tab${tab === 'investors' ? ' active' : ''}`}
              onClick={() => setTab('investors')}
            >
              <BarChart2 size={15} /> For Investors
            </button>
          </div>

          {tab === 'founders'
            ? <HowItWorksTab steps={FOUNDER_STEPS} />
            : <HowItWorksTab steps={INVESTOR_STEPS} />
          }
        </div>
      </section>

      {/* ── AUDIENCE ────────────────────────────────────────── */}
      <section className="fvc-section fvc-audience-section" id="audience">
        <div className="fvc-section-inner">
          <div className="fvc-audience-grid">
            {/* Founders */}
            <div className="fvc-audience-card">
              <div className="fvc-audience-icon fvc-audience-icon-blue">
                <TrendingUp size={20} />
              </div>
              <div className="fvc-audience-role">For Founders</div>
              <div className="fvc-audience-title">Stop guessing what investors think</div>
              <ul className="fvc-audience-list">
                {FOUNDER_BULLETS.map(b => (
                  <li key={b}><Check size={14} className="fvc-check" />{b}</li>
                ))}
              </ul>
              <Link to="/auth/signup" className="fvc-btn-primary fvc-btn-full">
                Get My Score <ArrowRight size={15} />
              </Link>
            </div>

            {/* Investors */}
            <div className="fvc-audience-card fvc-audience-card-dark">
              <div className="fvc-audience-icon fvc-audience-icon-green">
                <Shield size={20} />
              </div>
              <div className="fvc-audience-role fvc-audience-role-green">For Investors</div>
              <div className="fvc-audience-title">Discover scored, verified deal flow</div>
              <ul className="fvc-audience-list">
                {INVESTOR_BULLETS.map(b => (
                  <li key={b}><Check size={14} className="fvc-check fvc-check-green" />{b}</li>
                ))}
              </ul>
              <Link to="/auth/login" className="fvc-btn-outline fvc-btn-full">
                Explore Deal Flow <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <div className="fvc-stats-strip">
        <div className="fvc-stats-inner">
          {STATS.map(s => (
            <div className="fvc-stat" key={s.label}>
              <div className="fvc-stat-val">{s.value}</div>
              <div className="fvc-stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section className="fvc-section" id="pricing">
        <div className="fvc-section-inner">
          <div className="fvc-section-head">
            <div className="fvc-eyebrow">Pricing</div>
            <h2 className="fvc-h2">Simple, transparent pricing</h2>
            <p className="fvc-section-sub">Free forever for founders. Powerful tools for those who need more.</p>
          </div>
          <div className="fvc-pricing-grid">
            {PRICING.map(p => (
              <div key={p.name} className={`fvc-pricing-card${p.highlight ? ' fvc-pricing-card-hl' : ''}`}>
                {p.highlight && <div className="fvc-pricing-popular">Most popular</div>}
                <div className="fvc-pricing-name">{p.name}</div>
                <div className="fvc-pricing-price">
                  <span className="fvc-pricing-amount">{p.price}</span>
                  <span className="fvc-pricing-sub">{p.sub}</span>
                </div>
                <div className="fvc-pricing-desc">{p.desc}</div>
                <ul className="fvc-pricing-features">
                  {p.features.map(f => (
                    <li key={f}><Check size={14} className="fvc-check" />{f}</li>
                  ))}
                </ul>
                <Link
                  to="/auth/signup"
                  className={p.ctaStyle === 'accent' ? 'fvc-btn-primary fvc-btn-full' : 'fvc-btn-outline fvc-btn-full'}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="fvc-section" id="faq">
        <div className="fvc-section-inner">
          <div className="fvc-section-head">
            <div className="fvc-eyebrow">FAQ</div>
            <h2 className="fvc-h2">Common questions</h2>
          </div>
          <div className="fvc-faq-list">
            {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="fvc-final-cta">
        <div className="fvc-final-inner">
          <h2 className="fvc-h2">Built for Founders.<br />Engineered for Investors.</h2>
          <p className="fvc-final-sub">
            Join 2,400+ founders who already know how investors see them.
            Free forever for founders.
          </p>
          <div className="fvc-final-btns">
            <Link to="/auth/signup" className="fvc-btn-primary">
              Start fundraising — it's free
            </Link>
            <Link to="/auth/login" className="fvc-btn-ghost">
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="fvc-footer">
        <div className="fvc-footer-inner">
          <div className="fvc-footer-brand">
            <div className="fvc-logo fvc-footer-logo">
              <span className="fvc-logo-mark">◆</span>InvestScore
            </div>
            <div className="fvc-footer-tagline">Built for Founders. Engineered for Investors.</div>
            <div className="fvc-footer-copy">© 2026 InvestScore Inc. — DE C-Corp</div>
          </div>
          <div className="fvc-footer-cols">
            <div className="fvc-footer-col">
              <div className="fvc-footer-col-h">Product</div>
              <a href="#features"    className="fvc-footer-link">Features</a>
              <a href="#pricing"     className="fvc-footer-link">Pricing</a>
              <a href="#audience"    className="fvc-footer-link">For founders</a>
              <a href="#audience"    className="fvc-footer-link">For investors</a>
            </div>
            <div className="fvc-footer-col">
              <div className="fvc-footer-col-h">Company</div>
              <a href="#faq"         className="fvc-footer-link">About</a>
              <a href="#faq"         className="fvc-footer-link">Blog</a>
              <a href="#faq"         className="fvc-footer-link">Careers</a>
              <a href="#faq"         className="fvc-footer-link">Contact</a>
            </div>
            <div className="fvc-footer-col">
              <div className="fvc-footer-col-h">Legal</div>
              <a href="#faq"         className="fvc-footer-link">Terms</a>
              <a href="#faq"         className="fvc-footer-link">Privacy</a>
              <a href="#faq"         className="fvc-footer-link">Security</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
