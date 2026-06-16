import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
}

interface AdminAuthStore {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  setAdmin: (admin: AdminUser) => void;
  clearAdmin: () => void;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      setAdmin: (admin) => set({ admin, isAuthenticated: true }),
      clearAdmin: () => set({ admin: null, isAuthenticated: false }),
    }),
    { name: "campus-gigs-admin" }
  )
);
