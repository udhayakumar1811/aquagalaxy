import "./OfferBanner.css";

function OfferBanner() {
  return (
    <section className="offer-banner">
      <div className="container offer-container">
        
        <div className="offer-content">
          <span className="offer-tag">LIMITED OFFER</span>
          <h1>50% OFF</h1>
          <h2>Premium Aquarium Fish</h2>
          <p>
            Get healthy and beautiful aquarium fish at the best price.
          </p>

          <div className="countdown">
            <div className="time-box">
              <h3>12</h3>
              <span>Days</span>
            </div>
            <div className="time-box">
              <h3>08</h3>
              <span>Hours</span>
            </div>
            <div className="time-box">
              <h3>45</h3>
              <span>Minutes</span>
            </div>
            <div className="time-box">
              <h3>22</h3>
              <span>Seconds</span>
            </div>
          </div>

          <button className="offer-btn">Shop Now</button>
        </div>

        <div className="offer-image">
          <img
            src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=700"
            alt="Offer Fish"
          />
        </div>

      </div>
    </section>
  );
}

export default OfferBanner;