const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

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
