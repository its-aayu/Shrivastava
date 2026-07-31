import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import request from "../../lib/apiClient";
import "./style.css";

const ORDER_STATUSES = ["pending", "proof_review", "in_production", "dispatched", "delivered", "cancelled"];

const STATUS_LABELS = {
  pending:       "Pending",
  proof_review:  "Proof Review",
  in_production: "In Production",
  dispatched:    "Dispatched",
  delivered:     "Delivered",
  cancelled:     "Cancelled",
};

function StatCard({ label, value, sub }) {
  return (
    <div className="statCard">
      <p className="statCard__label">{label}</p>
      <p className="statCard__value">{value}</p>
      {sub && <p className="statCard__sub">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard({ onNavigate }) {
  const { user, logout, isAdmin } = useAuth();
  const [stats, setStats]         = useState(null);
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [updating, setUpdating]   = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) onNavigate("home");
  }, [isAdmin, onNavigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, ordersRes] = await Promise.all([
        request("/admin/stats"),
        request("/orders/?limit=100"),
      ]);
      setStats(statsRes);
      setOrders(ordersRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function updateStatus(orderId, status) {
    setUpdating(orderId);
    try {
      await request(`/orders/${orderId}/status?status=${status}`, { method: "PATCH" });
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  }

  function handleLogout() {
    logout();
    onNavigate("home");
  }

  function formatDate(str) {
    if (!str) return "—";
    const d = new Date(str);
    return isNaN(d) ? str : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  if (!isAdmin) return null;

  return (
    <div className="adminPage">

      {/* HEADER */}
      <header className="adminHeader">
        <button className="adminHeader__brand" type="button" onClick={() => onNavigate("home")}>
          VELORA
        </button>
        <div className="adminHeader__right">
          <span className="adminHeader__user">Admin: {user?.name || user?.email}</span>
          <button type="button" className="adminHeader__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="adminMain">
        <h1 className="adminMain__title">Admin Dashboard</h1>

        {error && <div className="adminError">{error} <button onClick={fetchData}>Retry</button></div>}

        {/* STATS */}
        {loading ? (
          <p className="adminLoading">Loading…</p>
        ) : (
          <>
            <div className="statsRow">
              <StatCard label="Total Orders"    value={stats?.total_orders   ?? "—"} />
              <StatCard label="Pending"         value={stats?.pending_orders ?? "—"} />
              <StatCard label="Total Revenue"   value={stats?.total_revenue ? `₹${stats.total_revenue.toLocaleString("en-IN")}` : "₹0"} />
              <StatCard label="Total Customers" value={stats?.total_users    ?? "—"} />
            </div>

            {/* ORDERS TABLE */}
            <section className="adminSection">
              <div className="adminSection__head">
                <h2>Orders <span>({orders.length})</span></h2>
                <button type="button" className="adminRefresh" onClick={fetchData}>↻ Refresh</button>
              </div>

              {orders.length === 0 ? (
                <p className="adminEmpty">No orders yet.</p>
              ) : (
                <div className="tableWrap">
                  <table className="ordersTable">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.order_id}>
                          <td className="ordersTable__id">{order.order_id}</td>
                          <td>{order.product_title || "—"}</td>
                          <td>{order.quantity ?? "—"}</td>
                          <td>₹{(order.total_price ?? 0).toLocaleString("en-IN")}</td>
                          <td>
                            <span className={`statusBadge statusBadge--${order.status}`}>
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                          </td>
                          <td className="ordersTable__date">{formatDate(order.created_at)}</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.order_id, e.target.value)}
                              disabled={updating === order.order_id}
                              className="statusSelect"
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
