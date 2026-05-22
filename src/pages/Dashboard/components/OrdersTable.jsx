import { useEffect, useState } from "react";
import { ordersApi } from "../../../lib/api";
import mockOrders from "../../../mock-data/orders.json";

function StatusBadge({ status }) {
  const cls = `status-badge status-${status?.toLowerCase() ?? "pending"}`;
  return <span className={cls}>{status ?? "pending"}</span>;
}

function formatPrice(v) {
  if (v == null) return "—";
  return `₹${Number(v).toLocaleString("en-IN")}`;
}

function formatDate(v) {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrdersTable({ limit }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .getAll()
      .then((res) => setOrders(res.data ?? res))
      .catch(() => setOrders(mockOrders))
      .finally(() => setLoading(false));
  }, []);

  const rows = limit ? orders.slice(0, limit) : orders;

  if (loading) {
    return <div className="dash-loading">Loading orders…</div>;
  }

  if (rows.length === 0) {
    return (
      <div className="dash-empty">
        <div className="dash-empty-icon">📦</div>
        <div className="dash-empty-title">No orders yet</div>
        <div className="dash-empty-text">Orders will appear here once placed.</div>
      </div>
    );
  }

  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => {
            const id = o.order_id ?? o.id;
            const product = o.product_title ?? o.product_name ?? "—";
            const status = o.status ?? "pending";
            const price = o.total_price;
            const date = o.created_at;

            return (
              <tr key={id}>
                <td className="muted">{id}</td>
                <td>{product}</td>
                <td><StatusBadge status={status} /></td>
                <td>{formatPrice(price)}</td>
                <td className="muted">{formatDate(date)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
