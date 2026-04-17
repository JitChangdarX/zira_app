import { useEffect, useState } from "react";
import '../../css/UnderConstructionToast.css';
export default function UnderConstructionToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="toast-wrapper">
      <div className="toast-card">
        <div className="toast-icon">🚧</div>
        <div className="toast-body">
          <p className="toast-title">Website under construction</p>
          <p className="toast-msg">
            Please check back in a few weeks — we'll be ready soon. Thank you!
          </p>
        </div>
      </div>
      <div className="toast-progress" />
    </div>
  );
}