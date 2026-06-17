import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { gigsApi, type ListGigsParams, type CreateGigInput, type UpdateGigInput } from "@/api";

export function useGigs(params?: ListGigsParams) {
  return useQuery({
    queryKey: ["gigs", params],
    queryFn: () => gigsApi.list(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useGig(id: string) {
  return useQuery({
    queryKey: ["gigs", id],
    queryFn: () => gigsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGigInput) => gigsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gigs"] });
      toast.success("Gig posted successfully!");
    },
  });
}

export function useUpdateGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGigInput }) => gigsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["gigs"] });
      qc.invalidateQueries({ queryKey: ["gigs", id] });
      toast.success("Gig updated");
    },
  });
}

export function useDeleteGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gigsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gigs"] });
      toast.success("Gig cancelled");
    },
  });
}

export function useCloseGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gigsApi.close(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["gigs"] });
      qc.invalidateQueries({ queryKey: ["gigs", id] });
      toast.success("Gig closed");
    },
  });
}

export function useSaveGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gigsApi.save(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gigs", "saved"] });
      toast.success("Gig saved");
    },
  });
}

export function useUnsaveGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gigsApi.unsave(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gigs", "saved"] });
      toast.success("Gig unsaved");
    },
  });
}

export function useSavedGigs() {
  return useQuery({
    queryKey: ["gigs", "saved"],
    queryFn: gigsApi.getSaved,
    staleTime: 30_000,
  });
}
