import { api } from "./axios";

export interface AuditLogRow {
  id: string;
  admin?: { id: string; fullName: string; email: string } | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  meta?: Record<string, unknown> | null;
  ip?: string | null;
  createdAt: string;
}

export interface AuditLogsListResponse {
  data: AuditLogRow[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditLogsListParams {
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const auditLogsApi = {
  list: (params: AuditLogsListParams) =>
    api.get<AuditLogsListResponse>("/audit-logs", { params }).then((r) => r.data),
};
