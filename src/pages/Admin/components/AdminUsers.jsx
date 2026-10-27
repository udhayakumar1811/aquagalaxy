import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../../config";
import { safeParseResponse } from "../../../utils/apiHandler";
import { getValidToken } from "../../../utils/auth";

const ROLES = [
  { value: "user", label: "Customer" },
  { value: "order_manager", label: "Order Manager" },
  { value: "product_manager", label: "Product Manager" },
  { value: "support_manager", label: "Support Manager" },
  { value: "content_manager", label: "Content Manager" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
];

// Staff role assignment + customer account management (Section 31/32).
// Deliberately restricted server-side to admin/superadmin only — see
// routes/adminUserRoutes.js for why this doesn't use the RBAC permission
// system that everything else in the dashboard uses.
function AdminUsers({ token, currentUserId, setMessage, filterRole = null }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback((query = "") => {
    const currentToken = token || getValidToken();
    if (!currentToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/api/admin/users${query ? `?search=${encodeURIComponent(query)}` : ""}`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    })
      .then((res) => safeParseResponse(res, "Users"))
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => setMessage("Failed to load users: " + err.message))
      .finally(() => setLoading(false));
  }, [token, setMessage]);

  // Debounced search on typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 350);
    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${currentToken}` },
        body: JSON.stringify({ role: newRole }),
      });
      await safeParseResponse(res, "Update Role");
      setMessage("✅ Role updated");
      fetchUsers(search);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const handleToggleStatus = async (userId, isDisabled) => {
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${currentToken}` },
        body: JSON.stringify({ isDisabled: !isDisabled }),
      });
      await safeParseResponse(res, "Update User Status");
      setMessage(isDisabled ? "Account enabled" : "Account disabled");
      fetchUsers(search);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const displayedUsers = users.filter((u) => {
    if (filterRole === "user") return u.role === "user";
    if (filterRole === "staff") return u.role !== "user";
    return true;
  });

  const getTitle = () => {
    if (filterRole === "user") return "Customer Accounts";
    if (filterRole === "staff") return "Staff & Admin Roles";
    return "Staff & Customer Accounts";
  };

  const getSubtitle = () => {
    if (filterRole === "user") {
      return "Registered customer accounts, contact details, mobile verification, and active account status.";
    }
    if (filterRole === "staff") {
      return "Assign staff roles to give teammates scoped access to specific parts of this dashboard. Only Admin/Super Admin can change roles here.";
    }
    return "Manage all customer accounts and staff roles across the platform.";
  };

  return (
    <div className="panel-card">
      <h2>{getTitle()} ({displayedUsers.length})</h2>
      <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
        {getSubtitle()}
      </p>

      <input
        placeholder="Search by name, email, or mobile…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "9px 14px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", borderRadius: "8px", width: "100%", maxWidth: "340px", marginBottom: "16px", outline: "none" }}
      />

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading accounts…</p>
      ) : displayedUsers.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>No matching accounts found.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email / Mobile</th><th>Role</th><th>Status</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {displayedUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                    {u.isMobileVerified && (
                      <span style={{ fontSize: "11px", color: "#16a34a", marginLeft: "6px" }}>✓ Verified</span>
                    )}
                  </td>
                  <td>
                    <div>{u.email || "No email"}</div>
                    {u.mobile && (
                      <div style={{ fontSize: "12px", color: "#64748b" }}>📱 {u.mobile}</div>
                    )}
                  </td>
                  <td>
                    <select
                      value={u.role}
                      disabled={u._id === currentUserId}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--input-bg)", color: "var(--text-primary)", fontSize: "13px" }}
                    >
                      {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    {u._id === currentUserId && (
                      <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "6px" }}>(you)</span>
                    )}
                  </td>
                  <td>
                    <button
                      disabled={u._id === currentUserId}
                      onClick={() => handleToggleStatus(u._id, u.isDisabled)}
                      style={{
                        background: u.isDisabled ? "#fee2e2" : "#dcfce7",
                        color: u.isDisabled ? "#991b1b" : "#166534",
                        border: "none", padding: "5px 12px", borderRadius: "6px",
                        cursor: u._id === currentUserId ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: "600",
                      }}
                    >
                      {u.isDisabled ? "Disabled" : "Active"}
                    </button>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;

