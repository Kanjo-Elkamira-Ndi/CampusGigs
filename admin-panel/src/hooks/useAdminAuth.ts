import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/api/auth.api";
import { useAdminAuthStore } from "@/store/adminAuthStore";

export function useLogin() {
  const setAdmin = useAdminAuthStore((s) => s.setAdmin);
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const mutate = async (vars: { email: string; password: string }) => {
    setIsPending(true);
    try {
      const data = await authApi.login(vars.email, vars.password);
      setAdmin(data.admin);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Login failed");
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}

export function useLogout() {
  const clearAdmin = useAdminAuthStore((s) => s.clearAdmin);
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const mutate = async () => {
    setIsPending(true);
    try {
      await authApi.logout();
    } finally {
      clearAdmin();
      navigate("/login");
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
