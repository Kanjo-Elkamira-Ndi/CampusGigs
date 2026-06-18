import { api, extractData } from "./axios";
import type { User } from "@/types";

export interface UpdateProfileInput {
  fullName?: string;
  bio?: string;
  universityId?: string;
  avatarUrl?: string;
  skills?: string[];
  hourlyRate?: number;
  availability?: string;
  experienceLevel?: string;
  remoteAvailable?: boolean;
}

interface BackendUser extends Record<string, unknown> {
  id: string;
  email: string;
  fullName: string;
  role: string;
  universityId: string;
  universityName: string;
  city: string;
  avatarUrl: string | null;
  bio: string | null;
  avgRating: number;
  reviewCount: number;
  skills: string[];
  hourlyRate: number | null;
  availability: string | null;
  experienceLevel: string | null;
  remoteAvailable: boolean;
  hiredCount: number;
  responseTime: string | null;
  verified: boolean;
  createdAt: string;
  emailVerified: boolean;
  reviewsReceived?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
      avgRating: number;
      reviewCount: number;
    };
    gig: { id: string; title: string; category: string | null };
  }>;
  _count?: { gigs: number; applications: number };
}

function mapBackendUser(u: BackendUser): User {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    avatarUrl: u.avatarUrl ?? undefined,
    role: u.role as User["role"],
    universityId: u.universityId,
    universityName: u.universityName ?? "",
    city: u.city ?? "",
    bio: u.bio ?? undefined,
    skills: u.skills ?? [],
    avgRating: Number(u.avgRating ?? 0),
    reviewCount: Number(u.reviewCount ?? 0),
    hiredCount: Number(u.hiredCount ?? 0),
    createdAt: u.createdAt,
    hourlyRate: u.hourlyRate ? Number(u.hourlyRate) : undefined,
    responseTime: u.responseTime ?? undefined,
    availability: (u.availability as User["availability"]) ?? undefined,
    verified: Boolean(u.verified),
    emailVerified: Boolean(u.emailVerified),
    experienceLevel: (u.experienceLevel as User["experienceLevel"]) ?? undefined,
    remoteAvailable: Boolean(u.remoteAvailable),
  };
}

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return api
    .post<{ success: boolean; data: { avatarUrl: string } }>("/upload/avatar", formData, {
      headers: { "Content-Type": null },
    })
    .then(extractData<{ avatarUrl: string }>);
};

export const usersApi = {
  getMe: () =>
    api
      .get<{ success: boolean; data: BackendUser }>("/users/me")
      .then(extractData<BackendUser>)
      .then(mapBackendUser),

  updateMe: (data: UpdateProfileInput) =>
    api
      .patch<{ success: boolean; data: BackendUser }>("/users/me", data)
      .then(extractData<BackendUser>)
      .then(mapBackendUser),

  getPublicProfile: (id: string) =>
    api
      .get<{ success: boolean; data: BackendUser }>(`/users/${id}`)
      .then(extractData<BackendUser>)
      .then(mapBackendUser),

  getReviews: (id: string, params?: { page?: number; limit?: number }) =>
    api
      .get<{ success: boolean; data: { reviews: unknown[]; avgRating: number; total: number } }>(`/users/${id}/reviews`, { params })
      .then(extractData),
};
