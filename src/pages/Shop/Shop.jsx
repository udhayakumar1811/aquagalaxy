import { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import Seo from "../../components/Seo/Seo";
import { Link, useLocation } from "react-router-dom";
import { API_URL, getImageUrl } from "../../config";
import { FaHeart } from "react-icons/fa";
import { getWishlist, setWishlist as saveWishlist } from "../../utils/wishlist";

const sortParamMap = {
  default: undefined,
  "low-to-high": "price_asc",
  "high-to-low": "price_desc",
  "name-az": "name_asc",
};

const PAGE_SIZE = 24;

function Shop() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(() => getWishlist());
  const [message, setMessage] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  const [prevCategory, setPrevCategory] = useState(selectedCategory);
  if (prevCategory !== selectedCategory) {
    setPrevCategory(selectedCategory);
    setPage(1);
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
        if (selectedCategory) params.set("category", selectedCategory);
        const sortParam = sortParamMap[sortOption];
        if (sortParam) params.set("sort", sortParam);

        const res = await fetch(`${API_URL}/api/products?${params}`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products || [];

        setProducts(productList);
        setTotalPages(Array.isArray(data) ? 1 : (data.pages || 1));
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, page, sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1);
  };

  const filteredProducts = products;

  const toggleWishlist = (product) => {
    let updatedWishlist = [...wishlist];
    const productId = product._id || product.id;
    const exists = updatedWishlist.some((item) => (item._id || item.id) === productId);

    if (exists) {
      updatedWishlist = updatedWishlist.filter((item) => (item._id || item.id) !== productId);
      showNotification("❌ Removed from Wishlist");
    } else {
      updatedWishlist.push(product);
      showNotification("❤️ Added to Wishlist Successfully!");
    }

    setWishlist(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  const showNotification = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <>
      <Seo
        title="Shop Aquarium Fish & Accessories | UDHAYA AQUATICS"
        description="Browse our full range of aquarium fish, tanks, filters, plants, food and accessories."
        canonical={window.location.origin + "/shop"}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
        {/* Header and Sorting Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {selectedCategory ? "Filtered Products" : "All Products"}
          </h1>

          <div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-sky-500 outline-none shadow-sm cursor-pointer"
            >
              <option value="default">Sort by: Featured</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Floating Notification Toast */}
        {message && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
            {message}
          </div>
        )}

        {selectedCategory && (
          <div className="mb-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#ff4d2d] hover:underline"
            >
              &larr; Show All Products
            </Link>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium">Loading Products...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 font-semibold text-base">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No products found!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try selecting another category or view all products.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const productId = product._id || product.id;
              const isWishlisted = wishlist.some((w) => (w._id || w.id) === productId);
              const isOutOfStock = product.qnt <= 0;
              const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;

              return (
                <div 
                  key={productId} 
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700 shadow-md flex items-center justify-center transition-all cursor-pointer ${
                      isWishlisted ? "text-red-500 scale-110" : "text-slate-400 hover:text-red-500 hover:scale-110"
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    aria-label="Wishlist toggle"
                  >
                    <FaHeart size={14} />
                  </button>

                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 mb-3 flex items-center justify-center">
                    <Link to={`/shop/${product._id}`} className="w-full h-full">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        loading="lazy"
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          isOutOfStock ? "grayscale opacity-50" : ""
                        }`}
                      />
                    </Link>
                    {isOutOfStock && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                        OUT OF STOCK
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <Link to={`/shop/${product._id}`}>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-500 line-clamp-1 mb-1.5 transition-colors" title={product.name}>
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        {hasDiscount ? (
                          <>
                            <span className="text-base font-extrabold text-[#ff4d2d]">₹{product.discountPrice}</span>
                            <span className="text-xs line-through text-slate-400">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="text-base font-extrabold text-[#ff4d2d]">₹{product.price}</span>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/shop/${product._id}`}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-[#0077b6] dark:hover:bg-sky-600 text-slate-700 dark:text-slate-200 hover:text-white font-bold text-xs text-center transition-all duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Shop;

