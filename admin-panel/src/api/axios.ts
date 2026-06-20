import axios from "axios";

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1") + "/superadmin",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data === "object" && "success" in res.data) {
      res.data = res.data.data;
    }
    return res;
  },
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
