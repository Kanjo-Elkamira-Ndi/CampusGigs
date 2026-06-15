import type { PublicUser } from "./user";

export interface MessageAttachment {
  type: "image" | "file";
  url: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  width?: number;
  height?: number;
}

export interface ChatMessage {
  id: string;
  fromUserId: string;
  text: string;
  sentAt: string;
  attachments?: MessageAttachment[];
}

export interface ChatThread {
  id: string;
  otherUser: PublicUser;
  gigTitle: string;
  messages: ChatMessage[];
}
