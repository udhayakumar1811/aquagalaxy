import { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { safeParseResponse } from "../../../utils/apiHandler";
import { getValidToken } from "../../../utils/auth";

// Admin-editable business settings — nothing here should ever be hardcoded
// in source code (Section 48/58). WhatsApp number, UPI ID, bank details,
// GST rate all live in the database and are edited through this panel.
function AdminSettings({ token, setMessage }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const currentToken = token || getValidToken();
    if (!currentToken) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/settings/admin`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    })
      .then((res) => safeParseResponse(res, "Settings"))
      .then((data) => setSettings(data))
      .catch((err) => setMessage("Failed to load settings: " + err.message))
      .finally(() => setLoading(false));
  }, [token, setMessage]);

  const updateField = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateNestedField = (section, subSection, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...(prev[section]?.[subSection] || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async (section) => {
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/settings/admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ [section]: settings[section] }),
      });
      const data = await safeParseResponse(res, "Update Settings");
      setSettings((prev) => ({ ...data, integrationStatus: prev.integrationStatus }));
      setMessage(`✅ ${section} settings saved`);
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <div className="panel-card">Loading settings…</div>;

  const inputStyle = { width: "100%", padding: "10px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", borderRadius: "6px", marginBottom: "12px" };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" };
  const saveBtnStyle = { background: "#0077b6", color: "white", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* --- Integration Status (live, from server env vars) --- */}
      <div className="panel-card">
        <h2>Integration Status</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
          Reflects what's actually configured on the server right now — not editable here.
          Configure credentials in the backend's .env file to turn these on.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {[
            { label: "Razorpay", ok: settings.integrationStatus?.razorpayConfigured },
            { label: "Email (SMTP)", ok: settings.integrationStatus?.emailConfigured },
            { label: "WhatsApp Business API", ok: settings.integrationStatus?.whatsappConfigured },
            { label: "Professional Courier", ok: settings.integrationStatus?.courierConfigured },
          ].map((item) => (
            <span key={item.label} style={{
              padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600",
              background: item.ok ? "#dcfce7" : "#f1f5f9",
              color: item.ok ? "#166534" : "#64748b",
            }}>
              {item.ok ? "✅" : "⚪"} {item.label} {item.ok ? "— Live" : "— Not configured"}
            </span>
          ))}
        </div>
      </div>

      {/* --- WhatsApp Settings --- */}
      <div className="panel-card">
        <h2>WhatsApp Settings</h2>
        <label style={labelStyle}>Admin WhatsApp Number</label>
        <input
          style={inputStyle}
          value={settings.whatsapp.adminNumber}
          onChange={(e) => updateField("whatsapp", "adminNumber", e.target.value)}
          placeholder="e.g. 6381582969"
        />
        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "14px" }}>
          <input
            type="checkbox"
            checked={settings.whatsapp.customerNotificationsEnabled}
            onChange={(e) => updateField("whatsapp", "customerNotificationsEnabled", e.target.checked)}
          />
          Send customers WhatsApp order updates (requires Meta WhatsApp Business API — not yet connected)
        </label>
        <button style={saveBtnStyle} disabled={saving} onClick={() => handleSave("whatsapp")}>Save WhatsApp Settings</button>
      </div>

      {/* --- Payment Settings --- */}
      <div className="panel-card">
        <h2>Payment Settings</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "12px" }}>
          Razorpay online payment isn't connected yet — this toggle will be enabled once
          RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are configured on the server.
        </p>
        <label style={labelStyle}>UPI ID</label>
        <input style={inputStyle} value={settings.payment.upiId} onChange={(e) => updateField("payment", "upiId", e.target.value)} placeholder="yourname@upi" />

        <label style={labelStyle}>UPI Display Name</label>
        <input style={inputStyle} value={settings.payment.upiDisplayName} onChange={(e) => updateField("payment", "upiDisplayName", e.target.value)} placeholder="UDHAYA AQUATICS" />

        <label style={labelStyle}>UPI QR Image URL</label>
        <input style={inputStyle} value={settings.payment.upiQrImage} onChange={(e) => updateField("payment", "upiQrImage", e.target.value)} placeholder="Paste Cloudinary image URL" />

        <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #e2e8f0" }} />

        <label style={labelStyle}>Bank Account Name</label>
        <input style={inputStyle} value={settings.payment.bankAccountName} onChange={(e) => updateField("payment", "bankAccountName", e.target.value)} />

        <label style={labelStyle}>Bank Account Number</label>
        <input style={inputStyle} value={settings.payment.bankAccountNumber} onChange={(e) => updateField("payment", "bankAccountNumber", e.target.value)} />

        <label style={labelStyle}>IFSC Code</label>
        <input style={inputStyle} value={settings.payment.bankIfsc} onChange={(e) => updateField("payment", "bankIfsc", e.target.value)} />

        <label style={labelStyle}>Bank Name</label>
        <input style={inputStyle} value={settings.payment.bankName} onChange={(e) => updateField("payment", "bankName", e.target.value)} />

        <button style={saveBtnStyle} disabled={saving} onClick={() => handleSave("payment")}>Save Payment Settings</button>
      </div>

      {/* --- Tax / GST Settings --- */}
      <div className="panel-card">
        <h2>Tax / GST Settings</h2>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "14px" }}>
          <input
            type="checkbox"
            checked={settings.tax.gstEnabled}
            onChange={(e) => updateField("tax", "gstEnabled", e.target.checked)}
          />
          Apply GST to orders
        </label>
        <label style={labelStyle}>GST Rate (%)</label>
        <input
          type="number"
          style={inputStyle}
          value={settings.tax.gstRate}
          onChange={(e) => updateField("tax", "gstRate", Number(e.target.value))}
        />
        <label style={labelStyle}>GSTIN (optional, shown on invoices)</label>
        <input style={inputStyle} value={settings.tax.gstNumber} onChange={(e) => updateField("tax", "gstNumber", e.target.value)} />
        <button style={saveBtnStyle} disabled={saving} onClick={() => handleSave("tax")}>Save Tax Settings</button>
      </div>

      {/* --- Website & Business Settings --- */}
      <div className="panel-card">
        <h2>Website &amp; Business Settings</h2>
        <label style={labelStyle}>Business / Website Name</label>
        <input style={inputStyle} value={settings.website?.name || ""} onChange={(e) => updateField("website", "name", e.target.value)} />

        <label style={labelStyle}>Proprietor / Owner Name</label>
        <input style={inputStyle} value={settings.website?.ownerName || ""} onChange={(e) => updateField("website", "ownerName", e.target.value)} placeholder="UDHAYAKUMAR" />

        <label style={labelStyle}>Contact Email</label>
        <input style={inputStyle} value={settings.website?.contactEmail || ""} onChange={(e) => updateField("website", "contactEmail", e.target.value)} />

        <label style={labelStyle}>Contact Phone</label>
        <input style={inputStyle} value={settings.website?.contactPhone || ""} onChange={(e) => updateField("website", "contactPhone", e.target.value)} />

        <label style={labelStyle}>Business Address / Street</label>
        <input style={inputStyle} value={settings.website?.address || ""} onChange={(e) => updateField("website", "address", e.target.value)} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={labelStyle}>City</label>
            <input style={inputStyle} value={settings.website?.city || ""} onChange={(e) => updateField("website", "city", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>District</label>
            <input style={inputStyle} value={settings.website?.district || ""} onChange={(e) => updateField("website", "district", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>State</label>
            <input style={inputStyle} value={settings.website?.state || ""} onChange={(e) => updateField("website", "state", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Pincode</label>
            <input style={inputStyle} value={settings.website?.pincode || ""} onChange={(e) => updateField("website", "pincode", e.target.value)} />
          </div>
        </div>

        <label style={labelStyle}>Business Hours</label>
        <input style={inputStyle} value={settings.website?.businessHours || ""} onChange={(e) => updateField("website", "businessHours", e.target.value)} placeholder="7:00 AM – 9:00 PM" />

        <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #e2e8f0" }} />
        <h3 style={{ fontSize: "15px", marginBottom: "12px", color: "#334155" }}>Social Media Links</h3>

        <label style={labelStyle}>Instagram Profile URL</label>
        <input style={inputStyle} value={settings.website?.socialLinks?.instagram || ""} onChange={(e) => updateNestedField("website", "socialLinks", "instagram", e.target.value)} placeholder="https://instagram.com/..." />

        <label style={labelStyle}>WhatsApp Group / Direct URL</label>
        <input style={inputStyle} value={settings.website?.socialLinks?.whatsappGroup || ""} onChange={(e) => updateNestedField("website", "socialLinks", "whatsappGroup", e.target.value)} placeholder="https://chat.whatsapp.com/..." />

        <label style={labelStyle}>Facebook Profile / Page URL</label>
        <input style={inputStyle} value={settings.website?.socialLinks?.facebook || ""} onChange={(e) => updateNestedField("website", "socialLinks", "facebook", e.target.value)} placeholder="https://facebook.com/..." />

        <label style={labelStyle}>YouTube Channel URL</label>
        <input style={inputStyle} value={settings.website?.socialLinks?.youtube || ""} onChange={(e) => updateNestedField("website", "socialLinks", "youtube", e.target.value)} placeholder="https://youtube.com/@..." />

        <button style={saveBtnStyle} disabled={saving} onClick={() => handleSave("website")}>Save Website &amp; Business Settings</button>
      </div>
    </div>
  );
}

export default AdminSettings;

