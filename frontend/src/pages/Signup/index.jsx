import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../lib/api";
import "../Login/style.css";

export default function Signup({ onNavigate }) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.signup(name, email, password);
      const userData = { id: res.data.user_id, name: res.data.name, email: res.data.email, role: res.data.role };
      login(res.data.access_token, userData);
      toast.success(`Account created! Welcome, ${res.data.name?.split(" ")[0] ?? "there"}.`, {
        description: "You can now browse products and place orders.",
      });
      onNavigate("home");
    } catch (err) {
      const msg = err.message || "Sign up failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      >
        <button className="auth-back" onClick={() => onNavigate("home")}>
          ← Back to site
        </button>

        <div className="auth-logo">
          <div className="auth-brand-mark">A</div>
          <div className="auth-logo-name">VELORA STUDIO</div>
          <div className="auth-logo-sub">Create Your Account</div>
        </div>

        <h1 className="auth-title">Get started</h1>
        <p className="auth-subtitle">Create a free account to place and track orders</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              className="auth-input"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="auth-input"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <button className="auth-link" onClick={() => onNavigate("login")}>
            Sign in
          </button>
        </div>
      </Motion.div>
    </div>
  );
}
