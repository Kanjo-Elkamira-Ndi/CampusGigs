import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, Copy, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { Pagination } from "@/components/shared/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { JsonViewer } from "@/components/shared/JsonViewer";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { formatDateTime, relativeTime } from "@/lib/format";
import type { AuditLogRow } from "@/api/auditLogs.api";
import { cn } from "@/lib/utils";

const LIMIT = 50;
const ACTIONS = [
  "LOGIN",
  "LOGOUT",
  "UPDATE_USER",
  "DELETE_USER",
  "DELETE_GIG",
  "DELETE_REVIEW",
];

function actionTone(action: string) {
  if (action.startsWith("DELETE_")) return "red" as const;
  if (action.startsWith("UPDATE_")) return "amber" as const;
  return "neutral" as const;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="ml-1 text-neutral-400 hover:text-neutral-700"
      aria-label="Copy"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

export default function AuditLogs() {
  const [action, setAction] = useState("all");
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useAuditLogs({
    action: action === "all" ? undefined : action,
    from: from ? from.toISOString() : undefined,
    to: to ? to.toISOString() : undefined,
    page,
    limit: LIMIT,
  });

  const columns: DataTableColumn<AuditLogRow>[] = [
    {
      key: "admin",
      header: "Admin",
      render: (l) => (
        <div className="min-w-0">
          <div className="font-medium text-neutral-900 truncate">
            {l.admin?.fullName ?? "—"}
          </div>
          <div className="text-xs text-neutral-500 truncate">{l.admin?.email ?? ""}</div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (l) => <StatusBadge tone={actionTone(l.action)}>{l.action}</StatusBadge>,
    },
    {
      key: "target",
      header: "Target",
      render: (l) => (
        <div className="flex items-center gap-1 text-xs text-neutral-700">
          {l.targetType ? (
            <>
              <span>{l.targetType}</span>
              {l.targetId && (
                <span className="font-mono text-neutral-500">
                  {l.targetId.slice(0, 8)}…<CopyButton value={l.targetId} />
                </span>
              )}
            </>
          ) : (
            <span className="text-neutral-300">—</span>
          )}
        </div>
      ),
    },
    {
      key: "meta",
      header: "Meta",
      render: (l) => <JsonViewer data={l.meta} />,
    },
    {
      key: "ip",
      header: "IP",
      render: (l) => (
        <span className="font-mono text-xs text-neutral-500">{l.ip ?? "—"}</span>
      ),
    },
    {
      key: "time",
      header: "Time",
      render: (l) => (
        <div className="text-xs">
          <div className="text-neutral-700">{formatDateTime(l.createdAt)}</div>
          <div className="text-neutral-400">{relativeTime(l.createdAt)}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">Audit Logs</h1>
        <StatusBadge tone="neutral">Append-only — never edited</StatusBadge>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white border border-neutral-200 rounded-2xl p-3">
        <Select
          value={action}
          onValueChange={(v) => {
            setAction(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {[
          { label: "From", value: from, set: setFrom },
          { label: "To", value: to, set: setTo },
        ].map((d) => (
          <Popover key={d.label}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-9 font-normal",
                  !d.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon size={14} className="mr-2" />
                {d.value ? format(d.value, "PP") : d.label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={d.value}
                onSelect={d.set}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        ))}

        {(from || to) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFrom(undefined);
              setTo(undefined);
              setPage(1);
            }}
          >
            Clear dates
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(l) => l.id}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        emptyIcon={ScrollText}
        emptyTitle="No audit log entries"
      />

      {data && data.total > 0 && (
        <Pagination page={page} limit={LIMIT} total={data.total} onPageChange={setPage} />
      )}
    </div>
  );
}
