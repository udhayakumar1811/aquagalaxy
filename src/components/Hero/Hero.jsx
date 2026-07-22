import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>
          Amazing <br />
          Aquarium Collection
        </h1>

        <p className="hero-description">
          Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
          et dolore magna aliquyam erat, sed diam voluptua.
        </p>

        <button className="hero-btn">
          Shop Now &rarr;
        </button>
      </div>
      
    </section>
  );
}

export default Hero;