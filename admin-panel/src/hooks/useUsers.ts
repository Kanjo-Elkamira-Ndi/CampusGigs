import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { usersApi, type UsersListParams, type UsersListResponse } from "@/api/users.api";

export function useUsers(params: UsersListParams) {
  const [data, setData] = useState<UsersListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(undefined);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await usersApi.list(JSON.parse(paramsKey));
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

export function useUpdateUser() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    vars: { id: string; payload: Record<string, unknown> },
    options?: { onSuccess?: () => void; onError?: (e: unknown) => void }
  ) => {
    setIsPending(true);
    try {
      await usersApi.update(vars.id as string, vars.payload);
      toast.success("User updated");
      options?.onSuccess?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Update failed");
      options?.onError?.(e);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}

export function useDeleteUser() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    id: string,
    options?: { onSuccess?: () => void; onError?: (e: unknown) => void }
  ) => {
    setIsPending(true);
    try {
      await usersApi.remove(id as string);
      toast.success("User deleted");
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
