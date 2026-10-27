import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { API_URL } from "../../config";
import Footer from "../../components/Footer/Footer";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;
  const [whatsappNumber, setWhatsappNumber] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/settings/public`)
      .then((res) => res.json())
      .then((data) => setWhatsappNumber(data?.whatsapp?.adminNumber || null))
      .catch(() => setWhatsappNumber(null));
  }, []);

  const sendToWhatsApp = () => {
    if (!order) {
      alert("Order details not found!");
      return;
    }
    if (!whatsappNumber) {
      alert("WhatsApp number is not configured yet. Please contact us directly.");
      return;
    }

    const orderIdStr = order.orderNumber || `#${order._id?.substring(order._id.length - 6).toUpperCase()}`;
    let message = `Hello UDHAYA AQUATICS! 🐟\n\nI have successfully placed an order.\n\n`;
    message += `*Order ID:* ${orderIdStr}\n`;
    message += `*Total Amount:* ₹${order.pricing?.totalPrice ?? order.totalPrice}\n`;
    message += `*Payment Method:* ${order.paymentMethod}\n`;

    const utr = order.paymentDetails?.utr || order.upiTransactionId;
    if (utr) {
      message += `*UTR Number:* ${utr}\n`;
    }

    message += `\nPlease process my order soon. Thank you!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
          <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
            Thank you for shopping with UDHAYA AQUATICS.{" "}
            {order?.paymentMethod === "Razorpay" || order?.paymentStatus === "Verified"
              ? "Your payment is verified and your order is confirmed!"
              : "Your order is received and pending verification — we'll confirm it once your payment receipt/UTR is checked."}
          </p>

          {order?.orderNumber && (
            <div className="inline-block px-4 py-2 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 rounded-xl font-bold text-sm mb-6">
              Order ID: {order.orderNumber}
            </div>
          )}

          {order && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 mb-8">
              <p className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                Notify us on WhatsApp for faster processing!
              </p>
              <button 
                type="button"
                onClick={sendToWhatsApp} 
                className="w-full mt-3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaWhatsapp className="text-xl" /> Send to WhatsApp
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/shop" 
              className="py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <Link 
              to="/profile" 
              className="py-3 rounded-xl bg-[#0077b6] hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-colors text-center"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderSuccess;

