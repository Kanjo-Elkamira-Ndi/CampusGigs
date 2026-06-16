import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi } from "@/api/reviews.api";

export function useReviews(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => reviewsApi.list(params),
    retry: false,
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Delete failed"),
  });
}
