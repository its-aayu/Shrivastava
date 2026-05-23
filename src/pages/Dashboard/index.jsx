import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { adminApi, ordersApi } from "../../lib/api";
import mockOrders from "../../mock-data/orders.json";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import DashboardCard from "./components/DashboardCard";
import OrdersTable from "./components/OrdersTable";
import UploadsTable from "./components/UploadsTable";
import UsersTable from "./components/UsersTable";
import ChatPanel from "./components/ChatPanel";
import "./style.css";

// ── icons ──────────────────────────────────────────────────────────────────
const IconOrders = (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 22, height: 22 }}>
    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
  </svg>
);

const IconPending = (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 22, height: 22 }}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const IconUploads = (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 22, height: 22 }}>
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const IconAI = (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 22, height: 22 }}>
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
  </svg>
);

// ── helpers ─────────────────────────────────────────────────────────────────
function getUploadsCount() {
  try {
    const h = JSON.parse(localStorage.getItem("aayu_uploads") ?? "[]");
    return h.length;
  } catch {
    return 0;
  }
}

// ── sections ─────────────────────────────────────────────────────────────────

function CustomerOverview({ orders, loading, setActiveTab }) {
  const pending = orders.filter((o) => (o.status ?? "").toLowerCase() === "pending").length;
  const uploadsCount = getUploadsCount();

  const cards = [
    { icon: { el: IconOrders, variant: "icon-pink" },  label: "Total Orders",   value: loading ? "…" : orders.length, tag: "All time",                                      tagVariant: "neutral" },
    { icon: { el: IconPending, variant: "icon-amber" }, label: "Pending",        value: loading ? "…" : pending,       tag: pending > 0 ? "Action needed" : "All clear",    tagVariant: pending > 0 ? "amber" : "green" },
    { icon: { el: IconUploads, variant: "icon-blue" },  label: "Files Uploaded", value: uploadsCount,                  tag: "This device",                                  tagVariant: "blue" },
    { icon: { el: IconAI, variant: "icon-green" },      label: "AI Assistant",   value: "Active",                      tag: "Beta",                                         tagVariant: "green" },
  ];

  return (
    <>
      <div className="dash-cards">
        {cards.map((c) => <DashboardCard key={c.label} {...c} />)}
      </div>
      <div className="dash-section">
        <div className="dash-section-header">
          <span className="dash-section-title">Recent Orders</span>
          <button className="dash-section-action" onClick={() => setActiveTab("orders")}>View all →</button>
        </div>
        <OrdersTable limit={5} />
      </div>
    </>
  );
}

function AdminOverview({ setActiveTab }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.getStats().then(setStats).catch(() => {});
  }, []);

  const cards = [
    { icon: { el: IconOrders, variant: "icon-pink" },  label: "Total Users",    value: stats ? stats.total_users   : "…", tag: "Registered",    tagVariant: "neutral" },
    { icon: { el: IconPending, variant: "icon-amber" }, label: "Total Orders",   value: stats ? stats.total_orders  : "…", tag: stats?.pending_orders > 0 ? `${stats.pending_orders} pending` : "All clear", tagVariant: stats?.pending_orders > 0 ? "amber" : "green" },
    { icon: { el: IconUploads, variant: "icon-blue" },  label: "Revenue (₹)",    value: stats ? `₹${(stats.total_revenue / 100).toLocaleString("en-IN")}` : "…", tag: "All orders", tagVariant: "blue" },
    { icon: { el: IconAI, variant: "icon-green" },      label: "AI Assistant",   value: "Active", tag: "Groq", tagVariant: "green" },
  ];

  return (
    <>
      <div className="dash-cards">
        {cards.map((c) => <DashboardCard key={c.label} {...c} />)}
      </div>
      <div className="dash-section">
        <div className="dash-section-header">
          <span className="dash-section-title">Recent Orders — All Customers</span>
          <button className="dash-section-action" onClick={() => setActiveTab("orders")}>View all →</button>
        </div>
        <OrdersTable limit={5} />
      </div>
      <div className="dash-section">
        <div className="dash-section-header">
          <span className="dash-section-title">Recent Users</span>
          <button className="dash-section-action" onClick={() => setActiveTab("users")}>View all →</button>
        </div>
        <UsersTable />
      </div>
    </>
  );
}

// ── main component ────────────────────────────────────────────────────────────
const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

export default function Dashboard({ onNavigate }) {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      onNavigate("login");
    }
  }, [authLoading, isAuthenticated, onNavigate]);

  // Pre-fetch orders for metric cards
  useEffect(() => {
    if (!isAuthenticated) return;
    ordersApi
      .getAll()
      .then((res) => setOrders(res.data ?? res))
      .catch(() => setOrders(mockOrders))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="dash-shell">
        <div style={{ margin: "auto", padding: 60, color: "var(--text-light)" }}>Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="dash-shell">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="dash-main">
        <DashboardHeader activeTab={activeTab} onNavigate={onNavigate} />

        <div className="dash-content">
          <Motion.div key={activeTab} {...fadeIn}>
            {activeTab === "overview" && (
              isAdmin
                ? <AdminOverview setActiveTab={setActiveTab} />
                : <CustomerOverview orders={orders} loading={ordersLoading} setActiveTab={setActiveTab} />
            )}

            {activeTab === "users" && isAdmin && (
              <div className="dash-section">
                <div className="dash-section-header">
                  <span className="dash-section-title">All Users</span>
                </div>
                <UsersTable />
              </div>
            )}

            {activeTab === "orders" && (
              <div className="dash-section">
                <div className="dash-section-header">
                  <span className="dash-section-title">{isAdmin ? "All Orders" : "My Orders"}</span>
                </div>
                <OrdersTable />
              </div>
            )}

            {activeTab === "uploads" && (
              <div className="dash-section">
                <div className="dash-section-header">
                  <span className="dash-section-title">File Uploads</span>
                </div>
                <UploadsTable />
              </div>
            )}

            {activeTab === "ai" && (
              <div className="dash-section">
                <div className="dash-section-header">
                  <span className="dash-section-title">AI Print Assistant</span>
                  <span className="dash-card-tag tag-green" style={{ fontSize: "0.72rem" }}>Beta</span>
                </div>
                <ChatPanel />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="dash-section">
                <div className="dash-section-header">
                  <span className="dash-section-title">Settings</span>
                </div>
                <div className="dash-empty">
                  <div className="dash-empty-icon">⚙</div>
                  <div className="dash-empty-title">Settings — Phase 3</div>
                  <div className="dash-empty-text">Profile and notification settings coming soon.</div>
                </div>
              </div>
            )}
          </Motion.div>
        </div>
      </div>
    </div>
  );
}
