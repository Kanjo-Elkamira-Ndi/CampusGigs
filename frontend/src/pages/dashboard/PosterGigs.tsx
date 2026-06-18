import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CategoryIconCircle } from "@/components/gigs/GigBadge";
import { GigStatusBadge } from "@/components/gigs/GigStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useGigs } from "@/hooks/useGigs";
import { useAuthStore } from "@/store/authStore";
import { formatBudget } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { GigStatus } from "@/types";

type Filter = "ALL" | GigStatus;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "OPEN", label: "Open" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function PosterGigsContent() {
  const user = useAuthStore((s) => s.user)!;
  const [filter, setFilter] = useState<Filter>("ALL");
  const { data: gigsResult } = useGigs({ posterId: user.id, limit: 100 });
  const allGigs = gigsResult?.data ?? [];
  const gigs = filter === "ALL" ? allGigs : allGigs.filter((g) => g.status === filter);

  return (
    <PageWrapper>
      <DashboardShell role="POSTER">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My gigs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{allGigs.length} total</p>
          </div>
          <Link
            to="/gigs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
          >
            <Plus size={16} /> Post a gig
          </Link>
        </div>

        <div className="flex items-center gap-1 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {gigs.length === 0 ? (
          <EmptyState
            title="No gigs found"
            description={filter === "ALL" ? "You haven't posted any gigs yet." : `No ${filter.toLowerCase().replace("_", " ")} gigs.`}
            action={<Link to="/gigs/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all">Post your first gig</Link>}
          />
        ) : (
          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            {gigs.map((g) => (
              <div key={g.id} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors">
                  <CategoryIconCircle category={g.category} size={36} />
                <Link to={"/gigs/" + g.id} className="flex-1 min-w-0">
                  <div className="font-medium text-sm hover:text-primary transition-colors truncate">{g.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatBudget(g.budget)} · {g.applicantCount} applicant{g.applicantCount > 1 ? "s" : ""}
                  </div>
                </Link>
                <GigStatusBadge status={g.status} />
              </div>
            ))}
          </motion.div>
        )}
      </DashboardShell>
    </PageWrapper>
  );
}

export function PosterGigs() {
  return <ProtectedRoute><PosterGigsContent /></ProtectedRoute>;
}
