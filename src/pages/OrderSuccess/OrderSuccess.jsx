import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";
import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order; // Checkout-ல் இருந்து வரும் டேட்டா

  const sendToWhatsApp = () => {
    if (!order) {
      alert("Order details not found!");
      return;
    }
    
    const orderIdStr = order._id ? `#ORD-${order._id.substring(order._id.length - 6).toUpperCase()}` : "N/A";
    let message = `Hello Udhaya Aquatics! 🐟\n\nI have successfully placed an order.\n\n`;
    message += `*Order ID:* ${orderIdStr}\n`;
    message += `*Total Amount:* ₹${order.totalPrice}\n`;
    message += `*Payment Method:* ${order.paymentMethod}\n`;
    
    if (order.upiTransactionId) {
      message += `*UTR Number:* ${order.upiTransactionId}\n`;
    }
    
    message += `\nPlease process my order soon. Thank you!`;

    const whatsappUrl = `https://wa.me/916381582969?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
    <div className="order-success-container">
      <div className="order-success-card">
        <FaCheckCircle className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with Aquafy. Your order has been placed and is being processed.</p>
        
        {order && (
          <div className="whatsapp-prompt">
            <p>Notify us on WhatsApp for faster processing!</p>
            <button onClick={sendToWhatsApp} className="btn-whatsapp">
              <FaWhatsapp style={{ fontSize: "20px" }} /> Send to WhatsApp
            </button>
          </div>
        )}

        <div className="success-actions">
          <Link to="/shop" className="btn-shop">Continue Shopping</Link>
          <Link to="/profile" className="btn-home">Track Order</Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default OrderSuccess;