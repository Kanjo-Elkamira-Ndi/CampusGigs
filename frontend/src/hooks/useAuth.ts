import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi, persistAuth, usersApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import { REFRESH_TOKEN_KEY } from "@/api/axios";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (result) => {
      setAuth(result.user, result.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      toast.success(`Welcome back, ${result.user.fullName.split(" ")[0]}!`);
      navigate("/dashboard");
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (result) => {
      setAuth(result.user, result.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      toast.success("Welcome to Campus Gigs!");
      navigate(result.user.role === "POSTER" ? "/dashboard/poster" : "/dashboard");
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      clearAuth();
      queryClient.clear();
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: usersApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("If an account with that email exists, a reset link has been sent");
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
  });
}

export function useDeleteAccount() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      clearAuth();
      queryClient.clear();
      toast.success("Account deleted");
    },
  });
}

export function useSignOutAll() {
  return useMutation({
    mutationFn: authApi.signOutAll,
  });
}
