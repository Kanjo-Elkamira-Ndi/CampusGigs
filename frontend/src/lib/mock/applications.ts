import type { Application, AppStatus, GigCategory } from "@/types";
import { mockUsers, toPublic } from "./users";
import { mockGigs } from "./gigs";

const hoursAgo = (h: number) => {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
};

export const mockApplications: Application[] = [
  { id: "a1", gig: mockGigs[0], worker: toPublic(mockUsers[0]), coverNote: "I've tutored DS to 5 students this semester. Available all Thursday evening.", status: "PENDING", appliedAt: hoursAgo(3) },
  { id: "a2", gig: mockGigs[2], worker: toPublic(mockUsers[1]), coverNote: "Designed 12+ posters this year. Can deliver tomorrow.", status: "ACCEPTED", appliedAt: hoursAgo(8) },
  { id: "a3", gig: mockGigs[4], worker: toPublic(mockUsers[7]), coverNote: "Shot 3 graduations already, full gear, fast turnaround.", status: "PENDING", appliedAt: hoursAgo(12) },
  { id: "a4", gig: mockGigs[6], worker: toPublic(mockUsers[4]), coverNote: "I run setup crews monthly, can bring 3 friends.", status: "ACCEPTED", appliedAt: hoursAgo(6) },
  { id: "a5", gig: mockGigs[3], worker: toPublic(mockUsers[5]), coverNote: "ENSP electrical, fixed this exact issue last month.", status: "REJECTED", appliedAt: hoursAgo(1) },
  { id: "a6", gig: mockGigs[8], worker: toPublic(mockUsers[0]), coverNote: "Math major + tutored calculus 2 sems.", status: "PENDING", appliedAt: hoursAgo(20) },
  { id: "a7", gig: mockGigs[13], worker: toPublic(mockUsers[1]), coverNote: "C1 French, translated 40+ pages of legal docs.", status: "COMPLETED", appliedAt: hoursAgo(60) },
  { id: "a8", gig: mockGigs[9], worker: toPublic(mockUsers[7]), coverNote: "Edited 6 recap videos for clubs, Premiere Pro.", status: "PENDING", appliedAt: hoursAgo(30) },
  { id: "a9", gig: mockGigs[11], worker: toPublic(mockUsers[4]), coverNote: "Print shop is on my path, can do today.", status: "PENDING", appliedAt: hoursAgo(2) },
  { id: "a10", gig: mockGigs[1], worker: toPublic(mockUsers[5]), coverNote: "I can lift, free at 3pm.", status: "PENDING", appliedAt: hoursAgo(4) },
];

export const mockApplicants: {
  id: string; name: string; initials: string; avatarColor: string;
  gigTitle: string; rating: number; reviewCount: number;
}[] = [
  { id: "ap1", name: "Kofi Asante", initials: "KA", avatarColor: "#dbeafe", gigTitle: "Python tutor for DS exam", rating: 4.9, reviewCount: 12 },
  { id: "ap2", name: "Ama Mensah", initials: "AM", avatarColor: "#fef3c7", gigTitle: "Design poster for council event", rating: 5.0, reviewCount: 7 },
  { id: "ap3", name: "Lionel Tchoupo", initials: "LT", avatarColor: "#ede9fe", gigTitle: "Photographer for graduation ceremony", rating: 4.6, reviewCount: 11 },
  { id: "ap4", name: "Sara Ndongo", initials: "SN", avatarColor: "#ccfbf1", gigTitle: "Help set up graduation dinner", rating: 4.7, reviewCount: 15 },
  { id: "ap5", name: "Emmanuel Tala", initials: "ET", avatarColor: "#e6f7e6", gigTitle: "Design poster for council event", rating: 4.8, reviewCount: 14 },
  { id: "ap6", name: "Danielle Nkwi", initials: "DN", avatarColor: "#fce7f3", gigTitle: "Python tutor for DS exam", rating: 4.9, reviewCount: 18 },
  { id: "ap7", name: "Prisca Ewolo", initials: "PE", avatarColor: "#fff7ed", gigTitle: "Fix WiFi on Ubuntu laptop", rating: 5.0, reviewCount: 10 },
];

export const mockDashboardApplications: {
  id: string; gigTitle: string; posterName: string; budget: number;
  status: AppStatus; category: GigCategory;
}[] = [
  { id: "da1", gigTitle: "Python tutor for DS exam", posterName: "Jules Biya", budget: 5000, status: "PENDING", category: "Tutoring" },
  { id: "da2", gigTitle: "Design poster for council event", posterName: "Marie Fofana", budget: 4000, status: "IN_PROGRESS", category: "Creative" },
  { id: "da3", gigTitle: "Photographer for graduation", posterName: "Marie Fofana", budget: 15000, status: "COMPLETED", category: "Photography" },
  { id: "da4", gigTitle: "Help set up graduation dinner", posterName: "Jules Biya", budget: 6000, status: "PENDING", category: "Events" },
];

export const applicationsByWorker = (userId: string) =>
  mockApplications.filter((a) => a.worker.id === userId);
