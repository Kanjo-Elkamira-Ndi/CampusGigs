import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  activeRole: "WORKER" | "POSTER";
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
  setActiveRole: (role: "WORKER" | "POSTER") => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeRole: "WORKER",
      setAuth: (user, token) => {
        set({ user, token, activeRole: user.role });
      },
      clearAuth: () => {
        set({ user: null, token: null, activeRole: "WORKER" });
      },
      hydrate: () => {
        /* persist middleware handles rehydration */
      },
      setActiveRole: (role) => set({ activeRole: role }),
    }),
    {
      name: "campus-gigs-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        activeRole: state.activeRole,
      }),
    },
  ),
);
