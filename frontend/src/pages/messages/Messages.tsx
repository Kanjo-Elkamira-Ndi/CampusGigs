import { Link } from "react-router-dom";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuthStore } from "@/store/authStore";
import { mockThreads } from "@/lib/mockData";
import { Avatar } from "@/components/shared/Avatar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useState } from "react";
import { cn } from "@/lib/utils";

function MessagesContent() {
  const activeRole = useAuthStore((s) => s.activeRole);
  const [activeId, setActiveId] = useState(mockThreads[0].id);
  const active = mockThreads.find((t) => t.id === activeId)!;
  return (
    <DashboardShell role={activeRole}>
        <div className="grid md:grid-cols-[320px_1fr] h-full rounded-xl border border-border bg-card overflow-hidden">
          <aside className="border-r border-border overflow-auto">
            {mockThreads.map((t) => {
              const last = t.messages[t.messages.length - 1];
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn("w-full text-left flex items-start gap-3 p-3 border-b border-border hover:bg-muted/40", isActive && "border-l-2 border-l-brand bg-brand-light/40 dark:bg-brand-light/20")}
                >
                  <Avatar id={t.otherUser.id} name={t.otherUser.fullName} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="font-medium text-sm truncate">{t.otherUser.fullName}</div>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{t.gigTitle}</div>
                    <div className="text-xs text-muted-foreground truncate mt-0.5">{last.text}</div>
                  </div>
                </button>
              );
            })}
          </aside>
          <div className="min-h-0">
            <ChatWindow thread={active} />
          </div>
        </div>
    </DashboardShell>
  );
}

export function Messages() {
  return <ProtectedRoute><MessagesContent /></ProtectedRoute>;
}
