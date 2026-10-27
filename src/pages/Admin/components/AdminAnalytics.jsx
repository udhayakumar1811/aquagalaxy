import { useState, useEffect } from "react";
import { API_URL } from "../../../config";
import { safeParseResponse } from "../../../utils/apiHandler";
import { getValidToken } from "../../../utils/auth";

const RANGES = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Custom range" },
];

function MetricCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ flex: "1 1 160px", minWidth: "160px" }}>
      <div className="stat-title">{label}</div>
      <div className="stat-value" style={color ? { color } : {}}>{value}</div>
    </div>
  );
}

// Simple horizontal-bar visualization built from plain divs — avoids
// pulling in a charting library dependency (Section 64: "don't introduce
// unnecessary dependencies") for what's fundamentally a short admin list.
function BarList({ items, valueKey, labelKey, formatValue = (v) => v }) {
  const max = Math.max(...items.map((i) => i[valueKey]), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
            <span>{item[labelKey]}</span>
            <span style={{ fontWeight: "700" }}>{formatValue(item[valueKey])}</span>
          </div>
          <div style={{ background: "rgba(0, 0, 0, 0.06)", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
            <div style={{ background: "#0077b6", height: "8px", borderRadius: "4px", width: `${(item[valueKey] / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {items.length === 0 && <p style={{ color: "#94a3b8", fontSize: "13px" }}>No data for this period.</p>}
    </div>
  );
}

function AdminAnalytics({ token }) {
  const [range, setRange] = useState("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    const currentToken = token || getValidToken();
    if (!currentToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const params = new URLSearchParams({ range });
    if (range === "custom" && customFrom && customTo) {
      params.set("from", customFrom);
      params.set("to", customTo);
    }
    fetch(`${API_URL}/api/admin/analytics?${params}`, { headers: { Authorization: `Bearer ${currentToken}` } })
      .then((res) => safeParseResponse(res, "Analytics"))
      .then(setData)
      .catch((err) => console.error("Error fetching analytics:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (range !== "custom" || (customFrom && customTo)) fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, token]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="panel-card">
        <h2>Analytics Overview</h2>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px", marginBottom: "12px" }}>
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRange(r.value)}
              style={{
                padding: "7px 15px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
                background: range === r.value ? "#0077b6" : "var(--bg-secondary)",
                border: range === r.value ? "1px solid #0077b6" : "1px solid var(--border-color)",
                color: range === r.value ? "#ffffff" : "var(--text-primary)",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        {range === "custom" && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginTop: "8px" }}>
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
            <span>to</span>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
            <button type="button" onClick={fetchAnalytics} style={{ padding: "6px 14px", background: "#0077b6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>Apply</button>
          </div>
        )}
      </div>

      {loading || !data ? (
        <div className="panel-card">Loading analytics…</div>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
            <MetricCard label="Total Revenue" value={`₹${(data.totals?.totalRevenue || 0).toLocaleString("en-IN")}`} color="#16a34a" />
            <MetricCard label="Total Orders" value={data.totals?.totalOrders || 0} />
            <MetricCard label="Paid Orders" value={data.totals?.paidOrders || 0} color="#16a34a" />
            <MetricCard label="Pending Payments" value={data.totals?.pendingPayments || 0} color="#b45309" />
            <MetricCard label="Cancelled" value={data.totals?.cancelledOrders || 0} color="#dc2626" />
            <MetricCard label="Delivered" value={data.totals?.deliveredOrders || 0} color="#0284c7" />
            <MetricCard label="Total Customers" value={data.totals?.totalCustomers || 0} />
            <MetricCard label="New Customers" value={data.totals?.newCustomers || 0} color="#7c3aed" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px" }}>
            <div className="panel-card">
              <h3>Revenue by Date</h3>
              <BarList items={data.revenueByDate || []} valueKey="revenue" labelKey="date" formatValue={(v) => `₹${v.toLocaleString("en-IN")}`} />
            </div>
            <div className="panel-card">
              <h3>Revenue by Category</h3>
              <BarList items={data.revenueByCategory || []} valueKey="revenue" labelKey="category" formatValue={(v) => `₹${v.toLocaleString("en-IN")}`} />
            </div>
            <div className="panel-card">
              <h3>Top Selling Products</h3>
              <BarList items={data.topSellingProducts || []} valueKey="quantitySold" labelKey="name" />
            </div>
            <div className="panel-card">
              <h3>Order Status Distribution</h3>
              <BarList items={data.statusDistribution || []} valueKey="count" labelKey="status" />
            </div>
            <div className="panel-card">
              <h3>Payment Method Stats</h3>
              <BarList items={data.paymentMethodStats || []} valueKey="count" labelKey="method" />
            </div>
            <div className="panel-card">
              <h3>Low Stock Products</h3>
              {(!data.lowStockProducts || data.lowStockProducts.length === 0) ? (
                <p style={{ color: "#94a3b8", fontSize: "13px" }}>Nothing low on stock. 🎉</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px" }}>
                  {data.lowStockProducts.map((p) => (
                    <li key={p._id} style={{ color: p.qnt === 0 ? "#dc2626" : "#b45309", marginBottom: "4px" }}>
                      <strong>{p.name}</strong> — {p.qnt} left
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminAnalytics;

