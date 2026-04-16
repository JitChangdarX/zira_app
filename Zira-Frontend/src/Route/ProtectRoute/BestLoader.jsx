export default function BestLoader() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes arcSpin {
          0%   { transform: rotate(-90deg); }
          100% { transform: rotate(270deg); }
        }

        @keyframes dotOrbit {
          0%   { transform: rotate(-90deg) translateX(54px) rotate(90deg); }
          100% { transform: rotate(270deg) translateX(54px) rotate(-270deg); }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(0.96); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }

        @keyframes textFade {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1; }
        }

        @keyframes barFlow {
          0%   { left: -45%; }
          100% { left: 110%; }
        }

        .arc-track {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.06);
        }

        .arc-spinner {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #6366f1;
          border-right-color: rgba(99,102,241,0.3);
          animation: arcSpin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          filter: drop-shadow(0 0 6px rgba(99,102,241,0.7));
        }

        .orbit-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          margin: -3px 0 0 -3px;
          border-radius: 50%;
          background: #818cf8;
          animation: dotOrbit 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: -0.05s;
        }

        .core-glyph {
          position: absolute;
          inset: 28px;
          border-radius: 50%;
          background: radial-gradient(circle at 38% 38%, rgba(99,102,241,0.18), rgba(99,102,241,0.04));
          display: flex;
          align-items: center;
          justify-content: center;
          animation: breathe 2.8s ease-in-out infinite;
        }

        .loading-label {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          animation: textFade 2.8s ease-in-out infinite;
        }

        .progress-track {
          width: 120px;
          height: 1px;
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }

        .progress-bar {
          position: absolute;
          top: 0;
          width: 45%;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #6366f1, #818cf8, transparent);
          animation: barFlow 1.8s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#09090b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
      }}>

        {/* Spinner ring */}
        <div style={{ position: "relative", width: "120px", height: "120px" }}>
          <div className="arc-track" />
          <div className="arc-spinner" />
          <div className="orbit-dot" />

          {/* Center glyph */}
          <div className="core-glyph">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="1.5" fill="rgba(99,102,241,0.9)" />
              <rect x="13" y="1" width="8" height="8" rx="1.5" fill="rgba(99,102,241,0.4)" />
              <rect x="1" y="13" width="8" height="8" rx="1.5" fill="rgba(99,102,241,0.4)" />
              <rect x="13" y="13" width="8" height="8" rx="1.5" fill="rgba(99,102,241,0.9)" />
            </svg>
          </div>
        </div>

        {/* Label + progress bar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <span className="loading-label">Loading</span>
          <div className="progress-track">
            <div className="progress-bar" />
          </div>
        </div>

      </div>
    </>
  );
}