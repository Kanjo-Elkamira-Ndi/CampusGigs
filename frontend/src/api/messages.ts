import { api, extractData } from "./axios";
import type { ChatThread, ChatMessage } from "@/types";

interface BackendThreadMessage {
  id: string;
  fromUserId: string;
  text: string;
  sentAt: string;
  attachments: Array<{ type: "image" | "file"; url: string; fileName?: string }>;
}

interface BackendThread {
  id: string;
  otherUser: { id: string; fullName: string; avatarUrl: string | null };
  gigTitle: string;
  messages: BackendThreadMessage[];
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
      attachments: m.attachments,
    })),
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

  sendMessage: (threadId: string, text: string) =>
    api
      .post<{ success: boolean; data: ChatMessage }>(`/messages/${threadId}`, { text })
      .then(extractData<ChatMessage>),
};
