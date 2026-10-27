import { useState } from "react";
import Footer from "../../components/Footer/Footer";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock, FaUserTie } from "react-icons/fa";
import { API_URL } from "../../config";

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
      <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Get In Touch
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Have questions about fish health, aquarium setups, or shipping? Reach out to us directly or fill in the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left side business info panel */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <FaUserTie className="text-xl text-sky-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Business &amp; Proprietor</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 font-semibold">UDHAYA AQUATICS</p>
                <p className="text-xs text-slate-400">Proprietor: UDHAYAKUMAR</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-xl text-sky-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Store Location</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200">Rajapalayam, Virudhunagar District</p>
                <p className="text-xs text-slate-400">Tamil Nadu, India - 626117</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-xl text-sky-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Phone Support</h4>
                <p className="text-sm">
                  <a href="tel:6381582969" className="text-slate-700 dark:text-slate-200 hover:text-sky-500 transition-colors">
                    +91 63815 82969
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaWhatsapp className="text-xl text-emerald-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">WhatsApp Support</h4>
                <p className="text-sm">
                  <a
                    href="https://wa.me/916381582969?text=Hello%20UDHAYA%20AQUATICS%2C%20I%20have%20an%20enquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    +91 63815 82969 (Chat Now)
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaEnvelope className="text-xl text-sky-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Email Support</h4>
                <p className="text-sm">
                  <a href="mailto:udhaya.aqua.pets@gmail.com" className="text-slate-700 dark:text-slate-200 hover:text-sky-500 transition-colors break-all">
                    udhaya.aqua.pets@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaClock className="text-xl text-sky-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Business Hours</h4>
                <p className="text-sm text-slate-700 dark:text-slate-200">7:00 AM – 9:00 PM</p>
                <p className="text-xs text-slate-400">Monday – Sunday (All 7 Days)</p>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <form className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4" onSubmit={handleSubmit}>
            {submitted && (
              <p className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                Thanks for reaching out! We'll get back to you soon.
              </p>
            )}

            {error && (
              <p className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-semibold">
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Message</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all resize-y"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-[#0077b6] hover:bg-[#005f92] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50" 
              disabled={loading}
            >
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
