import type { PublicUser } from "./user";

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
