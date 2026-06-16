import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi, type CreateReviewInput } from "@/api";

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewInput) => reviewsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["gigs"] });
      toast.success("Review submitted");
    },
  });
}
