import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { gigsApi, type GigsListParams, type GigsListResponse } from "@/api/gigs.api";

export function useGigs(params: GigsListParams) {
  const [data, setData] = useState<GigsListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(undefined);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await gigsApi.list(JSON.parse(paramsKey));
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

export function useCategories() {
  const [data, setData] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(undefined);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await gigsApi.categories();
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useDeleteGig() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    id: string,
    options?: { onSuccess?: () => void; onError?: (e: unknown) => void }
  ) => {
    setIsPending(true);
    try {
      await gigsApi.remove(id as string);
      toast.success("Gig deleted");
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
