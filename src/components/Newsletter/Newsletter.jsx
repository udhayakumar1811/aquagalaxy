import { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

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
    <section className="py-12 bg-gradient-to-r from-[#0077b6] to-[#0a2540] text-white w-full">
      <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-1.5 leading-tight text-white">
            Subscribe Our Newsletter
          </h2>
          <p className="text-slate-100 text-sm">
            Get the latest aquarium updates, offers and fish care tips.
          </p>
        </div>

        {subscribed ? (
          <p className="text-emerald-300 font-bold text-base bg-emerald-950/40 px-4 py-2 rounded-lg border border-emerald-500/30">
            ✅ Thanks for subscribing!
          </p>
        ) : (
          <form className="w-full md:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-2 sm:gap-0" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 bg-white text-slate-900 rounded-lg sm:rounded-r-none outline-none text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-sky-300"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg sm:rounded-l-none transition-colors duration-200 cursor-pointer shadow-md"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Newsletter;

