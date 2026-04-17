import { useState, useEffect, useRef } from "react";
import "../css/organization.css";
import { useNavigate, useParams } from "react-router-dom";
import apiurl from "../../utils/apiurl";
import AlertBanner from "./AlertMessage/AlertBanner";
import axios from "axios";

export default function Organization({ user, onCreate }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [orgName, setOrgName] = useState("");
  const [orgUrl, setOrgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const [errorAlert, setErrorAlert] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [memberCount] = useState(12);
  const [pendingCount] = useState(0);

  const alertRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (apiurl.token) {
      fetchUsername();
    }
  }, [id, apiurl.token]);

  const fetchUsername = async () => {
    const token = localStorage.getItem("AUTH-X");
    try {
      const res = await fetch(apiurl.user_fetch_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth": token,
        },
        credentials: "include",
      });

      if (res.status === 401) {
        localStorage.removeItem("AUTH-X");
        navigate("/signup");
        return;
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  useEffect(() => {
    if (errorAlert && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [errorAlert]);

  // ── API 2: create/update organisation (UNCHANGED) ────────────────────────
  const handleSave = async () => {
    const token = localStorage.getItem("AUTH-X");
    if (!orgName.trim()) return;
    setErrorAlert(null); // clear previous alert before each attempt
    setLoading(true);
    try {
      const post_data_organization = await axios.post(
        apiurl.crete_oganization,
        {},
        {
          headers: {
            name: orgName,
            slug: orgUrl,
            description: description,
            "x-auth-token": token,
          },
        },
      );

      if (post_data_organization.status === 201) {
        setLoading(false);
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
          navigate("/create-todo");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      const status = error?.response?.status;
      if (status === 401) {
        setErrorAlert({
          type: "info",
          code: "401 unauthorized",
          title: "Invalid or expired token",
          desc: "Please log out and sign in again to continue.",
        });
      } else if (status === 404) {
        setErrorAlert({
          type: "danger",
          code: "404 not found",
          title: "User not found",
          desc: "Your session may have expired. Please sign in again.",
        });
      } else if (status === 403) {
        setErrorAlert({
          type: "danger",
          code: "403 forbidden",
          title: "Organization limit reached",
          desc: "You've reached the maximum of 20 organizations. Remove one to continue.",
        });
      } else if (status === 429) {
        setErrorAlert({
          type: "warning",
          code: "429 rate limited",
          title: "Daily limit reached",
          desc: "You can only create 2 organizations per day. Try again tomorrow.",
        });
      } else {
        setErrorAlert({
          type: "danger",
          code: "500 error",
          title: "Something went wrong",
          desc: "Please try again in a moment.",
        });
      }
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) return;

    const token_Auth = localStorage.getItem("AUTH-X");

    // ✅ Safety check
    if (!token_Auth) {
      navigate("/signup");
      return;
    }

    try {
      setInviteLoading(true);

      const res = await fetch(apiurl.send_invite_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ fixed
          Authorization: `Bearer ${token_Auth}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
        }),
      });

      // ✅ HANDLE RESPONSES PROPERLY

      if (res.status === 200) {
        setInviteSent(true);
        setInviteEmail("");
        setTimeout(() => setInviteSent(false), 3000);
      } else if (res.status === 400) {
        localStorage.removeItem("AUTH-X");
        navigate("/signup");
      } else if (res.status === 401) {
        setErrorAlert({
          type: "info",
          code: "401",
          title: "Create Organization",
          desc: "Please create your organization first",
        });
      } else if (res.status === 500) {
        setErrorAlert({
          type: "danger",
          code: "500",
          title: "Server Error",
          desc: "Something went wrong. Try again later.",
        });
      }
    } catch (err) {
      console.error("Invite Error:", err);

      setErrorAlert({
        type: "danger",
        code: "NETWORK",
        title: "Network Error",
        desc: "Check your internet connection",
      });
    } finally {
      setInviteLoading(false); // ✅ always stop loader
    }
  };

  return (
    <div className="os-root">
      {/* ── Topbar ── */}
      <div className="os-topbar">
        <div className="os-topbar-left">
          <div className="os-topbar-icon">
            <svg
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
            <h1 className="os-topbar-title">Organization Settings</h1>
            <p className="os-topbar-sub">Configure your workspace</p>
          </div>
        </div>
        {saved && (
          <div className="os-saved-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            All changes saved
          </div>
        )}
      </div>

      <div className="os-body">
        {/* ── Sidebar ── */}
        <aside className="os-sidebar">
          <nav className="os-nav">
            <button
              className={`os-nav-item ${activeTab === "profile" ? "os-nav-active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              Profile
            </button>
            <button
              className={`os-nav-item ${activeTab === "team" ? "os-nav-active" : ""}`}
              onClick={() => setActiveTab("team")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Team
            </button>
          </nav>

          <div className="os-team-card">
            <div className="os-team-card-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="os-team-card-title">Team Management</h3>
            <p className="os-team-card-desc">
              Invite team members via email. They'll receive an invitation to
              join your organization.
            </p>
            <div className="os-team-stats">
              <div className="os-stat">
                <span className="os-stat-num">{memberCount}</span>
                <span className="os-stat-label">MEMBERS</span>
              </div>
              <div className="os-stat-divider" />
              <div className="os-stat">
                <span className="os-stat-num">{pendingCount}</span>
                <span className="os-stat-label">PENDING</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="os-main">
          {/* Organization Profile section */}
          <section className="os-section">
            <div className="os-section-header">
              <div className="os-section-icon">
                <svg
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
                </svg>
              </div>
              <div>
                <h2 className="os-section-title">Organization Profile</h2>
                <p className="os-section-sub">
                  Your organization's public information
                </p>
              </div>
            </div>

            <div className="os-fields">
              <div className="os-field-group">
                <label className="os-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="16" height="20" x="4" y="2" rx="2" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                    <path d="M12 6h.01" />
                  </svg>
                  Organization Name
                </label>
                <input
                  className="os-input"
                  type="text"
                  placeholder="Enter your organization name"
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>

              <div className="os-field-group">
                <label className="os-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Organization URL
                </label>
                <div className="os-url-wrap">
                  <span className="os-url-prefix">https://</span>
                  <input
                    className="os-input os-url-input"
                    type="text"
                    placeholder="yourcompany.com"
                    value={orgUrl}
                    onChange={(e) => setOrgUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="os-field-group">
                <label className="os-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                  Description
                </label>
                <textarea
                  className="os-textarea"
                  rows={5}
                  placeholder="Tell us about your organization..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="os-hint">
                  Brief description of your organization (optional)
                </p>
              </div>
            </div>

            {/* ── Alert banner — ref for auto-scroll ── */}
            <div ref={alertRef}>
              {errorAlert && (
                <div style={{ marginTop: "16px" }}>
                  <AlertBanner
                    type={errorAlert.type}
                    code={errorAlert.code}
                    title={errorAlert.title}
                    desc={errorAlert.desc}
                    onClose={() => setErrorAlert(null)}
                  />
                </div>
              )}
            </div>

            <div className="os-section-footer">
              <button className="os-btn-cancel" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button
                className={`os-btn-save ${loading ? "os-btn-loading" : ""} ${saved ? "os-btn-saved" : ""}`}
                disabled={!orgName.trim() || loading}
                onClick={handleSave}
              >
                {saved ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Saved!
                  </>
                ) : loading ? (
                  <>
                    <span className="os-spinner" />
                    Saving…
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </section>

          {/* ── Invite Team Members ── */}
          <section className="os-section os-invite-section">
            <div className="os-section-header">
              <div className="os-section-icon os-section-icon-blue">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <h2 className="os-section-title">Invite Team Members</h2>
                <p className="os-section-sub">
                  Send invitations to join your workspace
                </p>
              </div>
            </div>

            <div className="os-invite-row">
              <div className="os-invite-input-wrap">
                <svg
                  className="os-invite-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  className="os-invite-input"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
                />
              </div>
              <button
                className={`os-btn-invite ${inviteLoading ? "os-btn-loading" : ""} ${inviteSent ? "os-btn-sent" : ""}`}
                disabled={!inviteEmail.trim() || inviteLoading}
                onClick={handleSendInvite}
              >
                {inviteSent ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Sent!
                  </>
                ) : inviteLoading ? (
                  <>
                    <span className="os-spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    Send Invite
                  </>
                )}
              </button>
            </div>

            <div className="os-invite-tip">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Invited members will receive an email with a link to join your
              organization.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
