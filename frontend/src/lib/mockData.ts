import type { Application, ChatThread, Gig, Review, User, PublicUser } from "@/types";

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

export const mockUsers: User[] = [
  {
    id: "u1", email: "kofi@ub.cm", fullName: "Kofi Asante", role: "WORKER",
    universityId: "ub", universityName: "University of Buea", city: "Buea",
    bio: "CS senior. I tutor Python, algorithms and math. Patient and clear.",
    skills: ["Python", "Algorithms", "Math"], avgRating: 4.9, reviewCount: 12, hiredCount: 8,
    hourlyRate: 5000, responseTime: "within 1 hour", availability: "Immediately",
    verified: true, experienceLevel: "Intermediate", remoteAvailable: true,
    createdAt: hoursAgo(24 * 90),
  },
  {
    id: "u2", email: "ama@uy1.cm", fullName: "Ama Mensah", role: "WORKER",
    universityId: "uy1", universityName: "University of Yaoundé I", city: "Yaoundé",
    bio: "Graphic designer. Canva + Illustrator. Quick turnaround for posters, flyers and decks.",
    skills: ["Graphic design", "Canva", "Illustrator"], avgRating: 5.0, reviewCount: 7, hiredCount: 5,
    hourlyRate: 4000, responseTime: "within 2 hours", availability: "Immediately",
    verified: true, experienceLevel: "Intermediate", remoteAvailable: true,
    createdAt: hoursAgo(24 * 60),
  },
  {
    id: "u3", email: "marie@yibs.cm", fullName: "Marie Fofana", role: "POSTER",
    universityId: "yibs", universityName: "YIBS", city: "Yaoundé",
    bio: "Student council president at YIBS. I post events, design, errands.",
    skills: [], avgRating: 4.8, reviewCount: 9, hiredCount: 6,
    createdAt: hoursAgo(24 * 200),
  },
  {
    id: "u4", email: "jules@udla.cm", fullName: "Jules Biya", role: "POSTER",
    universityId: "udla", universityName: "University of Douala", city: "Douala",
    bio: "Engineering club lead, often need tech help and event muscle.",
    skills: [], avgRating: 4.5, reviewCount: 4, hiredCount: 4,
    createdAt: hoursAgo(24 * 150),
  },
  {
    id: "u5", email: "sara@udschang.cm", fullName: "Sara Ndongo", role: "WORKER",
    universityId: "udschang", universityName: "University of Dschang", city: "Dschang",
    bio: "Event setup, catering help, errands. Show up on time, get it done.",
    skills: ["Events", "Catering", "Errands"], avgRating: 4.7, reviewCount: 15, hiredCount: 12,
    hourlyRate: 3500, responseTime: "within 30 minutes", availability: "Immediately",
    verified: true, experienceLevel: "Expert", remoteAvailable: false,
    createdAt: hoursAgo(24 * 120),
  },
  {
    id: "u6", email: "paul@ensp.cm", fullName: "Paul Mbarga", role: "WORKER",
    universityId: "ensp", universityName: "ENSP", city: "Yaoundé",
    bio: "Electrical engineering. Repairs, wiring, laptop fixes.",
    skills: ["Electrician", "Repairs", "Tech help"], avgRating: 4.8, reviewCount: 9, hiredCount: 6,
    hourlyRate: 3000, responseTime: "within 2 hours", availability: "This Week",
    verified: true, experienceLevel: "Intermediate", remoteAvailable: false,
    createdAt: hoursAgo(24 * 80),
  },
  {
    id: "u7", email: "fatima@un.cm", fullName: "Fatima Oumarou", role: "POSTER",
    universityId: "un", universityName: "University of Ngaoundéré", city: "Ngaoundéré",
    bio: "Med student. I post tutoring + errands gigs.",
    skills: [], avgRating: 4.6, reviewCount: 3, hiredCount: 3,
    createdAt: hoursAgo(24 * 40),
  },
  {
    id: "u8", email: "lionel@ubam.cm", fullName: "Lionel Tchoupo", role: "WORKER",
    universityId: "ubam", universityName: "University of Bamenda", city: "Bamenda",
    bio: "Photography + video. Events, portraits, club recaps.",
    skills: ["Photography", "Video editing", "Lightroom"], avgRating: 4.6, reviewCount: 11, hiredCount: 9,
    hourlyRate: 8000, responseTime: "within 3 hours", availability: "This Week",
    verified: true, experienceLevel: "Intermediate", remoteAvailable: false,
    createdAt: hoursAgo(24 * 100),
  },
  {
    id: "u9", email: "danielle@catholic.cm", fullName: "Danielle Nkwi", role: "WORKER",
    universityId: "catholic", universityName: "Catholic University of Cameroon", city: "Bamenda",
    bio: "Mathematics and physics tutor. Passionate about helping students understand STEM concepts.",
    skills: ["Mathematics", "Physics", "Calculus", "Statistics"], avgRating: 4.9, reviewCount: 18, hiredCount: 15,
    hourlyRate: 5500, responseTime: "within 1 hour", availability: "Immediately",
    verified: true, experienceLevel: "Expert", remoteAvailable: true,
    createdAt: hoursAgo(24 * 130),
  },
  {
    id: "u10", email: "emmanuel@esstic.cm", fullName: "Emmanuel Tala", role: "WORKER",
    universityId: "esstic", universityName: "ESSTIC", city: "Yaoundé",
    bio: "Web developer. React, Laravel, Tailwind. Built 3 campus platforms.",
    skills: ["React", "Laravel", "Tailwind CSS", "JavaScript", "PHP"], avgRating: 4.8, reviewCount: 14, hiredCount: 11,
    hourlyRate: 7000, responseTime: "within 2 hours", availability: "This Week",
    verified: true, experienceLevel: "Intermediate", remoteAvailable: true,
    createdAt: hoursAgo(24 * 75),
  },
  {
    id: "u11", email: "prisca@uy2.cm", fullName: "Prisca Ewolo", role: "WORKER",
    universityId: "uy2", universityName: "University of Yaoundé II", city: "Soa",
    bio: "English-French translator. Certified, fast turnaround. Academic and legal docs.",
    skills: ["Translation", "English", "French", "Proofreading"], avgRating: 5.0, reviewCount: 10, hiredCount: 7,
    hourlyRate: 4500, responseTime: "within 1 hour", availability: "Immediately",
    verified: true, experienceLevel: "Expert", remoteAvailable: true,
    createdAt: hoursAgo(24 * 85),
  },
  {
    id: "u12", email: "brice@udla.cm", fullName: "Brice Mvondo", role: "WORKER",
    universityId: "udla", universityName: "University of Douala", city: "Douala",
    bio: "Full-stack developer. Available for web apps, APIs, and databases.",
    skills: ["Python", "Django", "React", "PostgreSQL", "REST APIs"], avgRating: 4.7, reviewCount: 8, hiredCount: 6,
    hourlyRate: 6500, responseTime: "within 4 hours", availability: "Next Week",
    verified: false, experienceLevel: "Intermediate", remoteAvailable: true,
    createdAt: hoursAgo(24 * 50),
  },
  {
    id: "u13", email: "chantal@ub.cm", fullName: "Chantal Ebongue", role: "WORKER",
    universityId: "ub", universityName: "University of Buea", city: "Buea",
    bio: "Experienced house cleaner and organizer. Reliable, thorough, and friendly.",
    skills: ["Cleaning", "Organization", "Laundry", "Cooking"], avgRating: 4.8, reviewCount: 22, hiredCount: 18,
    hourlyRate: 2500, responseTime: "within 30 minutes", availability: "Immediately",
    verified: true, experienceLevel: "Expert", remoteAvailable: false,
    createdAt: hoursAgo(24 * 200),
  },
  {
    id: "u14", email: "rodrigue@ensp.cm", fullName: "Rodrigue Ngué", role: "WORKER",
    universityId: "ensp", universityName: "ENSP", city: "Yaoundé",
    bio: "Event sound engineer. Speakers, mixers, mics. I've done 20+ campus events.",
    skills: ["Sound Engineering", "Event Setup", "MC", "Audio Editing"], avgRating: 4.9, reviewCount: 16, hiredCount: 14,
    hourlyRate: 9000, responseTime: "within 1 hour", availability: "Immediately",
    verified: true, experienceLevel: "Expert", remoteAvailable: false,
    createdAt: hoursAgo(24 * 110),
  },
  {
    id: "u15", email: "nadia@yibs.cm", fullName: "Nadia Beyala", role: "WORKER",
    universityId: "yibs", universityName: "YIBS", city: "Yaoundé",
    bio: "Social media manager. Content creation, scheduling, analytics. Canva + Meta Business.",
    skills: ["Social Media", "Content Creation", "Canva", "Copywriting"], avgRating: 4.6, reviewCount: 6, hiredCount: 4,
    hourlyRate: 3500, responseTime: "within 2 hours", availability: "This Week",
    verified: false, experienceLevel: "Entry", remoteAvailable: true,
    createdAt: hoursAgo(24 * 30),
  },
  {
    id: "u16", email: "samuel@ubam.cm", fullName: "Samuel Ndifor", role: "WORKER",
    universityId: "ubam", universityName: "University of Bamenda", city: "Bamenda",
    bio: "Delivery rider. Bike, fast, cover all of Bamenda. Same-day delivery.",
    skills: ["Delivery", "Bike Riding", "City Navigation", "Customer Service"], avgRating: 4.5, reviewCount: 20, hiredCount: 25,
    hourlyRate: 2000, responseTime: "within 15 minutes", availability: "Immediately",
    verified: true, experienceLevel: "Expert", remoteAvailable: false,
    createdAt: hoursAgo(24 * 180),
  },
  {
    id: "u17", email: "alain@uy1.cm", fullName: "Alain Eyango", role: "WORKER",
    universityId: "uy1", universityName: "University of Yaoundé I", city: "Yaoundé",
    bio: "French and English tutor. Bilingual. Help with exams, essays, and conversation practice.",
    skills: ["French", "English", "Tutoring", "Writing"], avgRating: 4.7, reviewCount: 13, hiredCount: 10,
    hourlyRate: 4000, responseTime: "within 1 hour", availability: "Immediately",
    verified: true, experienceLevel: "Intermediate", remoteAvailable: true,
    createdAt: hoursAgo(24 * 95),
  },
  {
    id: "u18", email: "esther@udschang.cm", fullName: "Esther Kemajou", role: "WORKER",
    universityId: "udschang", universityName: "University of Dschang", city: "Dschang",
    bio: "Event photographer and portrait specialist. Quick editing, natural results.",
    skills: ["Photography", "Portraits", "Lightroom", "Photoshop"], avgRating: 4.8, reviewCount: 9, hiredCount: 7,
    hourlyRate: 7000, responseTime: "within 3 hours", availability: "Next Week",
    verified: true, experienceLevel: "Intermediate", remoteAvailable: false,
    createdAt: hoursAgo(24 * 55),
  },
  {
    id: "u19", email: "yannick@un.cm", fullName: "Yannick Bédimo", role: "WORKER",
    universityId: "un", universityName: "University of Ngaoundéré", city: "Ngaoundéré",
    bio: "Computer science student. Web dev, tech support, and network troubleshooting.",
    skills: ["Web Development", "Tech Support", "JavaScript", "CSS", "Networking"], avgRating: 4.4, reviewCount: 5, hiredCount: 3,
    hourlyRate: 3500, responseTime: "within 5 hours", availability: "Flexible",
    verified: false, experienceLevel: "Entry", remoteAvailable: true,
    createdAt: hoursAgo(24 * 20),
  },
  {
    id: "u20", email: "dorcas@catholic.cm", fullName: "Dorcas Tabe", role: "WORKER",
    universityId: "catholic", universityName: "Catholic University of Cameroon", city: "Bamenda",
    bio: "Graphic designer and illustrator. Posters, branding, social media visuals.",
    skills: ["Graphic Design", "Illustration", "Poster Design", "Branding", "Photoshop"], avgRating: 4.7, reviewCount: 11, hiredCount: 8,
    hourlyRate: 4500, responseTime: "within 2 hours", availability: "This Week",
    verified: true, experienceLevel: "Intermediate", remoteAvailable: true,
    createdAt: hoursAgo(24 * 70),
  },
];

const toPublic = (u: User): PublicUser => ({
  id: u.id, fullName: u.fullName, avatarUrl: u.avatarUrl,
  universityName: u.universityName, city: u.city,
  avgRating: u.avgRating, reviewCount: u.reviewCount, hiredCount: u.hiredCount, skills: u.skills,
  hourlyRate: u.hourlyRate, responseTime: u.responseTime, availability: u.availability,
  verified: u.verified, experienceLevel: u.experienceLevel, remoteAvailable: u.remoteAvailable,
  bio: u.bio, universityId: u.universityId, createdAt: u.createdAt,
});

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

export const mockThreads: ChatThread[] = [
  {
    id: "t1", otherUser: toPublic(mockUsers[0]), gigTitle: "Python tutor for DS exam",
    messages: [
      { id: "m1", fromUserId: "u3", text: "Hi Kofi, are you free Thursday 6pm?", sentAt: hoursAgo(5) },
      { id: "m2", fromUserId: "u1", text: "Yes! Library or a quiet spot?", sentAt: hoursAgo(4) },
      { id: "m3", fromUserId: "u3", text: "Library ground floor works.", sentAt: hoursAgo(4) },
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

export const mockMessages = [
  { id: "dm1", senderName: "Marie Fofana", preview: "Hi! Are you available this weekend for the poster design?", time: "2 min ago", unread: true },
  { id: "dm2", senderName: "Jules Biya", preview: "Can you help move furniture tomorrow at 3pm?", time: "1 hour ago", unread: true },
  { id: "dm3", senderName: "Fatima Oumarou", preview: "The translation looks great. Let me know when you're free for the next one.", time: "3 hours ago", unread: false },
];

export const mockReceivedReviews = [
  { id: "dr1", reviewerName: "Marie Fofana", initials: "MF", comment: "Incredibly patient, fixed everything in 30 minutes. Highly recommend!", rating: 5 },
  { id: "dr2", reviewerName: "Jules Biya", initials: "JB", comment: "Showed up early and stayed late. Great energy and very professional.", rating: 4.5 },
  { id: "dr3", reviewerName: "Fatima Oumarou", initials: "FO", comment: "Excellent quality, precise vocabulary. Would hire again.", rating: 5 },
];

export const mockApplicants = [
  { id: "ap1", name: "Kofi Asante", initials: "KA", avatarColor: "#dbeafe", gigTitle: "Python tutor for DS exam", rating: 4.9, reviewCount: 12 },
  { id: "ap2", name: "Ama Mensah", initials: "AM", avatarColor: "#fef3c7", gigTitle: "Design poster for council event", rating: 5.0, reviewCount: 7 },
  { id: "ap3", name: "Lionel Tchoupo", initials: "LT", avatarColor: "#ede9fe", gigTitle: "Photographer for graduation ceremony", rating: 4.6, reviewCount: 11 },
  { id: "ap4", name: "Sara Ndongo", initials: "SN", avatarColor: "#ccfbf1", gigTitle: "Help set up graduation dinner", rating: 4.7, reviewCount: 15 },
  { id: "ap5", name: "Emmanuel Tala", initials: "ET", avatarColor: "#e6f7e6", gigTitle: "Design poster for council event", rating: 4.8, reviewCount: 14 },
  { id: "ap6", name: "Danielle Nkwi", initials: "DN", avatarColor: "#fce7f3", gigTitle: "Python tutor for DS exam", rating: 4.9, reviewCount: 18 },
  { id: "ap7", name: "Prisca Ewolo", initials: "PE", avatarColor: "#fff7ed", gigTitle: "Fix WiFi on Ubuntu laptop", rating: 5.0, reviewCount: 10 },
];

export const mockPostedGigs = [
  { id: "pg1", title: "Python tutor for DS exam", budget: 5000, applicantCount: 3, status: "OPEN" as const, category: "Tutoring" as const },
  { id: "pg2", title: "Help move furniture to new dorm", budget: 3500, applicantCount: 5, status: "OPEN" as const, category: "Errands" as const },
  { id: "pg3", title: "Design poster for council event", budget: 4000, applicantCount: 7, status: "IN_PROGRESS" as const, category: "Creative" as const },
  { id: "pg4", title: "Fix WiFi on Ubuntu laptop", budget: 2500, applicantCount: 2, status: "OPEN" as const, category: "Tech help" as const },
  { id: "pg5", title: "English-French report translation", budget: 8000, applicantCount: 4, status: "COMPLETED" as const, category: "Translation" as const },
  { id: "pg6", title: "Set up sound system for cultural night", budget: 12000, applicantCount: 6, status: "COMPLETED" as const, category: "Events" as const },
  { id: "pg7", title: "Quick courier: chemistry textbook return", budget: 1800, applicantCount: 2, status: "CANCELLED" as const, category: "Delivery" as const },
];

export const mockDashboardApplications = [
  { id: "da1", gigTitle: "Python tutor for DS exam", posterName: "Jules Biya", budget: 5000, status: "PENDING" as const, category: "Tutoring" as const },
  { id: "da2", gigTitle: "Design poster for council event", posterName: "Marie Fofana", budget: 4000, status: "IN_PROGRESS" as const, category: "Creative" as const },
  { id: "da3", gigTitle: "Photographer for graduation", posterName: "Marie Fofana", budget: 15000, status: "COMPLETED" as const, category: "Photography" as const },
  { id: "da4", gigTitle: "Help set up graduation dinner", posterName: "Jules Biya", budget: 6000, status: "PENDING" as const, category: "Events" as const },
];

export const mockSavedGigs: Gig[] = [mockGigs[0], mockGigs[2], mockGigs[4], mockGigs[7], mockGigs[9], mockGigs[11]];

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

export interface NotificationItem {
  id: string;
  type: "application" | "message" | "review" | "gig_update";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

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

export const findGig = (id: string) => mockGigs.find((g) => g.id === id);
export const findUser = (id: string) => mockUsers.find((u) => u.id === id);
export const reviewsForUser = (userId: string) =>
  mockReviews.filter(() => true).slice(0, 6);
export const gigsByPoster = (userId: string) =>
  mockGigs.filter((g) => g.poster.id === userId);
export const applicationsByWorker = (userId: string) =>
  mockApplications.filter((a) => a.worker.id === userId);
