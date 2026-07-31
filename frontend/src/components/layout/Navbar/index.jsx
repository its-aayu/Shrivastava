import { useCallback, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./style.css";

const megaMenu = [
  {
    id: "categories", label: "Men",
    subs: ["T-Shirt", "Full Sleeve", "Polo", "Sleeveless", "Sweatshirt", "Ringer", "Oversized", "Hoodie", "Jacket"],
  },
  {
    id: "categories", label: "Women",
    subs: ["T-Shirt", "Full Sleeve", "Top", "Oversized", "Sweatshirt", "Hoodie", "Jacket"],
  },
  {
    id: "categories", label: "Kids",
    subs: ["T-Shirt", "Sweatshirt", "Hoodie", "Full Sleeve", "Ringer"],
  },
  {
    id: "gift", label: "Gifts",
    subs: ["Frame", "Mug", "Tumbler", "Keychain", "Pillow", "Tote Bag"],
  },
];

export default function Navbar({ activePage, navItems = [], onNavigate }) {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef(null);

  const openMenu = useCallback(() => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 220);
  }, []);

  function handleLogout() {
    logout();
    onNavigate("home");
  }

  function goSub(pageId, sub) {
    setMegaOpen(false);
    onNavigate(pageId, { subcategory: sub });
  }

  return (
    <header
      className="app-nav"
      onKeyDown={(e) => e.key === "Escape" && setMegaOpen(false)}
    >
      <div className="container nav-inner">

        {/* LOGO */}
        <button
          className="brand-mark"
          onClick={() => onNavigate("home")}
          type="button"
          aria-label="VELORA — go to homepage"
        >
          <span className="brand-script">VELORA</span>
        </button>

        {/* DESKTOP NAV */}
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) =>
            item.id === "categories" ? (
              <div
                key={item.id}
                className="mega-wrap"
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => onNavigate("categories")}
                  className={`nav-link${activePage === "categories" ? " active" : ""}`}
                  aria-haspopup="true"
                  aria-expanded={megaOpen}
                  aria-current={activePage === "categories" ? "page" : undefined}
                >
                  {item.label} <span className="mega-arrow">{megaOpen ? "▴" : "▾"}</span>
                </button>

                {megaOpen && (
                  <div
                    className="mega-panel"
                    role="region"
                    aria-label="Browse categories"
                    onMouseEnter={openMenu}
                    onMouseLeave={scheduleClose}
                  >
                    {megaMenu.map((col) => (
                      <div key={col.label} className="mega-col">
                        <button
                          type="button"
                          className="mega-col__heading"
                          onClick={() => { setMegaOpen(false); onNavigate(col.id); }}
                        >
                          {col.label}
                        </button>
                        {col.subs.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            className="mega-col__link"
                            onClick={() => goSub(col.id, sub)}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={activePage === item.id ? "nav-link active" : "nav-link"}
                aria-current={activePage === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="nav-actions">

          {/* MOBILE SELECT */}
          <select
            className="mobile-select"
            value={activePage}
            onChange={(e) => onNavigate(e.target.value)}
            aria-label="Choose page"
          >
            {navItems.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>

          {/* AUTH */}
          {!isAuthenticated ? (
            <button
              type="button"
              className="nav-auth-btn"
              onClick={() => onNavigate("login")}
            >
              Login
            </button>
          ) : isAdmin ? (
            <>
              <button
                type="button"
                className="nav-auth-btn nav-auth-btn--admin"
                onClick={() => onNavigate("adminDashboard")}
              >
                Admin ↗
              </button>
              <button type="button" className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="nav-user">Hi, {user?.name?.split(" ")[0]}</span>
              <button type="button" className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          {/* SHOP CTA */}
          <button
            className="nav-cta-btn"
            type="button"
            onClick={() => onNavigate("categories")}
          >
            Shop Now
          </button>

        </div>
      </div>
    </header>
  );
}
