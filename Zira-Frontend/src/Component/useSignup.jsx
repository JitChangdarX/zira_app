import { useRef, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import api from "../../utils/apiurl";
import SHA256 from "crypto-js/sha256";
export const useSignup = () => {
  const fullnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [serverError, setServerError] = useState("");
  const [signin, checkSignin] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const showFieldError = (field, msg) => {
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
    setShakeFields((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShakeFields((prev) => ({ ...prev, [field]: false }));
    }, 450);
  };

  const [shakeFields, setShakeFields] = useState({
    name: false,
    email: false,
    password: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");
    setFieldErrors({ name: "", email: "", password: "" });

    const name = fullnameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    let hasError = false;

    if (!name) {
      showFieldError("name", "Please provide your full name");
      hasError = true;
    }

    if (!email) {
      showFieldError("email", "Please provide your email address");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError("email", "Enter a valid email address");
      hasError = true;
    }

    if (!password) {
      showFieldError("password", "Please provide a password");
      hasError = true;
    } else if (password.length < 8) {
      showFieldError("password", "Password must be at least 8 characters");
      hasError = true;
    }

    if (hasError) return;

    try {
      const frontendHash = SHA256(password).toString();
      const res = await fetch(api.signup_api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ user_name: name, email, frontendHash }),
      });

      const data = await res.json();

      if (res.status === 201) {
        const auth_token = data.X_AUTH;
        localStorage.setItem("AUTH-X", auth_token);
        navigate(`/organization/${data._k}`);
      } else {
        const msg =
          data.message ||
          data.error ||
          data.msg ||
          "Something went wrong. Please try again.";

        const lowerMsg = msg.toLowerCase();

        if (lowerMsg.includes("name")) {
          showFieldError("name", msg);
        } else if (lowerMsg.includes("email")) {
          showFieldError("email", msg);
        } else if (lowerMsg.includes("password")) {
          showFieldError("password", msg);
        } else if (
          lowerMsg.includes("user already exists") ||
          lowerMsg.includes("email already")
        ) {
          showFieldError("email", msg); // ✅ FIXED
        } else {
          setServerError(msg);
        }
      }
    } catch {
      setServerError(" Please check your connection and try again.");
    }
  };

  const switchsign = () => {
    checkSignin((prev) => !prev);
  };

  const hanndlesignin = async () => {
    const email = emailRef.current.value.trim();
    const passwordhash = passwordRef.current.value;
    let hasError = false;

    if (!email) {
      showFieldError("email", "Please provide your email address");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError("email", "Enter a valid email address");
      hasError = true;
    }

    if (!passwordhash) {
      showFieldError("password", "Please provide a password");
      hasError = true;
    } else if (password.length < 8) {
      showFieldError("password", "Password must be at least 8 characters");
      hasError = true;
    }

    if (hasError) return;

    const hashedPassword = SHA256(passwordhash).toString();

    const signin = await fetch(api.Signin_api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, hashedPassword }),
    });

    if (signin.status === 200) {
      navigate("/create-todo");
    } else if (signin.status === 401) {
      showFieldError("password", "Incorrect password. Please try again.");
    } else {
      setServerError("No account found with this email. Please sign up first.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  return {
    fullnameRef,
    emailRef,
    passwordRef,
    navigate,
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
  };
};
