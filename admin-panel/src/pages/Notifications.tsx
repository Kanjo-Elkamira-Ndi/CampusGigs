import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  LogIn,
  LogOut,
  Trash2,
  Edit3,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const actionMeta: Record<
  string,
  { label: string; icon: typeof Bell; color: string; bg: string }
> = {
  LOGIN: {
    label: "Admin logged in",
    icon: LogIn,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  LOGOUT: {
    label: "Admin logged out",
    icon: LogOut,
    color: "text-neutral-600",
    bg: "bg-neutral-100",
  },
  UPDATE_USER: {
    label: "User updated",
    icon: Edit3,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  DELETE_USER: {
    label: "User deleted",
    icon: Trash2,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  DELETE_GIG: {
    label: "Gig deleted",
    icon: Trash2,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  DELETE_REVIEW: {
    label: "Review deleted",
    icon: Star,
    color: "text-red-600",
    bg: "bg-red-50",
  },
};

function getActionMeta(action: string) {
  return (
    actionMeta[action] ?? {
      label: action,
      icon: AlertCircle,
      color: "text-neutral-600",
      bg: "bg-neutral-100",
    }
  );
}

export default function Notifications() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useAuditLogs({
    limit: 20,
    page,
  });
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const markRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const markAllRead = () => {
    if (!data) return;
    setReadIds(new Set(data.data.map((l) => l.id)));
  };

  const items = data?.data ?? [];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Platform activity and audit trail.
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="gap-2"
          >
            <Check size={14} />
            Mark all read
          </Button>
        )}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={20} />
          <div className="flex-1">
            <div className="font-medium text-red-900">Failed to load notifications</div>
            <Button size="sm" variant="outline" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white p-4 flex items-center gap-4 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                <div className="h-3 bg-neutral-50 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
            <Bell size={24} className="text-neutral-400" />
          </div>
          <h3 className="font-semibold text-neutral-900">No notifications</h3>
          <p className="text-sm text-neutral-500 mt-1">
            Platform activity will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {items.map((log) => {
                const meta = getActionMeta(log.action);
                const isRead = readIds.has(log.id);
                return (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => markRead(log.id)}
                    className={cn(
                      "rounded-2xl border border-neutral-200 bg-white p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-neutral-300",
                      !isRead && "border-l-4 border-l-indigo-500 bg-indigo-50/30",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        meta.bg,
                      )}
                    >
                      <meta.icon size={18} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-medium text-neutral-900">
                          {meta.label}
                        </span>
                        <span className="text-xs text-neutral-400 shrink-0">
                          {relativeTime(log.createdAt)}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 mt-0.5 truncate">
                        {log.action === "LOGIN" || log.action === "LOGOUT"
                          ? `${log.admin?.fullName ?? "Unknown"}`
                          : `${log.admin?.fullName ?? "Unknown"} — ${log.targetType ?? "item"} ${
                              log.targetId ? `(${log.targetId.slice(0, 8)}…)` : ""
                            }`}
                      </div>
                    </div>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {data && data.total > 20 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-xs text-neutral-500">
                Page {page} of {Math.ceil(data.total / 20)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(data.total / 20)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
