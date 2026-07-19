import "./Newsletter.css";

function Newsletter() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="newsletter">
      <div className="container newsletter-container">
        
        <div className="newsletter-content">
          <h2>Subscribe Our Newsletter</h2>
          <p>
            Get the latest aquarium updates, offers and fish care tips.
          </p>
        </div>

        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            required
          />
          <button type="submit">
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
}

export default Newsletter;