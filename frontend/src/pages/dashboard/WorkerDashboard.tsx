import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Star, TrendingUp, Calendar, MapPin, Check, Circle } from "lucide-react";
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CategoryIconCircle } from "@/components/gigs/GigBadge";
import { GigStatusBadge } from "@/components/gigs/GigStatusBadge";
import { cn, formatBudget } from "@/lib/utils";
import {
  mockDashboardApplications,
  mockMessages,
  mockWorkerStats,
  mockWorkerWeekActivity,
  mockUpcomingDeadline,
} from "@/lib/mockData";

const CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const STAT_ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function WorkerDashboardContent() {
  const user = useAuthStore((s) => s.user)!;
  const firstName = user.fullName.split(" ")[0];
  const stats = mockWorkerStats;
  const apps = mockDashboardApplications;
  const messages = mockMessages;

  const profileItems = [
    { label: "Avatar uploaded", done: !!user.avatarUrl },
    { label: "University verified", done: user.verified ?? false },
    { label: "Add a bio", done: !!user.bio && user.bio.length > 10 },
    { label: "Add skills / categories", done: user.skills.length > 0 },
  ];
  const profilePercent = Math.round((profileItems.filter((i) => i.done).length / profileItems.length) * 100);

  const statCards = [
    { label: "Active applications", value: stats.activeApplications, delta: `${stats.applicationsAwaitingResponse} awaiting response`, filled: true },
    { label: "Gigs completed", value: stats.gigsCompleted, delta: `+${stats.monthlyGigsCompleted} this month` },
    { label: "Total earned", value: `XAF ${stats.totalEarned.toLocaleString("fr-CM")}`, delta: `+${(stats.monthlyGigsCompleted * 15000).toLocaleString("fr-CM")} this month`, formatted: true },
    { label: "Your rating", value: stats.rating.toFixed(1), delta: `${stats.reviewCount} reviews`, rating: true },
  ] as const;

  return (
    <PageWrapper>
      <DashboardShell role="WORKER">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Here's what's happening with your gigs today</p>
          </div>
          <Link
            to="/gigs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Browse gigs
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
                {s.formatted ? s.value : s.rating ? s.value : <CountUp value={s.value as number} />}
              </div>
              <p className={cn("text-xs mt-1.5", s.filled ? "text-indigo-200" : "text-gray-500 dark:text-gray-400")}>
                {s.delta}
              </p>
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
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Weekly Activity</h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">Applications & gigs this week</p>
                </div>
              </div>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">This week</span>
            </div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockWorkerWeekActivity} margin={{ top: 0, right: 0, left: -12, bottom: 0 }}>
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
                    {mockWorkerWeekActivity.map((entry, idx) => (
                      <Cell key={idx} fill={idx === mockWorkerWeekActivity.length - 1 ? "#6366f1" : "#e0e7ff"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div {...FADE_UP} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Upcoming</h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Next deadline</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">{mockUpcomingDeadline.gigTitle}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={12} />
                  <span>{mockUpcomingDeadline.dateTime}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin size={12} />
                  <span>{mockUpcomingDeadline.location}</span>
                </div>
              </div>
              <Link
                to="/messages"
                className="block text-center py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
              >
                Message poster
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-7">
          <motion.div {...FADE_UP} className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">My applications</h2>
              <Link to="/dashboard/applications" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                View all &rarr;
              </Link>
            </div>
            <div className="px-2 pb-2">
              {apps.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <CategoryIconCircle category={a.category} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{a.gigTitle}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {a.posterName} &middot; {formatBudget(a.budget)}
                    </div>
                  </div>
                  <GigStatusBadge status={a.status === "PENDING" ? "OPEN" : a.status === "IN_PROGRESS" ? "IN_PROGRESS" : "COMPLETED"} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE_UP} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Profile strength</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{profilePercent}%</span>
            </div>
            <div className="px-5 pb-5">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Complete your profile to get noticed</p>
              <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${profilePercent}%` }}
                />
              </div>
              <div className="space-y-2.5">
                {profileItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-sm">
                    {item.done ? (
                      <Check size={15} className="text-green-500 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-gray-300 dark:text-gray-600 shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        item.done
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
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
              {messages.slice(0, 3).map((m) => (
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
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recommended gigs</h2>
              <Link to="/gigs" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                See all &rarr;
              </Link>
            </div>
            <div className="px-2 pb-2">
              {[
                { title: "Python tutor for DS exam", budget: 5000, university: "University of Buea", slots: 1, city: "Buea" },
                { title: "Design poster for council event", budget: 4000, university: "YIBS", slots: 1, city: "Yaoundé" },
              ].map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    {g.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {g.title}
                      </div>
                      <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">{formatBudget(g.budget)}</div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{g.university}</span>
                      <span>&middot;</span>
                      <span>{g.slots} slot{g.slots > 1 ? "s" : ""}</span>
                      <span>&middot;</span>
                      <span>{g.city}</span>
                    </div>
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

export function WorkerDashboard() {
  return <ProtectedRoute><WorkerDashboardContent /></ProtectedRoute>;
}
