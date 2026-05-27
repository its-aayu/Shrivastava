import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("aayu_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("aayu_token");
    if (!stored) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("aayu_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-logout when any API call receives a 401 (token expired/revoked)
  useEffect(() => {
    function onUnauthorized() {
      setToken(null);
      setUser(null);
    }
    window.addEventListener("aayu:unauthorized", onUnauthorized);
    return () => window.removeEventListener("aayu:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback((newToken, userData = null) => {
    localStorage.setItem("aayu_token", newToken);
    setToken(newToken);
    if (userData) setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aayu_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
