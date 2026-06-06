import { useAuth } from "../../../context/AuthContext";

const TITLES = {
  overview: "Overview",
  orders: "Orders",
  uploads: "File Uploads",
  ai: "AI Print Assistant",
};

export default function DashboardHeader({ activeTab, onNavigate }) {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    onNavigate("home");
  }

  const displayName = user?.name ?? "Guest";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <h1 className="dash-header-title">{TITLES[activeTab] ?? "Dashboard"}</h1>
        <span className="dash-header-breadcrumb">Aayu Printing Studio</span>
      </div>

      <div className="dash-header-right">
        <span className="dash-header-greeting">
          Hello, <strong>{displayName.split(" ")[0]}</strong>
        </span>
        <button className="dash-logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
