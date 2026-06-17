import { api, extractData } from "./axios";

const BACKEND_NAME_TO_SHORT: Record<string, string> = {
  "Tutoring & Academic": "Tutoring",
  "Admin & Errands": "Errands",
  "Tech & Dev": "Tech help",
  "Events & Hospitality": "Events",
  "Design & Creative": "Creative",
  "Moving & Labour": "Delivery",
  "Writing & Translation": "Translation",
  "Photography & Video": "Photography",
};

export interface WorkerDashboard {
  stats: {
    activeApplications: number;
    applicationsAwaitingResponse: number;
    gigsCompleted: number;
    monthlyGigsCompleted: number;
    totalEarned: number;
    rating: number;
    reviewCount: number;
  };
  recentApplications: Array<{
    id: string;
    gigTitle: string;
    posterName: string;
    budget: number;
    status: string;
    category: string;
  }>;
  recentMessages: Array<{
    id: string;
    senderName: string;
    preview: string;
    time: string;
    unread: boolean;
  }>;
  weeklyActivity: Array<{ day: string; value: number }>;
  upcomingDeadline: { gigTitle: string; dateTime: string; location: string } | null;
}

export interface PosterDashboard {
  stats: {
    activeGigs: number;
    openGigs: number;
    inProgressGigs: number;
    newApplicants: number;
    applicantsToReview: number;
    gigsCompleted: number;
    avgWorkerRating: number;
    gigsWithReviews: number;
  };
  postedGigs: Array<{
    id: string;
    title: string;
    budget: number;
    applicantCount: number;
    status: string;
    category: string;
  }>;
  receivedReviews: Array<{
    id: string;
    reviewerName: string;
    comment: string;
    rating: number;
  }>;
  recentMessages: Array<{
    id: string;
    senderName: string;
    preview: string;
    time: string;
    unread: boolean;
  }>;
  weeklyPosts: Array<{ day: string; value: number }>;
  applicantsToReview: Array<{
    id: string;
    name: string;
    gigTitle: string;
    rating: number;
    reviewCount: number;
  }>;
}

export const dashboardApi = {
  worker: () =>
    api
      .get<{ success: boolean; data: WorkerDashboard }>("/dashboard/worker")
      .then(extractData<WorkerDashboard>)
      .then((data) => ({
        ...data,
        recentApplications: data.recentApplications.map((a) => ({
          ...a,
          category: BACKEND_NAME_TO_SHORT[a.category] ?? a.category,
        })),
      })),

  poster: () =>
    api
      .get<{ success: boolean; data: PosterDashboard }>("/dashboard/poster")
      .then(extractData<PosterDashboard>)
      .then((data) => ({
        ...data,
        postedGigs: data.postedGigs.map((g) => ({
          ...g,
          category: BACKEND_NAME_TO_SHORT[g.category] ?? g.category,
        })),
      })),
};
