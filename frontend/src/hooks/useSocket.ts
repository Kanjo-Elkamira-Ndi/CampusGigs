import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/types";

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
      qc.invalidateQueries({ queryKey: ["messages"] });

      if (message.fromUserId !== user.id && activeThreadRef.current !== message.applicationId) {
        playNotificationSound();
      }
    });

    globalSocket.on("message:notification", () => {
      qc.invalidateQueries({ queryKey: ["messages", "threads"] });
      playNotificationSound();
    });

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
    setActiveThread,
  };
}
