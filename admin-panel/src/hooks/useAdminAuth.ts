import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth.api";
import { useAdminAuthStore } from "@/store/adminAuthStore";

export function useLogin() {
  const setAdmin = useAdminAuthStore((s) => s.setAdmin);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (vars: { email: string; password: string }) =>
      authApi.login(vars.email, vars.password),
    onSuccess: (data) => {
      setAdmin(data.admin);
      toast.success("Welcome back");
      navigate("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Login failed");
    },
  });
}

export function useLogout() {
  const clearAdmin = useAdminAuthStore((s) => s.clearAdmin);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAdmin();
      navigate("/login");
    },
  });
}
