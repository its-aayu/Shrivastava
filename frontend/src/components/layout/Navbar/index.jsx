import Button from "../../ui/Button";
import { useAuth } from "../../../context/AuthContext";
import useCartStore from "../../../store/cartStore";
import "./style.css";


export default function Navbar({ activePage, navItems = [], onNavigate }) {
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCartStore();

  const mobileAuthOption = isAuthenticated
    ? { id: "dashboard", label: "Dashboard" }
    : { id: "login", label: "Sign In" };

  return (
    <header className="app-nav">
      <div className="container nav-inner">

        {/* LOGO */}
        <button
          className="brand-mark"
          onClick={() => onNavigate("home")}
          type="button"
          aria-label="Aayu Printing Studio — go to homepage"
        >
          <span className="brand-script">Aayu</span>
        </button>

        {/* DESKTOP NAVIGATION */}
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={activePage === item.id ? "nav-link active" : "nav-link"}
              aria-current={activePage === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="nav-actions">

          {/* MOBILE SELECT — includes auth option */}
          <select
            className="mobile-select"
            value={activePage}
            onChange={(e) => onNavigate(e.target.value)}
            aria-label="Choose page"
          >
            {navItems.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
            <option value={mobileAuthOption.id}>{mobileAuthOption.label}</option>
          </select>

          {/* AUTH BUTTON — always visible, separate class so it shows on mobile */}
          {isAuthenticated ? (
            <button
              className="nav-auth-btn"
              onClick={() => onNavigate("dashboard")}
              type="button"
            >
              Dashboard
            </button>
          ) : (
            <button
              className="nav-auth-btn"
              onClick={() => onNavigate("login")}
              type="button"
            >
              Sign In
            </button>
          )}

          {/* CART ICON */}
          <button className="nav-cart" onClick={() => onNavigate("cart")} aria-label="View cart">
            <svg viewBox="0 0 20 20" fill="currentColor" width={17} height={17}>
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            {totalItems() > 0 && (
              <span className="nav-cart-badge">{totalItems()}</span>
            )}
          </button>

          {/* CTA BUTTON — hidden on mobile via nav-cta */}
          <Button size="sm" className="nav-cta" onClick={() => onNavigate("contact")}>
            Start Your Order
          </Button>

        </div>
      </div>
    </header>
  );
}
