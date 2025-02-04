import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/header.css";
import logo from "../assets/icons/logo.png";
import { PHONE } from "../constant";

const Header = () => {
  return (
    <header>
      <div className="logo-company-name">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="company-name">Freshtech RO World</div>
      </div>

      <div>
        <input className="search-input" type="search" placeholder="Search Product"/>
      </div>

      {/* Right - Contact & Auth Buttons */}
      <div className="right-section">
        <span>{`📞 +91 ${PHONE}`}</span>
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </header>
  );
};

export default Header;