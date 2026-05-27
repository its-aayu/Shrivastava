import request from "./apiClient";

export const productsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== false))
    ).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getFeatured: () => request("/products/featured"),
  getById: (idOrSlug) => request(`/products/${idOrSlug}`),
};

export const authApi = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, email, password) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => request("/auth/me"),
};

export const ordersApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    ).toString();
    return request(`/orders/${qs ? `?${qs}` : ""}`);
  },
  getById: (id) => request(`/orders/${id}`),
  create: (payload) =>
    request("/orders/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateStatus: (id, status) =>
    request(`/orders/${id}/status?status=${status}`, { method: "PATCH" }),
};

export const uploadsApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/uploads", { method: "POST", body: formData });
  },
};

export const chatApi = {
  send: (message, session_id) =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify({ message, session_id }),
    }),
  getHistory: (session_id) => request(`/chat/history/${session_id}`),
  getSessions: () => request("/chat/sessions"),
  deleteSession: (session_id) =>
    request(`/chat/sessions/${session_id}`, { method: "DELETE" }),
};

export const searchApi = {
  query: (q, top_k = 5) =>
    request(`/search?q=${encodeURIComponent(q)}&top_k=${top_k}`),
  stats: () => request("/search/stats"),
};

export const widgetApi = {
  send: (message, session_id) =>
    request("/chat/widget", {
      method: "POST",
      body: JSON.stringify({ message, session_id }),
    }),
};

export const adminApi = {
  getStats: () => request("/admin/stats"),
  getUsers: () => request("/admin/users"),
  setRole: (userId, role) =>
    request(`/admin/users/${userId}/role?role=${role}`, { method: "PUT" }),
};
