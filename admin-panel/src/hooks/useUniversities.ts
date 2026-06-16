import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { universitiesApi } from "@/api/universities.api";

export function useUniversities() {
  return useQuery({ queryKey: ["universities"], queryFn: () => universitiesApi.list() });
}

export function useCreateUniversity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: universitiesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["universities"] });
      toast.success("University created");
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? "Create failed"),
  });
}
