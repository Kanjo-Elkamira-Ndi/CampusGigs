import { useQuery } from "@tanstack/react-query";
import { auditLogsApi, type AuditLogsListParams } from "@/api/auditLogs.api";

export function useAuditLogs(params: AuditLogsListParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => auditLogsApi.list(params),
  });
}
