import { useState, useEffect, useRef } from "react";
import "../css/index.css";


/* ── Hooks ─────────────────────────────────────────────────── */

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useTypewriter(phrases, speed = 80, pause = 2200) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = phrases[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDeleting(false);
          setIdx((idx + 1) % phrases.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, phrases, speed, pause]);
  return text;
}

/* ── Toast Notification ─────────────────────────────────────── */
const TOASTS = [
  { logo: "PF", name: "Pfizer", msg: "just onboarded 2,400 employees" },
  { logo: "GS", name: "Goldman Sachs", msg: "renewed for 3 more years" },
  { logo: "AC", name: "Accenture", msg: "deployed to 14 new departments" },
  { logo: "SI", name: "Siemens", msg: "reached 340% productivity gain" },
  { logo: "BO", name: "Bosch", msg: "completed setup in 6 days" },
  { logo: "DL", name: "Deloitte", msg: "activated 5,000+ team members" },
];

function ToastNotification() {
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState(TOASTS[0]);
  const [entering, setEntering] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    const show = () => {
      idxRef.current = (idxRef.current + 1) % TOASTS.length;
      setToast(TOASTS[idxRef.current]);
      setEntering(true);
      setVisible(true);
      setTimeout(() => setEntering(false), 50);
      setTimeout(() => setVisible(false), 5000);
    };
    const t1 = setTimeout(show, 3000);
    const interval = setInterval(show, 9000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  if (!visible) return null;
  return (
    <div className={`z13-toast ${entering ? "z13-toast--entering" : "z13-toast--visible"}`}>
      <div className="z13-toast-avatar">{toast.logo}</div>
      <div>
        <p className="z13-toast-name">{toast.name}</p>
        <p className="z13-toast-msg">{toast.msg}</p>
      </div>
      <button className="z13-toast-close" onClick={() => setVisible(false)}>×</button>
    </div>
  );
}

/* ── Animated Counter ───────────────────────────────────────── */
function Counter({ value, suffix = "", prefix = "" }) {
  const [ref, inView] = useInView(0.3);
  const count = useCountUp(value, 1800, inView);
  return <span ref={ref}>{prefix}{inView ? count.toLocaleString() : 0}{suffix}</span>;
}

/* ── Scroll Reveal ──────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={`z13-reveal ${inView ? "z13-reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────────── */
function Header({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`z13-header ${scrolled ? "z13-header--scrolled" : ""}`}>
      <div className="z13-header-inner">
        <a href="/" className="z13-logo">
          <div className="z13-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <span className="z13-logo-text">Zira</span>
        </a>

        <nav className={`z13-nav ${menuOpen ? "z13-nav--open" : ""}`}>
          <a href="#features" className="z13-nav-link">Platform</a>
          <a href="#solutions" className="z13-nav-link">Solutions</a>
          <a href="#enterprise" className="z13-nav-link">Enterprise</a>
          <a href="#developers" className="z13-nav-link">Developers</a>
          <a href="#pricing" className="z13-nav-link">Pricing</a>
        </nav>

        <div className="z13-header-right">
          <button className="z13-theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <a href="/signup" className="z13-header-cta">Start for free</a>
          <button className="z13-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── Main Page ──────────────────────────────────────────────── */
export default function ZiraIndex() {
  const [darkMode, setDarkMode] = useState(true);
  const [annualBilling, setAnnualBilling] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const headline = useTypewriter([
    "Stop managing AI.",
    "Stop losing control.",
    "Stop flying blind.",
    "Start owning it.",
  ], 75, 2000);

  return (
    <div className="z13-page">
      <div className="z13-glow z13-glow--top" />
      <div className="z13-glow z13-glow--bottom" />

      <ToastNotification />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="z13-hero">
        <div className="z13-hero-inner">
          <div className="z13-hero-left">
            <Reveal>
              <div className="z13-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                </svg>
                Trusted by 12,000+ global organizations
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="z13-headline">
                <span className="z13-typewriter">{headline}<span className="z13-cursor">|</span></span>
                <span className="z13-headline-orange"> Start owning it.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="z13-subtext">
                Zira Software is the only AI platform that puts your organization in total
                control — custom models, private data, full transparency.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="z13-hero-cta">
                <a href="/signup" className="z13-btn-primary z13-btn-primary--pulse">
                  Create your organization
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a href="/demo" className="z13-btn-ghost">Watch demo ▶</a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <ul className="z13-checklist">
                {[
                  "Deploy AI in under 5 minutes — zero ML expertise needed",
                  "Private by default — your data never trains anyone else's model",
                  "Enterprise SLA: 99.99% uptime with dedicated support",
                ].map(p => (
                  <li key={p}>
                    <svg className="z13-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={100} className="z13-hero-right-wrap">
            <div className="z13-hero-right">
              <div className="z13-dashboard z13-dashboard--glow">
                <div className="z13-dashboard-header">
                  <span className="z13-dashboard-title">Organization AI Health</span>
                  <span className="z13-live-badge">
                    <span className="z13-live-dot" />Live
                  </span>
                </div>
                <div className="z13-bars">
                  {[
                    { label: "Response Accuracy", val: 97 },
                    { label: "Model Confidence", val: 94 },
                    { label: "Data Coverage", val: 88 },
                    { label: "System Reliability", val: 99 },
                  ].map(({ label, val }) => (
                    <div key={label} className="z13-bar-row">
                      <div className="z13-bar-meta">
                        <span className="z13-bar-label">{label}</span>
                        <span className="z13-bar-val">{val}%</span>
                      </div>
                      <div className="z13-bar-track">
                        <div className="z13-bar-fill z13-bar-fill--animate" style={{ "--bar-w": `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="z13-stat-cards">
                {[
                  { icon: <ShieldIcon />, num: "SOC2", sub: "Type II Certified" },
                  { icon: <TrendIcon />, num: "340%", sub: "Avg productivity gain" },
                  { icon: <ClockIcon />, num: "<1ms", sub: "Inference latency" },
                  { icon: <UsersIcon />, num: "12K+", sub: "Organizations" },
                ].map(({ icon, num, sub }) => (
                  <div key={num} className="z13-stat-card">
                    <div className="z13-stat-icon">{icon}</div>
                    <div className="z13-stat-num">{num}</div>
                    <div className="z13-stat-sub">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* this part any mobile and laptop this part now css problem */}

      {/* ── ANIMATED STATS STRIP ──────────────────────────── */}
      <section className="z13-statsstrip">
        <div className="z13-statsstrip-inner">
          {[
            { num: 12000, suffix: "+", label: "Organizations worldwide" },
            { num: 99, suffix: ".99%", label: "Uptime SLA guaranteed" },
            { num: 340, suffix: "%", label: "Average productivity gain" },
            { num: 7, suffix: " days", label: "Average onboarding time" },
            { num: 12, suffix: "", label: "Global edge locations" },
          ].map(({ num, suffix, label }, i) => (
            <div key={label} className="z13-statsstrip-item">
              {i > 0 && <div className="z13-statsstrip-divider" />}
              <div className="z13-statsstrip-num">
                <Counter value={num} suffix={suffix} />
              </div>
              <div className="z13-statsstrip-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE LOGOS ─────────────────────────────────── */}
      <section className="z13-marquee-section">
        <p className="z13-trusted-label">Trusted by teams at the world's leading organizations</p>
        <div className="z13-marquee">
          <div className="z13-marquee-track">
            {[...Array(2)].map((_, si) => (
              <div key={si} className="z13-marquee-set">
                {["Accenture","Goldman Sachs","Siemens","Pfizer","Bosch","Deloitte","HSBC","Nestlé","McKinsey","Airbus","SAP","Unilever"].map(n => (
                  <div key={n} className="z13-marquee-logo">{n}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="z13-section" id="features">
        <div className="z13-section-inner">
          <Reveal>
            <div className="z13-section-header">
              <div className="z13-section-tag">Platform</div>
              <h2 className="z13-section-title">Total AI ownership — out of the box</h2>
              <p className="z13-section-sub">
                Every feature is built for organizations that refuse to compromise on control, security, or performance.
              </p>
            </div>
          </Reveal>
          <div className="z13-features-grid">
            {[
              { icon: <ShieldIcon />, title: "Private by Default", desc: "Your data stays yours. Models trained on your data never cross organizational boundaries. Full data residency control included.", tags: ["Zero data leakage","Regional hosting","GDPR compliant"] },
              { icon: <EyeIcon />, title: "Full Observability", desc: "See every AI decision with complete audit trails. Know exactly why your AI said what it said, every single time.", tags: ["Audit trails","Decision logs","Real-time monitoring"] },
              { icon: <BoltIcon />, title: "Blazing Fast", desc: "Sub-millisecond inference on 12 global edge locations. No cold starts. No queues. Just instant AI, everywhere.", tags: ["<1ms latency","12 edge nodes","Zero cold starts"] },
              { icon: <GridIcon />, title: "Modular Architecture", desc: "Start with one team, scale to the entire enterprise. Every module is independent and connects seamlessly.", tags: ["Team-level deploy","Unlimited scale","No re-platforming"] },
              { icon: <TrendIcon />, title: "Live Analytics", desc: "Real-time dashboards showing AI performance, usage, accuracy, and ROI across every team and department.", tags: ["Live dashboards","ROI tracking","Department-level"] },
              { icon: <HeadsetIcon />, title: "Dedicated Success Team", desc: "Your assigned AI success manager gets you to full deployment in under 7 days. No guessing, no documentation rabbit holes.", tags: ["7-day deployment","24/7 support","Assigned manager"] },
            ].map(({ icon, title, desc, tags }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="z13-feature-card">
                  <div className="z13-feature-icon">{icon}</div>
                  <h3 className="z13-feature-title">{title}</h3>
                  <p className="z13-feature-desc">{desc}</p>
                  <div className="z13-feature-tags">
                    {tags.map(t => <span key={t} className="z13-tag">{t}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────── */}
      <section className="z13-section z13-section--alt" id="solutions">
        <div className="z13-section-inner">
          <Reveal>
            <div className="z13-section-header">
              <div className="z13-section-tag">Why Zira</div>
              <h2 className="z13-section-title">Zira vs. the competition</h2>
              <p className="z13-section-sub">Every other AI platform makes you choose between power and control. Zira gives you both.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="z13-compare-table">
              <div className="z13-compare-header">
                <div className="z13-compare-feature-col">Feature</div>
                <div className="z13-compare-col z13-compare-col--zira">Zira Software</div>
                <div className="z13-compare-col">Other AI Platforms</div>
                <div className="z13-compare-col">Build It Yourself</div>
              </div>
              {[
                { feature: "Private data — zero leakage",   zira: true,  others: false, diy: true  },
                { feature: "Full AI decision audit trails",  zira: true,  others: false, diy: false },
                { feature: "Deploy in under 7 days",         zira: true,  others: false, diy: false },
                { feature: "Sub-millisecond inference",      zira: true,  others: true,  diy: false },
                { feature: "Dedicated success manager",      zira: true,  others: false, diy: false },
                { feature: "SOC 2 Type II certified",        zira: true,  others: true,  diy: false },
                { feature: "Per-team AI customization",      zira: true,  others: false, diy: true  },
                { feature: "Transparent pricing",            zira: true,  others: false, diy: true  },
              ].map(({ feature, zira, others, diy }) => (
                <div key={feature} className="z13-compare-row">
                  <div className="z13-compare-feature-col">{feature}</div>
                  <div className="z13-compare-col z13-compare-col--zira">
                    {zira ? <span className="z13-check-icon">✓</span> : <span className="z13-cross-icon">✗</span>}
                  </div>
                  <div className="z13-compare-col">
                    {others ? <span className="z13-check-icon z13-check-icon--neutral">✓</span> : <span className="z13-cross-icon">✗</span>}
                  </div>
                  <div className="z13-compare-col">
                    {diy ? <span className="z13-check-icon z13-check-icon--neutral">✓</span> : <span className="z13-cross-icon">✗</span>}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="z13-section" id="enterprise">
        <div className="z13-section-inner">
          <Reveal>
            <div className="z13-section-header">
              <div className="z13-section-tag">How It Works</div>
              <h2 className="z13-section-title">From signup to full deployment in 7 days</h2>
              <p className="z13-section-sub">Our structured onboarding gets every team running on Zira faster than any other enterprise AI platform.</p>
            </div>
          </Reveal>
          <div className="z13-steps">
            {[
              { n: "01", title: "Create your organization", desc: "Sign up and invite your team. No engineering needed. Choose your data region and privacy settings upfront." },
              { n: "02", title: "Connect your data sources", desc: "One-click connectors for Salesforce, Slack, Google Drive, SAP, and 200+ more. Zira learns from your real data instantly." },
              { n: "03", title: "Configure team AI workflows", desc: "Each department gets a custom AI co-pilot tailored to their exact function — sales, legal, HR, engineering, and more." },
              { n: "04", title: "Measure and scale", desc: "Live dashboards show ROI, accuracy, and adoption across every team. Scale to new departments in one click." },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 80} className="z13-step">
                <div className="z13-step-num">{step.n}</div>
                <div className="z13-step-body">
                  <h3 className="z13-step-title">{step.title}</h3>
                  <p className="z13-step-desc">{step.desc}</p>
                </div>
                {i < 3 && <div className="z13-step-arrow">→</div>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="z13-section z13-section--alt">
        <div className="z13-section-inner">
          <Reveal>
            <div className="z13-section-header">
              <div className="z13-section-tag">Customer Stories</div>
              <h2 className="z13-section-title">What enterprise leaders say</h2>
            </div>
          </Reveal>
          <div className="z13-testimonials">
            {[
              { initials: "JM", name: "James Mitchell", role: "Chief Digital Officer · Siemens AG", quote: '"Zira gave us total visibility into every AI decision across 4,000 employees. The transparency alone was worth the switch. The productivity gains are extraordinary."' },
              { initials: "AL", name: "Aisha Laurent", role: "VP of Strategy · Goldman Sachs", quote: '"We spent months evaluating alternatives. Zira wasn\'t even a close call — it\'s the only platform that treats enterprise security as a first principle, not an afterthought."' },
              { initials: "RK", name: "Raj Krishnamurthy", role: "CTO · Bosch Global", quote: '"Deployed across 12 departments in 9 days. The onboarding team was exceptional. Our employees went from skeptical to dependent on Zira within the first week."' },
            ].map(({ initials, name, role, quote }, i) => (
              <Reveal key={name} delay={i * 80}>
                <div className="z13-testimonial">
                  <div className="z13-testimonial-stars">★★★★★</div>
                  <p className="z13-testimonial-text">{quote}</p>
                  <div className="z13-testimonial-author">
                    <div className="z13-author-avatar">{initials}</div>
                    <div>
                      <p className="z13-author-name">{name}</p>
                      <p className="z13-author-role">{role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section className="z13-section" id="pricing">
        <div className="z13-section-inner">
          <Reveal>
            <div className="z13-section-header">
              <div className="z13-section-tag">Pricing</div>
              <h2 className="z13-section-title">Start free, scale when you're ready</h2>
              <p className="z13-section-sub">No hidden fees. No usage traps. Just straightforward pricing for every stage of growth.</p>
              {/* Billing Toggle */}
              <div className="z13-billing-toggle">
                <span className={`z13-billing-opt ${!annualBilling ? "z13-billing-opt--active" : ""}`}>Monthly</span>
                <button
                  className={`z13-toggle-track ${annualBilling ? "z13-toggle-track--on" : ""}`}
                  onClick={() => setAnnualBilling(!annualBilling)}
                  aria-label="Toggle annual billing"
                >
                  <div className="z13-toggle-thumb" />
                </button>
                <span className={`z13-billing-opt ${annualBilling ? "z13-billing-opt--active" : ""}`}>
                  Annual <span className="z13-billing-save">Save 20%</span>
                </span>
              </div>
            </div>
          </Reveal>
          <div className="z13-plans">
            {[
              {
                name: "Starter", monthly: 0, annual: 0, period: "forever",
                features: ["Up to 5 team members","3 AI workflows","Basic observability","Community support"],
                featured: false, cta: "Get started free", href: "/signup"
              },
              {
                name: "Growth", monthly: 299, annual: 239, period: "per org / month",
                badge: "Most Popular",
                features: ["Unlimited team members","Unlimited AI workflows","Full observability suite","Priority 24/7 support","Custom integrations","SSO & SAML","Advanced audit logs"],
                featured: true, cta: "Start free trial", href: "/signup"
              },
              {
                name: "Enterprise", monthly: null, annual: null, period: "contact us",
                features: ["Everything in Growth","On-premise deployment","Dedicated success manager","Custom SLA","White-glove onboarding","Compliance packages","Custom contracts"],
                featured: false, cta: "Talk to sales", href: "/contact"
              },
            ].map(({ name, monthly, annual, period, badge, features, featured, cta, href }, i) => {
              const price = name === "Enterprise" ? "Custom" : name === "Starter" ? "Free" : annualBilling ? `$${annual}` : `$${monthly}`;
              return (
                <Reveal key={name} delay={i * 80}>
                  <div className={`z13-plan ${featured ? "z13-plan--featured" : ""}`}>
                    {badge && <div className="z13-plan-badge">{badge}</div>}
                    <div className="z13-plan-name">{name}</div>
                    <div className="z13-plan-price">{price}{name === "Growth" ? <span>/mo</span> : ""}</div>
                    <div className="z13-plan-period">{annualBilling && name === "Growth" ? "billed annually" : period}</div>
                    {annualBilling && name === "Growth" && (
                      <div className="z13-plan-savings">You save $720/year</div>
                    )}
                    <ul className="z13-plan-features">
                      {features.map(f => <li key={f}>{f}</li>)}
                    </ul>
                    <a href={href} className={`z13-btn-plan ${featured ? "z13-btn-plan--primary" : "z13-btn-plan--outline"}`}>{cta}</a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section className="z13-final-cta">
        <Reveal>
          <div className="z13-final-cta-inner">
            <div className="z13-final-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
              </svg>
              Join 12,000+ organizations already running on Zira
            </div>
            <h2 className="z13-final-title">
              Stop managing AI.<br/>
              <span className="z13-final-orange">Start owning it — today.</span>
            </h2>
            <p className="z13-final-sub">No credit card required. Set up in 5 minutes. Cancel anytime.</p>
            <div className="z13-final-btns">
              <a href="/signup" className="z13-btn-primary z13-btn-primary--lg">
                Create your organization free
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="/demo" className="z13-btn-outline-lg">Schedule a demo</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="z13-footer">
        <div className="z13-footer-inner">
          <div className="z13-footer-brand">
            <div className="z13-logo">
              <div className="z13-logo-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span className="z13-logo-text">Zira</span>
            </div>
            <p className="z13-footer-tagline">The enterprise AI platform built for total ownership.</p>
            <p className="z13-footer-copy">© 2025 Zira Software Inc. All rights reserved.</p>
          </div>
          <div className="z13-footer-cols">
            {[
              { title: "Product", links: ["Platform","API","Integrations","Security","Changelog"] },
              { title: "Solutions", links: ["For Enterprise","For Scale-ups","For Developers","By Industry"] },
              { title: "Company", links: ["About","Blog","Careers","Press","Partners"] },
              { title: "Legal", links: ["Privacy Policy","Terms of Service","Security","Compliance"] },
            ].map(col => (
              <div key={col.title} className="z13-footer-col">
                <p className="z13-footer-col-title">{col.title}</p>
                {col.links.map(l => <a key={l} href="#">{l}</a>)}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── SVG Icons ──────────────────────────────────────────────── */
const ShieldIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const EyeIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const BoltIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const GridIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const TrendIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const HeadsetIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
const ClockIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const UsersIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
