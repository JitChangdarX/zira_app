import { useEffect, useRef } from "react";
import "../css/alert.css"; /* adjust path if needed */

export function OrgCreatedAlert({ orgName, slug, onDashboard, onClose }) {
  const cardRef = useRef(null);
  const fillRef = useRef(null);

  /* animate progress bar to 100% after mount */
  useEffect(() => {
    const t = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.width = "100%";
    }, 80);
    return () => clearTimeout(t);
  }, []);

  /* trigger leave animation, then call handler */
  const leave = (cb) => {
    cardRef.current?.classList.add("za-leaving");
    setTimeout(cb, 380);
  };

  return (
    <div className="za-backdrop">
      <div className="za-card" ref={cardRef}>
        {/* decorative blobs */}
        <div className="za-sparkle za-sparkle-1" />
        <div className="za-sparkle za-sparkle-2" />

        {/* bell icon */}
        <div className="za-icon-wrap">
          <div className="za-icon-ring" />
          <div className="za-icon-bell">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5de0b3"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          {/* tick badge */}
          <div className="za-tick-circle">
            <svg viewBox="0 0 13 13" fill="none">
              <polyline
                className="za-tick-path"
                points="2,7 5,10 11,3"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* text */}
        <p className="za-eyebrow">Success</p>
        <h2 className="za-title">
          <span>{orgName || "Your Organization"}</span> is live!
        </h2>
        <p className="za-subtitle">
          Your workspace is ready. Invite your team and start building together.
        </p>

        {/* detail pills */}
        <div className="za-pills">
          <span className="za-pill">
            <span className="za-pill-dot" />
            zira.app/{slug || "your-org"}
          </span>
          <span className="za-pill">
            <span className="za-pill-dot" style={{ background: "#826eff" }} />
            Owner assigned
          </span>
          <span className="za-pill">
            <span className="za-pill-dot" style={{ background: "#ffd166" }} />
            Free plan active
          </span>
        </div>

        <div className="za-sep" />

        {/* progress */}
        <p className="za-progress-label">Setup complete</p>
        <div className="za-progress-track">
          <div className="za-progress-fill" ref={fillRef} />
        </div>

        {/* actions */}
        <div className="za-actions">
          <button
            className="za-btn za-btn-ghost"
            onClick={() => leave(onClose)}
          >
            Close
          </button>
          <button
            className="za-btn za-btn-primary"
            onClick={() => leave(onDashboard)}
          >
            Go to Dashboard
          </button>
        </div>
      </div>

   
    </div>
  );
}
