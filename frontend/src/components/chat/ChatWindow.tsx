import type { ChatThread } from "@/types";
import { Avatar } from "@/components/shared/Avatar";
import { MessageBubble } from "./MessageBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export function ChatWindow({ thread }: { thread: ChatThread }) {
  const user = useAuthStore((s) => s.user);
  const [draft, setDraft] = useState("");
  const meId = user?.id ?? "u3";
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Avatar id={thread.otherUser.id} name={thread.otherUser.fullName} size={36} />
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{thread.otherUser.fullName}</div>
          <div className="text-xs text-muted-foreground truncate">on “{thread.gigTitle}”</div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-2 bg-muted/20">
        {thread.messages.map((m) => (
          <MessageBubble key={m.id} text={m.text} sentAt={m.sentAt} isMe={m.fromUserId === meId} />
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); setDraft(""); }}
        className="p-3 border-t border-border flex gap-2"
      >
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" />
        <Button type="submit" className="bg-brand hover:bg-[color:var(--brand-dark)] text-white" size="icon"><Send size={16} /></Button>
      </form>
    </div>
  );
}
