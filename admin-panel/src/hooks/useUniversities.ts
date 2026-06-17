import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { universitiesApi } from "@/api/universities.api";
import type { University } from "@/api/universities.api";

export function useUniversities() {
  const [data, setData] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(undefined);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await universitiesApi.list();
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

export function useCreateUniversity() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    payload: { name: string; city: string; type: "public" | "private" },
    options?: { onSuccess?: () => void; onError?: (e: unknown) => void }
  ) => {
    setIsPending(true);
    try {
      await universitiesApi.create(payload);
      toast.success("University created");
      options?.onSuccess?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Create failed");
      options?.onError?.(e);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
