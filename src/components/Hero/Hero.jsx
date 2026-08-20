import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1>
          Amazing <br />
          Aquarium Collection
        </h1>

        <p className="hero-description">
          Premium aquarium fish, tanks, plants, and accessories — everything
          you need to build a thriving aquatic world at home.
        </p>

        <button className="hero-btn" onClick={() => navigate("/shop")}>
          Shop Now &rarr;
        </button>
      </div>
      
    </section>
  );
}

export default Hero;