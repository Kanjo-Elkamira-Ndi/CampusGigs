import { api, extractData } from "./axios";

export interface UniversityRequest {
  id: string;
  userId: string;
  name: string;
  city: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export const universityRequestsApi = {
  create: (data: { name: string; city?: string }) =>
    api
      .post<{ success: boolean; data: UniversityRequest }>("/university-requests", data)
      .then(extractData<UniversityRequest>),

  getMyRequest: () =>
    api
      .get<{ success: boolean; data: UniversityRequest | null }>("/university-requests/my")
      .then(extractData<UniversityRequest | null>),
};
