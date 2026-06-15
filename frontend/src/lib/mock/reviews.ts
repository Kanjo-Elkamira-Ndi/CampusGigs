import type { Review } from "@/types";
import { mockUsers, toPublic } from "./users";

const hoursAgo = (h: number) => {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
};

export const mockReviews: Review[] = [
  { id: "r1", gig: { id: "g1", title: "Python tutor for DS exam", category: "Tutoring" }, reviewer: toPublic(mockUsers[2]), rating: 5, comment: "Incredibly patient, fixed everything in 30 minutes. Highly recommend!", createdAt: hoursAgo(24 * 10) },
  { id: "r2", gig: { id: "g3", title: "Poster design", category: "Creative" }, reviewer: toPublic(mockUsers[3]), rating: 5, comment: "Très professionnel, livré à temps. Je recommande vivement.", createdAt: hoursAgo(24 * 14) },
  { id: "r3", gig: { id: "g7", title: "Event setup", category: "Events" }, reviewer: toPublic(mockUsers[3]), rating: 4.5, comment: "Showed up early and stayed late. Great energy.", createdAt: hoursAgo(24 * 5) },
  { id: "r4", gig: { id: "g5", title: "Graduation photos", category: "Photography" }, reviewer: toPublic(mockUsers[2]), rating: 5, comment: "Galerie magnifique, retouches soignées. À refaire.", createdAt: hoursAgo(24 * 21) },
  { id: "r5", gig: { id: "g4", title: "WiFi fix", category: "Tech help" }, reviewer: toPublic(mockUsers[3]), rating: 4, comment: "Solved it in under an hour. Knows his Linux.", createdAt: hoursAgo(24 * 30) },
  { id: "r6", gig: { id: "g2", title: "Moving furniture", category: "Errands" }, reviewer: toPublic(mockUsers[2]), rating: 4.5, comment: "Strong, reliable, no complaints.", createdAt: hoursAgo(24 * 7) },
  { id: "r7", gig: { id: "g6", title: "EN-FR translation", category: "Translation" }, reviewer: toPublic(mockUsers[6]), rating: 5, comment: "Excellente qualité, vocabulaire précis.", createdAt: hoursAgo(24 * 12) },
  { id: "r8", gig: { id: "g8", title: "Doc delivery", category: "Delivery" }, reviewer: toPublic(mockUsers[2]), rating: 4, comment: "Fast and friendly.", createdAt: hoursAgo(24 * 3) },
  { id: "r9", gig: { id: "g10", title: "Video recap", category: "Creative" }, reviewer: toPublic(mockUsers[2]), rating: 5, comment: "Loved the cut. Music choice was perfect.", createdAt: hoursAgo(24 * 18) },
  { id: "r10", gig: { id: "g9", title: "Calculus tutor", category: "Tutoring" }, reviewer: toPublic(mockUsers[6]), rating: 4.5, comment: "Très bon prof, explications claires.", createdAt: hoursAgo(24 * 9) },
  { id: "r11", gig: { id: "g13", title: "Printer install", category: "Tech help" }, reviewer: toPublic(mockUsers[2]), rating: 3.5, comment: "Worked but took longer than expected.", createdAt: hoursAgo(24 * 4) },
  { id: "r12", gig: { id: "g11", title: "Sound system", category: "Events" }, reviewer: toPublic(mockUsers[2]), rating: 5, comment: "Son impeccable toute la soirée. Bravo!", createdAt: hoursAgo(24 * 22) },
];

export const mockReceivedReviews: {
  id: string; reviewerName: string; initials: string;
  comment: string; rating: number;
}[] = [
  { id: "dr1", reviewerName: "Marie Fofana", initials: "MF", comment: "Incredibly patient, fixed everything in 30 minutes. Highly recommend!", rating: 5 },
  { id: "dr2", reviewerName: "Jules Biya", initials: "JB", comment: "Showed up early and stayed late. Great energy and very professional.", rating: 4.5 },
  { id: "dr3", reviewerName: "Fatima Oumarou", initials: "FO", comment: "Excellent quality, precise vocabulary. Would hire again.", rating: 5 },
];

export const reviewsForUser = () => mockReviews.filter(() => true).slice(0, 6);
