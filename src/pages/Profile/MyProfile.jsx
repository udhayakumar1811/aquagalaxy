import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { FaUser, FaBoxOpen, FaLock, FaSignOutAlt, FaDownload, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import "./MyProfile.css";

function MyProfile() {
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Editable account fields
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  // Password change fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  // Order cancellation
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          setEditName(parsedUser.name || "");
          setEditEmail(parsedUser.email || "");
        }

        const resOrders = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (resOrders.ok) {
          const data = await resOrders.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- Save Account Details ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setSavingProfile(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { _id: data._id, name: data.name, email: data.email, role: data.role };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("token", data.token);
        setUser(updatedUser);
        setProfileMsg("✅ Profile updated successfully!");
      } else {
        setProfileErr(data.message || "Failed to update profile");
      }
    } catch (err) {
      setProfileErr("Something went wrong. Please try again.");
    } finally {
      setSavingProfile(false);
      setTimeout(() => { setProfileMsg(""); setProfileErr(""); }, 4000);
    }
  };

  // --- Save New Password ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordErr("");

    if (newPassword.length < 6) {
      setPasswordErr("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr("Passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setPasswordMsg("✅ Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordErr(data.message || "Failed to update password");
      }
    } catch (err) {
      setPasswordErr("Something went wrong. Please try again.");
    } finally {
      setSavingPassword(false);
      setTimeout(() => { setPasswordMsg(""); setPasswordErr(""); }, 4000);
    }
  };

  // --- Cancel an order ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  // --- Order Tracking Steps ---
  const trackingSteps = ["Pending", "Packing", "Shipping", "Delivered"];
  
  const getStepIndex = (status) => {
    const currentStatus = status ? status.trim() : "Pending";
    const index = trackingSteps.indexOf(currentStatus);
    return index !== -1 ? index : 0;
  };

  // --- Print Invoice Logic ---
  const handleDownloadInvoice = (order) => {
    const orderIdStr = `#ORD-${order._id.substring(order._id.length - 6).toUpperCase()}`;
    const printWindow = window.open("", "_blank");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${orderIdStr}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
            h1 { color: #0284c7; text-align: center; margin-bottom: 5px; }
            .header-info { display: flex; justify-content: space-between; margin-top: 30px; border-bottom: 2px solid #0284c7; padding-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8fafc; }
            .total-section { text-align: right; margin-top: 20px; font-size: 18px; }
            .footer { margin-top: 40px; text-align: center; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <h1>Udhaya Aquatics</h1>
            <p style="text-align: center; margin: 0; color: #555;">Premium Aquarium Fishes & Accessories</p>
            
            <div class="header-info">
              <div>
                <strong>Billed To:</strong><br/>
                ${order.shippingAddress?.fullName || 'Valued Customer'}<br/>
                ${order.shippingAddress?.address || ''}<br/>
                ${order.shippingAddress?.city || ''} - ${order.shippingAddress?.postalCode || ''}<br/>
                Phone: ${order.shippingAddress?.phone || 'N/A'}
              </div>
              <div style="text-align: right;">
                <strong>Invoice No:</strong> ${orderIdStr}<br/>
                <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br/>
                <strong>Payment Method:</strong> ${order.paymentMethod}<br/>
                ${order.upiTransactionId ? `<strong>UTR:</strong> ${order.upiTransactionId}` : ''}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity || item.qnt || 1}</td>
                    <td>₹${item.price}</td>
                    <td>₹${(item.quantity || item.qnt || 1) * item.price}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div class="total-section">
              <p><strong>Grand Total: ₹${order.totalPrice}</strong></p>
            </div>

            <div class="footer">
              <p>Thank you for shopping with us! If you have any questions concerning this invoice, contact udhaya.aqua.pets@gmail.com.</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
    <div className="profile-page-container">
      <div className="profile-sidebar">
        <div className="profile-user-card">
          <div className="profile-avatar">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        
        <ul className="profile-menu">
          <li className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>
            <FaUser /> Account Details
          </li>
          <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
            <FaBoxOpen /> My Orders ({orders.length})
          </li>
          <li className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
            <FaLock /> Security & Password
          </li>
          <li className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      <div className="profile-content">
        {activeTab === "account" && (
          <div className="profile-panel">
            <h2>Account Information</h2>
            <p className="panel-subtitle">Update your personal details here.</p>

            {profileMsg && (
              <div style={{ background: "#dcfce7", color: "#166534", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontWeight: "600" }}>
                {profileMsg}
              </div>
            )}
            {profileErr && (
              <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontWeight: "600" }}>
                {profileErr}
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn-invoice" disabled={savingProfile} style={{ marginTop: "10px" }}>
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* --- MY ORDERS & TRACKING TAB --- */}
        {activeTab === "orders" && (
          <div className="profile-panel">
            <h2>My Orders</h2>
            {loading ? <p>Loading orders...</p> : orders.length === 0 ? (
              <p className="panel-subtitle">You haven't placed any orders yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map(order => {
                  const orderIdStr = `#ORD-${order._id.substring(order._id.length - 6).toUpperCase()}`;
                  const orderStatus = order.status || "Pending";
                  const currentStepIdx = getStepIndex(orderStatus);

                  return (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div>
                          <span className="order-id">{orderIdStr}</span>
                          <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button className="btn-invoice" onClick={() => handleDownloadInvoice(order)}>
                          <FaDownload /> Invoice
                        </button>
                      </div>

                      {/* --- Ordered Items Summary --- */}
                      <div className="order-items-summary">
                        <strong>Ordered Products:</strong>
                        <ul style={{ margin: "8px 0 15px 20px", color: "#475569", fontSize: "14px" }}>
                          {order.orderItems?.map((item, idx) => (
                            <li key={idx}>
                              {item.name} — Qty: {item.quantity || item.qnt || 1} x ₹{item.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* --- Order Tracking UI (or Cancelled badge) --- */}
                      {orderStatus === "Cancelled" ? (
                        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", fontWeight: "700", marginBottom: "10px", display: "inline-block" }}>
                          ❌ Order Cancelled
                        </div>
                      ) : (
                        <div className="order-tracking-container">
                          {trackingSteps.map((step, index) => {
                            const isCompleted = index <= currentStepIdx;
                            return (
                              <div key={step} className={`tracking-step ${isCompleted ? "completed" : ""}`}>
                                <div className="tracking-icon" style={{ background: isCompleted ? "#16a34a" : "#e2e8f0" }}>
                                  {isCompleted && <FaCheck />}
                                </div>
                                <div className="tracking-label" style={{ color: isCompleted ? "#16a34a" : "#64748b" }}>
                                  {step}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="order-footer">
                        <span className="order-total">Total: ₹{order.totalPrice}</span>
                        <span className="order-payment">Paid via: {order.paymentMethod}</span>
                        {!["Shipping", "Delivered", "Cancelled"].includes(orderStatus) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingId === order._id}
                            style={{
                              background: "transparent", color: "#dc2626", border: "1px solid #dc2626",
                              padding: "6px 14px", borderRadius: "6px", fontWeight: "600", fontSize: "13px",
                              cursor: "pointer",
                            }}
                          >
                            {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="profile-panel">
            <h2>Security & Password</h2>
            <p className="panel-subtitle">Change your account password.</p>

            {passwordMsg && (
              <div style={{ background: "#dcfce7", color: "#166534", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontWeight: "600" }}>
                {passwordMsg}
              </div>
            )}
            {passwordErr && (
              <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontWeight: "600" }}>
                {passwordErr}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-invoice" disabled={savingPassword} style={{ marginTop: "10px" }}>
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
}

export default MyProfile;