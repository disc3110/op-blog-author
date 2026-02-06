const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function getAuthToken() {
  return localStorage.getItem("authToken");
}

export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}