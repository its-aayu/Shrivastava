import { createContext, useContext, useEffect, useState } from "react";
import request from "../lib/apiClient";

const AuthContext = createContext(null);

function loadUser() {
  try { return JSON.parse(localStorage.getItem("velora_user")); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    const handler = () => { setUser(null); localStorage.removeItem("velora_user"); localStorage.removeItem("velora_token"); };
    window.addEventListener("velora:unauthorized", handler);
    return () => window.removeEventListener("velora:unauthorized", handler);
  }, []);

  async function login(email, password) {
    const res = await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("velora_token", res.data.access_token);
    const me = await request("/auth/me");
    localStorage.setItem("velora_user", JSON.stringify(me));
    setUser(me);
    return me;
  }

  async function signup(name, email, password) {
    const res = await request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });
    const { access_token, user_id, email: userEmail, name: userName, role } = res.data;
    localStorage.setItem("velora_token", access_token);
    const me = { id: user_id, email: userEmail, name: userName, role };
    localStorage.setItem("velora_user", JSON.stringify(me));
    setUser(me);
    return me;
  }

  function logout() {
    localStorage.removeItem("velora_token");
    localStorage.removeItem("velora_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
