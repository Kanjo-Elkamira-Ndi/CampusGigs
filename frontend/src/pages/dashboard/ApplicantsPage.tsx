import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StarRating } from "@/components/reviews/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePosterDashboard } from "@/hooks/useDashboard";
import { useAcceptApplication, useRejectApplication } from "@/hooks/useApplications";
import { cn } from "@/lib/utils";

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function ApplicantsPageContent() {
  const { data: dashboard } = usePosterDashboard();
  const acceptApp = useAcceptApplication();
  const rejectApp = useRejectApplication();
  const applicants = dashboard?.applicantsToReview ?? [];
  const pendingCount = applicants.length;

  return (
    <PageWrapper>
      <DashboardShell role="POSTER">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Applicants</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{applicants.length} total · {pendingCount} pending review</p>
          </div>
        </div>

        {applicants.length === 0 ? (
          <EmptyState title="No applicants yet" description="When workers apply to your gigs, they'll appear here." />
        ) : (
          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            {applicants.map((a) => {
              const initials = a.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
              const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
              const avatarColor = colors[a.name.length % colors.length];
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 text-white"
                    style={{ background: avatarColor }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{a.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 flex-wrap">
                      <span>Applied to: {a.gigTitle}</span>
                      <span>·</span>
                      <StarRating value={a.rating} readOnly size={11} />
                      <span>({a.reviewCount})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => acceptApp.mutate(a.id)}
                      disabled={acceptApp.isPending}
                      className="px-2.5 py-1 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectApp.mutate(a.id)}
                      disabled={rejectApp.isPending}
                      className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/70 transition-colors disabled:opacity-50"
                    >
                      Pass
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </DashboardShell>
    </PageWrapper>
  );
}

export function ApplicantsPage() {
  return <ProtectedRoute><ApplicantsPageContent /></ProtectedRoute>;
}
