import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuthStore } from "@/store/authStore";
import { useThreads } from "@/hooks/useMessages";
import { useSocket } from "@/hooks/useSocket";
import { Avatar } from "@/components/shared/Avatar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function MessagesContent() {
  const activeRole = useAuthStore((s) => s.activeRole);
  const { data: threads } = useThreads();
  const threadList = threads ?? [];
  const [activeId, setActiveId] = useState(threadList[0]?.id ?? "");
  const active = threadList.find((t) => t.id === activeId) ?? threadList[0];

  const {
    isUserOnline,
    setActiveThread,
    joinThread,
    leaveThread,
    emitTypingStart,
    emitTypingStop,
    emitMessageRead,
  } = useSocket();

  useEffect(() => {
    setActiveThread(activeId);
  }, [activeId, setActiveThread]);

  useEffect(() => {
    if (activeId) {
      joinThread(activeId);
      return () => leaveThread(activeId);
    }
  }, [activeId]);

  return (
    <DashboardShell role={activeRole}>
      <div className="grid md:grid-cols-[340px_1fr] h-full rounded-xl border border-border bg-card overflow-hidden">
        <aside className="border-r border-border overflow-y-auto p-2 space-y-1">
          {threadList.map((t) => {
            const last = t.messages?.[t.messages.length - 1];
            const isActive = t.id === activeId;
            const online = isUserOnline(t.otherUser.id);
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={cn(
                  "w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-150 active:scale-[0.98]",
                  "hover:bg-muted/50",
                  isActive && "bg-indigo-50 dark:bg-indigo-950/40",
                )}
              >
                <div className="relative shrink-0">
                  <Avatar id={t.otherUser.id} name={t.otherUser.fullName} src={t.otherUser.avatarUrl} size={40} />
                  {online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-medium text-sm truncate">{t.otherUser.fullName}</div>
                    {last && (
                      <span className="text-[10px] tabular-nums text-muted-foreground shrink-0">
                        {new Date(last.sentAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{t.gigTitle}</div>
                  <div className="flex items-center gap-2">
                    {last && (
                      <span className="text-xs text-muted-foreground/70 truncate">
                        {last.isVoice ? "🎤 Voice message" : last.text}
                      </span>
                    )}
                    {(t.unreadCount ?? 0) > 0 && (
                      <span className="shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-indigo-600 text-[10px] font-bold text-white px-1">
                        {t.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>
        <div className="min-h-0">
          {active ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full"
              >
                <ChatWindow
                  thread={active}
                  online={isUserOnline(active.otherUser.id)}
                  onTypingStart={emitTypingStart}
                  onTypingStop={emitTypingStop}
                  onMessageRead={emitMessageRead}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No conversations yet
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export function Messages() {
  return <ProtectedRoute><MessagesContent /></ProtectedRoute>;
}
