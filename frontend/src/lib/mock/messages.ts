import type { ChatThread } from "@/types";
import { mockUsers, toPublic } from "./users";

const hoursAgo = (h: number) => {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
};

export const mockThreads: ChatThread[] = [
  {
    id: "t1", otherUser: toPublic(mockUsers[0]), gigTitle: "Python tutor for DS exam",
    messages: [
      { id: "m1", fromUserId: "u3", text: "Hi Kofi, are you free Thursday 6pm?", sentAt: hoursAgo(5) },
      { id: "m2", fromUserId: "u1", text: "Yes! Library or a quiet spot?", sentAt: hoursAgo(4) },
      { id: "m3", fromUserId: "u3", text: "Library ground floor works.", sentAt: hoursAgo(4) },
      { id: "m3a", fromUserId: "u1", text: "Here's the syllabus I'm working from:", sentAt: hoursAgo(3), attachments: [{ type: "image", url: "/placeholder-syllabus.png", fileName: "syllabus-2026.png", fileSize: 245_000, width: 800, height: 600 }] },
      { id: "m4", fromUserId: "u1", text: "Perfect. I'll bring practice problems.", sentAt: hoursAgo(3) },
      { id: "m5", fromUserId: "u3", text: "Merci beaucoup, à jeudi!", sentAt: hoursAgo(2) },
    ],
  },
  {
    id: "t2", otherUser: toPublic(mockUsers[1]), gigTitle: "Poster design",
    messages: [
      { id: "m6", fromUserId: "u3", text: "Hi Ama, can we go with brand green?", sentAt: hoursAgo(10) },
      { id: "m7", fromUserId: "u2", text: "Bien sûr! I'll send 2 mockups tonight.", sentAt: hoursAgo(9) },
      { id: "m8", fromUserId: "u3", text: "Awesome, thanks!", sentAt: hoursAgo(9) },
      { id: "m9", fromUserId: "u2", text: "Done — check your email.", sentAt: hoursAgo(4) },
      { id: "m9a", fromUserId: "u2", text: "Here's the final PDF:", sentAt: hoursAgo(4), attachments: [{ type: "file", url: "/poster-final.pdf", fileName: "poster-final.pdf", fileSize: 1_840_000, fileType: "application/pdf" }] },
      { id: "m10", fromUserId: "u3", text: "Option B is perfect. Let's ship it.", sentAt: hoursAgo(2) },
    ],
  },
  {
    id: "t3", otherUser: toPublic(mockUsers[7]), gigTitle: "Graduation photos",
    messages: [
      { id: "m11", fromUserId: "u3", text: "Bonjour Lionel, dispo le 15?", sentAt: hoursAgo(30) },
      { id: "m12", fromUserId: "u8", text: "Yes, full day available.", sentAt: hoursAgo(29) },
      { id: "m13", fromUserId: "u3", text: "Combien de photos retouchées?", sentAt: hoursAgo(28) },
      { id: "m14", fromUserId: "u8", text: "Around 80, delivered in a week.", sentAt: hoursAgo(20) },
      { id: "m15", fromUserId: "u3", text: "Parfait. On confirme!", sentAt: hoursAgo(6) },
    ],
  },
];

export const mockMessages: {
  id: string; senderName: string; preview: string; time: string; unread: boolean;
}[] = [
  { id: "dm1", senderName: "Marie Fofana", preview: "Hi! Are you available this weekend for the poster design?", time: "2 min ago", unread: true },
  { id: "dm2", senderName: "Jules Biya", preview: "Can you help move furniture tomorrow at 3pm?", time: "1 hour ago", unread: true },
  { id: "dm3", senderName: "Fatima Oumarou", preview: "The translation looks great. Let me know when you're free for the next one.", time: "3 hours ago", unread: false },
];
