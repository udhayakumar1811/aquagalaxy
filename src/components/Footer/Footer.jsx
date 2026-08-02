import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Summary Column */}
        <div className="footer-box">
          <h2>Aquafy</h2>
          <p className="brand-desc">
            Premium Aquarium Fish, Tanks,
            Accessories and Fish Food.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="footer-box">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="footer-box">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/shop">Betta Fish</Link></li>
            <li><Link to="/shop">Guppy Fish</Link></li>
            <li><Link to="/shop">Aquarium Tanks</Link></li>
            <li><Link to="/shop">Fish Food</Link></li>
          </ul>
        </div>

        {/* Contact Information Column */}
        <div className="footer-box">
          <h3>Contact</h3>
          
          <div className="contact-item">
            <FaPhone className="contact-icon" /> <span>+91 98765 43210</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" /> <span>info@aquafy.com</span>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" /> <span>Chennai, India</span>
          </div>

          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaYoutube />
          </div>
        </div>

      </div>

      <div className="copyright">
        &copy; 2026 Aquafy. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;