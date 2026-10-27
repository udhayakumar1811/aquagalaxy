import { useNavigate } from "react-router-dom";
import heroBgImage from "../../assets/images/heroBgImage.webp";

function Hero() {
  const navigate = useNavigate();

  return (
    <section 
      className="relative w-full min-h-[85vh] min-h-[85dvh] md:min-h-[75vh] flex items-center justify-center py-16 px-5 bg-cover bg-center bg-no-repeat bg-[#0a2540]"
      style={{ backgroundImage: `url(${heroBgImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a2540]/50 to-[#0a2540]/75 z-[1]" />

      <div className="relative z-[2] text-center text-white w-full max-w-[780px] flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-tight mb-5 tracking-tight drop-shadow-md">
          Amazing <br />
          Aquarium Collection
        </h1>

        <p className="w-full max-w-[580px] text-slate-200 text-sm sm:text-base leading-relaxed mb-8 text-center drop-shadow">
          Premium aquarium fish, tanks, plants, and accessories — everything
          you need to build a thriving aquatic world at home.
        </p>

        <button 
          type="button"
          className="bg-[#ff4d2d] hover:bg-[#e03e20] text-white px-8 sm:px-9 py-3.5 rounded-lg text-base font-bold transition-all duration-200 cursor-pointer shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
          onClick={() => navigate("/shop")}
        >
          Shop Now &rarr;
        </button>
      </div>
    </section>
  );
}

export default Hero;

