import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Star, TrendingUp, Briefcase, Calendar } from "lucide-react";
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CategoryIconCircle } from "@/components/gigs/GigBadge";
import { GigStatusBadge } from "@/components/gigs/GigStatusBadge";
import { StarRating } from "@/components/reviews/StarRating";
import { cn, formatBudget } from "@/lib/utils";
import { usePosterDashboard } from "@/hooks/useDashboard";
import { useAcceptApplication, useRejectApplication } from "@/hooks/useApplications";

const CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const STAT_ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const FADE_UP = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const s = useSpring(mv, { stiffness: 80, damping: 18 });
  const t = useTransform(s, (v) => Math.round(v).toLocaleString());
  useEffect(() => { mv.set(value); }, [mv, value]);
  return <motion.span>{t}</motion.span>;
}

function PosterDashboardContent() {
  const user = useAuthStore((s) => s.user)!;
  const { data: dashboard } = usePosterDashboard();
  const stats = dashboard?.stats ?? null;
  const acceptApp = useAcceptApplication();
  const rejectApp = useRejectApplication();

  const statCards: {
    label: string; value: string | number; delta: string; filled?: boolean; rating?: boolean;
  }[] = stats ? [
    { label: "Active gigs", value: stats.activeGigs, delta: `${stats.openGigs} open, ${stats.inProgressGigs} in progress`, filled: true },
    { label: "New applicants", value: stats.newApplicants, delta: "Needs your review" },
    { label: "Gigs completed", value: stats.gigsCompleted, delta: "All time" },
    { label: "Avg worker rating", value: stats.avgWorkerRating.toFixed(1), delta: `Across ${stats.gigsWithReviews} gigs`, rating: true },
  ] : [];

  return (
    <PageWrapper>
      <DashboardShell role="POSTER">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Poster overview</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your active gigs and review applicants</p>
          </div>
          <Link
            to="/gigs/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Post a gig
          </Link>
        </div>

        <motion.div variants={CONTAINER} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              variants={STAT_ITEM}
              className={cn(
                "rounded-xl p-4 sm:p-5 border transition-shadow",
                s.filled
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-950"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 shadow-sm",
              )}
            >
              <p className={cn("text-xs font-medium", s.filled ? "text-indigo-100" : "text-gray-500 dark:text-gray-400")}>
                {s.label}
              </p>
              <div className="text-2xl sm:text-3xl font-bold mt-1.5 flex items-center gap-1.5">
                {s.rating && <Star size={18} className="fill-amber-400 text-amber-400" />}
                {s.rating ? s.value : <CountUp value={s.value as number} />}
              </div>
              <p className={cn("text-xs mt-1.5", s.filled ? "text-indigo-200" : "text-gray-500 dark:text-gray-400")}>{s.delta}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-7">
          <motion.div {...FADE_UP} className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                  <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Weekly Posts</h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Gigs posted this week</p>
                </div>
              </div>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">This week</span>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard?.weeklyPosts ?? []} margin={{ top: 0, right: 0, left: -12, bottom: 0 }}>
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      background: "#fff",
                      fontSize: 12,
                    }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28}>
                    {(dashboard?.weeklyPosts ?? []).map((entry, idx) => (
                      <Cell key={idx} fill={idx === (dashboard?.weeklyPosts ?? []).length - 1 ? "#6366f1" : "#e0e7ff"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div {...FADE_UP} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <Briefcase size={16} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Active gigs</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{stats?.activeGigs ?? 0} currently open</p>
              </div>
            </div>
            <div className="space-y-2">
              {(dashboard?.postedGigs ?? []).slice(0, 3).map((g) => (
                <Link
                  key={g.id}
                  to="/dashboard/poster/gigs"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <CategoryIconCircle category={g.category} size={24} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{g.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatBudget(g.budget)} &middot; {g.applicantCount} applicant{g.applicantCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <GigStatusBadge status={g.status} />
                </Link>
              ))}
            </div>
            <Link
              to="/dashboard/poster/gigs"
              className="block text-center py-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-2"
            >
              Manage all gigs
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-7">
          <motion.div {...FADE_UP} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Applicants to review</h2>
              <span className="text-xs font-medium text-red-500">{stats?.applicantsToReview ?? 0} pending</span>
            </div>
            <div className="px-2 pb-2 space-y-0.5">
              {(dashboard?.applicantsToReview ?? []).slice(0, 4).map((a) => {
                const initials = a.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
                const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
                const avatarColor = colors[a.name.length % colors.length];
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 text-white"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{a.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="truncate">{a.gigTitle}</span>
                        <span>&middot;</span>
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
                        className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      >
                        Pass
                      </button>
                    </div>
                  </div>
                );
              })}
              {(dashboard?.applicantsToReview ?? []).slice(0, 4).length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">All applicants reviewed</div>
              )}
            </div>
          </motion.div>

          <motion.div {...FADE_UP} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent reviews</h2>
              <Link to={"/profile/" + user.id} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                View all &rarr;
              </Link>
            </div>
            <div className="px-2 pb-2 space-y-0.5">
              {(dashboard?.receivedReviews ?? []).slice(0, 3).map((r) => {
                const initials = r.reviewerName.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
                return (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.reviewerName}</span>
                      <StarRating value={r.rating} readOnly size={12} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <motion.div {...FADE_UP} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent messages</h2>
              <Link to="/messages" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Open inbox &rarr;
              </Link>
            </div>
            <div className="px-2 pb-2">
              {(dashboard?.recentMessages ?? []).slice(0, 3).map((m) => (
                <Link
                  key={m.id}
                  to="/messages"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {m.unread && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                  {!m.unread && <span className="w-2 h-2 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-sm",
                          m.unread ? "font-semibold text-gray-900 dark:text-gray-100" : "font-medium text-gray-700 dark:text-gray-300",
                        )}
                      >
                        {m.senderName}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 shrink-0">{m.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{m.preview}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE_UP} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Upcoming deadlines</h2>
              <Link to="/dashboard/poster/gigs" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                View all &rarr;
              </Link>
            </div>
            <div className="px-2 pb-2">
              {(dashboard?.postedGigs ?? []).slice(0, 2).map((g) => (
                <div key={g.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center shrink-0">
                    <Calendar size={14} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{g.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatBudget(g.budget)} &middot; {g.applicantCount} applicants</p>
                  </div>
                  <GigStatusBadge status={g.status} />
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
