import { useAuth } from "../../../context/AuthContext";

const IconOverview = (
  <svg className="dash-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V4zM2 14a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" />
  </svg>
);
const IconUsers = (
  <svg className="dash-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);
const IconOrders = (
  <svg className="dash-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);
const IconUploads = (
  <svg className="dash-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);
const IconAI = (
  <svg className="dash-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
  </svg>
);
const IconSettings = (
  <svg className="dash-nav-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const CUSTOMER_NAV = [
  { id: "overview",  label: "Overview",     icon: IconOverview },
  { id: "orders",    label: "Orders",        icon: IconOrders },
  { id: "uploads",   label: "Uploads",       icon: IconUploads },
  { id: "ai",        label: "AI Assistant",  icon: IconAI },
];

const ADMIN_NAV = [
  { id: "overview",  label: "Overview",     icon: IconOverview },
  { id: "users",     label: "All Users",    icon: IconUsers },
  { id: "orders",    label: "All Orders",   icon: IconOrders },
  { id: "uploads",   label: "Uploads",      icon: IconUploads },
  { id: "ai",        label: "AI Assistant", icon: IconAI },
];

const BOTTOM_NAV = [
  { id: "settings", label: "Settings", icon: IconSettings },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const displayName = user?.name ?? "Guest";
  const role = user?.role ?? "customer";
  const isAdmin = role === "admin";
  const navItems = isAdmin ? ADMIN_NAV : CUSTOMER_NAV;

  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar-logo">
        <div className="dash-sidebar-logo-mark">A</div>
        <div className="dash-sidebar-logo-name">Aayu Printing</div>
        <div className="dash-sidebar-logo-sub">
          {isAdmin ? "Admin Panel" : "Studio Dashboard"}
        </div>
      </div>

      <nav className="dash-nav">
        <div className="dash-nav-section-label">{isAdmin ? "Admin" : "Main"}</div>

        {navItems.map((item) => (
          <button
            key={item.id}
            className={`dash-nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="dash-nav-divider" />
        <div className="dash-nav-section-label">Account</div>

        {BOTTOM_NAV.map((item) => (
          <button
            key={item.id}
            className={`dash-nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="dash-sidebar-user">
        <div className="dash-user-avatar">{displayName.charAt(0).toUpperCase()}</div>
        <div className="dash-user-info">
          <div className="dash-user-name">{displayName}</div>
          <div className="dash-user-role" style={isAdmin ? { color: "var(--primary)", fontWeight: 600 } : {}}>
            {isAdmin ? "Admin" : "Customer"}
          </div>
        </div>
      </div>
    </aside>
  );
}
