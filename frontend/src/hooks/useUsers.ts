import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi, type UpdateProfileInput } from "@/api";
import { useAuthStore } from "@/store/authStore";

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.getPublicProfile(id),
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => usersApi.updateMe(data),
    onSuccess: (updatedUser) => {
      if (user && token) {
        setAuth(updatedUser, token);
      }
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("Profile updated");
    },
  });
}

export function useUserReviews(id: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["users", id, "reviews", params],
    queryFn: () => usersApi.getReviews(id, params),
    enabled: !!id,
  });
}
