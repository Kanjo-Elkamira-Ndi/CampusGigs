import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gigsApi, type GigsListParams } from "@/api/gigs.api";

export function useGigs(params: GigsListParams) {
  return useQuery({ queryKey: ["gigs", params], queryFn: () => gigsApi.list(params) });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: () => gigsApi.categories() });
}

export function useDeleteGig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gigsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gigs"] });
      toast.success("Gig deleted");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Delete failed"),
  });
}
