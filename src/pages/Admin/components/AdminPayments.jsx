import { useState } from "react";
import { API_URL } from "../../../config";
import { safeParseResponse } from "../../../utils/apiHandler";
import { getValidToken } from "../../../utils/auth";
import { FaCheck, FaTimes, FaImage } from "react-icons/fa";

// Admin panel to approve/reject manually-submitted UTR payments.
// This is the ONLY place an order's paymentStatus can move out of
// "Pending Verification" — nothing is ever auto-approved (Section 15).
function AdminPayments({ orders, token, onOrderUpdated, setMessage }) {
  const [processingId, setProcessingId] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loadingScreenshotFor, setLoadingScreenshotFor] = useState(null);

  // The screenshot is stored under Cloudinary's private delivery type — no
  // plain public URL exists for it. This fetches a freshly-signed,
  // authorization-checked URL from the backend each time it's viewed.
  const handleViewScreenshot = async (orderId) => {
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    setLoadingScreenshotFor(orderId);
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/payment-screenshot`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const data = await safeParseResponse(res, "Payment Screenshot");
      setScreenshotPreview(data.url);
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setLoadingScreenshotFor(null);
    }
  };

  const pendingOrders = orders.filter((o) => o.paymentStatus === "Pending Verification");
  const recentlyDecided = orders
    .filter((o) => ["Verified", "Failed"].includes(o.paymentStatus))
    .slice(0, 10);

  const handleDecision = async (orderId, action) => {
    let reason = "";
    if (action === "reject") {
      const input = window.prompt("Enter rejection reason (will be visible to customer and stock will be restored):");
      if (input === null) return;
      reason = input.trim();
    } else if (action === "request_correction") {
      const input = window.prompt("Enter note for customer (e.g. Please provide clear screenshot or valid UTR):");
      if (input === null) return;
      reason = input.trim();
    }

    setProcessingId(orderId);
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/verify-payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, reason }),
      });
      const data = await safeParseResponse(res, "Verify Payment");

      if (action === "approve") {
        setMessage("✅ Payment approved — order confirmed.");
      } else if (action === "request_correction") {
        setMessage("⚠️ Correction requested from customer.");
      } else {
        setMessage("❌ Payment rejected — stock restored.");
      }
      onOrderUpdated(data);
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="panel-card">
      <h2>Payment Verification</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
        Orders paid via UPI or Bank Transfer stay "Pending Verification" until you check the UTR
        against your bank/UPI statement and approve or reject here.
      </p>

      {pendingOrders.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No payments waiting for verification. 🎉</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {pendingOrders.map((order) => (
            <div key={order._id} style={{ border: "1px solid var(--border-color)", background: "var(--bg-card)", borderRadius: "8px", padding: "16px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <strong>{order.orderNumber}</strong> — {order.shippingAddress?.fullName}
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                  {order.paymentMethod} · ₹{order.pricing?.totalPrice} · {new Date(order.createdAt).toLocaleString()}
                </div>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>
                  UTR: <strong>{order.paymentDetails?.utr || "—"}</strong>
                </div>
                {order.paymentDetails?.paymentScreenshotPublicId && (
                  <button
                    onClick={() => handleViewScreenshot(order._id)}
                    disabled={loadingScreenshotFor === order._id}
                    style={{ marginTop: "6px", background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <FaImage /> {loadingScreenshotFor === order._id ? "Loading…" : "View screenshot"}
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <button
                  disabled={processingId === order._id}
                  onClick={() => handleDecision(order._id, "approve")}
                  style={{ background: "#16a34a", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  disabled={processingId === order._id}
                  onClick={() => handleDecision(order._id, "request_correction")}
                  style={{ background: "#f59e0b", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}
                >
                  Need Info
                </button>
                <button
                  disabled={processingId === order._id}
                  onClick={() => handleDecision(order._id, "reject")}
                  style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {recentlyDecided.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px" }}>Recently Decided</h3>
          <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentlyDecided.map((o) => (
                <tr key={o._id}>
                  <td>{o.orderNumber}</td>
                  <td>{o.shippingAddress?.fullName}</td>
                  <td>₹{o.pricing?.totalPrice}</td>
                  <td style={{ color: o.paymentStatus === "Verified" ? "#16a34a" : "#dc2626", fontWeight: "600" }}>
                    {o.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}

      {screenshotPreview && (
        <div
          onClick={() => setScreenshotPreview(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer" }}
        >
          <img src={screenshotPreview} alt="Payment screenshot" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px" }} />
        </div>
      )}
    </div>
  );
}

export default AdminPayments;

