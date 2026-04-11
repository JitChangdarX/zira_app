import React from "react";
import "../css/shemer.css";

function SignupSkeleton() {
  return (
    <div className="signup-container">
      {/* Logo */}
      <div className="skeleton logo"></div>

      {/* Title + subtitle */}
      <div className="skeleton title"></div>
      <div className="skeleton subtitle"></div>

      {/* Inputs */}
      <div className="skeleton label"></div>
      <div className="skeleton input"></div>

      <div className="skeleton label"></div>
      <div className="skeleton input"></div>

      <div className="skeleton label"></div>
      <div className="skeleton input"></div>

      {/* Divider */}
      <div className="divider">
        <hr />
        <div className="skeleton divider-text"></div>
        <hr />
      </div>

      {/* Social login */}
      <div className="skeleton social"></div>

      {/* Button */}
      <div className="skeleton button"></div>

      {/* Footer */}
      <div className="skeleton footer-link"></div>
    </div>
  );
}

export default SignupSkeleton;
