import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { freelancersApi, type ListFreelancersParams } from "@/api";

export function useFreelancers(params?: ListFreelancersParams) {
  return useQuery({
    queryKey: ["freelancers", params],
    queryFn: () => freelancersApi.list(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
