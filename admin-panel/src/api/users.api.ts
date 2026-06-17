import { api } from "./axios";

export interface AdminUserRow {
  id: string;
  fullName: string;
  email: string;
  role: "WORKER" | "POSTER" | "ADMIN";
  university?: { id: string; name: string } | null;
  universityId?: string | null;
  avgRating?: number;
  reviewCount?: number;
  isBanned: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface UsersListResponse {
  data: AdminUserRow[];
  total: number;
  page: number;
  limit: number;
}

export interface UsersListParams {
  search?: string;
  role?: string;
  isBanned?: string;
  universityId?: string;
  page?: number;
  limit?: number;
}

export const usersApi = {
  list: (params: UsersListParams) =>
    api.get<UsersListResponse>("/users", { params }).then((r) => r.data),
  update: (id: string, payload: Partial<AdminUserRow>) =>
    api.patch<AdminUserRow>(`/users/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};
