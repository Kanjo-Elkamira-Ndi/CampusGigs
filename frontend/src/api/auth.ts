import { api, extractData, REFRESH_TOKEN_KEY } from "./axios";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role: "WORKER" | "POSTER";
  universityId: string;
}

export const authApi = {
  login: (data: LoginInput) =>
    api.post<{ success: boolean; data: AuthResult }>("/auth/login", data).then(extractData<AuthResult>),

  register: (data: RegisterInput) =>
    api.post<{ success: boolean; data: AuthResult }>("/auth/register", data).then(extractData<AuthResult>),

  logout: () =>
    api.post("/auth/logout").then(extractData<null>),

  refresh: (refreshToken: string) =>
    api
      .post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>("/auth/refresh", { refreshToken })
      .then(extractData<{ accessToken: string; refreshToken: string }>),

  getMe: () =>
    api.get<{ success: boolean; data: User }>("/auth/me").then(extractData<User>),

  verifyEmail: (email: string) =>
    api.post("/auth/verify-email", { email }).then(extractData<null>),

  resendVerification: () =>
    api.post("/auth/resend-verification").then(extractData<null>),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/auth/change-password", { currentPassword, newPassword }).then(extractData<null>),

  deleteAccount: () =>
    api.delete("/auth/delete-account").then(extractData<null>),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }).then(extractData<null>),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }).then(extractData<null>),

  signOutAll: () =>
    api.post("/auth/sessions/sign-out-all").then(extractData<null>),
};

export function persistAuth(result: AuthResult) {
  const { user, accessToken, refreshToken } = result;
  useAuthStore.getState().setAuth(user, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}
