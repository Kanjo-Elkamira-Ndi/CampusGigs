import { api, extractData } from "./axios";
import type { NotificationItem } from "@/types";

interface BackendNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  linkTo?: string;
}

function mapBackendNotif(n: BackendNotification): NotificationItem {
  return {
    id: n.id,
    type: n.type as NotificationItem["type"],
    title: n.title,
    message: n.body,
    time: n.createdAt,
    read: n.read,
  };
}

export const notificationsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api
      .get<{ success: boolean; data: BackendNotification[] }>("/notifications", { params })
      .then(extractData<BackendNotification[]>)
      .then((data) => data.map(mapBackendNotif)),

  unreadCount: () =>
    api
      .get<{ success: boolean; data: { count: number } }>("/notifications/unread-count")
      .then(extractData<{ count: number }>)
      .then((res) => res.count),

  markRead: (id: string) =>
    api.patch(`/notifications/${id}`).then(extractData<null>),

  markAllRead: () =>
    api.patch("/notifications/read-all").then(extractData<null>),
};
