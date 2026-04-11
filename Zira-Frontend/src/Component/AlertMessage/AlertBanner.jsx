const STYLES = {
  success: {
    bg: "#EAF3DE", border: "#639922", tc: "#27500A",
    ic: "#63992233", badgeBg: "#C0DD97", badgeTc: "#173404", icon: "✓"
  },
  danger: {
    bg: "#FCEBEB", border: "#E24B4A", tc: "#791F1F",
    ic: "#E24B4A22", badgeBg: "#F7C1C1", badgeTc: "#791F1F", icon: "✕"
  },
  warning: {
    bg: "#FAEEDA", border: "#EF9F27", tc: "#633806",
    ic: "#EF9F2722", badgeBg: "#FAC775", badgeTc: "#412402", icon: "!"
  },
  info: {
    bg: "#E6F1FB", border: "#378ADD", tc: "#0C447C",
    ic: "#378ADD22", badgeBg: "#B5D4F4", badgeTc: "#042C53", icon: "i"
  },
};

export default function AlertBanner({ type, code, title, desc, onClose }) {
  const s = STYLES[type] || STYLES.info;

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "12px",
      padding: "14px 16px", borderRadius: "12px",
      border: `1px solid ${s.border}`, background: s.bg,
      marginBottom: "16px", position: "relative",
    }}>
      {/* icon circle */}
      <div style={{
        width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
        background: s.ic, color: s.tc, marginTop: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 600,
      }}>
        {s.icon}
      </div>

      {/* text */}
      <div style={{ flex: 1 }}>
        <span style={{
          display: "inline-block", fontSize: 11, fontWeight: 600,
          padding: "2px 9px", borderRadius: 20, marginBottom: 5,
          background: s.badgeBg, color: s.badgeTc,
        }}>
          {code}
        </span>
        <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: s.tc }}>{title}</p>
        <p style={{ margin: 0, fontSize: 13, color: s.tc, opacity: 0.85 }}>{desc}</p>
      </div>

      {/* close */}
      {onClose && (
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: s.tc, opacity: 0.5, fontSize: 16, padding: "0 2px",
          lineHeight: 1, marginTop: 2,
        }}>✕</button>
      )}
    </div>
  );
}