import type { GigStatus } from "@/types";
import { cn } from "@/lib/utils";

const STYLE: Record<GigStatus, { label: string; cls: string }> = {
  OPEN:        { label: "Open",        cls: "bg-brand-light text-[color:var(--brand-dark)] dark:text-brand-foreground border border-brand-border/60" },
  IN_PROGRESS: { label: "In progress", cls: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
  COMPLETED:   { label: "Completed",   cls: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  CANCELLED:   { label: "Cancelled",   cls: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" },
};

export function GigStatusBadge({ status, className }: { status: GigStatus; className?: string }) {
  const s = STYLE[status];
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium", s.cls, className)}>{s.label}</span>;
}
