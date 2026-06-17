import { api } from "./axios";

export interface AdminGigRow {
  id: string;
  title: string;
  description: string;
  budget: number;
  category?: { id: string; name: string; slug: string } | null;
  poster?: { id: string; fullName: string } | null;
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  slots: number;
  deadline?: string | null;
  applicationCount?: number;
  createdAt: string;
}

export interface GigsListResponse {
  data: AdminGigRow[];
  total: number;
  page: number;
  limit: number;
}

export interface GigsListParams {
  search?: string;
  status?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
}

export const gigsApi = {
  list: (params: GigsListParams) =>
    api.get<GigsListResponse>("/gigs", { params }).then((r) => r.data),
  remove: (id: string) => api.delete(`/gigs/${id}`).then((r) => r.data),
  categories: () =>
    api
      .get<{ id: string; name: string; slug: string }[]>("/categories")
      .then((r) => r.data)
      .catch(() => []),
};
