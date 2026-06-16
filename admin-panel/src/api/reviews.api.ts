import { api } from "./axios";

export interface AdminReviewRow {
  id: string;
  reviewer?: { id: string; fullName: string } | null;
  reviewee?: { id: string; fullName: string } | null;
  gig?: { id: string; title: string } | null;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface ReviewsListResponse {
  data: AdminReviewRow[];
  total: number;
  page: number;
  limit: number;
}

export const reviewsApi = {
  list: (params: { page?: number; limit?: number }) =>
    api.get<ReviewsListResponse>("/reviews", { params }).then((r) => r.data),
  remove: (id: string) => api.delete(`/reviews/${id}`).then((r) => r.data),
};
