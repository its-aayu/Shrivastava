import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import useCartStore from "../../store/cartStore";
import { ordersApi, paymentsApi } from "../../lib/api";
import "./style.css";

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

function OrderSuccess({ orderData, onNavigate }) {
  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  return (
    <Motion.div className="ck-success" {...fadeUp}>
      <div className="ck-success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={40} height={40}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2>Order placed!</h2>
      <p className="ck-success-id">Order ID: <strong>{orderData?.order_id}</strong></p>

      {orderData?.items?.length > 0 && (
        <div className="ck-success-items">
          {orderData.items.map((item) => (
            <div key={item.id} className="ck-success-item">
              <span>{item.product_title}</span>
              <span>×{item.quantity} · {fmt(item.total_price)}</span>
            </div>
          ))}
          <div className="ck-success-item ck-success-item--total">
            <span>Total (incl. GST)</span>
            <span>{fmt(orderData.total_price)}</span>
          </div>
        </div>
      )}

      <p className="ck-success-note">
        The studio team will review your order and send a digital proof within 1 working day.
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
  const [orderData, setOrderData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

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
        <OrderSuccess orderData={orderData} onNavigate={onNavigate} />
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
      const payload = {
        items: items.map((item) => ({
          product_id: item.product.id,
          product_title: item.product.title,
          quantity: item.quantity,
          unit_price: item.product.price,
          finish: item.product.finish ?? null,
          size: item.product.size ?? null,
        })),
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        customer_city: form.city || null,
        notes: form.notes || null,
      };
      const res = await ordersApi.createMulti(payload);

      // Try Razorpay payment — falls back to "order confirmed, pay later" if not configured
      const paid = await initiatePayment(res);
      if (paid) return; // success handled inside initiatePayment

      // Razorpay not configured or skipped — show success directly
      clearCart();
      setOrderIds([res.order_id]);
      setOrderData(res);
      toast.success("Order placed! The studio will send a payment link before production.");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function initiatePayment(order) {
    setPaymentLoading(true);
    try {
      const rzData = await paymentsApi.createOrder(order.order_id);
      const rzOptions = rzData?.data ?? rzData;

      if (!rzOptions?.razorpay_order_id) return false; // not configured

      return new Promise((resolve) => {
        const options = {
          key: rzOptions.key_id,
          amount: rzOptions.amount,
          currency: rzOptions.currency || "INR",
          name: "Aayu Printing Studio",
          description: `Order ${order.order_id}`,
          order_id: rzOptions.razorpay_order_id,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#4b3b38" },
          handler: async (response) => {
            try {
              await paymentsApi.verify({
                order_id: order.order_id,
                razorpay_order_id: rzOptions.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              clearCart();
              setOrderIds([order.order_id]);
              setOrderData({ ...order, payment_status: "paid" });
              toast.success("Payment successful! Order confirmed.");
              resolve(true);
            } catch {
              toast.error("Payment received but verification failed. Contact studio.");
              resolve(false);
            }
          },
          modal: {
            ondismiss: () => {
              toast.info("Payment cancelled. Your order is saved — you can pay later.");
              clearCart();
              setOrderIds([order.order_id]);
              setOrderData(order);
              resolve(true);
            },
          },
        };

        if (!window.Razorpay) {
          // SDK not loaded — fall through to "pay later" flow
          resolve(false);
          return;
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch {
      // Payment create-order failed (keys not set, etc.) — fall through silently
      return false;
    } finally {
      setPaymentLoading(false);
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
                <p className="ck-payment-title">Razorpay — UPI, cards &amp; net banking</p>
                <p className="ck-payment-sub">
                  You'll be redirected to the secure Razorpay checkout after confirming your order.
                  If payment is unavailable, the studio will send a link before production starts.
                </p>
              </div>
            </div>
          </div>

          <button
            className="ck-submit"
            type="submit"
            disabled={submitting || paymentLoading}
          >
            {paymentLoading
              ? "Opening payment…"
              : submitting
              ? "Placing order…"
              : `Place order · ₹${total.toLocaleString("en-IN")}`}
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
