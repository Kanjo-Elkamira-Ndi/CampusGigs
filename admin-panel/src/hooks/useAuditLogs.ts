import { useCallback, useEffect, useMemo, useState } from "react";
import { auditLogsApi, type AuditLogsListParams, type AuditLogsListResponse } from "@/api/auditLogs.api";

export function useAuditLogs(params: AuditLogsListParams) {
  const [data, setData] = useState<AuditLogsListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(undefined);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await auditLogsApi.list(JSON.parse(paramsKey));
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
