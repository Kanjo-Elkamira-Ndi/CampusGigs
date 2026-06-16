import { api, extractData } from "./axios";
import type { PublicUser } from "@/types";

export interface ListFreelancersParams {
  q?: string;
  universityIds?: string;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

interface RawFreelancer {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  universityId: string | null;
  universityName: string;
  city: string;
  bio: string | null;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  verified: boolean;
  responseTime: string | null;
  hiredCount: number;
  skills: string[];
  hourlyRate: number | null;
  availability: string | null;
  experienceLevel: string | null;
  remoteAvailable: boolean;
}

interface PaginatedFreelancers {
  data: RawFreelancer[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

function mapFreelancer(f: RawFreelancer): PublicUser {
  return {
    id: f.id,
    fullName: f.fullName,
    avatarUrl: f.avatarUrl ?? undefined,
    universityName: f.universityName ?? "",
    city: f.city ?? "",
    avgRating: Number(f.avgRating),
    reviewCount: Number(f.reviewCount),
    hiredCount: Number(f.hiredCount),
    skills: f.skills ?? [],
    hourlyRate: f.hourlyRate ?? undefined,
    responseTime: f.responseTime ?? undefined,
    availability: (f.availability ?? undefined) as PublicUser["availability"],
    verified: Boolean(f.verified),
    experienceLevel: (f.experienceLevel ?? undefined) as PublicUser["experienceLevel"],
    remoteAvailable: Boolean(f.remoteAvailable),
    bio: f.bio ?? undefined,
    universityId: f.universityId ?? "",
    createdAt: f.createdAt,
  };
}

export const freelancersApi = {
  list: (params?: ListFreelancersParams) =>
    api
      .get<{ success: boolean; data: PaginatedFreelancers }>("/freelancers", { params })
      .then(extractData<PaginatedFreelancers>)
      .then((res) => ({
        data: res.data.map(mapFreelancer),
        meta: res.meta,
      })),
};
