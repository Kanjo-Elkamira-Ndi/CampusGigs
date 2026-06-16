import { api, extractData } from "./axios";
import type { Gig, GigCategory, GigStatus } from "@/types";

const CATEGORY_TO_SLUG: Record<string, string> = {
  Tutoring: "tutoring-academic",
  Errands: "admin-errands",
  "Tech help": "tech-dev",
  Events: "events-hospitality",
  Creative: "design-creative",
  Delivery: "moving-labour",
  Translation: "writing-translation",
  Photography: "photography-video",
  Other: "admin-errands",
};

const BACKEND_NAME_TO_SHORT: Record<string, string> = {
  "Tutoring & Academic": "Tutoring",
  "Admin & Errands": "Errands",
  "Tech & Dev": "Tech help",
  "Events & Hospitality": "Events",
  "Design & Creative": "Creative",
  "Moving & Labour": "Delivery",
  "Writing & Translation": "Translation",
  "Photography & Video": "Photography",
};

export interface ListGigsParams {
  q?: string;
  category?: string;
  universityId?: string;
  minBudget?: number;
  maxBudget?: number;
  status?: string;
  posterId?: string;
  page?: number;
  limit?: number;
}

export interface CreateGigInput {
  title: string;
  category: string;
  description: string;
  location: string;
  budget: number;
  slots?: number;
  deadline: string;
  universityId?: string;
  isEasyApply?: boolean;
  tags?: string[];
  remote?: boolean;
}

export interface UpdateGigInput {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  budget?: number;
  slots?: number;
  deadline?: string;
  universityId?: string;
  isEasyApply?: boolean;
  tags?: string[];
}

interface PaginatedResult<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

function mapBackendGig(g: Record<string, unknown>): Gig {
  const poster = g.poster as Record<string, unknown>;
  return {
    id: g.id as string,
    title: g.title as string,
    description: g.description as string,
    budget: Number(g.budget),
    location: g.location as string,
    universityId: (g.universityId as string) ?? "",
    universityName: (g.universityName as string) ?? "",
    city: (g.city as string) ?? "",
    category: (BACKEND_NAME_TO_SHORT[g.category as string] ?? g.category) as GigCategory,
    status: g.status as GigStatus,
    slots: Number(g.slots),
    slotsRemaining: Number(g.slotsRemaining ?? g.slots),
    deadline: g.deadline as string,
    createdAt: g.createdAt as string,
    poster: {
      id: poster.id as string,
      fullName: poster.fullName as string,
      avatarUrl: poster.avatarUrl as string | undefined,
      universityName: (poster.universityName as string) ?? "",
      city: (poster.city as string) ?? "",
      avgRating: Number(poster.avgRating ?? 0),
      reviewCount: Number(poster.reviewCount ?? 0),
      hiredCount: Number(poster.hiredCount ?? 0),
      skills: (poster.skills as string[]) ?? [],
      hourlyRate: poster.hourlyRate ? Number(poster.hourlyRate) : undefined,
      responseTime: poster.responseTime as string | undefined,
      availability: poster.availability as "Immediately" | "This Week" | "Next Week" | "Flexible" | undefined,
      verified: Boolean(poster.verified),
      experienceLevel: poster.experienceLevel as "Entry" | "Intermediate" | "Expert" | undefined,
      remoteAvailable: Boolean(poster.remoteAvailable),
      bio: poster.bio as string | undefined,
      universityId: (poster.universityId as string) ?? "",
      createdAt: (poster.createdAt as string) ?? g.createdAt as string,
    } as Gig["poster"],
    applicationCount: Number(g.applicationCount ?? 0),
    isEasyApply: Boolean(g.isEasyApply),
    tags: (g.tags as string[]) ?? [],
  };
}

export const gigsApi = {
  list: (params?: ListGigsParams) => {
    const mapped = { ...params };
    if (mapped.category) {
      mapped.category = CATEGORY_TO_SLUG[mapped.category] ?? mapped.category;
    }
    return api
      .get<{ success: boolean; data: PaginatedResult<Record<string, unknown>> }>("/gigs", { params: mapped })
      .then(extractData<PaginatedResult<Record<string, unknown>>>)
      .then((res) => ({
        data: res.data.map(mapBackendGig),
        meta: res.meta,
      }));
  },

  getById: (id: string) =>
    api
      .get<{ success: boolean; data: Record<string, unknown> }>(`/gigs/${id}`)
      .then(extractData<Record<string, unknown>>)
      .then(mapBackendGig),

  create: (data: CreateGigInput) => {
    const slug = CATEGORY_TO_SLUG[data.category] ?? data.category;
    return api
      .post<{ success: boolean; data: Record<string, unknown> }>("/gigs", { ...data, category: slug })
      .then(extractData<Record<string, unknown>>)
      .then(mapBackendGig);
  },

  update: (id: string, data: UpdateGigInput) =>
    api
      .patch<{ success: boolean; data: Record<string, unknown> }>(`/gigs/${id}`, data)
      .then(extractData<Record<string, unknown>>)
      .then(mapBackendGig),

  delete: (id: string) =>
    api.delete(`/gigs/${id}`).then(extractData<null>),

  close: (id: string) =>
    api
      .patch<{ success: boolean; data: Record<string, unknown> }>(`/gigs/${id}/close`)
      .then(extractData<Record<string, unknown>>)
      .then(mapBackendGig),

  save: (id: string) =>
    api.post(`/gigs/${id}/save`).then(extractData<null>),

  unsave: (id: string) =>
    api.delete(`/gigs/${id}/save`).then(extractData<null>),

  getSaved: () =>
    api
      .get<{ success: boolean; data: Record<string, unknown>[] }>("/gigs/saved")
      .then(extractData<Record<string, unknown>[]>)
      .then((data) => data.map(mapBackendGig)),
};
