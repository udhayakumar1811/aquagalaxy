import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../../config";
import { safeParseResponse } from "../../../utils/apiHandler";
import { getValidToken } from "../../../utils/auth";
import { FaTrash } from "react-icons/fa";

const emptyCoupon = {
  code: "", discountType: "percentage", discountValue: "", maxDiscount: "",
  minOrderValue: "", expiryDate: "", usageLimit: "", perUserLimit: 1, freeDelivery: false,
};

const emptyOffer = {
  title: "", discountType: "percentage", discountValue: "", maxDiscount: "",
  product: "", category: "", freeDelivery: false, endDate: "",
};

// Admin panel for Coupons (code-based, Section 19) and Offers (automatic,
// Section 20). Kept as one component with two sections since they share
// a lot of UI, but each has its own state/API calls.
function AdminCouponsOffers({ token, categories, products, setMessage }) {
  const [subTab, setSubTab] = useState("coupons");

  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const [savingCoupon, setSavingCoupon] = useState(false);

  const [offers, setOffers] = useState([]);
  const [offerForm, setOfferForm] = useState(emptyOffer);
  const [savingOffer, setSavingOffer] = useState(false);

  const fetchCoupons = useCallback(() => {
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    fetch(`${API_URL}/api/coupons/admin`, { headers: { Authorization: `Bearer ${currentToken}` } })
      .then((r) => safeParseResponse(r, "Coupons"))
      .then((d) => setCoupons(Array.isArray(d) ? d : []))
      .catch((err) => console.error("Error fetching coupons:", err.message));
  }, [token]);

  const fetchOffers = useCallback(() => {
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    fetch(`${API_URL}/api/offers/admin`, { headers: { Authorization: `Bearer ${currentToken}` } })
      .then((r) => safeParseResponse(r, "Offers"))
      .then((d) => setOffers(Array.isArray(d) ? d : []))
      .catch((err) => console.error("Error fetching offers:", err.message));
  }, [token]);

  useEffect(() => { 
    fetchCoupons(); 
    fetchOffers(); 
  }, [fetchCoupons, fetchOffers]);

  const inputStyle = { padding: "8px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", borderRadius: "6px" };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSavingCoupon(true);
    try {
      const payload = {
        ...couponForm,
        discountValue: Number(couponForm.discountValue),
        maxDiscount: couponForm.maxDiscount ? Number(couponForm.maxDiscount) : null,
        minOrderValue: couponForm.minOrderValue ? Number(couponForm.minOrderValue) : 0,
        usageLimit: couponForm.usageLimit ? Number(couponForm.usageLimit) : null,
        perUserLimit: couponForm.perUserLimit ? Number(couponForm.perUserLimit) : null,
      };
      const res = await fetch(`${API_URL}/api/coupons/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      await safeParseResponse(res, "Create Coupon");
      setMessage("✅ Coupon created");
      setCouponForm(emptyCoupon);
      fetchCoupons();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSavingCoupon(false);
    }
  };

  const handleToggleCoupon = async (coupon) => {
    await fetch(`${API_URL}/api/coupons/admin/${coupon._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    });
    fetchCoupons();
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    await fetch(`${API_URL}/api/coupons/admin/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchCoupons();
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!offerForm.product && !offerForm.category) {
      setMessage("Select either a product or a category for the offer");
      return;
    }
    setSavingOffer(true);
    try {
      const payload = {
        ...offerForm,
        discountValue: Number(offerForm.discountValue),
        maxDiscount: offerForm.maxDiscount ? Number(offerForm.maxDiscount) : null,
        product: offerForm.product || null,
        category: offerForm.category || null,
      };
      const res = await fetch(`${API_URL}/api/offers/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      await safeParseResponse(res, "Create Offer");
      setMessage("✅ Offer created");
      setOfferForm(emptyOffer);
      fetchOffers();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSavingOffer(false);
    }
  };

  const handleToggleOffer = async (offer) => {
    await fetch(`${API_URL}/api/offers/admin/${offer._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !offer.isActive }),
    });
    fetchOffers();
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    await fetch(`${API_URL}/api/offers/admin/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchOffers();
  };

  return (
    <div className="panel-card">
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => setSubTab("coupons")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            background: subTab === "coupons" ? "#0077b6" : "var(--bg-secondary)",
            color: subTab === "coupons" ? "white" : "var(--text-secondary)",
            border: subTab === "coupons" ? "1px solid #0077b6" : "1px solid var(--border-color)",
          }}
        >
          Coupons
        </button>
        <button
          type="button"
          onClick={() => setSubTab("offers")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            background: subTab === "offers" ? "#0077b6" : "var(--bg-secondary)",
            color: subTab === "offers" ? "white" : "var(--text-secondary)",
            border: subTab === "offers" ? "1px solid #0077b6" : "1px solid var(--border-color)",
          }}
        >
          Offers
        </button>
      </div>

      {subTab === "coupons" && (
        <>
          <h2>Coupons</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
            Code-based discounts customers enter at checkout.
          </p>
          <div className="table-responsive">
          <table className="admin-table">
            <thead><tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Usage</th><th>Expiry</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}{c.freeDelivery ? " + Free Delivery" : ""}</td>
                  <td>₹{c.minOrderValue}</td>
                  <td>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleToggleCoupon(c)} style={{ background: c.isActive ? "#dcfce7" : "#fee2e2", color: c.isActive ? "#166534" : "#991b1b", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                      {c.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td><button onClick={() => handleDeleteCoupon(c._id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <h3 style={{ marginTop: "24px" }}>Create Coupon</h3>
          <form onSubmit={handleCreateCoupon} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "420px" }}>
            <input placeholder="Coupon Code (e.g. WELCOME10)" required value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} style={inputStyle} />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <select value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })} style={inputStyle}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <input type="number" placeholder="Value" required value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })} style={inputStyle} />
            </div>
            <input type="number" placeholder="Max discount ₹ (optional, for percentage)" value={couponForm.maxDiscount} onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })} style={inputStyle} />
            <input type="number" placeholder="Minimum order value ₹" value={couponForm.minOrderValue} onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: e.target.value })} style={inputStyle} />
            <label style={{ fontSize: "13px", fontWeight: "600" }}>Expiry Date</label>
            <input type="date" required value={couponForm.expiryDate} onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })} style={inputStyle} />
            <input type="number" placeholder="Total usage limit (optional)" value={couponForm.usageLimit} onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })} style={inputStyle} />
            <input type="number" placeholder="Per-user usage limit" value={couponForm.perUserLimit} onChange={(e) => setCouponForm({ ...couponForm, perUserLimit: e.target.value })} style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <input type="checkbox" checked={couponForm.freeDelivery} onChange={(e) => setCouponForm({ ...couponForm, freeDelivery: e.target.checked })} />
              Also gives free delivery
            </label>
            <button type="submit" disabled={savingCoupon} style={{ background: "#0077b6", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
              {savingCoupon ? "Saving…" : "Create Coupon"}
            </button>
          </form>
        </>
      )}

      {subTab === "offers" && (
        <>
          <h2>Offers</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
            Automatic discounts on a product or category — no code needed. If multiple offers
            match an item, only the single best one applies (never stacked).
          </p>
          <div className="table-responsive">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Target</th><th>Discount</th><th>Ends</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o._id}>
                  <td>{o.title}</td>
                  <td>{o.product?.name || (o.category?.name ? `Category: ${o.category.name}` : "—")}</td>
                  <td>{o.discountType === "percentage" ? `${o.discountValue}%` : `₹${o.discountValue}`}{o.freeDelivery ? " + Free Delivery" : ""}</td>
                  <td>{new Date(o.endDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleToggleOffer(o)} style={{ background: o.isActive ? "#dcfce7" : "#fee2e2", color: o.isActive ? "#166534" : "#991b1b", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                      {o.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td><button onClick={() => handleDeleteOffer(o._id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}><FaTrash /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <h3 style={{ marginTop: "24px" }}>Create Offer</h3>
          <form onSubmit={handleCreateOffer} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "420px" }}>
            <input placeholder="Offer title (e.g. Fish Food Week)" required value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} style={inputStyle} />

            <select value={offerForm.product} onChange={(e) => setOfferForm({ ...offerForm, product: e.target.value, category: "" })} style={inputStyle}>
              <option value="">— Specific product (optional) —</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select value={offerForm.category} onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value, product: "" })} style={inputStyle}>
              <option value="">— Whole category (optional) —</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <p style={{ fontSize: "12px", color: "#94a3b8" }}>Choose one: a specific product OR a whole category.</p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <select value={offerForm.discountType} onChange={(e) => setOfferForm({ ...offerForm, discountType: e.target.value })} style={inputStyle}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <input type="number" placeholder="Value" required value={offerForm.discountValue} onChange={(e) => setOfferForm({ ...offerForm, discountValue: e.target.value })} style={inputStyle} />
            </div>
            <input type="number" placeholder="Max discount ₹ (optional)" value={offerForm.maxDiscount} onChange={(e) => setOfferForm({ ...offerForm, maxDiscount: e.target.value })} style={inputStyle} />
            <label style={{ fontSize: "13px", fontWeight: "600" }}>Offer Ends</label>
            <input type="date" required value={offerForm.endDate} onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })} style={inputStyle} />
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <input type="checkbox" checked={offerForm.freeDelivery} onChange={(e) => setOfferForm({ ...offerForm, freeDelivery: e.target.checked })} />
              Also gives free delivery
            </label>
            <button type="submit" disabled={savingOffer} style={{ background: "#0077b6", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
              {savingOffer ? "Saving…" : "Create Offer"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default AdminCouponsOffers;

