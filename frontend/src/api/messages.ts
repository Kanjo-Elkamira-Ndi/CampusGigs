import { api, extractData } from "./axios";
import type { ChatThread, ChatMessage } from "@/types";

interface BackendThread {
  id: string;
  otherUser: Record<string, unknown>;
  gigTitle: string;
  messages: Array<{
    id: string;
    fromUserId: string;
    text: string;
    sentAt: string;
    attachments?: Array<{ type: "image" | "file"; url: string; fileName?: string }>;
  }>;
}

function mapBackendThread(t: BackendThread): ChatThread {
  const ou = t.otherUser;
  return {
    id: t.id,
    gigTitle: t.gigTitle,
    otherUser: {
      id: ou.id as string,
      fullName: ou.fullName as string,
      avatarUrl: (ou.avatarUrl as string) ?? undefined,
      universityName: (ou.universityName as string) ?? "",
      city: (ou.city as string) ?? "",
      avgRating: Number(ou.avgRating ?? 0),
      reviewCount: Number(ou.reviewCount ?? 0),
      hiredCount: Number(ou.hiredCount ?? 0),
      skills: (ou.skills as string[]) ?? [],
    } as ChatThread["otherUser"],
    messages: (t.messages ?? []).map((m) => ({
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
