import React from "react";
import Footer from "../../components/Footer/Footer";
import { FaFish, FaLeaf, FaShippingFast, FaHeadset } from "react-icons/fa";
import "./About.css";

function About() {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Aquafy</h1>
          <p>
            Bringing healthy, vibrant aquatic life and everything you need to
            care for it, right to your door.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <h2 className="section-title">Our Story</h2>
          <p className="about-text">
            Aquafy started with a simple idea: fishkeeping should be
            enjoyable, not overwhelming. From premium fish food to
            aquarium-ready plants and equipment, we curate everything with
            care so hobbyists and first-time fishkeepers alike can build the
            aquatic setup they've always wanted.
          </p>
        </div>
      </section>

      <section className="about-values-section">
        <div className="about-container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
              <FaFish className="about-value-icon" />
              <h3>Healthy Livestock</h3>
              <p>Every fish is sourced responsibly and quarantined with care.</p>
            </div>
            <div className="about-value-card">
              <FaLeaf className="about-value-icon" />
              <h3>Quality Plants</h3>
              <p>Fresh, aquarium-safe plants to help your tank thrive.</p>
            </div>
            <div className="about-value-card">
              <FaShippingFast className="about-value-icon" />
              <h3>Fast Shipping</h3>
              <p>Quick, careful packaging so your order arrives safely.</p>
            </div>
            <div className="about-value-card">
              <FaHeadset className="about-value-icon" />
              <h3>Friendly Support</h3>
              <p>Real advice from people who actually keep aquariums.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;
