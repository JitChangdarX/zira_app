import { useState, useEffect } from "react";
import "../css/organization.css";
import { useNavigate, useParams } from "react-router-dom";
import { OrgCreatedAlert } from "./OrgCreatedAlert";
import apiurl from "../../utils/apiurl";
import AlertBanner from "./AlertMessage/AlertBanner";
import axios from "axios";

export function Organization({ user, onCreate }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [description, setDescription] = useState("");
  const [focused, setFocused] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchusername();
  }, [id]);

  const fetchusername = async () => {
    const token = localStorage.getItem("AUTH-X");

    if (!token) {
      navigate("/signup");
      return;
    }

    try {
      const res = await fetch(apiurl.user_fetch_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("AUTH-X");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        console.error("API error:", res.status);
        return;
      }
      const data = await res.json();
      setName(data.verify_name);
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleNameChange = (val) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      const get_x_auth_acess_token = localStorage.getItem("AUTH-X");

      const post_data_organization = await axios.post(
        apiurl.crete_oganization,
        {},
        {
          headers: {
            name: name,
            slug: slug,
            description: description,
            "x-auth-token": get_x_auth_acess_token,
          },
        },
      );
      console.log(post_data_organization.status);
      if (post_data_organization.status === 201) {
        setLoading(false);
        setDone(true);
        setShowAlert(true);

        setTimeout(() => {
          navigate("/create-todo");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.log("response:", error.response);
      console.log("status:", error.response?.status);
      console.log("data:", error.response?.data);
      const status = error?.response?.status;
      if (status === 401) {
        setAlert({
          type: "info",
          code: "401 unauthorized",
          title: "Invalid or expired token",
          desc: "Please log out and sign in again to continue.",
        });
      } else if (status === 404) {
        setAlert({
          type: "danger",
          code: "404 not found",
          title: "User not found",
          desc: "Your session may have expired. Please sign in again.",
        });
      } else if (status === 403) {
        setAlert({
          type: "danger",
          code: "403 forbidden",
          title: "Organization limit reached",
          desc: "You've reached the maximum of 20 organizations. Remove one to continue.",
        });
      } else if (status === 429) {
        setAlert({
          type: "warning",
          code: "429 rate limited",
          title: "Daily limit reached",
          desc: "You can only create 2 organizations per day. Try again tomorrow.",
        });
      } else {
        setAlert({
          type: "danger",
          code: "500 error",
          title: "Something went wrong",
          desc: "Please try again in a moment.",
        });
      }
    }
  };

  return (
    <div className="co-page">
      {/* Animated background blobs */}
      <div className="co-bg">
        <div className="co-blob co-blob-1" />
        <div className="co-blob co-blob-2" />
        <div className="co-blob co-blob-3" />
        <div className="co-grid" />
      </div>

      {/* Card */}
      <div className="co-card">
        {/* Top brand bar */}
        <div className="co-brand">
          <div className="co-brand-icon">Z</div>
          <span className="co-brand-name">Zira</span>
        </div>

        {/* Header */}
        <div className="co-header">
          <div className="co-icon-wrap">
            <svg
              className="co-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="16" height="20" x="4" y="2" rx="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" />
              <path d="M16 6h.01" />
              <path d="M12 6h.01" />
              <path d="M12 10h.01" />
              <path d="M8 10h.01" />
              <path d="M16 10h.01" />
            </svg>
          </div>
          <div>
            <h1 className="co-title">Create your Organization</h1>
            <p className="co-subtitle">
              {user?.name ? (
                <>
                  Welcome, <strong>{user.name}</strong> — set up your workspace
                  below.
                </>
              ) : (
                "Set up your team workspace on Zira."
              )}
            </p>
          </div>
        </div>

        <div className="co-divider" />

        {/* Fields */}
        <div className="co-fields">
          {/* Owner name — read only, from signup */}
          {user?.name && (
            <div className="co-field">
              <label className="co-label">Owner</label>
              <div className="co-readonly">
                <div className="co-readonly-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="co-readonly-text">{user.name}</span>
                <span className="co-readonly-badge">You</span>
              </div>
            </div>
          )}

          {/* Org Name */}
          <div
            className={`co-field ${focused === "name" ? "co-field-active" : ""}`}
          >
            <label className="co-label">Organization Name</label>
            <input
              className="co-input"
              type="text"
              placeholder="e.g. Acme Corporation"
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused("")}
            />
          </div>

          {/* Workspace URL */}
          <div
            className={`co-field ${focused === "slug" ? "co-field-active" : ""}`}
          >
            <label className="co-label">Workspace URL</label>
            <div className="co-url-wrap">
              <span className="co-url-prefix">zira.app/</span>
              <input
                className="co-input co-url-input"
                type="text"
                placeholder="your-org"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onFocus={() => setFocused("slug")}
                onBlur={() => setFocused("")}
              />
            </div>
            {slug && (
              <p className="co-url-hint">
                Your workspace: <strong>zira.app/{slug}</strong>
              </p>
            )}
          </div>

          {/* Description */}
          <div
            className={`co-field ${focused === "desc" ? "co-field-active" : ""}`}
          >
            <label className="co-label">
              Description
              <span className="co-optional"> — optional</span>
            </label>
            <textarea
              className="co-textarea"
              rows={3}
              placeholder="What does your organization do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocused("desc")}
              onBlur={() => setFocused("")}
            />
          </div>
        </div>

        {alert && (
          <AlertBanner
            type={alert.type}
            code={alert.code}
            title={alert.title}
            desc={alert.desc}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Footer */}
        <div className="co-footer">
          <button
            className={`co-btn-create
              ${!name.trim() ? "co-btn-off" : ""}
              ${done ? "co-btn-done" : ""}
            `}
            disabled={!name.trim() || loading}
            onClick={handleSubmit}
          >
            {done ? (
              <>
                <svg
                  className="co-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Organization Created!
              </>
            ) : loading ? (
              <>
                <span className="co-spinner" />
                Creating…
              </>
            ) : (
              <>
                <svg
                  className="co-btn-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Organization
              </>
            )}
          </button>
          <p className="co-footer-note">
            You can change these settings anytime from your dashboard.
          </p>
        </div>
      </div>

      {showAlert && (
        <OrgCreatedAlert
          orgName={name}
          slug={slug}
          onDashboard={() => {
            setShowAlert(false);
            navigate("/dashboard");
          }}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
