import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to={"/login?from=" + encodeURIComponent(location.pathname)} replace />;
  }
  return <>{children}</>;
}
