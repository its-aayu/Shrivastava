import { useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useCartStore from "../../store/cartStore";

const slideIn = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit:    { x: "100%" },
  transition: { type: "spring", stiffness: 340, damping: 34 },
};

function CartItem({ item, onRemove, onUpdateQty }) {
  const { product, quantity } = item;
  return (
    <div className="cd-item">
      <div className="cd-item-info">
        <span className="cd-item-category">{product.category}</span>
        <p className="cd-item-name">{product.title}</p>
        {product.finish && <span className="cd-item-meta">{product.finish}</span>}
      </div>
      <div className="cd-item-controls">
        <div className="cd-qty">
          <button
            className="cd-qty-btn"
            onClick={() => onUpdateQty(product.id, quantity - 1)}
            aria-label="Decrease quantity"
          >−</button>
          <span>{quantity}</span>
          <button
            className="cd-qty-btn"
            onClick={() => onUpdateQty(product.id, quantity + 1)}
            aria-label="Increase quantity"
          >+</button>
        </div>
        <div className="cd-item-price">
          ₹{(product.price * quantity).toLocaleString("en-IN")}
        </div>
        <button
          className="cd-remove"
          onClick={() => onRemove(product.id)}
          aria-label="Remove item"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width={15} height={15}>
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function CartDrawer({ onNavigate }) {
  const { items, drawerOpen, closeDrawer, removeItem, updateQty, clearCart, subtotal, totalItems } = useCartStore();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function goToCheckout() {
    closeDrawer();
    onNavigate("checkout");
  }

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            className="cd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <Motion.aside className="cd-drawer" {...slideIn} aria-label="Shopping cart">
            {/* Header */}
            <div className="cd-header">
              <div className="cd-header-left">
                <svg viewBox="0 0 20 20" fill="currentColor" width={18} height={18}>
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <h2>Cart <span className="cd-header-count">{totalItems()}</span></h2>
              </div>
              <button className="cd-close" onClick={closeDrawer} aria-label="Close cart">
                <svg viewBox="0 0 20 20" fill="currentColor" width={18} height={18}>
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={48} height={48}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </div>
                <p className="cd-empty-title">Your cart is empty</p>
                <p className="cd-empty-sub">Add products from our gallery to get started.</p>
                <button className="cd-shop-btn" onClick={() => { closeDrawer(); onNavigate("gallery"); }}>
                  Browse products →
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="cd-items">
                  {items.map((item) => (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQty={updateQty}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="cd-footer">
                  <div className="cd-subtotal">
                    <span>Subtotal <small>(excl. GST)</small></span>
                    <strong>₹{subtotal().toLocaleString("en-IN")}</strong>
                  </div>
                  <button className="cd-checkout-btn" onClick={goToCheckout}>
                    Checkout · ₹{subtotal().toLocaleString("en-IN")}
                  </button>
                  <button className="cd-clear" onClick={clearCart}>Clear cart</button>
                </div>
              </>
            )}
          </Motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
