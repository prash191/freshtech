import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/header.css";
import logo from "../assets/icons/logo.png";

const Header = () => {
  return (
    <header>
      <div className="logo-company-name">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="company-name">Freshtech RO World</div>
      </div>

      {/* Right - Contact & Auth Buttons */}
      <div className="right-section">
        <span>📞 +123 456 7890</span>
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </header>
  );
};

export default Header;