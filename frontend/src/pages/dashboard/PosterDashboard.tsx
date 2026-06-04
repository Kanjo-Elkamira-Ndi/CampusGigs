import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Star } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CategoryIconCircle } from "@/components/gigs/GigBadge";
import { GigStatusBadge } from "@/components/gigs/GigStatusBadge";
import { StarRating } from "@/components/reviews/StarRating";
import { toast } from "sonner";
import { cn, formatBudget } from "@/lib/utils";
import {
  mockPostedGigs,
  mockApplicants,
  mockMessages,
  mockReceivedReviews,
  mockPosterStats,
} from "@/lib/mockData";

const CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function PosterDashboardContent() {
  const user = useAuthStore((s) => s.user)!;
  const stats = mockPosterStats;

  const [applicantState, setApplicantState] = useState<Record<string, "pending" | "accepted" | "passed">>(
    Object.fromEntries(mockApplicants.map((a) => [a.id, "pending" as const])),
  );

  return (
    <PageWrapper>
      <DashboardShell role="POSTER">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Poster overview</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your active gigs and review applicants</p>
          </div>
          <Link
            to="/gigs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
          >
            + Post a gig
          </Link>
        </div>

        <motion.div variants={CONTAINER} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Active gigs", value: stats.activeGigs, delta: `${stats.openGigs} open, ${stats.inProgressGigs} in progress`, deltaCls: "text-green-600 dark:text-green-400" },
            { label: "New applicants", value: stats.newApplicants, delta: "Needs your review", deltaCls: "text-amber-600 dark:text-amber-400" },
            { label: "Gigs completed", value: stats.gigsCompleted, delta: "All time", deltaCls: "text-muted-foreground" },
            { label: "Avg worker rating", value: stats.avgWorkerRating.toFixed(1), delta: `Across ${stats.gigsWithReviews} gigs`, deltaCls: "text-muted-foreground", isRating: true },
          ].map((s) => (
            <motion.div key={s.label} variants={ITEM} className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold mt-1 flex items-center gap-1">
                {"isRating" in s && s.isRating && <Star size={18} className="fill-amber-400 text-amber-400" />}
                {s.value}
              </div>
              <div className={cn("text-xs mt-1", s.deltaCls)}>{s.delta}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="font-semibold text-sm">Your active gigs</h2>
              <Link to="/dashboard/poster" className="text-xs text-primary hover:underline">Manage all →</Link>
            </div>
            <div className="px-2 pb-2">
              {mockPostedGigs.slice(0, 3).map((g) => (
                <div key={g.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                  <CategoryIconCircle category={g.category} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{g.title}</div>
                    <div className="text-xs text-muted-foreground">{formatBudget(g.budget)} · {g.applicantCount} applicant{g.applicantCount > 1 ? "s" : ""}</div>
                  </div>
                  <GigStatusBadge status={g.status} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="font-semibold text-sm">Applicants to review</h2>
              <span className="text-xs font-medium text-red-500">{stats.applicantsToReview} pending</span>
            </div>
            <div className="px-2 pb-2 space-y-1">
              {mockApplicants.slice(0, 3).map((a) => {
                const state = applicantState[a.id];
                if (state === "accepted" || state === "passed") return null;
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0"
                      style={{ background: a.avatarColor }}
                    >
                      {a.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>{a.gigTitle}</span>
                        <span>·</span>
                        <StarRating value={a.rating} readOnly size={11} />
                        <span>({a.reviewCount})</span>
                      </div>
                    </div>
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
                  </div>
                );
              })}
              {mockApplicants.slice(0, 3).every((a) => applicantState[a.id] !== "pending") && (
                <div className="p-6 text-center text-sm text-muted-foreground">All applicants reviewed</div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="font-semibold text-sm">Recent messages</h2>
              <Link to="/messages" className="text-xs text-primary hover:underline">Open inbox →</Link>
            </div>
            <div className="px-2 pb-2">
              {mockMessages.slice(0, 3).map((m) => (
                <Link key={m.id} to="/messages" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                  {m.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  {!m.unread && <span className="w-2 h-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-sm", m.unread ? "font-semibold" : "font-medium")}>{m.senderName}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{m.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{m.preview}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="font-semibold text-sm">Reviews left for you</h2>
              <Link to={"/profile/" + user.id} className="text-xs text-primary hover:underline">View all →</Link>
            </div>
            <div className="px-2 pb-2 space-y-1">
              {mockReceivedReviews.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 bg-muted">
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{r.reviewerName}</span>
                      <StarRating value={r.rating} readOnly size={12} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardShell>
    </PageWrapper>
  );
}

export function PosterDashboard() {
  return <ProtectedRoute><PosterDashboardContent /></ProtectedRoute>;
}
