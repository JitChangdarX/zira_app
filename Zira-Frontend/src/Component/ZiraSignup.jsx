import { useEffect } from "react";
import "../css/zira.css";
import Header from "./Header";
import { Zirasignupbody } from "./Zirasignupbody";
import { useNavigate } from "react-router-dom";
export default function ZiraSignup() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("AUTH-X");
    if (token) {
      navigate("/create-todo");
    } else {
      navigate("/signup");
    }
  }, []);
  return (
    <>
      <div className="zira-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="noise-overlay" />
        <Zirasignupbody />
      </div>
    </>
  );
}
