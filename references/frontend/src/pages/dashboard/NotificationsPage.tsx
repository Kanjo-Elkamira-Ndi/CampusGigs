import { motion } from "framer-motion";
import { useState } from "react";
import { Bell, UserPlus, MessageSquare, Star, Info, CheckCheck } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuthStore } from "@/store/authStore";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockNotifications, type NotificationItem } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const TYPE_ICON = {
  application: UserPlus,
  message: MessageSquare,
  review: Star,
  gig_update: Info,
};

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function NotificationsContent() {
  const activeRole = useAuthStore((s) => s.activeRole);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const filtered = filter === "ALL" ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const toggleRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <PageWrapper>
      <DashboardShell role={activeRole}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 mb-4">
          {(["ALL", "UNREAD"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {f === "ALL" ? "All" : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No notifications"
            description={filter === "UNREAD" ? "You've read everything." : "You don't have any notifications yet."}
            icon={<Bell size={36} />}
          />
        ) : (
          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            {filtered.map((n) => {
              const Icon = TYPE_ICON[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => toggleRead(n.id)}
                  className={cn(
                    "w-full text-left flex items-start gap-4 p-4 border-b border-border last:border-b-0 transition-colors hover:bg-muted/40",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                      n.type === "application" && "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
                      n.type === "message" && "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
                      n.type === "review" && "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
                      n.type === "gig_update" && "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>{n.title}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </DashboardShell>
    </PageWrapper>
  );
}

export function NotificationsPage() {
  return <ProtectedRoute><NotificationsContent /></ProtectedRoute>;
}
