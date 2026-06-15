import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, Clock, MapPin, Users } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CategoryIconCircle } from "@/components/gigs/GigBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockSavedGigs } from "@/lib/mockData";
import { formatBudget, getDeadlineLabel } from "@/lib/utils";

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function SavedGigsContent() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(mockSavedGigs.map((g) => g.id)));
  const gigs = mockSavedGigs.filter((g) => savedIds.has(g.id));

  return (
    <PageWrapper>
      <DashboardShell role="WORKER">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Saved gigs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{gigs.length} gig{gigs.length !== 1 ? "s" : ""} saved</p>
          </div>
        </div>

        {gigs.length === 0 ? (
          <EmptyState
            title="No saved gigs"
            description="Bookmark gigs you're interested in and they'll appear here."
            action={<Link to="/gigs" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all">Browse gigs</Link>}
          />
        ) : (
          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            {gigs.map((g) => {
              const d = getDeadlineLabel(g.deadline);
              return (
                <div key={g.id} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors group">
                  <CategoryIconCircle category={g.category} size={36} />
                  <Link to={"/gigs/" + g.id} className="flex-1 min-w-0">
                    <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">{g.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="inline-flex items-center gap-1"><MapPin size={11} />{g.city}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1"><Clock size={11} />{d.label}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1"><Users size={11} />{g.applicationCount} applicants</span>
                    </div>
                  </Link>
                  <div className="text-sm font-semibold text-primary">{formatBudget(g.budget)}</div>
                  <button
                    onClick={() => setSavedIds((prev) => { const next = new Set(prev); next.delete(g.id); return next; })}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors shrink-0"
                    aria-label="Remove from saved"
                  >
                    <Heart size={16} className="fill-red-500" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </DashboardShell>
    </PageWrapper>
  );
}

export function SavedGigs() {
  return <ProtectedRoute><SavedGigsContent /></ProtectedRoute>;
}
