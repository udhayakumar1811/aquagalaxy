import { useState, useEffect } from "react";
import { API_URL, getImageUrl } from "../../config";
import { getValidToken, clearAuthSession } from "../../utils/auth";
import { 
  FaUser, 
  FaBoxOpen, 
  FaLock, 
  FaSignOutAlt, 
  FaDownload, 
  FaCheck, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import { getWishlist } from "../../utils/wishlist";

const INDIAN_STATES = [
  "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana",
  "Maharashtra", "Goa", "Gujarat", "Delhi", "Puducherry", "Punjab",
  "Rajasthan", "Uttar Pradesh", "West Bengal", "Bihar", "Odisha",
  "Assam", "Haryana", "Madhya Pradesh", "Uttarakhand"
];

function MyProfile() {
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Personal details
  const [editName, setEditName] = useState("");
  const [editMobile, setEditMobile] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  // Address CRUD modal/form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    mobile: "",
    houseFlat: "",
    streetArea: "",
    city: "",
    district: "",
    state: "Tamil Nadu",
    pincode: "",
    landmark: "",
    addressType: "Home",
    isDefault: false,
  });
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [addressMsg, setAddressMsg] = useState("");
  const [addressErr, setAddressErr] = useState("");

  // Password change fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  // Order cancellation
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = getValidToken();
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
          setEditMobile(parsedUser.mobile || "");
          setEditEmail(parsedUser.email || "");
        }

        // Fetch fresh user profile from backend
        const resProfile = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resProfile.ok) {
          const freshUser = await resProfile.json();
          setUser(freshUser);
          setEditName(freshUser.name || "");
          setEditMobile(freshUser.mobile || "");
          setEditEmail(freshUser.email || "");
          setAddresses(freshUser.addresses || []);
        }

        // Fetch user orders
        const resOrders = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resOrders.ok) {
          const data = await resOrders.json();
          setOrders(Array.isArray(data) ? data : []);
        }

        // Fetch user addresses
        const resAddr = await fetch(`${API_URL}/api/users/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resAddr.ok) {
          const addrData = await resAddr.json();
          setAddresses(Array.isArray(addrData) ? addrData : []);
        }

        // Load wishlist
        setWishlistItems(getWishlist());
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = () => {
    clearAuthSession(true);
  };

  // --- SAVE PERSONAL DETAILS ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setSavingProfile(true);

    try {
      const token = getValidToken();
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          mobile: editMobile,
          email: editEmail || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = {
          _id: data._id,
          name: data.name,
          mobile: data.mobile,
          email: data.email,
          role: data.role,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (data.token) localStorage.setItem("token", data.token);
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

  // --- ADDRESS CRUD HANDLERS ---
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user.name || "",
      mobile: user.mobile || "",
      houseFlat: "",
      streetArea: "",
      city: "",
      district: "",
      state: "Tamil Nadu",
      pincode: "",
      landmark: "",
      addressType: "Home",
      isDefault: addresses.length === 0,
    });
    setAddressMsg("");
    setAddressErr("");
    setShowAddressForm(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      fullName: addr.fullName,
      mobile: addr.mobile,
      houseFlat: addr.houseFlat,
      streetArea: addr.streetArea,
      city: addr.city,
      district: addr.district || "",
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark || "",
      addressType: addr.addressType || "Home",
      isDefault: Boolean(addr.isDefault),
    });
    setAddressMsg("");
    setAddressErr("");
    setShowAddressForm(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressMsg("");
    setAddressErr("");
    setAddressSubmitting(true);

    try {
      const token = getValidToken();
      const method = editingAddressId ? "PUT" : "POST";
      const url = editingAddressId
        ? `${API_URL}/api/users/addresses/${editingAddressId}`
        : `${API_URL}/api/users/addresses`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();
      if (res.ok) {
        setAddresses(Array.isArray(data) ? data : []);
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressMsg(editingAddressId ? "✅ Address updated!" : "✅ Address added!");
      } else {
        setAddressErr(data.message || "Failed to save address");
      }
    } catch (err) {
      setAddressErr("Failed to save address. Please check connection.");
    } finally {
      setAddressSubmitting(false);
      setTimeout(() => { setAddressMsg(""); setAddressErr(""); }, 4000);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const token = getValidToken();
      const res = await fetch(`${API_URL}/api/users/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(Array.isArray(data) ? data : []);
        setAddressMsg("🗑️ Address removed.");
      }
    } catch (err) {
      alert("Error deleting address");
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const token = getValidToken();
      const res = await fetch(`${API_URL}/api/users/addresses/${id}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(Array.isArray(data) ? data : []);
        setAddressMsg("⭐ Default address updated!");
      }
    } catch (err) {
      alert("Error updating default address");
    }
  };

  // --- SAVE NEW PASSWORD ---
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
      const token = getValidToken();
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

  // --- CANCEL ORDER (Prior to packing only) ---
  const handleCancelOrder = async (orderId, currentStatus) => {
    if (["Packed", "Shipped", "Out for Delivery", "Delivered"].includes(currentStatus)) {
      alert("Orders that are already packed or shipped cannot be cancelled. Please contact customer support.");
      return;
    }

    const reason = window.prompt("Please enter the reason for cancellation:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    setCancellingId(orderId);
    try {
      const token = getValidToken();
      const res = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Cancellation request processed successfully");
        const updatedOrder = data.order || data;
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  // --- ORDER TRACKING STAGES (BOOKED -> PACKING -> SHIPPING -> DELIVERY) ---
  const trackingSteps = ["Order Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];

  const getStepIndex = (status) => {
    const index = trackingSteps.indexOf(status);
    return index !== -1 ? index : -1;
  };

  // --- PRINT INVOICE ---
  const escapeHtml = (value) => {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const handleDownloadInvoice = (order) => {
    const orderIdStr = order.orderNumber || `#ORD-${order._id.substring(order._id.length - 6).toUpperCase()}`;
    const pricing = order.pricing || {};
    const printWindow = window.open("", "_blank");
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${orderIdStr} - UDHAYA AQUATICS</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); border-radius: 8px; }
            h1 { color: #0077b6; text-align: center; margin-bottom: 5px; }
            .header-info { display: flex; justify-content: space-between; margin-top: 30px; border-bottom: 2px solid #0077b6; padding-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8fafc; color: #1e293b; font-weight: 700; }
            .total-section { text-align: right; margin-top: 20px; font-size: 15px; }
            .total-section .grand { font-size: 18px; font-weight: 800; color: #ff4d2d; margin-top: 8px; }
            .footer { margin-top: 40px; text-align: center; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <h1>UDHAYA AQUATICS</h1>
            <p style="text-align: center; margin: 0; color: #555; font-size: 13px;">
              Proprietor: UDHAYAKUMAR | Live Ornamental Aquarium Fish &amp; Aquatic Supplies<br/>
              Rajapalayam, Virudhunagar District, Tamil Nadu, India - 626117<br/>
              Phone / WhatsApp: +91 63815 82969 | Email: udhaya.aqua.pets@gmail.com
            </p>
            
            <div class="header-info">
              <div>
                <strong>Billed &amp; Shipped To:</strong><br/>
                ${escapeHtml(order.shippingAddress?.fullName) || 'Valued Customer'}<br/>
                ${escapeHtml(order.shippingAddress?.address)}<br/>
                ${escapeHtml(order.shippingAddress?.city)}, ${escapeHtml(order.shippingAddress?.state)} - ${escapeHtml(order.shippingAddress?.pincode)}<br/>
                Phone: +91 ${escapeHtml(order.shippingAddress?.phone) || 'N/A'}
              </div>
              <div style="text-align: right;">
                <strong>Invoice / Order No:</strong> ${escapeHtml(orderIdStr)}<br/>
                <strong>Order Date:</strong> ${escapeHtml(new Date(order.createdAt).toLocaleDateString())}<br/>
                <strong>Payment Method:</strong> ${escapeHtml(order.paymentMethod)}<br/>
                <strong>Payment Status:</strong> ${escapeHtml(order.paymentStatus) || 'N/A'}<br/>
                ${order.paymentDetails?.utr ? `<strong>UTR Reference:</strong> ${escapeHtml(order.paymentDetails.utr)}` : ''}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems.map(item => `
                  <tr>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${escapeHtml(item.quantity || item.qnt || 1)}</td>
                    <td>₹${escapeHtml(item.discountPrice ?? item.price)}</td>
                    <td>₹${escapeHtml((item.quantity || item.qnt || 1) * (item.discountPrice ?? item.price))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div class="total-section">
              <p>Subtotal: ₹${escapeHtml(pricing.subtotal ?? order.totalPrice)}</p>
              ${pricing.couponDiscount ? `<p>Coupon Discount: -₹${escapeHtml(pricing.couponDiscount)}</p>` : ''}
              <p>Delivery Charge: ₹${escapeHtml(pricing.deliveryCharge ?? 0)}</p>
              ${pricing.gstAmount ? `<p>GST (${escapeHtml(pricing.gstRate)}%): ₹${escapeHtml(pricing.gstAmount)}</p>` : ''}
              <p class="grand">Grand Total: ₹${escapeHtml(pricing.totalPrice ?? order.totalPrice)}</p>
            </div>

            <div class="footer">
              <p>Thank you for choosing UDHAYA AQUATICS! For live arrival support or inquiries, please message us on WhatsApp: +91 63815 82969.</p>
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
        {/* SIDEBAR NAVIGATION */}
        <div className="profile-sidebar">
          <div className="profile-user-card">
            <div className="profile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h3>{user.name || "Customer"}</h3>
            <p>{user.mobile ? `+91 ${user.mobile}` : user.email || ""}</p>
          </div>

          <ul className="profile-menu">
            <li className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>
              <FaUser /> Personal Details
            </li>
            <li className={activeTab === "addresses" ? "active" : ""} onClick={() => setActiveTab("addresses")}>
              <FaMapMarkerAlt /> Saved Addresses ({addresses.length})
            </li>
            <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
              <FaBoxOpen /> My Orders ({orders.length})
            </li>
            <li className={activeTab === "wishlist" ? "active" : ""} onClick={() => setActiveTab("wishlist")}>
              <FaHeart /> Wishlist ({wishlistItems.length})
            </li>
            <li className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
              <FaLock /> Security &amp; Password
            </li>
            <li className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        </div>

        {/* MAIN TAB CONTENT */}
        <div className="profile-content">

          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === "account" && (
            <div className="profile-panel">
              <h2>Personal Information</h2>
              <p className="panel-subtitle">Manage your name, verified mobile, and email address.</p>

              {profileMsg && <div className="auth-success">{profileMsg}</div>}
              {profileErr && <div className="auth-error">{profileErr}</div>}

              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number (Primary Login)</label>
                  <input
                    type="tel"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    maxLength={10}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <button type="submit" className="btn-add-address" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Personal Details"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES (CRUD) */}
          {activeTab === "addresses" && (
            <div className="profile-panel">
              <div className="address-header-row">
                <div>
                  <h2>Saved Addresses</h2>
                  <p className="panel-subtitle" style={{ marginBottom: 0 }}>
                    Manage delivery addresses for quick and hassle-free checkout.
                  </p>
                </div>
                {!showAddressForm && (
                  <button className="btn-add-address" onClick={handleOpenAddAddress}>
                    <FaPlus /> Add New Address
                  </button>
                )}
              </div>

              {addressMsg && <div className="auth-success">{addressMsg}</div>}
              {addressErr && <div className="auth-error">{addressErr}</div>}

              {/* Add / Edit Address Form */}
              {showAddressForm && (
                <div className="address-form-modal">
                  <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--text-primary)" }}>
                    {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                  </h3>
                  <form onSubmit={handleSaveAddress}>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>10-Digit Mobile Number *</label>
                        <input
                          type="tel"
                          value={addressForm.mobile}
                          onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                          maxLength={10}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Flat / House No. / Building Name *</label>
                        <input
                          type="text"
                          value={addressForm.houseFlat}
                          onChange={(e) => setAddressForm({ ...addressForm, houseFlat: e.target.value })}
                          placeholder="e.g. Flat 302, Aqua Residency"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Street / Area / Colony *</label>
                        <input
                          type="text"
                          value={addressForm.streetArea}
                          onChange={(e) => setAddressForm({ ...addressForm, streetArea: e.target.value })}
                          placeholder="e.g. Gandhi Nagar, 2nd Cross"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>City / Town *</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>District (Optional)</label>
                        <input
                          type="text"
                          value={addressForm.district}
                          onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>State *</label>
                        <select
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          required
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Pincode *</label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Landmark (Optional)</label>
                        <input
                          type="text"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          placeholder="e.g. Near Big Temple"
                        />
                      </div>
                      <div className="form-group">
                        <label>Address Type</label>
                        <select
                          value={addressForm.addressType}
                          onChange={(e) => setAddressForm({ ...addressForm, addressType: e.target.value })}
                        >
                          <option value="Home">Home (7 AM - 9 PM)</option>
                          <option value="Work">Work / Office (9 AM - 6 PM)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                      <input
                        type="checkbox"
                        id="isDefaultCheckbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <label htmlFor="isDefaultCheckbox" style={{ margin: 0, fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                        Make this my default shipping address
                      </label>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="submit" className="btn-add-address" disabled={addressSubmitting}>
                        {addressSubmitting ? "Saving..." : editingAddressId ? "Update Address" : "Save Address"}
                      </button>
                      <button
                        type="button"
                        className="btn-addr-sm"
                        onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Address Cards List */}
              {addresses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-secondary)" }}>
                  <FaMapMarkerAlt style={{ fontSize: "36px", color: "#94a3b8", marginBottom: "12px" }} />
                  <p>No saved addresses found. Add an address for rapid checkout!</p>
                </div>
              ) : (
                <div className="address-grid">
                  {addresses.map((addr) => (
                    <div key={addr._id} className={`address-card ${addr.isDefault ? "is-default" : ""}`}>
                      <div>
                        <div className="address-card-header">
                          <span className="address-type-tag">{addr.addressType || "Home"}</span>
                          {addr.isDefault && (
                            <span className="default-badge">
                              <FaCheckCircle /> Default Address
                            </span>
                          )}
                        </div>
                        <div className="address-body">
                          <strong>{addr.fullName}</strong> (+91 {addr.mobile})<br />
                          {addr.houseFlat}, {addr.streetArea}<br />
                          {addr.landmark ? `Landmark: ${addr.landmark}` : ""}<br />
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </div>
                      </div>

                      <div className="address-actions">
                        <button className="btn-addr-sm" onClick={() => handleOpenEditAddress(addr)}>
                          <FaEdit /> Edit
                        </button>
                        <button className="btn-addr-sm btn-delete" onClick={() => handleDeleteAddress(addr._id)}>
                          <FaTrash /> Delete
                        </button>
                        {!addr.isDefault && (
                          <button className="btn-addr-sm btn-make-default" onClick={() => handleSetDefaultAddress(addr._id)}>
                            Set as Default
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY ORDERS & TRACKING */}
          {activeTab === "orders" && (
            <div className="profile-panel">
              <h2>My Orders &amp; Delivery Tracking</h2>
              <p className="panel-subtitle">View order history, live courier status, and download tax invoices.</p>

              {loading ? (
                <p>Loading your orders...</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <FaBoxOpen style={{ fontSize: "40px", color: "#94a3b8", marginBottom: "12px" }} />
                  <p style={{ color: "var(--text-secondary)" }}>You haven't placed any orders yet.</p>
                  <Link to="/shop" className="btn-add-address" style={{ display: "inline-flex", textDecoration: "none", marginTop: "12px" }}>
                    Explore Ornamental Fish
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const stepIdx = getStepIndex(order.status);
                    const canCancel = ["Order Confirmed", "Processing", "Pending Payment"].includes(order.status);

                    return (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div>
                            <span className="order-id">
                              {order.orderNumber || `#${order._id.substring(order._id.length - 8).toUpperCase()}`}
                            </span>
                            <span className="order-date">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button className="btn-invoice" onClick={() => handleDownloadInvoice(order)}>
                              <FaDownload /> Tax Invoice
                            </button>
                            {canCancel && order.cancellation?.status === "None" && (
                              <button
                                className="btn-invoice"
                                style={{ color: "#dc2626", borderColor: "#fca5a5" }}
                                onClick={() => handleCancelOrder(order._id, order.status)}
                                disabled={cancellingId === order._id}
                              >
                                {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Cancellation / Refund Alert */}
                        {order.cancellation?.status === "Requested" && (
                          <div style={{ background: "#fef3c7", color: "#92400e", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "14px", fontWeight: "600" }}>
                            ⏳ Cancellation Requested: Your request is currently under review by our operations team.
                          </div>
                        )}
                        {order.status === "Cancelled" && (
                          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "14px", fontWeight: "600" }}>
                            ❌ Order Cancelled. {order.refund?.status !== "None" ? `Refund Status: ${order.refund?.status}` : ""}
                          </div>
                        )}

                        {/* Order Items Snapshot */}
                        <div className="order-items-summary">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13.5px", borderBottom: idx < order.orderItems.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                              <span><strong>{item.name}</strong> × {item.quantity || 1}</span>
                              <span style={{ fontWeight: "700" }}>₹{(item.discountPrice ?? item.price) * (item.quantity || 1)}</span>
                            </div>
                          ))}
                        </div>

                        {/* 4-Stage Delivery Tracking Lifecycle */}
                        {order.status !== "Cancelled" && (
                          <div className="order-tracking-container">
                            {trackingSteps.map((stepName, sIdx) => {
                              const isCompleted = stepIdx >= sIdx;
                              return (
                                <div key={stepName} className={`tracking-step ${isCompleted ? "completed" : ""}`}>
                                  <div className="tracking-icon">
                                    {isCompleted ? <FaCheck /> : sIdx + 1}
                                  </div>
                                  <div className="tracking-label">{stepName}</div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Footer Details */}
                        <div className="order-footer">
                          <div>
                            <span className="order-payment">
                              Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                            </span>
                            {order.shipment?.trackingId && (
                              <div style={{ fontSize: "12.5px", color: "#0284c7", marginTop: "4px" }}>
                                Courier: <strong>{order.shipment.courierName || "Professional Courier"}</strong> | Tracking: <strong>{order.shipment.trackingId}</strong>
                              </div>
                            )}
                          </div>
                          <div className="order-total">
                            Total: ₹{order.pricing?.totalPrice ?? order.totalPrice}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="profile-panel">
              <div className="address-header-row">
                <div>
                  <h2>My Wishlist</h2>
                  <p className="panel-subtitle" style={{ marginBottom: 0 }}>
                    Saved aquarium pets and accessories you love.
                  </p>
                </div>
                <Link to="/wishlist" className="btn-add-address" style={{ textDecoration: "none" }}>
                  View Full Wishlist Page →
                </Link>
              </div>

              {wishlistItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                  <FaHeart style={{ fontSize: "36px", color: "#fca5a5", marginBottom: "12px" }} />
                  <p>Your wishlist is currently empty.</p>
                  <Link to="/shop" className="btn-add-address" style={{ display: "inline-flex", textDecoration: "none", marginTop: "10px" }}>
                    Browse Live Fish &amp; Tanks
                  </Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                  {wishlistItems.map((item) => (
                    <div key={item._id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                      />
                      <h4 style={{ margin: "6px 0", fontSize: "14px", color: "var(--text-primary)" }}>{item.name}</h4>
                      <p style={{ margin: "4px 0 12px", color: "#0077b6", fontWeight: "700" }}>₹{item.discountPrice ?? item.price}</p>
                      <Link to={`/shop/${item._id}`} className="btn-addr-sm" style={{ textDecoration: "none", display: "inline-block" }}>
                        View Product
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SECURITY & PASSWORD */}
          {activeTab === "security" && (
            <div className="profile-panel">
              <h2>Password &amp; Security</h2>
              <p className="panel-subtitle">Change your account password to keep your account secure.</p>

              {passwordMsg && <div className="auth-success">{passwordMsg}</div>}
              {passwordErr && <div className="auth-error">{passwordErr}</div>}

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>New Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-add-address" disabled={savingPassword}>
                  <FaLock /> {savingPassword ? "Updating..." : "Update Password"}
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
