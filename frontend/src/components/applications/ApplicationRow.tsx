import { Link } from "@tanstack/react-router";
import type { Application, AppStatus } from "@/types";
import { CategoryIconCircle } from "@/components/gigs/GigBadge";
import { cn, timeAgo } from "@/lib/utils";

const STATUS: Record<AppStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  ACCEPTED: "bg-brand-light text-[color:var(--brand-dark)] dark:text-brand-foreground border border-brand-border/60",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  COMPLETED: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function ApplicationRow({ application }: { application: Application }) {
  const a = application;
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border hover:bg-muted/40">
      <CategoryIconCircle category={a.gig.category} size={36} />
      <div className="flex-1 min-w-0">
        <Link to="/gigs/$id" params={{ id: a.gig.id }} className="font-medium text-sm hover:underline truncate block">
          {a.gig.title}
        </Link>
        <div className="text-xs text-muted-foreground">
          {a.gig.poster.fullName} · {a.gig.universityName} · applied {timeAgo(a.appliedAt)}
        </div>
      </div>
      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium", STATUS[a.status])}>{a.status}</span>
      <Link to="/gigs/$id" params={{ id: a.gig.id }} className="text-xs text-[color:var(--brand-dark)] dark:text-brand hover:underline">
        View gig
      </Link>
    </div>
  );
}
