import { api, extractData } from "./axios";
import type { Application, AppStatus } from "@/types";

export interface CreateApplicationInput {
  coverNote: string;
}

interface BackendApplication {
  id: string;
  coverNote: string;
  status: string;
  appliedAt: string;
  gig: Record<string, unknown>;
  worker: Record<string, unknown>;
}

function mapBackendApp(a: BackendApplication): Application {
  const gig = a.gig as Record<string, unknown>;
  const gPoster = (gig.poster ?? {}) as Record<string, unknown>;
  const worker = a.worker as Record<string, unknown>;
  return {
    id: a.id,
    coverNote: a.coverNote,
    status: a.status as AppStatus,
    appliedAt: a.appliedAt,
    gig: {
      id: gig.id as string,
      title: gig.title as string,
      description: (gig.description as string) ?? "",
      budget: Number(gig.budget ?? 0),
      location: (gig.location as string) ?? "",
      universityId: (gig.universityId as string) ?? "",
      universityName: (gig.universityName as string) ?? "",
      city: (gig.city as string) ?? "",
      category: gig.category as Application["gig"]["category"],
      status: gig.status as Application["gig"]["status"],
      slots: Number(gig.slots ?? 1),
      slotsRemaining: Number(gig.slotsRemaining ?? gig.slots ?? 1),
      deadline: gig.deadline as string,
      createdAt: (gig.createdAt as string) ?? a.appliedAt,
      poster: {
        id: gPoster.id as string,
        fullName: gPoster.fullName as string,
        avatarUrl: gPoster.avatarUrl as string | undefined,
        universityName: (gPoster.universityName as string) ?? "",
        city: (gPoster.city as string) ?? "",
        avgRating: Number(gPoster.avgRating ?? 0),
        reviewCount: Number(gPoster.reviewCount ?? 0),
        hiredCount: Number(gPoster.hiredCount ?? 0),
        skills: (gPoster.skills as string[]) ?? [],
      } as Application["gig"]["poster"],
      applicationCount: Number(gig.applicationCount ?? 0),
      isEasyApply: Boolean(gig.isEasyApply),
      tags: (gig.tags as string[]) ?? [],
    },
    worker: {
      id: worker.id as string,
      fullName: worker.fullName as string,
      avatarUrl: worker.avatarUrl as string | undefined,
      universityName: (worker.universityName as string) ?? "",
      city: (worker.city as string) ?? "",
      avgRating: Number(worker.avgRating ?? 0),
      reviewCount: Number(worker.reviewCount ?? 0),
      hiredCount: Number(worker.hiredCount ?? 0),
      skills: (worker.skills as string[]) ?? [],
      hourlyRate: worker.hourlyRate ? Number(worker.hourlyRate) : undefined,
      responseTime: worker.responseTime as string | undefined,
      availability: worker.availability as "Immediately" | "This Week" | "Next Week" | "Flexible" | undefined,
      verified: Boolean(worker.verified),
      experienceLevel: worker.experienceLevel as "Entry" | "Intermediate" | "Expert" | undefined,
      remoteAvailable: Boolean(worker.remoteAvailable),
      bio: worker.bio as string | undefined,
      universityId: (worker.universityId as string) ?? "",
      createdAt: (worker.createdAt as string) ?? "",
    } as Application["worker"],
  };
}

export interface PaginatedApps {
  data: Application[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const applicationsApi = {
  create: (gigId: string, data: CreateApplicationInput) =>
    api
      .post<{ success: boolean; data: BackendApplication }>(`/gigs/${gigId}/applications`, data)
      .then(extractData<BackendApplication>)
      .then(mapBackendApp),

  listForGig: (gigId: string) =>
    api
      .get<{ success: boolean; data: BackendApplication[] }>(`/gigs/${gigId}/applications`)
      .then(extractData<BackendApplication[]>)
      .then((data) => data.map(mapBackendApp)),

  listMy: (params?: { status?: string; page?: number; limit?: number }) =>
    api
      .get<{ success: boolean; data: PaginatedApps }>("/my-applications", { params })
      .then(extractData<PaginatedApps>)
      .then((res) => ({
        data: res.data.map(mapBackendApp),
        meta: res.meta,
      })),

  accept: (id: string) =>
    api
      .patch<{ success: boolean; data: BackendApplication }>(`/my-applications/${id}/accept`)
      .then(extractData<BackendApplication>)
      .then(mapBackendApp),

  reject: (id: string) =>
    api
      .patch<{ success: boolean; data: BackendApplication }>(`/my-applications/${id}/reject`)
      .then(extractData<BackendApplication>)
      .then(mapBackendApp),

  complete: (id: string) =>
    api
      .patch<{ success: boolean; data: BackendApplication }>(`/my-applications/${id}/complete`)
      .then(extractData<BackendApplication>)
      .then(mapBackendApp),
};
