import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applicationsApi, type CreateApplicationInput } from "@/api";

export function useCreateApplication(gigId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateApplicationInput) => applicationsApi.create(gigId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gigs", gigId] });
      qc.invalidateQueries({ queryKey: ["applications", "my"] });
      qc.invalidateQueries({ queryKey: ["applications", "gig", gigId] });
      toast.success("Application submitted!");
    },
  });
}

export function useGigApplications(gigId: string) {
  return useQuery({
    queryKey: ["applications", "gig", gigId],
    queryFn: () => applicationsApi.listForGig(gigId),
    enabled: !!gigId,
  });
}

export function useMyApplications(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["applications", "my", params],
    queryFn: () => applicationsApi.listMy(params),
    staleTime: 30_000,
  });
}

export function useAcceptApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.accept(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Application accepted");
    },
  });
}

export function useRejectApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.reject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Application rejected");
    },
  });
}

export function useCompleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsApi.complete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applications"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Application completed");
    },
  });
}
