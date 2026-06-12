import { motion } from "framer-motion";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StarRating } from "@/components/reviews/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockApplicants } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function ApplicantsPageContent() {
  const [applicantState, setApplicantState] = useState<Record<string, "pending" | "accepted" | "passed">>(
    Object.fromEntries(mockApplicants.map((a) => [a.id, "pending" as const])),
  );

  const pendingCount = Object.values(applicantState).filter((s) => s === "pending").length;
  const applicants = mockApplicants;

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
              const state = applicantState[a.id];
              return (
                <div
                  key={a.id}
                  className={cn(
                    "flex items-center gap-4 p-4 border-b border-border last:border-b-0 transition-all",
                    state === "accepted" && "bg-green-50/50 dark:bg-green-950/20",
                    state === "passed" && "opacity-50",
                    state === "pending" && "hover:bg-muted/40",
                  )}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
                    style={{ background: a.avatarColor }}
                  >
                    {a.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{a.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {state === "accepted" ? "Accepted" : state === "passed" ? "Passed" : ""}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 flex-wrap">
                      <span>Applied to: {a.gigTitle}</span>
                      <span>·</span>
                      <StarRating value={a.rating} readOnly size={11} />
                      <span>({a.reviewCount})</span>
                    </div>
                  </div>
                  {state === "pending" && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => { setApplicantState((p) => ({ ...p, [a.id]: "accepted" })); toast.success(`${a.name} accepted!`); }}
                        className="px-2.5 py-1 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => { setApplicantState((p) => ({ ...p, [a.id]: "passed" })); toast(`${a.name} passed`); }}
                        className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/70 transition-colors"
                      >
                        Pass
                      </button>
                    </div>
                  )}
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
