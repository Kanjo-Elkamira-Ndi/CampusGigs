export type UserRole = "WORKER" | "POSTER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  universityId: string;
  universityName: string;
  city: string;
  bio?: string;
  skills: string[];
  avgRating: number;
  reviewCount: number;
  hiredCount: number;
  createdAt: string;
  hourlyRate?: number;
  responseTime?: string;
  availability?: "Immediately" | "This Week" | "Next Week" | "Flexible";
  verified?: boolean;
  emailVerified?: boolean;
  experienceLevel?: "Entry" | "Intermediate" | "Expert";
  remoteAvailable?: boolean;
}

export type PublicUser = Pick<
  User,
  | "id"
  | "fullName"
  | "avatarUrl"
  | "universityName"
  | "city"
  | "avgRating"
  | "reviewCount"
  | "hiredCount"
  | "skills"
  | "hourlyRate"
  | "responseTime"
  | "availability"
  | "verified"
  | "experienceLevel"
  | "remoteAvailable"
  | "bio"
  | "universityId"
  | "createdAt"
>;

export type GigStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type GigCategory =
  | "Tutoring"
  | "Errands"
  | "Tech help"
  | "Events"
  | "Creative"
  | "Delivery"
  | "Translation"
  | "Photography"
  | "Other";

export interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  universityId: string;
  universityName: string;
  city: string;
  category: GigCategory;
  status: GigStatus;
  slots: number;
  slotsRemaining: number;
  deadline: string;
  createdAt: string;
  poster: PublicUser;
  applicationCount: number;
  isEasyApply: boolean;
  tags?: string[];
}

export type AppStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";

export interface Application {
  id: string;
  gig: Gig;
  worker: PublicUser;
  coverNote: string;
  status: AppStatus;
  appliedAt: string;
}

export interface Review {
  id: string;
  gig: Pick<Gig, "id" | "title" | "category">;
  reviewer: PublicUser;
  rating: number;
  comment: string;
  createdAt: string;
}

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
