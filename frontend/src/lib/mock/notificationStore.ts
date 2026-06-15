import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
  id: string;
  type: "APPLICATION" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "REVIEW" | "MESSAGE";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  linkTo?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

function computeUnread(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}

const MOCK_SEED: Notification[] = [
  {
    id: "notif-1",
    type: "APPLICATION",
    title: "New applicant",
    body: "Kofi Asante applied to your gig 'Python tutor for DS exam'.",
    read: false,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    linkTo: "/dashboard/poster/applicants",
  },
  {
    id: "notif-2",
    type: "MESSAGE",
    title: "New message",
    body: "Marie Fofana: Are you available this weekend for the poster design?",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    linkTo: "/messages",
  },
  {
    id: "notif-3",
    type: "REVIEW",
    title: "New review",
    body: "Jules Biya left you a 5-star review for 'Help set up graduation dinner'.",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: MOCK_SEED,
      unreadCount: computeUnread(MOCK_SEED),
      addNotification: (n) => {
        const notifications = [n, ...get().notifications];
        set({ notifications, unreadCount: computeUnread(notifications) });
      },
      markAsRead: (id) => {
        const notifications = get().notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        );
        set({ notifications, unreadCount: computeUnread(notifications) });
      },
      markAllAsRead: () => {
        const notifications = get().notifications.map((n) => ({ ...n, read: true }));
        set({ notifications, unreadCount: 0 });
      },
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: "campus-gigs-notifications",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
      }),
    },
  ),
);
