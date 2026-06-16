import { api, extractData } from "./axios";
import type { Review } from "@/types";

export interface CreateReviewInput {
  gigId: string;
  revieweeId: string;
  rating: number;
  comment: string;
}

interface BackendReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: Record<string, unknown>;
  gig: { id: string; title: string; category: string | null };
}

function mapBackendReview(r: BackendReview): Review {
  const rev = r.reviewer as Record<string, unknown>;
  return {
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    gig: { id: r.gig.id, title: r.gig.title, category: r.gig.category ?? "Other" } as Review["gig"],
    reviewer: {
      id: rev.id as string,
      fullName: rev.fullName as string,
      name: rev.name as string,
      avatarUrl: (rev.avatarUrl as string) ?? undefined,
      avgRating: Number(rev.avgRating ?? 0),
      reviewCount: Number(rev.reviewCount ?? 0),
    } as Review["reviewer"],
  };
}

export const reviewsApi = {
  create: (data: CreateReviewInput) =>
    api
      .post<{ success: boolean; data: BackendReview }>("/reviews", data)
      .then(extractData<BackendReview>)
      .then(mapBackendReview),
};
