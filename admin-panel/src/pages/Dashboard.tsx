import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Send,
  Users as UsersIcon,
  AlertCircle,
} from "lucide-react";
import { api } from "@/api/axios";
import { StatCard } from "@/components/shared/StatCard";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { relativeTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalUsers: number;
  totalGigs: number;
  totalApplications: number;
  activeUniversities: number;
  bannedUsers?: number;
  unverifiedUsers?: number;
  openGigs?: number;
  completedGigs?: number;
}

function actionTone(action: string): "neutral" | "amber" | "red" {
  if (action.startsWith("DELETE_")) return "red";
  if (action.startsWith("UPDATE_")) return "amber";
  return "neutral";
}

export default function Dashboard() {
  const stats = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.get<DashboardStats>("/dashboard").then((r) => r.data),
  });
  const logs = useAuditLogs({ limit: 5, page: 1 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Platform overview — real-time stats
        </p>
      </div>

      {stats.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
          <AlertCircle className="text-red-500" />
          <div className="flex-1">
            <div className="font-medium text-red-900">Failed to load dashboard</div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => stats.refetch()}
            >
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            label="Total Users"
            value={stats.data?.totalUsers ?? 0}
            icon={UsersIcon}
            color="indigo"
            isLoading={stats.isLoading}
          />
          <StatCard
            label="Total Gigs"
            value={stats.data?.totalGigs ?? 0}
            icon={Briefcase}
            color="green"
            isLoading={stats.isLoading}
          />
          <StatCard
            label="Total Applications"
            value={stats.data?.totalApplications ?? 0}
            icon={Send}
            color="amber"
            isLoading={stats.isLoading}
          />
          <StatCard
            label="Active Universities"
            value={stats.data?.activeUniversities ?? 0}
            icon={Building2}
            color="rose"
            isLoading={stats.isLoading}
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Recent Activity</h3>
            <Link
              to="/audit-logs"
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {logs.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))
            ) : logs.data?.data.length ? (
              logs.data.data.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <StatusBadge tone={actionTone(log.action)}>{log.action}</StatusBadge>
                    <span className="text-xs text-neutral-600 truncate">
                      {log.targetType ?? "—"}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 shrink-0">
                    {relativeTime(log.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No recent activity</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Platform health</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: "Banned users", value: stats.data?.bannedUsers ?? 0 },
              { label: "Unverified users", value: stats.data?.unverifiedUsers ?? 0 },
              { label: "Open gigs", value: stats.data?.openGigs ?? 0 },
              { label: "Completed gigs", value: stats.data?.completedGigs ?? 0 },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
              >
                <span className="text-neutral-600">{row.label}</span>
                <span className="font-semibold text-neutral-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
