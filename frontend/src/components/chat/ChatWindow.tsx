import type { ChatThread } from "@/types";
import { Avatar } from "@/components/shared/Avatar";
import { MessageBubble } from "./MessageBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

export function ChatWindow({ thread }: { thread: ChatThread }) {
  const user = useAuthStore((s) => s.user);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const meId = user?.id ?? "u3";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.id]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border shrink-0">
        <Avatar id={thread.otherUser.id} name={thread.otherUser.fullName} size={36} />
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{thread.otherUser.fullName}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
            <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {thread.gigTitle}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1.5 scroll-smooth">
        <AnimatePresence initial={false}>
          {thread.messages.map((m, i) => {
            const prev = thread.messages[i - 1];
            const isConsecutive = prev && prev.fromUserId === m.fromUserId;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <MessageBubble
                  text={m.text}
                  sentAt={m.sentAt}
                  isMe={m.fromUserId === meId}
                  isConsecutive={isConsecutive}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setDraft(""); }}
        className="p-4 border-t border-border shrink-0"
      >
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-xl border-border/60 bg-muted/30 focus-visible:bg-background transition-colors"
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] transition-all duration-150"
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}
