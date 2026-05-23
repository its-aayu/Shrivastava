import { useEffect, useState } from "react";
import { adminApi } from "../../../lib/api";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    adminApi
      .getUsers()
      .then((res) => setUsers(res.data ?? []))
      .catch(() => setError("Could not load users."))
      .finally(() => setLoading(false));
  }, []);

  async function toggleRole(user) {
    const newRole = user.role === "admin" ? "customer" : "admin";
    setUpdating(user.id);
    try {
      await adminApi.setRole(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch {
      // silently fail — user can retry
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <div className="dash-empty"><div className="dash-empty-text">Loading users…</div></div>;
  if (error)   return <div className="dash-empty"><div className="dash-empty-text" style={{ color: "#dc2626" }}>{error}</div></div>;
  if (!users.length) return <div className="dash-empty"><div className="dash-empty-icon">👤</div><div className="dash-empty-title">No users yet</div></div>;

  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Orders</th>
            <th>Spend (₹)</th>
            <th>Joined</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={{ fontWeight: 500 }}>{u.name}</td>
              <td className="muted">{u.email}</td>
              <td className="muted">{u.city || "—"}</td>
              <td>{u.total_orders}</td>
              <td>{u.total_spend.toLocaleString("en-IN")}</td>
              <td className="muted">{u.created_at ?? "—"}</td>
              <td>
                <button
                  className={`status-badge ${u.role === "admin" ? "status-processing" : "status-completed"}`}
                  style={{ cursor: "pointer", border: "none", fontFamily: "inherit" }}
                  onClick={() => toggleRole(u)}
                  disabled={updating === u.id}
                  title={`Click to make ${u.role === "admin" ? "customer" : "admin"}`}
                >
                  {updating === u.id ? "…" : u.role}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
