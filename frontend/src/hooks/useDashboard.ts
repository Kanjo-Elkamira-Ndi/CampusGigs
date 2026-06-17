import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api";

export function useWorkerDashboard() {
  return useQuery({
    queryKey: ["dashboard", "worker"],
    queryFn: dashboardApi.worker,
    staleTime: 30_000,
  });
}

export function usePosterDashboard() {
  return useQuery({
    queryKey: ["dashboard", "poster"],
    queryFn: dashboardApi.poster,
    staleTime: 30_000,
  });
}
