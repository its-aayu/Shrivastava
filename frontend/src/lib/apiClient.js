const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

function getToken() {
  return localStorage.getItem("velora_token");
}

function handleUnauthorized() {
  localStorage.removeItem("velora_token");
  localStorage.removeItem("velora_user");
  // Dispatch a custom event so AuthContext can react without a hard import cycle
  window.dispatchEvent(new CustomEvent("velora:unauthorized"));
}

function normalizeError(status, body) {
  if (status === 401) return "Session expired. Please sign in again.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "Resource not found.";
  if (status === 422) {
    // FastAPI validation errors have a list of details
    const detail = body?.detail;
    if (Array.isArray(detail)) {
      return detail.map((e) => e.msg || e.message).join("; ");
    }
    return detail || "Validation failed.";
  }
  if (status >= 500) return "Server error. Please try again in a moment.";
  return body?.detail || body?.message || `Request failed (${status}).`;
}

async function request(path, options = {}, retries = 1) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = { ...options.headers };

  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    // Network-level failure (offline, DNS, CORS preflight error)
    throw new Error("Network error — check your connection and try again.");
  }

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error(normalizeError(401, null));
  }

  if (!res.ok) {
    // Retry once on 5xx errors
    if (res.status >= 500 && retries > 0) {
      await new Promise((r) => setTimeout(r, 800));
      return request(path, options, retries - 1);
    }
    const body = await res.json().catch(() => ({}));
    throw new Error(normalizeError(res.status, body));
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

export default request;
