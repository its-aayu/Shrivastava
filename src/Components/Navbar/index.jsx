import Button from "../Button";

export default function Navbar({ activePage, navItems = [], onNavigate }) {
  return (
    <header className="app-nav">
      <div className="nav-inner">
        <button className="brand-mark" onClick={() => onNavigate("home")} type="button">
          Aayu
        </button>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              className={activePage === item.id ? "active" : ""}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={activePage === item.id ? "page" : undefined}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <select
          className="mobile-select"
          value={activePage}
          onChange={(event) => onNavigate(event.target.value)}
          aria-label="Choose page"
        >
          {navItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>

        <Button size="sm" onClick={() => onNavigate("contact")}>
          Request a Quote
        </Button>
      </div>
    </header>
  );
}
