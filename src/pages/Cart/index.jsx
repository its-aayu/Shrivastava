import { motion as Motion } from "framer-motion";
import { toast } from "sonner";
import useCartStore from "../../store/cartStore";
import "./style.css";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28 },
};

function EmptyCart({ onNavigate }) {
  return (
    <Motion.div className="cart-empty" {...fadeUp}>
      <div className="cart-empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} width={56} height={56}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </div>
      <h2>Your cart is empty</h2>
      <p>Browse our products and add something to get started.</p>
      <button className="cart-cta-primary" onClick={() => onNavigate("gallery")}>
        Browse products
      </button>
    </Motion.div>
  );
}

function CartItemRow({ item, onUpdateQty, onRemove }) {
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;

  return (
    <div className="ci-row">
      {/* Product info */}
      <div className="ci-info">
        <div className="ci-thumb">
          <span>{product.category?.charAt(0) ?? "P"}</span>
        </div>
        <div className="ci-details">
          <span className="ci-category">{product.category}</span>
          <p className="ci-name">{product.title}</p>
          {product.finish && <span className="ci-spec">Finish: {product.finish}</span>}
          {product.size && <span className="ci-spec">Size: {product.size}</span>}
          <span className="ci-unit-price">₹{product.price.toLocaleString("en-IN")} {product.price_unit}</span>
        </div>
      </div>

      {/* Quantity */}
      <div className="ci-qty-wrap">
        <div className="ci-qty">
          <button
            type="button"
            className="ci-qty-btn"
            onClick={() => onUpdateQty(product.id, quantity - 1)}
            aria-label="Decrease"
          >−</button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onUpdateQty(product.id, Math.max(1, parseInt(e.target.value) || 1))}
            aria-label="Quantity"
          />
          <button
            type="button"
            className="ci-qty-btn"
            onClick={() => onUpdateQty(product.id, quantity + 1)}
            aria-label="Increase"
          >+</button>
        </div>
      </div>

      {/* Price */}
      <div className="ci-price">₹{lineTotal.toLocaleString("en-IN")}</div>

      {/* Remove */}
      <button
        type="button"
        className="ci-remove"
        onClick={() => {
          onRemove(product.id);
          toast.info(`${product.title} removed from cart`);
        }}
        aria-label="Remove item"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16}>
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

export default function Cart({ onNavigate }) {
  const { items, updateQty, removeItem, clearCart, subtotal, totalItems } = useCartStore();

  const sub = subtotal();
  const gstNote = "GST (18%) will be calculated at checkout";

  if (items.length === 0) {
    return (
      <div className="cart-shell">
        <EmptyCart onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="cart-shell">
      <Motion.div className="cart-layout" {...fadeUp}>

        {/* ── Left: items ── */}
        <section className="cart-items-section">
          <div className="cart-items-header">
            <h1 className="cart-title">Your cart <span className="cart-count">{totalItems()} item{totalItems() !== 1 ? "s" : ""}</span></h1>
            <button className="cart-clear" onClick={() => { clearCart(); toast.info("Cart cleared"); }}>
              Clear all
            </button>
          </div>

          {/* Column headers */}
          <div className="ci-table-head">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
            <span />
          </div>

          <div className="cart-items-list">
            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onUpdateQty={updateQty}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="cart-continue">
            <button className="cart-cta-ghost" onClick={() => onNavigate("gallery")}>
              ← Continue shopping
            </button>
          </div>
        </section>

        {/* ── Right: summary ── */}
        <aside className="cart-summary">
          <h2 className="cart-summary-title">Order summary</h2>

          <div className="cart-summary-rows">
            {items.map((item) => (
              <div key={item.product.id} className="cart-summary-line">
                <span className="cart-summary-line-name">
                  {item.product.title}
                  <em>× {item.quantity}</em>
                </span>
                <span>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="cart-summary-divider" />

          <div className="cart-summary-sub">
            <span>Subtotal</span>
            <strong>₹{sub.toLocaleString("en-IN")}</strong>
          </div>

          <p className="cart-gst-note">{gstNote}</p>

          <button
            className="cart-cta-primary cart-checkout-btn"
            onClick={() => onNavigate("checkout")}
          >
            Proceed to checkout
            <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16}>
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="cart-trust">
            <span>✓ Proof before production</span>
            <span>✓ Quality guarantee</span>
            <span>✓ Pan-India delivery</span>
          </div>
        </aside>

      </Motion.div>
    </div>
  );
}
