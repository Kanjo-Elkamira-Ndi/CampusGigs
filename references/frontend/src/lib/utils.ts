import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInHours, format, isPast } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBudget = (n: number) => `XAF ${n.toLocaleString("fr-CM")}`;

export type DeadlineUrgency = "red" | "amber" | "green" | "gray";

export const getDeadlineLabel = (
  deadline: string,
): { label: string; urgency: DeadlineUrgency } => {
  const d = new Date(deadline);
  if (isPast(d)) return { label: "Expired", urgency: "gray" };
  const h = differenceInHours(d, new Date());
  if (h < 24) return { label: `${h}h left`, urgency: "red" };
  if (h < 168) return { label: `${Math.ceil(h / 24)} days left`, urgency: "amber" };
  return { label: format(d, "d MMM yyyy"), urgency: "green" };
};

export const getAvatarColor = (id: string) => {
  const p = [
    "#e6f7e6",
    "#dbeafe",
    "#fef3c7",
    "#ede9fe",
    "#fee2e2",
    "#ccfbf1",
    "#fce7f3",
    "#fff7ed",
  ];
  return p[id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % p.length];
};

export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

export const timeAgo = (iso: string) => {
  const h = Math.max(0, differenceInHours(new Date(), new Date(iso)));
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
