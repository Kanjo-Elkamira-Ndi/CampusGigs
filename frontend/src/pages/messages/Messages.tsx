import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuthStore } from "@/store/authStore";
import { mockThreads } from "@/lib/mockData";
import { Avatar } from "@/components/shared/Avatar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function MessagesContent() {
  const activeRole = useAuthStore((s) => s.activeRole);
  const [activeId, setActiveId] = useState(mockThreads[0].id);
  const active = mockThreads.find((t) => t.id === activeId)!;
  return (
    <DashboardShell role={activeRole}>
      <div className="grid md:grid-cols-[340px_1fr] h-full rounded-xl border border-border bg-card overflow-hidden">
        <aside className="border-r border-border overflow-y-auto p-2 space-y-1">
          {mockThreads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            const isActive = t.id === activeId;
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
                <Avatar id={t.otherUser.id} name={t.otherUser.fullName} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-medium text-sm truncate">{t.otherUser.fullName}</div>
                    <span className="text-[10px] tabular-nums text-muted-foreground shrink-0">
                      {new Date(last.sentAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{t.gigTitle}</div>
                  <div className="text-xs text-muted-foreground/70 truncate mt-0.5">{last.text}</div>
                </div>
              </button>
            );
          })}
        </aside>
        <div className="min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <ChatWindow thread={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  );
}

export function Messages() {
  return <ProtectedRoute><MessagesContent /></ProtectedRoute>;
}
