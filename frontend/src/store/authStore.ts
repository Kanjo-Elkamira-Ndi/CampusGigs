import { create } from "zustand";
import type { User } from "@/types";

const STORAGE_KEY = "campus-gigs-auth";

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    }
    set({ user, token });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { user: User; token: string };
      set({ user: parsed.user, token: parsed.token });
    } catch {
      /* ignore */
    }
  },
}));
