import "./Footer.css";
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
            <li>Home</li>
            <li>Shop</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="footer-box">
          <h3>Categories</h3>
          <ul>
            <li>Betta Fish</li>
            <li>Guppy Fish</li>
            <li>Aquarium Tanks</li>
            <li>Fish Food</li>
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