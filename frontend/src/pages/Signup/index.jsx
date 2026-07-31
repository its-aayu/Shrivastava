import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../Login/style.css";
import "./style.css";

export default function Signup({ onNavigate }) {
  const { signup } = useAuth();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      onNavigate("home");
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
        <h1>Create account</h1>
        <p className="authCard__sub">Start ordering custom prints and gifts.</p>

        {error && <div className="authCard__error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="authField">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              autoComplete="name"
              autoFocus
            />
          </div>
          <div className="authField">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="authField">
            <label htmlFor="signup-password">Password <small>(min 10 characters)</small></label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="authCard__submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="authCard__switch">
          Already have an account?{" "}
          <button type="button" onClick={() => onNavigate("login")}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
