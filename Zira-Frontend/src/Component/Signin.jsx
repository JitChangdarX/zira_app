import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/zira.css";
import apiurl from "../../utils/apiurl";
import axios from "axios";
import SHA256 from "crypto-js/sha256";
export const Signin = () => {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [shakeFields, setShakeFields] = useState({
    name: false,
    email: false,
    password: false,
  });

  const showFieldError = (field, msg) => {
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
    setShakeFields((prev) => ({ ...prev, [field]: true }));

    setTimeout(() => {
      setShakeFields((prev) => ({ ...prev, [field]: false }));
    }, 400);
  };

  // ✅ validation
  const validate = () => {
    let hasError = false;

    if (!formData.email) {
      showFieldError("email", "Please provide your email address");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showFieldError("email", "Enter a valid email address");
      hasError = true;
    }

    if (!formData.password) {
      showFieldError("password", "Please provide a password");
      hasError = true;
    } else if (formData.password.length < 8) {
      showFieldError("password", "Password must be at least 8 characters");
      hasError = true;
    }

    return hasError;
  };

  const handleSubmitsignin = async (e) => {
    e.preventDefault();

    setServerError("");
    setFieldErrors({ name: "", email: "", password: "" });

    if (validate()) return;

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    setIsLoading(true);

    const frontendHash = SHA256(password).toString();

    try {
      const signup_status = await axios.post(
        apiurl.Signin_api,
        {},
        {
          headers: {
            "x-email": email,
            "x-auth-identity": frontendHash,
          },
          withCredentials: true,
        },
      );

      if (signup_status.status === 200) {
        const token = signup_status.data.X_AUTH;

        localStorage.setItem("AUTH-X", token);

        navigate("/create-todo");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again.";

      const code = err.response?.data?.code;

      if (code === "USER_NOT_FOUND") {
        navigate("/signup");
        return;
      }

      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setServerError("");
  };

  // password strength
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
    <>
      <div className="zira-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="noise-overlay" />

        <div className="zira-card">
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

          <div className="zira-heading">
            <h1>Signin your account</h1>
            <p>Start your journey with Zira today.</p>
          </div>

          {serverError && (
            <div className="server-error-banner">{serverError}</div>
          )}

          <form
            className="zira-form"
            onSubmit={handleSubmitsignin}
            autoComplete="off"
          >
            {/* EMAIL */}
            <div
              className={`field-group ${focused === "email" ? "field-active" : ""} ${formData.email ? "field-filled" : ""}`}
            >
              <label htmlFor="email">Email Address</label>
              <div
                className={`field-wrap ${shakeFields.email ? "shake" : ""} ${fieldErrors.email ? "has-error" : ""}`}
              >
                <input
                  id="email"
                  name="email"
                  placeholder="alex@example.com"
                  ref={emailRef}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                />
              </div>

              {fieldErrors.email && (
                <p className="field-error">{fieldErrors.email}</p>
              )}

              <div className="field-line" />
            </div>

            {/* PASSWORD */}
            <div
              className={`field-group ${focused === "password" ? "field-active" : ""} ${formData.password ? "field-filled" : ""}`}
            >
              <label htmlFor="password">Password</label>
              <div
                className={`field-wrap ${shakeFields.password ? "shake" : ""} ${fieldErrors.password ? "has-error" : ""}`}
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  ref={passwordRef}
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
                  👁
                </button>
              </div>

              {fieldErrors.password && (
                <p className="field-error">{fieldErrors.password}</p>
              )}

              <div className="field-line" />
            </div>

            {/* STRENGTH */}
            <div className="strength-bar">
              <div
                className="strength-fill"
                style={{
                  width: getStrengthWidth(),
                  background: getStrengthColor(),
                }}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className={`zira-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              <span className="btn-text">
                {isLoading ? "Please Wait....." : "Signin"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
