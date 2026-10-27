import { useState, useEffect, useContext } from "react";
import { API_URL, getImageUrl } from "../../config";
import { safeParseResponse } from "../../utils/apiHandler";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { getWishlist, setWishlist as saveWishlist } from "../../utils/wishlist";

function TopSelling() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => getWishlist());
  const [message, setMessage] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          fetch(`${API_URL}/api/products?limit=200`),
          fetch(`${API_URL}/api/category`),
        ]);

        const prodData = await safeParseResponse(resProd, "Top Products");
        const catData = await safeParseResponse(resCat, "Categories");

        setProducts(Array.isArray(prodData) ? prodData : prodData.products || []);
        setCategories(Array.isArray(catData) ? catData : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching top products:", err.message);
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

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

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "All") return true;
    const catName = p.category_id?.name || "";
    const catId = String(p.category_id?._id || p.category_id?.id || p.category_id);
    return (
      catName.toLowerCase() === selectedCategory.toLowerCase() ||
      catId === selectedCategory
    );
  });

  return (
    <section className="py-16 px-4 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto">
        {message && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
            {message}
          </div>
        )}

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Top Selling Products
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-6">
            Customer favorite fish, planted aquarium picks, and daily essentials
          </p>

          <div className="flex justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#ff4d2d] text-white shadow-md shadow-orange-500/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-400 border border-slate-200 dark:border-slate-700"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const isActive =
                selectedCategory === cat.name ||
                selectedCategory === (cat._id || cat.id);
              return (
                <button
                  type="button"
                  key={cat._id || cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ff4d2d] text-white shadow-md shadow-orange-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
            <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading Top Products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => {
              const itemId = product._id || product.id;
              const isWishlisted = wishlist.some((w) => (w._id || w.id) === itemId);
              const isOutOfStock = product.qnt <= 0;
              const hasDiscount =
                product.discountPrice != null && product.discountPrice < product.price;

              return (
                <div 
                  key={itemId} 
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-6 right-6 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                      isWishlisted
                        ? "bg-red-50 text-red-500 dark:bg-red-950/60 dark:text-red-400 scale-110"
                        : "bg-white/90 dark:bg-slate-700 text-slate-400 hover:text-red-500 hover:scale-110"
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    aria-label="Wishlist toggle"
                  >
                    <FaHeart size={13} />
                  </button>

                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 mb-3 flex items-center justify-center">
                    <Link to={`/shop/${itemId}`} className="w-full h-full">
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
                      <Link to={`/shop/${itemId}`}>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-500 line-clamp-1 transition-colors text-left mb-1.5">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-3 text-left">
                        {hasDiscount ? (
                          <>
                            <span className="text-base font-extrabold text-[#ff4d2d]">
                              ₹{product.discountPrice}
                            </span>
                            <span className="text-xs line-through text-slate-400">
                              ₹{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-extrabold text-[#ff4d2d]">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <Link 
                        to={`/shop/${itemId}`} 
                        className="flex-1 text-center py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-sky-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 hover:text-sky-600 text-xs font-bold transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product);
                          showNotification("🛒 Added to Cart Successfully!");
                        }}
                        disabled={isOutOfStock}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isOutOfStock
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "bg-[#0077b6] hover:bg-sky-600 text-white shadow-sm hover:shadow"
                        }`}
                        title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        aria-label="Add to Cart"
                      >
                        <FaShoppingCart size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#ff4d2d] dark:hover:bg-[#ff4d2d] text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            See More Products &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export default TopSelling;

