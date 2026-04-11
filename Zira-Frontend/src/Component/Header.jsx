import { useState, useEffect } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <header className="z13-header">
      <div className="z13-header-inner">

        {/* Logo */}
        <a href="/" className="z13-logo">
          <div className="z13-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12"/>
              <path d="M12 6v6l4 2"/>
              <path d="M2 12c0-1.85.5-3.58 1.38-5.06"/>
            </svg>
          </div>
          <span className="z13-logo-text">Zira</span>
        </a>

        {/* Nav */}
        <nav className={`z13-nav ${menuOpen ? "z13-nav--open" : ""}`}>
          <a href="#features" className="z13-nav-link">Platform</a>
          <a href="#solutions" className="z13-nav-link">Solutions</a>
          <a href="#enterprise" className="z13-nav-link">Enterprise</a>
          <a href="#developers" className="z13-nav-link">Developers</a>
          <a href="#pricing" className="z13-nav-link">Pricing</a>
        </nav>

        {/* Right */}
        <div className="z13-header-right">
          <button
            className="z13-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <a href="/signin" className="z13-signin">Sign in</a>
          <a href="/signup" className="z13-header-cta">Start for free</a>

          <button
            className="z13-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}