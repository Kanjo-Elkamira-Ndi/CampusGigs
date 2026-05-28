import { Link } from "@tanstack/react-router";
import type { Gig } from "@/types";
import { CategoryIconCircle, GigBadge } from "./GigBadge";
import { formatBudget, getDeadlineLabel } from "@/lib/utils";
import { GigStatusBadge } from "./GigStatusBadge";

export function GigCard({ gig }: { gig: Gig }) {
  const d = getDeadlineLabel(gig.deadline);
  return (
    <Link
      to="/gigs/$id"
      params={{ id: gig.id }}
      className="block rounded-xl border border-border p-4 hover:border-brand hover:shadow-sm transition-all bg-card"
    >
      <div className="flex items-start gap-3">
        <CategoryIconCircle category={gig.category} size={36} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-sm truncate">{gig.title}</h4>
            <GigStatusBadge status={gig.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{gig.description}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <GigBadge category={gig.category} />
            <span className="font-bold text-[color:var(--brand-dark)] dark:text-brand">{formatBudget(gig.budget)}</span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">{d.label} · {gig.universityName}</div>
        </div>
      </div>
    </Link>
  );
}
