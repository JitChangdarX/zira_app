import { useSignup } from "./useSignup";

export const Zirasignupbody = () => {
  const {
    fullnameRef,
    emailRef,
    passwordRef,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    handleSubmit,
    focused,
    setFocused,
    serverError,
    setServerError,
    fieldErrors,
    setFieldErrors,
    shakeFields,
    setShakeFields,
    switchsign,
    signin,
    hanndlesignin,
  } = useSignup();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
    setServerError("");
  };

  const getStrengthWidth = () => {
    const len = formData.password.length;
    if (len === 0) return "0%";
    if (len < 6) return "33%";
    if (len < 10) return "66%";
    return "100%";
  };

  const getStrengthColor = () => {
    const len = formData.password.length;
    if (len === 0) return "transparent";
    if (len < 6) return "#f87171";
    if (len < 10) return "#fbbf24";
    return "#34d399";
  };

  return (
    <div className="zira-card">
      {/* Logo */}
      <div className="zira-logo">
        <div className="logo-mark">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M4 4L28 4L16 16L28 28L4 28L16 16L4 4Z"
              fill="url(#logoGrad)"
            />
            <defs>
              <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="logo-text">Zira</span>
      </div>

      {/* Heading */}
      <div className="zira-heading">
        <>
          <h1>Create your account</h1>
          <p>Start your journey with Zira today.</p>
        </>
      </div>

      {/* Server-level error banner */}
      {serverError && (
        <div className="server-error-banner">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {serverError}
        </div>
      )}

      {/* Form */}
      <form className="zira-form" onSubmit={handleSubmit} autoComplete="off">
        {/* Full Name — signup only */}

        <div
          className={`field-group ${focused === "name" ? "field-active" : ""} ${formData.name ? "field-filled" : ""}`}
        >
          <label htmlFor="name">Full Name</label>
          <div
            className={`field-wrap ${shakeFields.name ? "shake" : ""} ${fieldErrors.name ? "has-error" : ""}`}
          >
            <span className="field-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="name"
              name="name"
              placeholder="Alex Johnson"
              value={formData.name}
              ref={fullnameRef}
              onChange={handleChange}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
            />
          </div>
          {fieldErrors.name && (
            <p className="field-error">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {fieldErrors.name}
            </p>
          )}
          <div className="field-line" />
        </div>

        {/* Email */}
        <div
          className={`field-group ${focused === "email" ? "field-active" : ""} ${formData.email ? "field-filled" : ""}`}
        >
          <label htmlFor="email">Email Address</label>
          <div
            className={`field-wrap ${shakeFields.email ? "shake" : ""} ${fieldErrors.email ? "has-error" : ""}`}
          >
            <span className="field-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              id="email"
              name="email"
              ref={emailRef}
              placeholder="alex@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused("")}
            />
          </div>
          {fieldErrors.email && (
            <p className="field-error">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {fieldErrors.email}
            </p>
          )}
          <div className="field-line" />
        </div>

        {/* Password */}
        <div
          className={`field-group ${focused === "password" ? "field-active" : ""} ${formData.password ? "field-filled" : ""}`}
        >
          <label htmlFor="password">Password</label>
          <div
            className={`field-wrap ${shakeFields.password ? "shake" : ""} ${fieldErrors.password ? "has-error" : ""}`}
          >
            <span className="field-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
            />
            <button
              type="button"
              className="toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="field-error">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {fieldErrors.password}
            </p>
          )}
          <div className="field-line" />
        </div>

        {/* Password strength bar — signup only */}

        <div className="strength-bar">
          <div
            className="strength-fill"
            style={{
              width: getStrengthWidth(),
              background: getStrengthColor(),
            }}
          />
        </div>

        <button type="submit" className="zira-btn">
          <span>Create Account</span>
          <svg
            className="btn-arrow"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </form>

      {/* Divider + Social — signup only */}

      <>
        <div className="zira-divider">
          <span>or continue with</span>
        </div>

        <div className="zira-social">
          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>
      </>

      {/* Toggle between signup and signin */}
      <p className="zira-login">
        <>
          Already have an account? <a onClick={switchsign}>Sign in</a>
        </>
      </p>
    </div>
  );
};
