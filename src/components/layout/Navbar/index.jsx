import Button from "../../ui/Button";
import { useAuth } from "../../../context/AuthContext";
import "./style.css";

export default function Navbar({ activePage, navItems = [], onNavigate }) {
  const { isAuthenticated } = useAuth();

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

          {/* CTA BUTTON — hidden on mobile via nav-cta */}
          <Button size="sm" className="nav-cta" onClick={() => onNavigate("contact")}>
            Start Your Order
          </Button>

        </div>
      </div>
    </header>
  );
}
