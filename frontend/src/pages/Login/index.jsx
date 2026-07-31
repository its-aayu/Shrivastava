import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./style.css";

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      onNavigate(user.role === "admin" ? "adminDashboard" : "home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <button className="authCard__brand" type="button" onClick={() => onNavigate("home")}>
          VELORA
        </button>
        <h1>Sign in</h1>
        <p className="authCard__sub">Welcome back.</p>

        {error && <div className="authCard__error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="authField">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>
          <div className="authField">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="authCard__submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="authCard__switch">
          Don't have an account?{" "}
          <button type="button" onClick={() => onNavigate("signup")}>Sign up</button>
        </p>
      </div>
    </div>
  );
}
