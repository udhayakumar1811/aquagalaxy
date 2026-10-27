import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, getImageUrl } from "../../config";
import { safeParseResponse } from "../../utils/apiHandler";

function OfferBanner() {
  const [banner, setBanner] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();

  // 1. Fetch Banner Data from Backend API
  useEffect(() => {
    fetch(`${API_URL}/api/banner`)
      .then((res) => safeParseResponse(res, "Banner"))
      .then((data) => {
        if (data && (data.title || data.image)) {
          setBanner(data);
        }
      })
      .catch((err) => console.error("Error fetching banner:", err.message));
  }, []);

  // 2. Countdown Timer Logic
  useEffect(() => {
    if (!banner || !banner.endDate) return;

    const targetTime = new Date(banner.endDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [banner]);

  if (!banner) return null;

  const bannerImgSrc = banner.image
    ? banner.image.startsWith("http")
      ? banner.image
      : getImageUrl(banner.image)
    : null;

  return (
    <section className="py-14 sm:py-16 bg-[#0a2540] text-white w-full relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex-1 w-full text-center md:text-left">
          <span className="inline-block bg-sky-400/15 text-sky-400 font-bold text-xs tracking-widest px-3 py-1 rounded-full mb-3 uppercase">
            LIMITED TIME OFFER
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold my-2 leading-tight tracking-tight text-white">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <h3 className="text-lg sm:text-xl mb-3 text-blue-200 font-semibold">
              {banner.subtitle}
            </h3>
          )}
          {banner.description && (
            <p className="mb-6 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
              {banner.description}
            </p>
          )}

          <div className="flex justify-center md:justify-start gap-3 mb-7">
            <div className="w-16 h-16 bg-white text-slate-900 rounded-xl flex flex-col justify-center items-center shadow-lg shadow-black/20">
              <h4 className="text-xl font-extrabold leading-none text-slate-900">
                {String(timeLeft.days).padStart(2, "0")}
              </h4>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 uppercase">Days</span>
            </div>
            <div className="w-16 h-16 bg-white text-slate-900 rounded-xl flex flex-col justify-center items-center shadow-lg shadow-black/20">
              <h4 className="text-xl font-extrabold leading-none text-slate-900">
                {String(timeLeft.hours).padStart(2, "0")}
              </h4>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 uppercase">Hours</span>
            </div>
            <div className="w-16 h-16 bg-white text-slate-900 rounded-xl flex flex-col justify-center items-center shadow-lg shadow-black/20">
              <h4 className="text-xl font-extrabold leading-none text-slate-900">
                {String(timeLeft.minutes).padStart(2, "0")}
              </h4>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 uppercase">Mins</span>
            </div>
            <div className="w-16 h-16 bg-white text-slate-900 rounded-xl flex flex-col justify-center items-center shadow-lg shadow-black/20">
              <h4 className="text-xl font-extrabold leading-none text-slate-900">
                {String(timeLeft.seconds).padStart(2, "0")}
              </h4>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 uppercase">Secs</span>
            </div>
          </div>

          <button
            type="button"
            className="bg-[#ff4d2d] hover:bg-orange-600 active:scale-95 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
            onClick={() => navigate("/shop")}
          >
            Shop Offers &rarr;
          </button>
        </div>

        {bannerImgSrc && (
          <div className="flex-1 w-full max-w-md flex justify-center items-center">
            <img 
              src={bannerImgSrc} 
              alt={banner.title || "Special Offer"} 
              loading="lazy" 
              className="w-full max-h-[340px] object-cover rounded-2xl shadow-2xl border-4 border-white/10"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default OfferBanner;

