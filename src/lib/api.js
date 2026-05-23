const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

function getToken() {
  return localStorage.getItem("aayu_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = { ...options.headers };

  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `API error ${res.status}`);
  }

  return res.json();
}

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
  getAll: () => request("/orders/"),
  getById: (id) => request(`/orders/${id}`),
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
};

export const adminApi = {
  getStats: () => request("/admin/stats"),
  getUsers: () => request("/admin/users"),
  setRole: (userId, role) =>
    request(`/admin/users/${userId}/role?role=${role}`, { method: "PUT" }),
};
