import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp, // 👈 Added WhatsApp icon
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
            <FaPhone className="contact-icon" /> <span>+91 63815 82969</span>
          </div>
          <div className="contact-item">
            <FaEnvelope className="contact-icon" /> <span>udhaya.aqua.pets@gmail.com</span>
          </div>
          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" /> <span>Rajapalayam, India</span>
          </div>

          {/* 👈 Added External Links to Social Icons */}
          <div className="social-icons">
            <a href="https://www.facebook.com/share/1DYndWGcjC/" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=j0ccj2u" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://www.youtube.com/@Udhaya_Aquatics" target="_blank" rel="noreferrer"><FaYoutube /></a>
            <a href="https://chat.whatsapp.com/Bb4FI0WOsYgBKxHoTOQ8u4" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
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