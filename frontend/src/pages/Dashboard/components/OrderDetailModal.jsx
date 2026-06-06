const STATUS_FLOW = [
  { key: "pending",      label: "Order placed",      desc: "Your order has been received." },
  { key: "proof_review", label: "Proof review",       desc: "Digital proof sent — awaiting your approval." },
  { key: "processing",   label: "Processing",         desc: "Artwork approved, preparing for production." },
  { key: "production",   label: "In production",      desc: "Your order is being printed and finished." },
  { key: "dispatched",   label: "Dispatched",         desc: "On its way — tracking details sent to your email." },
  { key: "delivered",    label: "Delivered",          desc: "Order delivered. Hope you love it!" },
];

const CANCELLED = { key: "cancelled", label: "Cancelled", desc: "This order was cancelled." };

function fmt(n) {
  if (n == null) return "—";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
function fmtDate(v) {
  if (!v) return "—";
  return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const isCancelled = order.status === "cancelled";
  const flow = isCancelled ? [...STATUS_FLOW, CANCELLED] : STATUS_FLOW;
  const currentIdx = flow.findIndex((s) => s.key === order.status);

  const items = order.items ?? [];
  const payStatus = order.payment_status ?? "unpaid";

  return (
    <div className="odm-backdrop" onClick={onClose}>
      <div className="odm-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="odm-header">
          <div>
            <div className="odm-order-id">{order.order_id}</div>
            <div className="odm-placed">Placed {fmtDate(order.created_at)}</div>
          </div>
          <button className="odm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Status timeline */}
        <div className="odm-section">
          <div className="odm-section-title">Order status</div>
          <div className="odm-timeline">
            {flow.map((step, i) => {
              const done = currentIdx >= 0 && i <= currentIdx;
              const active = i === currentIdx;
              return (
                <div key={step.key} className={`odm-step ${done ? "odm-step--done" : ""} ${active ? "odm-step--active" : ""}`}>
                  <div className="odm-step-dot" />
                  <div className="odm-step-body">
                    <div className="odm-step-label">{step.label}</div>
                    {active && <div className="odm-step-desc">{step.desc}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div className="odm-section">
            <div className="odm-section-title">Items</div>
            <div className="odm-items">
              {items.map((item) => (
                <div key={item.id ?? item.product_id} className="odm-item">
                  <span className="odm-item-name">{item.product_title}</span>
                  <span className="odm-item-meta">×{item.quantity}</span>
                  <span className="odm-item-price">{fmt(item.total_price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Totals */}
        <div className="odm-section">
          <div className="odm-section-title">Summary</div>
          <div className="odm-totals">
            {order.subtotal != null && (
              <div className="odm-total-row"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
            )}
            {order.gst != null && (
              <div className="odm-total-row"><span>GST (18%)</span><span>{fmt(order.gst)}</span></div>
            )}
            <div className="odm-total-row odm-total-row--final">
              <span>Total</span>
              <span>{fmt(order.total_price)}</span>
            </div>
            <div className="odm-total-row">
              <span>Payment</span>
              <span className={`odm-pay-badge odm-pay-${payStatus}`}>{payStatus}</span>
            </div>
          </div>
        </div>

        {/* Customer info */}
        {(order.customer_name || order.customer_email) && (
          <div className="odm-section">
            <div className="odm-section-title">Contact</div>
            <div className="odm-contact">
              {order.customer_name && <span>{order.customer_name}</span>}
              {order.customer_email && <span>{order.customer_email}</span>}
              {order.customer_phone && <span>{order.customer_phone}</span>}
              {order.customer_city && <span>{order.customer_city}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
