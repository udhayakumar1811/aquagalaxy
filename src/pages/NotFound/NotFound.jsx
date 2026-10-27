import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

function NotFound() {
  return (
    <>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-white dark:bg-slate-900 transition-colors">
        <h1 className="text-7xl sm:text-9xl font-black text-[#0077b6] tracking-widest mb-2">404</h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 rounded-xl bg-[#ff4d2d] hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all"
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;

