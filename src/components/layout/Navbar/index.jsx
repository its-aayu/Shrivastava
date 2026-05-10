import Button from "../../ui/Button";
import "./style.css";

export default function Navbar({
  activePage,
  navItems = [],
  onNavigate,
}) {
  return (
    <header className="app-nav">
      <div className="container nav-inner">

        {/* LOGO */}
        <button
          className="brand-mark"
          onClick={() => onNavigate("home")}
          type="button"
        >
          <span className="brand-script">Aayu</span>
        </button>

        {/* DESKTOP NAVIGATION */}
        <nav
          className="nav-links"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={
                activePage === item.id
                  ? "nav-link active"
                  : "nav-link"
              }
              aria-current={
                activePage === item.id
                  ? "page"
                  : undefined
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="nav-actions">

          {/* MOBILE SELECT */}
          <select
            className="mobile-select"
            value={activePage}
            onChange={(event) =>
              onNavigate(event.target.value)
            }
            aria-label="Choose page"
          >
            {navItems.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>

          {/* CTA BUTTON */}
          <Button
            size="sm"
            className="nav-cta"
            onClick={() => onNavigate("contact")}
          >
            Start Your Order
          </Button>

        </div>
      </div>
    </header>
  );
}
