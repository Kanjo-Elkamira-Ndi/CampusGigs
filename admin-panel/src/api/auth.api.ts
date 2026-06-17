import { api } from "./axios";
import type { AdminUser } from "@/store/adminAuthStore";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ admin: AdminUser }>("/auth/login", { email, password }).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  me: () => api.get<{ admin: AdminUser }>("/auth/me").then((r) => r.data),
};
