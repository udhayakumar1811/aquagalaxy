import React, { useState, useEffect } from "react";
import { API_URL, getImageUrl } from "../../config";
import "./OfferBanner.css";

function OfferBanner() {
  const [banner, setBanner] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 1. Fetch Banner Data from Backend API
  useEffect(() => {
    fetch(`${API_URL}/api/banner`)
      .then((res) => res.json())
      .then((data) => {
        setBanner(data);
      })
      .catch((err) => console.error("Error fetching banner:", err));
  }, []);

  // 2. Countdown Timer Logic
  useEffect(() => {
    if (!banner || !banner.endDate) return;

    const targetTime = new Date(banner.endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [banner]);

  if (!banner) return null; // டேட்டா வரும் வரை லோட் ஆகக் காத்திருக்கும்

  return (
    <section className="offer-banner">
      <div className="container offer-container">
        
        <div className="offer-content">
          <span className="offer-tag">LIMITED OFFER</span>
          <h1>{banner.title}</h1>
          <h2>{banner.subtitle}</h2>
          <p>{banner.description}</p>

          <div className="countdown">
            <div className="time-box">
              <h3>{String(timeLeft.days).padStart(2, "0")}</h3>
              <span>Days</span>
            </div>
            <div className="time-box">
              <h3>{String(timeLeft.hours).padStart(2, "0")}</h3>
              <span>Hours</span>
            </div>
            <div className="time-box">
              <h3>{String(timeLeft.minutes).padStart(2, "0")}</h3>
              <span>Minutes</span>
            </div>
            <div className="time-box">
              <h3>{String(timeLeft.seconds).padStart(2, "0")}</h3>
              <span>Seconds</span>
            </div>
          </div>

          <button className="offer-btn" onClick={() => window.location.href = "/shop"}>
            Shop Now
          </button>
        </div>

        <div className="offer-image">
          <img
            src={banner.image.startsWith("http") ? banner.image : getImageUrl(banner.image)}
            alt="Offer Fish"
          />
        </div>

      </div>
    </section>
  );
}

export default OfferBanner;