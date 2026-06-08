import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

function applyTheme(t: Theme) {
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", t === "dark");
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        applyTheme(next);
        set({ theme: next });
      },
      setTheme: (t) => {
        applyTheme(t);
        set({ theme: t });
      },
    }),
    {
      name: "campus-gigs-theme",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
