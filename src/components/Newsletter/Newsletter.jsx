import { useState } from "react";
import "./Newsletter.css";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    // NOTE: There is currently no backend endpoint to persist newsletter
    // subscribers. This stores the email locally so at least the UI is
    // honest about what happened, and shows a clear confirmation instead of
    // silently doing nothing. Wire this up to a real /api/newsletter
    // endpoint if email marketing is added later.
    const existing = JSON.parse(localStorage.getItem("newsletter_subscribers")) || [];
    if (!existing.includes(email.trim().toLowerCase())) {
      existing.push(email.trim().toLowerCase());
      localStorage.setItem("newsletter_subscribers", JSON.stringify(existing));
    }

    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
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

        {subscribed ? (
          <p style={{ color: "#16a34a", fontWeight: "700", fontSize: "16px" }}>
            ✅ Thanks for subscribing!
          </p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              Subscribe
            </button>
          </form>
        )}

      </div>
    </section>
  );
}

export default Newsletter;