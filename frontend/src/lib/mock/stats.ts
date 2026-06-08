import type { NotificationItem } from "@/types";

export const mockWorkerStats = {
  activeApplications: 4,
  applicationsAwaitingResponse: 2,
  gigsCompleted: 8,
  monthlyGigsCompleted: 3,
  totalEarned: 185000,
  rating: 4.8,
  reviewCount: 24,
};

export const mockPosterStats = {
  activeGigs: 5,
  openGigs: 3,
  inProgressGigs: 1,
  newApplicants: 7,
  applicantsToReview: 3,
  gigsCompleted: 14,
  avgWorkerRating: 4.6,
  gigsWithReviews: 10,
};

export const mockWorkerWeekActivity = [
  { day: "S", value: 3 },
  { day: "M", value: 5 },
  { day: "T", value: 2 },
  { day: "W", value: 7 },
  { day: "T", value: 4 },
  { day: "F", value: 6 },
  { day: "S", value: 1 },
];

export const mockPosterWeekPosts = [
  { day: "S", value: 1 },
  { day: "M", value: 0 },
  { day: "T", value: 3 },
  { day: "W", value: 2 },
  { day: "T", value: 4 },
  { day: "F", value: 1 },
  { day: "S", value: 0 },
];

export const mockUpcomingDeadline = {
  gigTitle: "Python tutor for DS exam",
  dateTime: "Thursday, 6:00 PM",
  location: "Library Ground Floor, UB",
};

export const mockNotifications: NotificationItem[] = [
  { id: "n1", type: "application", title: "New applicant", message: "Kofi Asante applied to your gig 'Python tutor for DS exam'.", time: "12 min ago", read: false },
  { id: "n2", type: "message", title: "New message", message: "Marie Fofana: Are you available this weekend for the poster design?", time: "2 hours ago", read: false },
  { id: "n3", type: "review", title: "New review", message: "Jules Biya left you a 5-star review for 'Help set up graduation dinner'.", time: "5 hours ago", read: false },
  { id: "n4", type: "gig_update", title: "Gig completed", message: "Your gig 'Design poster for council event' has been marked as completed.", time: "1 day ago", read: false },
  { id: "n5", type: "application", title: "Application accepted", message: "Your application for 'Python tutor for DS exam' was accepted by Jules Biya.", time: "2 days ago", read: true },
  { id: "n6", type: "message", title: "New message", message: "Fatima Oumarou: The translation looks great! Let's work together again soon.", time: "3 days ago", read: true },
  { id: "n7", type: "review", title: "New review", message: "Fatima Oumarou left you a 5-star review for 'EN-FR translation'.", time: "4 days ago", read: true },
  { id: "n8", type: "gig_update", title: "Gig expiring", message: "Your gig 'Help move furniture to new dorm' has 1 day left before the deadline.", time: "6 days ago", read: true },
];
