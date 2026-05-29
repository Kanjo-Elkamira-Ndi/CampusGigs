import { createFileRoute, Link } from "@tanstack/react-router";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { mockThreads } from "@/lib/mockData";
import { Avatar } from "@/components/shared/Avatar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages/")({
  component: () => <ProtectedRoute><Messages /></ProtectedRoute>,
});

function Messages() {
  const [activeId, setActiveId] = useState(mockThreads[0].id);
  const active = mockThreads.find((t) => t.id === activeId)!;
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid md:grid-cols-[320px_1fr] h-[calc(100vh-180px)] rounded-xl border border-border bg-card overflow-hidden">
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
      </div>
    </PageWrapper>
  );
}
