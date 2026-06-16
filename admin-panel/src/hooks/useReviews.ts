import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { reviewsApi, type ReviewsListResponse } from "@/api/reviews.api";

export function useReviews(params: { page?: number; limit?: number }) {
  const [data, setData] = useState<ReviewsListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(undefined);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await reviewsApi.list(JSON.parse(paramsKey));
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useDeleteReview() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    id: string,
    options?: { onSuccess?: () => void; onError?: (e: unknown) => void }
  ) => {
    setIsPending(true);
    try {
      await reviewsApi.remove(id as string);
      toast.success("Review deleted");
      options?.onSuccess?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Delete failed");
      options?.onError?.(e);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
