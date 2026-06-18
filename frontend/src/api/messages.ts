import { api, extractData } from "./axios";
import type { ChatThread, ChatMessage, MessageAttachment } from "@/types";

interface BackendMessageAttachment {
  type: "image" | "file" | "voice";
  url: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  width?: number;
  height?: number;
}

interface BackendThreadMessage {
  id: string;
  fromUserId: string;
  text: string;
  sentAt: string;
  attachments: BackendMessageAttachment[];
  isVoice?: boolean;
}

interface BackendOtherUser {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  lastSeen?: string | null;
}

interface BackendThread {
  id: string;
  otherUser: BackendOtherUser;
  gigTitle: string;
  messages: BackendThreadMessage[];
  unreadCount?: number;
}

function mapBackendThread(t: BackendThread): ChatThread {
  const ou = t.otherUser;
  return {
    id: t.id,
    gigTitle: t.gigTitle,
    otherUser: {
      id: ou.id,
      fullName: ou.fullName,
      avatarUrl: ou.avatarUrl ?? undefined,
      lastSeen: ou.lastSeen ?? undefined,
      universityName: "",
      city: "",
      avgRating: 0,
      reviewCount: 0,
      hiredCount: 0,
      skills: [],
    } as ChatThread["otherUser"],
    messages: t.messages.map((m) => ({
      id: m.id,
      fromUserId: m.fromUserId,
      text: m.text,
      sentAt: m.sentAt,
      attachments: m.attachments as MessageAttachment[],
      isVoice: m.isVoice ?? false,
    })),
    unreadCount: t.unreadCount ?? 0,
  };
}

export const messagesApi = {
  listThreads: () =>
    api
      .get<{ success: boolean; data: BackendThread[] }>("/messages")
      .then(extractData<BackendThread[]>)
      .then((data) => data.map(mapBackendThread)),

  getThread: (threadId: string) =>
    api
      .get<{ success: boolean; data: BackendThread }>(`/messages/${threadId}`)
      .then(extractData<BackendThread>)
      .then(mapBackendThread),

  sendMessage: (threadId: string, payload: { text: string; attachments?: MessageAttachment[]; isVoice?: boolean }) =>
    api
      .post<{ success: boolean; data: ChatMessage }>(`/messages/${threadId}`, payload)
      .then(extractData<ChatMessage>),

  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api
      .post<{ success: boolean; data: { url: string } }>("/upload/chat/image", fd, {
        headers: { "Content-Type": null },
      })
      .then(extractData<{ url: string }>);
  },

  uploadVoice: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api
      .post<{ success: boolean; data: { url: string } }>("/upload/chat/voice", fd, {
        headers: { "Content-Type": null },
      })
      .then(extractData<{ url: string }>);
  },
};
