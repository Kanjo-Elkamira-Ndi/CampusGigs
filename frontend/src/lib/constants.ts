export const CAMEROON_UNIVERSITIES = [
  { id: "uy1", name: "University of Yaoundé I", city: "Yaoundé", type: "public" },
  { id: "uy2", name: "University of Yaoundé II", city: "Soa", type: "public" },
  { id: "ub", name: "University of Buea", city: "Buea", type: "public" },
  { id: "udschang", name: "University of Dschang", city: "Dschang", type: "public" },
  { id: "udla", name: "University of Douala", city: "Douala", type: "public" },
  { id: "un", name: "University of Ngaoundéré", city: "Ngaoundéré", type: "public" },
  { id: "um", name: "University of Maroua", city: "Maroua", type: "public" },
  { id: "ubam", name: "University of Bamenda", city: "Bamenda", type: "public" },
  { id: "yibs", name: "YIBS", city: "Yaoundé", type: "private" },
  { id: "esstic", name: "ESSTIC", city: "Yaoundé", type: "public" },
  { id: "ensp", name: "ENSP", city: "Yaoundé", type: "public" },
  { id: "catholic", name: "Catholic University of Cameroon", city: "Bamenda", type: "private" },
] as const;

export type UniversityId = (typeof CAMEROON_UNIVERSITIES)[number]["id"];

export const CATEGORY_META = {
  Tutoring: { icon: "📚", bg: "bg-green-50 dark:bg-green-950", text: "text-green-700 dark:text-green-400" },
  Errands: { icon: "🛒", bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-400" },
  "Tech help": { icon: "💻", bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-400" },
  Events: { icon: "🎉", bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-700 dark:text-purple-400" },
  Creative: { icon: "🎨", bg: "bg-pink-50 dark:bg-pink-950", text: "text-pink-700 dark:text-pink-400" },
  Delivery: { icon: "🚚", bg: "bg-orange-50 dark:bg-orange-950", text: "text-orange-700 dark:text-orange-400" },
  Translation: { icon: "🌍", bg: "bg-teal-50 dark:bg-teal-950", text: "text-teal-700 dark:text-teal-400" },
  Photography: { icon: "📸", bg: "bg-rose-50 dark:bg-rose-950", text: "text-rose-700 dark:text-rose-400" },
  Other: { icon: "⚡", bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" },
} as const;

export const ROUTES = {
  home: "/",
  gigs: "/gigs",
  postGig: "/gigs/new",
  freelancers: "/freelancers",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  posterDashboard: "/dashboard/poster",
  messages: "/messages",
  editProfile: "/profile/edit",
} as const;
