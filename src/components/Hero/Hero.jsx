import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay" aria-hidden="true"></div>

      <div className="hero-content">
        <h1>
          Amazing <span className="hero-title-break">Aquarium Collection</span>
        </h1>

        <p className="hero-description">
          Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
          et dolore magna aliquyam erat, sed diam voluptua.
        </p>

        <button type="button" className="hero-btn">
          <span>Shop Now</span>
          <span className="btn-arrow" aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </section>
  );
}

export default Hero;