import { api } from "./axios";

export interface University {
  id: string;
  name: string;
  city: string;
  type: "public" | "private";
  userCount?: number;
  gigCount?: number;
}

export const universitiesApi = {
  list: () => api.get<University[]>("/universities").then((r) => r.data),
  create: (payload: { name: string; city: string; type: "public" | "private" }) =>
    api.post<University>("/universities", payload).then((r) => r.data),
};
