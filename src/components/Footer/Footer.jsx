import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import udhayaLogo from "../../assets/udhaya-logo.png";

function Footer() {
  return (
    <footer className="bg-[#0a2540] dark:bg-[#031020] text-slate-200 pt-12 border-t border-[#133355] dark:border-[#12375c] w-full">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">

        {/* Brand Summary Column */}
        <div>
          <div className="flex items-center gap-3 mb-3.5">
            <img
              src={udhayaLogo}
              alt="UDHAYA AQUATICS"
              className="h-12 w-auto object-contain rounded-lg bg-white p-0.5"
            />
            <h2 className="m-0 text-xl font-bold text-slate-50">UDHAYA AQUATICS</h2>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
            Premium Live Ornamental Fish, Custom Glass Tanks, Live Plants,
            Quality Feeds and Aquarium Accessories.
          </p>
          <div className="text-xs text-slate-400">
            Proprietor: <strong className="text-slate-200 font-semibold">UDHAYAKUMAR</strong>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3.5">Quick Links</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li><Link to="/" className="hover:text-sky-400 transition-colors">Home</Link></li>
            <li><Link to="/shop" className="hover:text-sky-400 transition-colors">Shop</Link></li>
            <li><Link to="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/wishlist" className="hover:text-sky-400 transition-colors">Wishlist</Link></li>
            <li><Link to="/profile" className="hover:text-sky-400 transition-colors">My Account / Orders</Link></li>
          </ul>
        </div>

        {/* Customer Policies & Legal Column */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3.5">Customer Policies</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li><Link to="/privacy-policy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-sky-400 transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-sky-400 transition-colors">Shipping & Delivery</Link></li>
            <li><Link to="/refund-policy" className="hover:text-sky-400 transition-colors">Return & Refund Policy</Link></li>
            <li><Link to="/cancellation-policy" className="hover:text-sky-400 transition-colors">Cancellation Policy</Link></li>
            <li><Link to="/payment-policy" className="hover:text-sky-400 transition-colors">Payment Policy</Link></li>
          </ul>
        </div>

        {/* Contact Information Column */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3.5">Contact Us</h3>
          
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <FaPhone className="text-sky-400 flex-shrink-0 text-xs" />
              <a href="tel:+916381582969" className="hover:text-sky-400 transition-colors">+91 63815 82969</a>
            </div>
            <div className="flex items-center gap-2.5">
              <FaWhatsapp className="text-emerald-400 flex-shrink-0 text-xs" />
              <a href="https://wa.me/916381582969" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">+91 63815 82969</a>
            </div>
            <div className="flex items-center gap-2.5">
              <FaEnvelope className="text-sky-400 flex-shrink-0 text-xs" />
              <a href="mailto:udhaya.aqua.pets@gmail.com" className="hover:text-sky-400 transition-colors break-all">udhaya.aqua.pets@gmail.com</a>
            </div>
            <div className="flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-sky-400 flex-shrink-0 text-xs mt-0.5" />
              <span>Rajapalayam, Virudhunagar Dist, Tamil Nadu - 626117</span>
            </div>
            <div className="flex items-center gap-2.5">
              <FaClock className="text-sky-400 flex-shrink-0 text-xs" />
              <span>Mon – Sun: 7:00 AM – 9:00 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 text-base text-slate-400">
            <a href="https://www.facebook.com/share/1DYndWGcjC/" target="_blank" rel="noreferrer" title="Facebook" className="hover:text-sky-400 hover:-translate-y-0.5 transition-all"><FaFacebookF /></a>
            <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=j0ccj2u" target="_blank" rel="noreferrer" title="Instagram" className="hover:text-pink-400 hover:-translate-y-0.5 transition-all"><FaInstagram /></a>
            <a href="https://www.youtube.com/@Udhaya_Aquatics" target="_blank" rel="noreferrer" title="YouTube" className="hover:text-red-500 hover:-translate-y-0.5 transition-all"><FaYoutube /></a>
            <a href="https://chat.whatsapp.com/Bb4FI0WOsYgBKxHoTOQ8u4" target="_blank" rel="noreferrer" title="WhatsApp Community" className="hover:text-emerald-400 hover:-translate-y-0.5 transition-all"><FaWhatsapp /></a>
          </div>
        </div>

      </div>

      <div className="text-center py-4 px-6 border-t border-slate-800 text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} UDHAYA AQUATICS. All Rights Reserved. Owned and Operated by UDHAYAKUMAR.
      </div>
    </footer>
  );
}

export default Footer;
