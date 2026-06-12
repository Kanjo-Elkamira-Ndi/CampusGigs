export interface NotificationItem {
  id: string;
  type: "application" | "message" | "review" | "gig_update";
  title: string;
  message: string;
  time: string;
  read: boolean;
}
