import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL, getImageUrl } from "../../config";
import { safeParseResponse } from "../../utils/apiHandler";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaFish,
  FaRedo,
} from "react-icons/fa";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/category`);
      const data = await safeParseResponse(res, "Categories");
      const list = Array.isArray(data) ? data : [];

      // Filter out any explicitly disabled categories
      const activeList = list.filter((cat) => cat.isCategory !== false);
      setCategories(activeList);
    } catch (err) {
      console.error("Error fetching categories:", err.message);
      setError("Unable to load categories. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Check scroll position to dynamically show/hide scroll arrows
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories, loading, updateScrollButtons]);

  const handleScroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = Math.max(el.clientWidth * 0.75, 260);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleCategoryClick = (categoryId) => {
    if (!categoryId) return;
    navigate(`/shop?category=${categoryId}`);
  };

  return (
    <section className="py-14 sm:py-18 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative text-center mb-10 sm:mb-12">
          {/* Subtle Background Watermark */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-7xl md:text-8xl font-black text-slate-900/[0.04] dark:text-white/[0.03] select-none uppercase tracking-widest pointer-events-none whitespace-nowrap">
            Categories
          </span>

          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#ff4d2d] bg-orange-500/10 border border-orange-500/20 mb-3 shadow-xs">
              <FaFish className="text-xs" /> Aquarium Collections
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2.5">
              Popular Categories
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Explore healthy ornamental fish, customized aquariums, live plants, and daily essentials
            </p>
          </div>

          {/* Desktop Arrow Navigation Controls */}
          {categories.length > 3 && !loading && !error && (
            <div className="hidden md:flex items-center justify-end gap-2 absolute right-0 bottom-0 z-10">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollLeft
                    ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#ff4d2d] hover:text-white hover:border-[#ff4d2d] shadow-sm hover:shadow-md"
                    : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
                }`}
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollRight
                    ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-[#ff4d2d] hover:text-white hover:border-[#ff4d2d] shadow-sm hover:shadow-md"
                    : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50"
                }`}
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          /* Skeleton Loader Carousel */
          <div className="flex gap-4 sm:gap-6 overflow-hidden py-3 px-1 justify-start md:justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[165px] sm:w-[195px] md:w-[220px] lg:w-[235px] p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 animate-pulse flex flex-col items-center justify-between"
              >
                <div className="flex flex-col items-center w-full">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-md mb-2" />
                  <div className="h-3.5 w-16 bg-slate-100 dark:bg-slate-700/60 rounded-full mb-3" />
                </div>
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-200 dark:bg-slate-700 my-3" />
                <div className="h-8 w-24 bg-slate-100 dark:bg-slate-700/60 rounded-full mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="max-w-md mx-auto text-center py-10 px-6 bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-4">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchCategories}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#ff4d2d] hover:bg-[#e03e20] text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              <FaRedo className="text-xs" /> Try Again
            </button>
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12 px-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 max-w-lg mx-auto">
            <FaFish className="text-4xl text-slate-400 dark:text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              No Categories Available
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
              Categories are currently being updated. Visit our shop to explore all live products.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ff4d2d] hover:bg-[#e03e20] text-white shadow-md shadow-orange-500/25 transition-all"
            >
              Explore Shop <FaArrowRight className="text-xs" />
            </Link>
          </div>
        ) : (
          /* Categories Horizontal Rail */
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className={`custom-scrollbar flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 ${
                categories.length <= 5 ? "justify-start lg:justify-center" : "justify-start"
              }`}
            >
              {categories.map((cat) => {
                const categoryId = cat._id || cat.id;
                return (
                  <div
                    key={categoryId}
                    onClick={() => handleCategoryClick(categoryId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCategoryClick(categoryId);
                      }
                    }}
                    className="group relative flex-shrink-0 snap-start w-[168px] sm:w-[195px] md:w-[220px] lg:w-[235px] min-h-[300px] sm:min-h-[330px] p-4 sm:p-5 bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:border-[#ff4d2d] dark:hover:border-[#ff4d2d] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-between cursor-pointer select-none"
                  >
                    {/* Category Title & Badge */}
                    <div className="text-center w-full">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#ff4d2d] transition-colors truncate px-1">
                        {cat.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-[#ff4d2d] dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200/60 dark:border-orange-900/40 mt-1.5 shadow-xs">
                        {cat.count || 0} {cat.count === 1 ? "Item" : "Items"}
                      </span>
                    </div>

                    {/* Circular Image Container with Aquatic Accent */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden my-3 sm:my-4 p-1.5 bg-gradient-to-tr from-sky-50 to-blue-50 dark:from-slate-700/60 dark:to-slate-800 border-2 border-sky-100 dark:border-slate-600/80 group-hover:border-[#ff4d2d] dark:group-hover:border-[#ff4d2d] group-hover:shadow-md group-hover:shadow-orange-500/15 transition-all duration-300 flex items-center justify-center">
                      <img
                        src={getImageUrl(cat.image)}
                        alt={cat.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getImageUrl("");
                        }}
                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Interactive Action Pill */}
                    <div className="w-full pt-1 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700/80 dark:text-slate-200 group-hover:bg-[#ff4d2d] group-hover:text-white transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:shadow-orange-500/25">
                        <span>Shop Now</span>
                        <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View All Bottom Link */}
        {!loading && !error && categories.length > 0 && (
          <div className="text-center mt-8 sm:mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#ff4d2d] dark:hover:text-[#ff4d2d] transition-colors group"
            >
              <span>Explore all aquatic categories & products</span>
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;

