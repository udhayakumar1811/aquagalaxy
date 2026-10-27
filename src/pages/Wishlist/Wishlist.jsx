import { useState, useContext } from "react";
import { getImageUrl } from "../../config";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { getWishlist, setWishlist as saveWishlist } from "../../utils/wishlist";
import Footer from "../../components/Footer/Footer";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(() => getWishlist());
  const [message, setMessage] = useState("");
  const { addToCart } = useContext(CartContext);

  const removeFromWishlist = (id) => {
    const updated = wishlistItems.filter((item) => (item._id || item.id) !== id);
    setWishlistItems(updated);
    saveWishlist(updated);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center tracking-tight">
          Your Wishlist
        </h1>

        {message && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
            {message}
          </div>
        )}

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 px-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg mx-auto">
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              You haven't saved any items yet. Browse the shop and tap the heart icon on a product to save it here.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0077b6] hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all duration-200"
            >
              Browse Shop &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const itemId = item._id || item.id;
              const hasDiscount = item.discountPrice != null && item.discountPrice < item.price;
              const isOutOfStock = item.qnt === 0;

              return (
                <div 
                  key={itemId} 
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(itemId)}
                    className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700 shadow-md text-slate-400 hover:text-red-500 hover:scale-110 flex items-center justify-center transition-all cursor-pointer"
                    title="Remove from Wishlist"
                    aria-label="Remove item"
                  >
                    <FaTrash size={12} />
                  </button>

                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 mb-3 flex items-center justify-center">
                    <Link to={`/shop/${itemId}`} className="w-full h-full">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        loading="lazy" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <Link to={`/shop/${itemId}`}>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-500 line-clamp-1 transition-colors text-left mb-1.5" title={item.name}>
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-3 text-left">
                        {hasDiscount ? (
                          <>
                            <span className="text-base font-extrabold text-[#ff4d2d]">₹{item.discountPrice}</span>
                            <span className="text-xs line-through text-slate-400">₹{item.price}</span>
                          </>
                        ) : (
                          <span className="text-base font-extrabold text-[#ff4d2d]">₹{item.price}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const result = addToCart(item);
                        setMessage(result.success ? "🛒 Added to Cart Successfully!" : result.message);
                        setTimeout(() => setMessage(""), 2500);
                      }}
                      disabled={isOutOfStock}
                      className="w-full py-2.5 rounded-xl bg-[#ff4d2d] hover:bg-orange-600 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
                    >
                      <FaShoppingCart size={13} /> {isOutOfStock ? "Out of Stock" : "Buy"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Wishlist;

