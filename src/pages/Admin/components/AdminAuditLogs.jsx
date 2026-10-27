import { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { safeParseResponse } from "../../../utils/apiHandler";
import { getValidToken } from "../../../utils/auth";

const ACTION_LABELS = {
  "product.created": "Product Created",
  "product.updated": "Product Updated",
  "product.stock_changed": "Stock Adjusted",
  "product.deleted": "Product Deleted",
  "order.status_changed": "Order Status Changed",
  "payment.verified": "Payment Verified",
  "payment.rejected": "Payment Rejected",
  "coupon.created": "Coupon Created",
  "admin.role_changed": "Staff Role Changed",
  "settings.whatsapp_number_changed": "WhatsApp Number Changed",
};

// Read-only audit trail viewer. Strictly admin/superadmin only, matching
// the backend route's access restriction (Section 49).
function AdminAuditLogs({ token }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchLogs = () => {
    const currentToken = token || getValidToken();
    if (!currentToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const params = filter ? `?action=${encodeURIComponent(filter)}` : "";
    fetch(`${API_URL}/api/admin/audit-logs${params}`, { headers: { Authorization: `Bearer ${currentToken}` } })
      .then((res) => safeParseResponse(res, "Audit Logs"))
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching audit logs:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchLogs, [token, filter]);

  return (
    <div className="panel-card">
      <h2>Audit Log</h2>
      <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
        A record of sensitive admin actions — who did what, and when.
      </p>

      <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", marginBottom: "16px" }}>
        <option value="">All actions</option>
        {Object.entries(ACTION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {loading ? (
        <p>Loading…</p>
      ) : logs.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No matching audit log entries.</p>
      ) : (
        <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr><th>When</th><th>Admin</th><th>Action</th><th>Target</th><th>Details</th></tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td style={{ fontSize: "12px", whiteSpace: "nowrap" }}>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.adminName}</td>
                <td>{ACTION_LABELS[log.action] || log.action}</td>
                <td>{log.target || "—"}</td>
                <td style={{ fontSize: "12px", color: "#64748b" }}>
                  {log.metadata && Object.keys(log.metadata).length > 0
                    ? Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(", ")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}

export default AdminAuditLogs;

