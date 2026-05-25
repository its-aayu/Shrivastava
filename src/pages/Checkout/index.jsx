import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import useCartStore from "../../store/cartStore";
import { ordersApi } from "../../lib/api";
import "./style.css";

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

function OrderSuccess({ orderIds, onNavigate }) {
  return (
    <Motion.div className="ck-success" {...fadeUp}>
      <div className="ck-success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={40} height={40}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2>Order placed!</h2>
      <p>
        {orderIds.length === 1
          ? `Order ${orderIds[0]} has been received.`
          : `${orderIds.length} orders (${orderIds.join(", ")}) have been received.`}
        <br />The studio team will review your files and send a digital proof within 1 working day.
      </p>
      <div className="ck-success-actions">
        <button className="ck-btn-primary" onClick={() => onNavigate("dashboard")}>
          Track your orders →
        </button>
        <button className="ck-btn-ghost" onClick={() => onNavigate("home")}>
          Back to home
        </button>
      </div>
    </Motion.div>
  );
}

export default function Checkout({ onNavigate }) {
  const { isAuthenticated, user } = useAuth();
  const { items, subtotal, clearCart } = useCartStore();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    city: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderIds, setOrderIds] = useState(null);

  const gst = Math.round(subtotal() * 0.18);
  const total = subtotal() + gst;

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  if (!isAuthenticated) {
    return (
      <div className="ck-shell">
        <div className="ck-auth-gate">
          <div className="ck-auth-icon">🔒</div>
          <h2>Sign in to complete your order</h2>
          <p>You need to be signed in so we can link your order to your account and keep you updated.</p>
          <button className="ck-btn-primary" onClick={() => onNavigate("login")}>Sign in</button>
          <button className="ck-btn-ghost" onClick={() => onNavigate("signup")}>Create account</button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderIds) {
    return (
      <div className="ck-shell">
        <div className="ck-auth-gate">
          <div className="ck-auth-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add products to your cart before checking out.</p>
          <button className="ck-btn-primary" onClick={() => onNavigate("gallery")}>Browse products</button>
        </div>
      </div>
    );
  }

  if (orderIds) {
    return (
      <div className="ck-shell">
        <OrderSuccess orderIds={orderIds} onNavigate={onNavigate} />
      </div>
    );
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const created = [];
      const userId = user?.id ?? user?.sub ?? "guest";
      for (const item of items) {
        const orderPayload = {
          user_id: userId,
          product_id: item.product.id,
          product_title: item.product.title,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity,
          finish: item.product.finish ?? null,
          size: item.product.size ?? null,
          notes: form.notes || null,
          artwork_approved: false,
        };
        const res = await ordersApi.create(orderPayload);
        created.push(res.order_id ?? res.data?.order_id ?? "—");
      }
      clearCart();
      setOrderIds(created);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ck-shell">
      <Motion.div className="ck-layout" {...fadeUp}>
        {/* ── Left — form ── */}
        <form className="ck-form" onSubmit={placeOrder}>
          <div className="ck-form-section">
            <h2 className="ck-section-title">Your details</h2>
            <div className="ck-field-row">
              <label className="ck-field">
                <span>Full name *</span>
                <input name="name" value={form.name} onChange={update} required placeholder="Ayush Shrivastava" />
              </label>
              <label className="ck-field">
                <span>Email *</span>
                <input name="email" type="email" value={form.email} onChange={update} required placeholder="you@example.com" />
              </label>
            </div>
            <div className="ck-field-row">
              <label className="ck-field">
                <span>Phone</span>
                <input name="phone" value={form.phone} onChange={update} placeholder="+91 98765 43210" />
              </label>
              <label className="ck-field">
                <span>City</span>
                <input name="city" value={form.city} onChange={update} placeholder="Indore" />
              </label>
            </div>
          </div>

          <div className="ck-form-section">
            <h2 className="ck-section-title">Order notes</h2>
            <label className="ck-field">
              <span>Special instructions (optional)</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={update}
                rows={3}
                placeholder="Finish preferences, deadline, delivery notes, or any special requirements…"
              />
            </label>
          </div>

          <div className="ck-form-section">
            <h2 className="ck-section-title">Payment</h2>
            <div className="ck-payment-placeholder">
              <div className="ck-payment-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={28} height={28}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div>
                <p className="ck-payment-title">Razorpay payment — coming soon</p>
                <p className="ck-payment-sub">
                  Place your order now and the studio will send you a payment link before production starts.
                  UPI, cards, and net banking accepted.
                </p>
              </div>
            </div>
          </div>

          <button className="ck-submit" type="submit" disabled={submitting}>
            {submitting ? "Placing order…" : `Place order · ₹${total.toLocaleString("en-IN")}`}
          </button>
        </form>

        {/* ── Right — order summary ── */}
        <aside className="ck-summary">
          <h2 className="ck-section-title">Order summary</h2>
          <div className="ck-summary-items">
            {items.map((item) => (
              <div key={item.product.id} className="ck-summary-row">
                <div className="ck-summary-info">
                  <span className="ck-summary-name">{item.product.title}</span>
                  <span className="ck-summary-meta">
                    {item.product.category} · Qty {item.quantity}
                  </span>
                </div>
                <span className="ck-summary-price">
                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="ck-totals">
            <div className="ck-total-row">
              <span>Subtotal</span>
              <span>₹{subtotal().toLocaleString("en-IN")}</span>
            </div>
            <div className="ck-total-row">
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="ck-total-row ck-total-row--final">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="ck-trust">
            <span>✓ Proof before production</span>
            <span>✓ Quality guarantee</span>
            <span>✓ Pan-India delivery</span>
          </div>
        </aside>
      </Motion.div>
    </div>
  );
}
