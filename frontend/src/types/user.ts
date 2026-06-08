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
