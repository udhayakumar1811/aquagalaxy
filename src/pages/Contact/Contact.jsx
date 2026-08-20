import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { API_URL } from "../../config";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    } catch (err) {
      console.error("Contact form error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="contact-page">
        <h1 className="section-title">Get In Touch</h1>

        <div className="contact-wrapper">
          {/* 👈 Left side updated with your requested details */}
          <div className="contact-info-panel">
            <div className="contact-info-item">
              <FaMapMarkerAlt className="contact-info-icon" />
              <div>
                <h4>Our Location</h4>
                <p>Rajapalayam, Tamil Nadu, India</p>
              </div>
            </div>
            <div className="contact-info-item">
              <FaPhoneAlt className="contact-info-icon" />
              <div>
                <h4>Call Us</h4>
                <p>+91 63815 82969</p>
              </div>
            </div>
            <div className="contact-info-item">
              <FaEnvelope className="contact-info-icon" />
              <div>
                <h4>Email Us</h4>
                <p>udhaya.aqua.pets@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <p className="contact-success-msg" style={{ color: "#16a34a", fontWeight: "600", marginBottom: "15px" }}>
                Thanks for reaching out! We'll get back to you soon.
              </p>
            )}

            {error && (
              <p style={{ color: "#dc2626", fontWeight: "600", marginBottom: "15px" }}>
                {error}
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
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
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
            <button type="submit" className="contact-submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;