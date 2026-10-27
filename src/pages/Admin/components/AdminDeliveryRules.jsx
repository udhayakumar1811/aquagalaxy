import { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { safeParseResponse } from "../../../utils/apiHandler";
import { getValidToken } from "../../../utils/auth";
import { FaTrash, FaPlus } from "react-icons/fa";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh", "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
];

const emptyForm = {
  state: "", pincode: "", tiers: [{ uptoQuantity: 2, charge: 100 }],
  beyondLastTier: { stepQuantity: 1, stepCharge: 50 },
  freeDelivery: false, freeDeliveryThreshold: "", isServiceable: true,
};

// Admin CRUD for delivery pricing rules (Section 17/18). If no rule exists
// for a state/pincode, the backend falls back to the hardcoded default
// slabs (Tamil Nadu vs rest-of-India) — this panel is for overriding those
// defaults or marking specific locations as free-delivery / not serviceable.
function AdminDeliveryRules({ token, setMessage }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchRules = () => {
    const currentToken = token || getValidToken();
    if (!currentToken) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/delivery/rules`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    })
      .then((res) => safeParseResponse(res, "Delivery Rules"))
      .then((data) => setRules(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching delivery rules:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchRules, [token]);

  const handleTierChange = (index, field, value) => {
    const newTiers = [...form.tiers];
    newTiers[index] = { ...newTiers[index], [field]: Number(value) };
    setForm({ ...form, tiers: newTiers });
  };

  const addTier = () => {
    setForm({ ...form, tiers: [...form.tiers, { uptoQuantity: "", charge: "" }] });
  };

  const removeTier = (index) => {
    setForm({ ...form, tiers: form.tiers.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        pincode: form.pincode.trim() || null,
        freeDeliveryThreshold: form.freeDeliveryThreshold ? Number(form.freeDeliveryThreshold) : null,
      };
      const res = await fetch(`${API_URL}/api/delivery/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      await safeParseResponse(res, "Create Delivery Rule");
      setMessage("✅ Delivery rule created");
      setForm(emptyForm);
      fetchRules();
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      const res = await fetch(`${API_URL}/api/delivery/rules/${rule._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !rule.isActive }),
      });
      await safeParseResponse(res, "Toggle Delivery Rule");
      fetchRules();
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this delivery rule? The default rate will apply again.")) return;
    try {
      const res = await fetch(`${API_URL}/api/delivery/rules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await safeParseResponse(res, "Delete Delivery Rule");
      setMessage("Rule deleted");
      fetchRules();
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const inputStyle = { padding: "8px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", borderRadius: "6px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="panel-card">
        <h2>Delivery Rules</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Default rates apply automatically: Tamil Nadu (1–3 items = ₹100, 4–6 = ₹150, +₹50 per
          additional 2 items) and all other states (first 2 items = ₹100, +₹50 per additional
          item). Add a rule below only to override a specific state or pincode.
        </p>

        {loading ? (
          <p>Loading…</p>
        ) : rules.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No custom rules yet — default rates are in effect everywhere.</p>
        ) : (
          <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr><th>State</th><th>Pincode</th><th>Pricing</th><th>Free Delivery</th><th>Active</th><th></th></tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule._id}>
                  <td>{rule.state}</td>
                  <td>{rule.pincode || "All"}</td>
                  <td style={{ fontSize: "12px" }}>
                    {rule.tiers.map((t) => `≤${t.uptoQuantity}: ₹${t.charge}`).join(", ")}
                    {" "}+₹{rule.beyondLastTier.stepCharge}/{rule.beyondLastTier.stepQuantity} beyond
                  </td>
                  <td>{rule.freeDelivery ? "Always" : rule.freeDeliveryThreshold ? `Above ₹${rule.freeDeliveryThreshold}` : "—"}</td>
                  <td>
                    <button onClick={() => handleToggleActive(rule)} style={{ background: rule.isActive ? "#dcfce7" : "#fee2e2", color: rule.isActive ? "#166534" : "#991b1b", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(rule._id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <div className="panel-card">
        <h3>Add a New Rule</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
          <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} style={inputStyle}>
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input placeholder="Pincode (leave blank for whole state)" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} style={inputStyle} />

          <label style={{ fontSize: "13px", fontWeight: "600" }}>Pricing Tiers</label>
          {form.tiers.map((tier, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px" }}>Up to</span>
              <input type="number" value={tier.uptoQuantity} onChange={(e) => handleTierChange(i, "uptoQuantity", e.target.value)} style={{ ...inputStyle, width: "70px" }} required />
              <span style={{ fontSize: "13px" }}>items = ₹</span>
              <input type="number" value={tier.charge} onChange={(e) => handleTierChange(i, "charge", e.target.value)} style={{ ...inputStyle, width: "80px" }} required />
              {form.tiers.length > 1 && (
                <button type="button" onClick={() => removeTier(i)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer" }}><FaTrash /></button>
              )}
            </div>
          ))}
          <button type="button" onClick={addTier} style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", width: "fit-content", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            <FaPlus size={11} /> Add tier
          </button>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px" }}>Beyond last tier: +₹</span>
            <input type="number" value={form.beyondLastTier.stepCharge} onChange={(e) => setForm({ ...form, beyondLastTier: { ...form.beyondLastTier, stepCharge: Number(e.target.value) } })} style={{ ...inputStyle, width: "80px" }} />
            <span style={{ fontSize: "13px" }}>per</span>
            <input type="number" value={form.beyondLastTier.stepQuantity} onChange={(e) => setForm({ ...form, beyondLastTier: { ...form.beyondLastTier, stepQuantity: Number(e.target.value) } })} style={{ ...inputStyle, width: "70px" }} />
            <span style={{ fontSize: "13px" }}>items</span>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <input type="checkbox" checked={form.freeDelivery} onChange={(e) => setForm({ ...form, freeDelivery: e.target.checked })} />
            Always free delivery for this location
          </label>

          {!form.freeDelivery && (
            <input
              type="number"
              placeholder="Free delivery above order value ₹ (optional)"
              value={form.freeDeliveryThreshold}
              onChange={(e) => setForm({ ...form, freeDeliveryThreshold: e.target.value })}
              style={inputStyle}
            />
          )}

          <button type="submit" disabled={saving} style={{ background: "#0077b6", color: "white", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}>
            {saving ? "Saving…" : "Add Rule"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminDeliveryRules;

