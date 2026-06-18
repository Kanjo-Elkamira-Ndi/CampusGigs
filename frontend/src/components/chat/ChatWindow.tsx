import type { ChatThread, MessageAttachment } from "@/types";
import { Avatar } from "@/components/shared/Avatar";
import { MessageBubble } from "./MessageBubble";
import { EmojiPicker } from "./EmojiPicker";
import { AttachmentMenu } from "./AttachmentMenu";
import { VoiceRecorder } from "./VoiceRecorder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Send, Smile, Paperclip } from "lucide-react";
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const meId = user?.id ?? "";
  const send = useSendMessage(thread.id);
  const lastSeen = thread.otherUser.lastSeen;

  useEffect(() => {
    onMessageRead(thread.id);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowEmoji(false);
  }, [thread.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages.length]);

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
        send.mutate({ text: draft.trim() || "📷 Image", attachments: uploaded }, { onSuccess: () => setDraft("") });
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
        },
        { onError: () => console.error("Failed to send voice message") },
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
    send.mutate({ text: draft.trim() }, { onSuccess: () => setDraft("") });
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
              >
                <MessageBubble
                  text={m.text}
                  sentAt={m.sentAt}
                  isMe={m.fromUserId === meId}
                  isConsecutive={isConsecutive}
                  attachments={m.attachments}
                  isVoice={m.isVoice}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

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
              placeholder="Type a message…"
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
