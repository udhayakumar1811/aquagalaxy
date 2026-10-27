import { useContext } from "react";
import Footer from "../../components/Footer/Footer";
import { CartContext } from "../../context/CartContext";
import { getImageUrl } from "../../config";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useContext(CartContext);
  
  const navigate = useNavigate();

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center tracking-tight">
          Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 px-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Your cart is empty! 🛒</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Looks like you haven&apos;t added any aquatic items yet.</p>

            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0077b6] hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all duration-200"
            >
              Explore Shop &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item._id} 
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl bg-slate-50 dark:bg-slate-900 flex-shrink-0"
                    />

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                        {item.name}
                      </h3>
                      <div className="text-sm">
                        {item.discountPrice != null && item.discountPrice < item.price ? (
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#ff4d2d]">₹{item.discountPrice}</span>
                            <span className="line-through text-slate-400 text-xs">₹{item.price}</span>
                          </div>
                        ) : (
                          <span className="font-extrabold text-[#ff4d2d]">₹{item.price}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                    <div>
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item._id, -1)} 
                          className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item._id, 1)}
                          disabled={typeof item.qnt === "number" && item.quantity >= item.qnt}
                          title={typeof item.qnt === "number" && item.quantity >= item.qnt ? "Maximum available stock reached" : ""}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors font-bold disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      {typeof item.qnt === "number" && item.quantity >= item.qnt && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1 text-center">
                          Max stock reached
                        </p>
                      )}
                    </div>

                    <div className="text-base font-extrabold text-slate-900 dark:text-white min-w-16 text-right">
                      ₹{(item.discountPrice ?? item.price) * item.quantity}
                    </div>

                    <button
                      type="button"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      onClick={() => removeFromCart(item._id)}
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <button 
                type="button"
                className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline py-2 cursor-pointer" 
                onClick={clearCart}
              >
                Clear Entire Cart
              </button>
            </div>

            {/* Cart Order Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm sticky top-24 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order Summary</h2>
              <div className="h-px bg-slate-100 dark:bg-slate-700" />

              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{totalPrice}</span>
              </div>

              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Shipping</span>
                <span className="text-xs text-slate-400">Calculated at checkout</span>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-700" />

              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-xl text-[#ff4d2d]">₹{totalPrice}</span>
              </div>

              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-[#0077b6] hover:bg-sky-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate("/checkout")} 
              >
                Proceed to Checkout &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Cart;

