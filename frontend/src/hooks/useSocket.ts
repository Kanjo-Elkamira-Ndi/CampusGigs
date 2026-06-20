import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage, MessageStatus } from "@/types";

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL as string).replace("/api/v1", "")
  : "http://localhost:5000";

let globalSocket: Socket | null = null;
let hookInstanceCount = 0;

function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 523.25;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

export function useSocket() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const onlineUsersRef = useRef<Set<string>>(new Set());
  const typingUsersRef = useRef<Map<string, string>>(new Map());
  const activeThreadRef = useRef<string | null>(null);
  const deliveredTimersRef = useRef<Map<string, string>>(new Map());

  const setActiveThread = useCallback((threadId: string | null) => {
    activeThreadRef.current = threadId;
  }, []);

  const isUserOnline = useCallback((userId: string) => {
    return onlineUsersRef.current.has(userId);
  }, []);

  const isTyping = useCallback((threadId: string, userId: string) => {
    return typingUsersRef.current.get(threadId) === userId;
  }, []);

  const joinThread = useCallback((threadId: string) => {
    globalSocket?.emit("join:thread", threadId);
  }, []);

  const leaveThread = useCallback((threadId: string) => {
    globalSocket?.emit("leave:thread", threadId);
  }, []);

  const emitTypingStart = useCallback((threadId: string) => {
    globalSocket?.emit("typing:start", threadId);
  }, []);

  const emitTypingStop = useCallback((threadId: string) => {
    globalSocket?.emit("typing:stop", threadId);
  }, []);

  const emitMessageRead = useCallback((threadId: string) => {
    globalSocket?.emit("message:read", threadId);
  }, []);

  const emitMessageDelivered = useCallback((messageIds: string[]) => {
    if (messageIds.length > 0) {
      globalSocket?.emit("message:delivered", messageIds);
    }
  }, []);

  useEffect(() => {
    hookInstanceCount++;

    if (!token || !user) {
      if (globalSocket?.connected) {
        globalSocket.disconnect();
      }
      globalSocket = null;
      return;
    }

    if (globalSocket?.connected) return;

    globalSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    globalSocket.on("connect", () => {
      console.log("Socket connected");
    });

    globalSocket.on("user:online", ({ onlineUserIds }: { onlineUserIds: string[] }) => {
      onlineUsersRef.current = new Set(onlineUserIds);
    });

    globalSocket.on("user:offline", ({ onlineUserIds }: { onlineUserIds: string[] }) => {
      onlineUsersRef.current = new Set(onlineUserIds);
    });

    globalSocket.on("message:received", (message: ChatMessage) => {
      // Optimistically append to the thread cache if it exists
      const threadId = message.applicationId;
      if (threadId) {
        qc.setQueryData<any>(["messages", "thread", threadId], (old: any) => {
          if (!old?.messages) return old;
          // Avoid duplicates — only append if not already present
          if (old.messages.some((m: any) => m.id === message.id)) return old;
          return {
            ...old,
            messages: [...old.messages, message],
          };
        });
      }

      // Invalidate sidebar thread list preview
      qc.invalidateQueries({ queryKey: ["messages", "threads"] });

      // Emit delivered for messages from others
      if (message.fromUserId !== user.id) {
        deliveredTimersRef.current.set(message.id, setTimeout(() => {
          emitMessageDelivered([message.id]);
          deliveredTimersRef.current.delete(message.id);
        }, 500));
      }

      if (message.fromUserId !== user.id && activeThreadRef.current !== threadId) {
        playNotificationSound();
      }
    });

    globalSocket.on("message:notification", () => {
      qc.invalidateQueries({ queryKey: ["messages", "threads"] });
      playNotificationSound();
    });

    globalSocket.on(
      "message:status",
      ({ messageIds, status }: { messageIds: string[]; status: MessageStatus }) => {
        qc.setQueriesData<any>({ queryKey: ["messages"] }, (old: any) => {
          if (!old) return old;
          const updateStatus = (msgs: any[]) =>
            msgs.map((m: any) =>
              messageIds.includes(m.id) ? { ...m, status } : m,
            );
          if (Array.isArray(old)) {
            return old.map((thread: any) => ({
              ...thread,
              messages: updateStatus(thread.messages),
            }));
          }
          if (old?.messages) {
            return { ...old, messages: updateStatus(old.messages) };
          }
          return old;
        });
      },
    );

    globalSocket.on("typing:start", ({ threadId, userId: typingUserId }: { threadId: string; userId: string }) => {
      typingUsersRef.current.set(threadId, typingUserId);
    });

    globalSocket.on("typing:stop", ({ threadId }: { threadId: string }) => {
      typingUsersRef.current.delete(threadId);
    });

    globalSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      hookInstanceCount--;
      if (hookInstanceCount > 0) return;
      for (const timer of deliveredTimersRef.current.values()) {
        clearTimeout(timer);
      }
      deliveredTimersRef.current.clear();
      if (globalSocket) {
        globalSocket.removeAllListeners();
        globalSocket.disconnect();
        globalSocket = null;
      }
    };
  }, [token, user, qc]);

  return {
    isUserOnline,
    isTyping,
    joinThread,
    leaveThread,
    emitTypingStart,
    emitTypingStop,
    emitMessageRead,
    emitMessageDelivered,
    setActiveThread,
  };
}
