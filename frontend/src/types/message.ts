import type { PublicUser } from "./user";

export interface MessageAttachment {
  type: "image" | "file" | "voice";
  url: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  width?: number;
  height?: number;
}

export type MessageStatus = "sent" | "delivered" | "read";

export interface ReplyToInfo {
  id: string;
  fromUserId: string;
  text: string;
  isVoice?: boolean;
}

export interface ChatMessage {
  id: string;
  fromUserId: string;
  text: string;
  sentAt: string;
  attachments?: MessageAttachment[];
  isVoice?: boolean;
  applicationId?: string;
  status?: MessageStatus;
  replyToId?: string;
  replyTo?: ReplyToInfo;
}

export interface ChatThread {
  id: string;
  otherUser: PublicUser & { lastSeen?: string };
  gigTitle: string;
  messages: ChatMessage[];
  unreadCount?: number;
}
