import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { CartContext } from "../../context/CartContext";
import Footer from "../../components/Footer/Footer";
import "./Checkout.css";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [upiTransactionId, setUpiTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || item.qty || 1), 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (paymentMethod === "Online UPI Payment" && !upiTransactionId.trim()) {
      setError("Please enter the UPI Transaction ID / UTR number after making the payment.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    const orderData = {
      orderItems: cart.map(item => ({
        product: item._id || item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || item.qty || 1,
      })),
      shippingAddress: {
        fullName: shipping.fullName,
        email: shipping.email,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        postalCode: shipping.postalCode,
      },
      paymentMethod: paymentMethod,
      upiTransactionId: paymentMethod === "Online UPI Payment" ? upiTransactionId : null,
      totalPrice: calculateTotal(),
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      if (clearCart) clearCart();
      // 👈 இங்கு state மூலமாக data-வை அனுப்புகிறோம்
      navigate("/order-success", { state: { order: data } }); 
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      alert("❌ Error: " + (err.message || "Failed to place order"));
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <>
        <div className="empty-cart-container">
          <h2>Your cart is empty!</h2>
          <button onClick={() => navigate("/shop")} className="btn-go-shop">
            Go to Shop
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const totalAmount = calculateTotal();
  const upiLink = `upi://pay?pa=udhayakumar2969-1@okaxis&pn=Aquafy&am=${totalAmount}&cu=INR`;

  return (
    <>
    <div className="checkout-page-container">
      <h1 className="checkout-title">Checkout</h1>

      {error && <div className="checkout-error-banner">{error}</div>}

      <div className="checkout-grid">
        <form onSubmit={handlePlaceOrder} className="checkout-form-card">
          <h2>Shipping Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="fullName" value={shipping.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={shipping.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={shipping.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" rows="3" value={shipping.address} onChange={handleChange} required></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City / Town</label>
              <input type="text" name="city" value={shipping.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={shipping.postalCode} onChange={handleChange} required />
            </div>
          </div>

          <h2>Select Payment Method</h2>
          <div className="payment-options">
            <label className={`payment-option-label ${paymentMethod === "Cash on Delivery" ? "selected" : ""}`}>
              <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === "Cash on Delivery"} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span className="payment-text">Cash on Delivery (COD)</span>
            </label>

            <label className={`payment-option-label ${paymentMethod === "Online UPI Payment" ? "selected" : ""}`}>
              <input type="radio" name="paymentMethod" value="Online UPI Payment" checked={paymentMethod === "Online UPI Payment"} onChange={(e) => setPaymentMethod(e.target.value)} />
              <div>
                <span className="payment-text">Online UPI Payment</span>
                <span className="payment-subtext">Pay directly to Udhaya Aquatics UPI ID</span>
              </div>
            </label>
          </div>

          {paymentMethod === "Online UPI Payment" && (
            <div className="upi-box">
              <p className="upi-title">Pay to UPI ID:</p>
              <p className="upi-id-display">udhayakumar2969-1@okaxis</p>
              <div className="upi-btn-wrapper">
                <a href={upiLink} className="upi-pay-btn">
                  Pay ₹{totalAmount} via UPI App
                </a>
              </div>
              <div className="form-group" style={{ marginTop: "15px" }}>
                <label>Enter UPI Transaction ID / UTR Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4152xxxxxxxx" 
                  value={upiTransactionId} 
                  onChange={(e) => setUpiTransactionId(e.target.value)} 
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="place-order-btn">
            {loading ? "Placing Order..." : `Place Order (${paymentMethod})`}
          </button>
        </form>

        <div className="order-summary-card">
          <h2>Order Summary</h2>
          
          <div className="summary-items-list">
            {cart.map((item, index) => (
              <div key={index} className="summary-item-row">
                <span>{item.name} x {item.quantity || item.qty || 1}</span>
                <span className="item-price">₹{item.price * (item.quantity || item.qty || 1)}</span>
              </div>
            ))}
          </div>

          <div className="summary-total-row">
            <span>Total to Pay:</span>
            <span className="total-amount-val">₹{calculateTotal()}</span>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Checkout;