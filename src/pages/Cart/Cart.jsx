import React, { useContext } from "react";
import Footer from "../../components/Footer/Footer";
import { CartContext } from "../../context/CartContext";
import { getImageUrl } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useContext(CartContext);
  
  // Navigate function for routing
  const navigate = useNavigate();

  return (
    <>
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty! 🛒</h2>
            <p>Looks like you haven't added any aquatic items yet.</p>

            <Link to="/shop" className="shop-now-btn">
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="cart-wrapper">
            {/* Cart Items List */}
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <img src={getImageUrl(item.image)} alt={item.name} />

                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">₹{item.price}</p>
                  </div>

                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      disabled={typeof item.qnt === "number" && item.quantity >= item.qnt}
                      title={typeof item.qnt === "number" && item.quantity >= item.qnt ? "Maximum available stock reached" : ""}
                    >
                      +
                    </button>
                  </div>
                  {typeof item.qnt === "number" && item.quantity >= item.qnt && (
                    <p style={{ fontSize: "12px", color: "#dc2626", margin: "4px 0 0", fontWeight: "600" }}>
                      Max stock reached
                    </p>
                  )}

                  <div className="item-total">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>

            {/* Cart Order Summary */}
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <hr />

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="summary-row">
                <span>Shipping Fee</span>
                <span className="free-text">FREE</span>
              </div>

              <hr />

              <div className="summary-row total-row">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>

              {/* Alert removed, navigate added here */}
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")} 
              >
                Proceed to Checkout
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