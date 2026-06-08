import type { Gig, GigStatus, GigCategory } from "@/types";
import { mockUsers, toPublic } from "./users";

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};
const hoursAgo = (h: number) => {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
};

const poster = (id: string) => toPublic(mockUsers.find((u) => u.id === id)!);

export const mockGigs: Gig[] = [
  { id: "g1", title: "Python tutor for data structures exam", description: "Need help reviewing trees, hashmaps and Big-O before Friday's exam. 2-hour session.", budget: 5000, location: "Library Ground Floor, UB", universityId: "ub", universityName: "University of Buea", city: "Buea", category: "Tutoring", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(3), createdAt: hoursAgo(4), poster: poster("u4"), applicationCount: 3, isEasyApply: true, tags: ["Python", "Exam prep"] },
  { id: "g2", title: "Help move furniture to new dorm", description: "Two desks and a mattress to move from Block A to Block C. Should take 1h.", budget: 3500, location: "Block C Dormitory, YIBS", universityId: "yibs", universityName: "YIBS", city: "Yaoundé", category: "Errands", status: "OPEN", slots: 2, slotsRemaining: 2, deadline: daysFromNow(1), createdAt: hoursAgo(6), poster: poster("u3"), applicationCount: 5, isEasyApply: true, tags: ["Moving", "Heavy lifting"] },
  { id: "g3", title: "Design poster for student council event", description: "Need a punchy A2 poster for upcoming culture week. Brand colors provided.", budget: 4000, location: "Remote", universityId: "uy1", universityName: "University of Yaoundé I", city: "Yaoundé", category: "Creative", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(5), createdAt: hoursAgo(10), poster: poster("u3"), applicationCount: 7, isEasyApply: true, tags: ["Poster", "Branding"] },
  { id: "g4", title: "Fix WiFi on Ubuntu laptop", description: "Wifi card not detected after kernel update. Need someone who knows Linux.", budget: 2500, location: "Amphi 200, ENSP", universityId: "ensp", universityName: "ENSP", city: "Yaoundé", category: "Tech help", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(2), createdAt: hoursAgo(2), poster: poster("u4"), applicationCount: 2, isEasyApply: true, tags: ["Linux", "Networking"] },
  { id: "g5", title: "Photographer for graduation ceremony", description: "Full-day shoot, edited gallery within a week. Bring own gear.", budget: 15000, location: "Main Hall, UDschang", universityId: "udschang", universityName: "University of Dschang", city: "Dschang", category: "Photography", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(10), createdAt: hoursAgo(20), poster: poster("u3"), applicationCount: 4, isEasyApply: true, tags: ["Event", "Portraits"] },
  { id: "g6", title: "English-French report translation (10 pages)", description: "Academic report, needs accurate translation with technical terms.", budget: 8000, location: "Remote", universityId: "uy1", universityName: "University of Yaoundé I", city: "Yaoundé", category: "Translation", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(7), createdAt: hoursAgo(14), poster: poster("u7"), applicationCount: 3, isEasyApply: true, tags: ["Academic", "EN-FR"] },
  { id: "g7", title: "Help set up graduation dinner", description: "Set up tables, lights and sound for a 60-person dinner.", budget: 6000, location: "Faculty Hall, UDouala", universityId: "udla", universityName: "University of Douala", city: "Douala", category: "Events", status: "OPEN", slots: 4, slotsRemaining: 3, deadline: daysFromNow(4), createdAt: hoursAgo(8), poster: poster("u4"), applicationCount: 6, isEasyApply: true, tags: ["Setup", "Evening"] },
  { id: "g8", title: "Deliver printed documents across campus", description: "Pick up stack from print shop, drop at 3 buildings.", budget: 1500, location: "Main Gate, UBamenda", universityId: "ubam", universityName: "University of Bamenda", city: "Bamenda", category: "Delivery", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(1), createdAt: hoursAgo(1), poster: poster("u3"), applicationCount: 1, isEasyApply: true, tags: ["Quick", "Walking"] },
  { id: "g9", title: "Maths tutor for calculus finals", description: "1-on-1 sessions, 3 evenings before finals. Limits, integrals.", budget: 4500, location: "Library Wing B, UN", universityId: "un", universityName: "University of Ngaoundéré", city: "Ngaoundéré", category: "Tutoring", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(6), createdAt: hoursAgo(30), poster: poster("u7"), applicationCount: 5, isEasyApply: true, tags: ["Calculus", "Exam prep"] },
  { id: "g10", title: "Video editing for student club recap", description: "5-min recap from 30 mins of footage. Music + lower thirds.", budget: 7000, location: "Remote", universityId: "ub", universityName: "University of Buea", city: "Buea", category: "Creative", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(8), createdAt: hoursAgo(36), poster: poster("u3"), applicationCount: 2, isEasyApply: true, tags: ["Premiere", "Recap"] },
  { id: "g11", title: "Set up sound system for cultural night", description: "Bring or rent speakers, mixer. Run sound during event.", budget: 12000, location: "Open Quad, YIBS", universityId: "yibs", universityName: "YIBS", city: "Yaoundé", category: "Events", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(9), createdAt: hoursAgo(40), poster: poster("u3"), applicationCount: 3, isEasyApply: true, tags: ["Sound", "Live"] },
  { id: "g12", title: "Errands: print + bind 3 thesis copies", description: "Take USB to print shop, bind 3 copies, deliver to office.", budget: 2000, location: "Admin Block, UDla", universityId: "udla", universityName: "University of Douala", city: "Douala", category: "Errands", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(2), createdAt: hoursAgo(3), poster: poster("u4"), applicationCount: 4, isEasyApply: true, tags: ["Printing"] },
  { id: "g13", title: "Help install printer + Office on laptop", description: "Win 11 laptop, network printer, Office 2021 license provided.", budget: 3000, location: "Lab 4, ESSTIC", universityId: "esstic", universityName: "ESSTIC", city: "Yaoundé", category: "Tech help", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(3), createdAt: hoursAgo(7), poster: poster("u3"), applicationCount: 1, isEasyApply: true, tags: ["Windows"] },
  { id: "g14", title: "Translate club bylaws EN->FR", description: "8 pages, formal tone. Need clean Word doc.", budget: 5500, location: "Remote", universityId: "ubam", universityName: "University of Bamenda", city: "Bamenda", category: "Translation", status: "IN_PROGRESS", slots: 1, slotsRemaining: 0, deadline: daysFromNow(5), createdAt: hoursAgo(60), poster: poster("u3"), applicationCount: 4, isEasyApply: true, tags: ["Legal"] },
  { id: "g15", title: "Wedding-style portraits for class photo day", description: "Half day, classic posed shots, 30 students.", budget: 18000, location: "Botanical Garden, UDschang", universityId: "udschang", universityName: "University of Dschang", city: "Dschang", category: "Photography", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(12), createdAt: hoursAgo(48), poster: poster("u4"), applicationCount: 2, isEasyApply: true, tags: ["Portraits"] },
  { id: "g16", title: "Quick courier: chemistry textbook return", description: "Pick from Block B, drop at library counter before 5pm.", budget: 1800, location: "Block B, UB", universityId: "ub", universityName: "University of Buea", city: "Buea", category: "Delivery", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(1), createdAt: hoursAgo(2), poster: poster("u3"), applicationCount: 2, isEasyApply: true, tags: ["Same-day"] },
  { id: "g17", title: "Tutor: French oral exam practice", description: "3 sessions of 1 hour, conversational practice + feedback.", budget: 6000, location: "Cafeteria, UN", universityId: "un", universityName: "University of Ngaoundéré", city: "Ngaoundéré", category: "Tutoring", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(5), createdAt: hoursAgo(16), poster: poster("u7"), applicationCount: 3, isEasyApply: true, tags: ["French", "Oral"] },
  { id: "g18", title: "Design Instagram template pack (5 posts)", description: "Club brand, clean modern look. Editable in Canva.", budget: 5000, location: "Remote", universityId: "ensp", universityName: "ENSP", city: "Yaoundé", category: "Creative", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(6), createdAt: hoursAgo(22), poster: poster("u4"), applicationCount: 4, isEasyApply: true, tags: ["Canva", "Social"] },
  { id: "g19", title: "MC + sound runner for engineering night", description: "Bilingual MC, manage sound cues. Evening event.", budget: 10000, location: "Auditorium, UDla", universityId: "udla", universityName: "University of Douala", city: "Douala", category: "Events", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(7), createdAt: hoursAgo(28), poster: poster("u4"), applicationCount: 6, isEasyApply: true, tags: ["MC", "Bilingual"] },
  { id: "g20", title: "Repair broken dorm desk lamp", description: "Lamp doesn't turn on. Needs rewiring or new switch.", budget: 2500, location: "Dorm 12, ENSP", universityId: "ensp", universityName: "ENSP", city: "Yaoundé", category: "Other", status: "OPEN", slots: 1, slotsRemaining: 1, deadline: daysFromNow(4), createdAt: hoursAgo(18), poster: poster("u3"), applicationCount: 1, isEasyApply: true, tags: ["Repair"] },
];

export const mockPostedGigs: {
  id: string; title: string; budget: number; applicantCount: number;
  status: GigStatus; category: GigCategory;
}[] = [
  { id: "pg1", title: "Python tutor for DS exam", budget: 5000, applicantCount: 3, status: "OPEN", category: "Tutoring" },
  { id: "pg2", title: "Help move furniture to new dorm", budget: 3500, applicantCount: 5, status: "OPEN", category: "Errands" },
  { id: "pg3", title: "Design poster for council event", budget: 4000, applicantCount: 7, status: "IN_PROGRESS", category: "Creative" },
  { id: "pg4", title: "Fix WiFi on Ubuntu laptop", budget: 2500, applicantCount: 2, status: "OPEN", category: "Tech help" },
  { id: "pg5", title: "English-French report translation", budget: 8000, applicantCount: 4, status: "COMPLETED", category: "Translation" },
  { id: "pg6", title: "Set up sound system for cultural night", budget: 12000, applicantCount: 6, status: "COMPLETED", category: "Events" },
  { id: "pg7", title: "Quick courier: chemistry textbook return", budget: 1800, applicantCount: 2, status: "CANCELLED", category: "Delivery" },
];

export const mockSavedGigs: Gig[] = [mockGigs[0], mockGigs[2], mockGigs[4], mockGigs[7], mockGigs[9], mockGigs[11]];

export const findGig = (id: string) => mockGigs.find((g) => g.id === id);
export const gigsByPoster = (userId: string) => mockGigs.filter((g) => g.poster.id === userId);
