import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <div className="contact-page">
        <h1 className="section-title">Get In Touch</h1>

        <div className="contact-wrapper">
          <div className="contact-info-panel">
            <div className="contact-info-item">
              <FaMapMarkerAlt className="contact-info-icon" />
              <div>
                <h4>Our Location</h4>
                <p>12 Marina Street, Chennai, Tamil Nadu, India</p>
              </div>
            </div>
            <div className="contact-info-item">
              <FaPhoneAlt className="contact-info-icon" />
              <div>
                <h4>Call Us</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-info-item">
              <FaEnvelope className="contact-info-icon" />
              <div>
                <h4>Email Us</h4>
                <p>support@aquafy.com</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <p className="contact-success-msg">
                Thanks for reaching out! We'll get back to you soon.
              </p>
            )}
            <div className="contact-form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="contact-form-group">
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="contact-submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
