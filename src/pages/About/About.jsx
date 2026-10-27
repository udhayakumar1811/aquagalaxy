import Footer from "../../components/Footer/Footer";
import { FaFish, FaLeaf, FaShippingFast, FaHeadset, FaStore, FaAward } from "react-icons/fa";

function About() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a2540] to-[#0077b6] text-white py-20 px-5 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            About UDHAYA AQUATICS
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Dedicated to bringing healthy, vibrant ornamental fish, customized aquariums,
            and professional aquatic care products straight to hobbyists across India.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-5 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
            Our Story &amp; Heritage
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
            <strong className="text-slate-900 dark:text-white">UDHAYA AQUATICS</strong> was founded by <strong className="text-slate-900 dark:text-white">UDHAYAKUMAR</strong> in Rajapalayam, Virudhunagar District, Tamil Nadu, with a passionate mission: to provide hobbyists and beginners with authentic, healthy aquatic life and dependable aquarium supplies.
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            What started as a specialized aquatic breeding facility has grown into a trusted online aquarium store serving enthusiasts all across India. We personally inspect, quarantine, and pack each live specimen using breathable, oxygen-packed containers and temperature-controlled materials to ensure safe transit to your doorstep.
          </p>
        </div>
      </section>

      {/* Why Choose Us Values Section */}
      <section className="py-16 px-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-10">
            Why Choose UDHAYA AQUATICS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <FaFish className="text-3xl text-[#ff4d2d] mb-3.5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Healthy Livestock</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Every fish is quarantined, health-checked, and conditioned before shipping.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <FaLeaf className="text-3xl text-[#ff4d2d] mb-3.5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Quality Live Plants</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Fresh, snail-free aquatic plants to help your aquarium ecosystem thrive.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <FaShippingFast className="text-3xl text-[#ff4d2d] mb-3.5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Safe Transit &amp; Packaging</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Specialized oxygen-filled insulated packaging to guarantee live arrival.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <FaHeadset className="text-3xl text-[#ff4d2d] mb-3.5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Direct WhatsApp Support</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Expert hobbyist advice from our founder and staff during business hours.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <FaStore className="text-3xl text-[#ff4d2d] mb-3.5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Local Indian Store</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Based in Rajapalayam, Virudhunagar, supporting Indian aquaculture.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <FaAward className="text-3xl text-[#ff4d2d] mb-3.5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Quality Assurance</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Only authentic feeds, reliable filters, and genuine accessories sold.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;

