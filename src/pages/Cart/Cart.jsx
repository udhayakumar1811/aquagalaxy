import React, { useContext } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { CartContext } from "../../context/CartContext";
import { getImageUrl } from "../../config";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useContext(CartContext);

  return (
    <>
      <Navbar />
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
                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                  </div>

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

              <button
                className="checkout-btn"
                onClick={() => alert("Proceeding to Order Checkout!")}
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