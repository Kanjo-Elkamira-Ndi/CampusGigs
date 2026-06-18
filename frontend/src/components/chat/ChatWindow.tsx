import type { ChatThread, ChatMessage, MessageAttachment } from "@/types";
import { Avatar } from "@/components/shared/Avatar";
import { MessageBubble } from "./MessageBubble";
import { EmojiPicker } from "./EmojiPicker";
import { AttachmentMenu } from "./AttachmentMenu";
import { VoiceRecorder } from "./VoiceRecorder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Send, Smile, Paperclip, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSendMessage } from "@/hooks/useMessages";
import { messagesApi } from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import { cn, timeAgo } from "@/lib/utils";

const springConfig = { duration: 0.15, ease: "easeOut" as const };

interface Props {
  thread: ChatThread;
  online: boolean;
  onTypingStart: (threadId: string) => void;
  onTypingStop: (threadId: string) => void;
  onMessageRead: (threadId: string) => void;
}

export function ChatWindow({ thread, online, onTypingStart, onTypingStop, onMessageRead }: Props) {
  const user = useAuthStore((s) => s.user);
  const [draft, setDraft] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [contextMsg, setContextMsg] = useState<ChatMessage | null>(null);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const contextRef = useRef<HTMLDivElement>(null);
  const meId = user?.id ?? "";
  const send = useSendMessage(thread.id);
  const lastSeen = thread.otherUser.lastSeen;

  useEffect(() => {
    onMessageRead(thread.id);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowEmoji(false);
    setReplyTo(null);
  }, [thread.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMsg(null);
      }
    };
    if (contextMsg) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMsg]);

  const handleEmojiSelect = (emoji: string) => {
    setDraft((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleDraftChange = (val: string) => {
    setDraft(val);
    if (val.trim()) {
      onTypingStart(thread.id);
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => onTypingStop(thread.id), 1500);
    } else {
      onTypingStop(thread.id);
    }
  };

  const handleAttach = async (files: FileList, type: "image" | "file") => {
    if (type !== "image") {
      setDraft((prev) => prev + `[file: ${Array.from(files).map((f) => f.name).join(", ")}] `);
      return;
    }
    setUploading(true);
    try {
      const uploaded: MessageAttachment[] = [];
      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/")) {
          const { url } = await messagesApi.uploadImage(file);
          uploaded.push({ type: "image", url, fileName: file.name, fileSize: file.size, fileType: file.type });
        }
      }
      if (uploaded.length > 0) {
        send.mutate(
          { text: draft.trim() || "📷 Image", attachments: uploaded, replyToId: replyTo?.id },
          { onSuccess: () => { setDraft(""); setReplyTo(null); } },
        );
      }
    } catch {
      console.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleVoiceSend = async (blob: Blob) => {
    setUploading(true);
    try {
      const file = new File([blob], "voice.webm", { type: "audio/webm" });
      const { url } = await messagesApi.uploadVoice(file);
      send.mutate(
        {
          text: "🎤 Voice message",
          attachments: [{ type: "voice", url, fileName: "voice.webm", fileSize: blob.size, fileType: "audio/webm" }],
          isVoice: true,
          replyToId: replyTo?.id,
        },
        { onSuccess: () => setReplyTo(null) },
      );
    } catch (err) {
      console.error("Voice upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || send.isPending) return;
    onTypingStop(thread.id);
    send.mutate(
      { text: draft.trim(), replyToId: replyTo?.id },
      { onSuccess: () => { setDraft(""); setReplyTo(null); } },
    );
  };

  const handleReply = (msg: ChatMessage) => {
    setReplyTo(msg);
    setContextMsg(null);
    inputRef.current?.focus();
  };

  const handleContextMenu = (e: React.MouseEvent, msg: ChatMessage) => {
    if (msg.fromUserId === meId) return;
    e.preventDefault();
    setContextPos({ x: e.clientX, y: e.clientY });
    setContextMsg(msg);
  };

  const handleSwipe = (msg: ChatMessage) => {
    handleReply(msg);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border shrink-0">
        <div className="relative">
          <Avatar id={thread.otherUser.id} name={thread.otherUser.fullName} src={thread.otherUser.avatarUrl} size={36} />
          {online && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm truncate">{thread.otherUser.fullName}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
            {online ? (
              <span className="text-emerald-500 font-medium">Online</span>
            ) : lastSeen ? (
              <span>Last seen {timeAgo(lastSeen)}</span>
            ) : null}
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
                onContextMenu={(e) => handleContextMenu(e, m)}
              >
                <SwipeableMessage onSwipe={() => handleSwipe(m)}>
                  <MessageBubble
                    text={m.text}
                    sentAt={m.sentAt}
                    isMe={m.fromUserId === meId}
                    isConsecutive={isConsecutive}
                    attachments={m.attachments}
                    isVoice={m.isVoice}
                    status={m.status}
                    replyTo={m.replyTo}
                  />
                </SwipeableMessage>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Reply bar */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-muted/30"
          >
            <div className="flex items-center gap-2 px-5 py-2">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Replying to {replyTo.fromUserId === meId ? "yourself" : thread.otherUser.fullName}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {replyTo.isVoice ? "🎤 Voice message" : replyTo.text}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom context menu */}
      <AnimatePresence>
        {contextMsg && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setContextMsg(null)} />
            <motion.div
              ref={contextRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[140px]"
              style={{ left: contextPos.x, top: contextPos.y }}
            >
              <button
                type="button"
                onClick={() => handleReply(contextMsg)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                Reply
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="shrink-0">
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={springConfig}
              className="overflow-hidden"
            >
              <div className="px-3 pb-2">
                <EmojiPicker onSelect={handleEmojiSelect} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSend} className="p-3 border-t border-border">
          <div className="flex items-end gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={uploading}
                  className="flex items-center justify-center h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 active:scale-95 disabled:opacity-40"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                >
                  <Paperclip size={18} />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" sideOffset={8} className="p-0 w-auto border-border/60 shadow-lg rounded-xl">
                <AttachmentMenu onAttach={handleAttach} />
              </PopoverContent>
            </Popover>

            <VoiceRecorder onSend={handleVoiceSend} disabled={uploading} />

            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => handleDraftChange(e.target.value)}
              placeholder={replyTo ? "Write a reply…" : "Type a message…"}
              className="flex-1 rounded-xl border-border/60 bg-muted/30 focus-visible:bg-background transition-colors text-sm"
            />

            <button
              type="button"
              onClick={() => setShowEmoji((v) => !v)}
              className={cn(
                "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-150 active:scale-95",
                showEmoji
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            >
              <Smile size={18} />
            </button>

            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim() || send.isPending || uploading}
              className="shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:active:scale-100"
              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
            >
              {uploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SwipeableMessage({ children, onSwipe }: { children: React.ReactNode; onSwipe: () => void }) {
  const touchStartRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current;
    if (dx > 60) {
      onSwipe();
    }
    touchStartRef.current = null;
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
}
