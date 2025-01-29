import React from "react";
import "../assets/css/footer.css";
import logo from "../assets/icons/logo.png";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        {/* Left - Logo and Company Info */}
        <div className="footer-logo">
          <img src={logo} alt="Freshtech RO World" />
          <p>Providing the best RO water purification solutions.</p>
        </div>

        {/* Center - Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Right - Contact Info */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>📍 123 Street, City, Country</p>
          <p>📞 +123 456 7890</p>
          <p>✉️ support@freshtechro.com</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Freshtech RO World. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
