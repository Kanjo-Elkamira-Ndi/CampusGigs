import { create } from "zustand";

type Theme = "light" | "dark";
const STORAGE_KEY = "campus-gigs-theme";

const getInitial = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getInitial(),
  toggleTheme: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
    }
    set({ theme: next });
  },
  setTheme: (t) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, t);
      document.documentElement.classList.toggle("dark", t === "dark");
    }
    set({ theme: t });
  },
}));
