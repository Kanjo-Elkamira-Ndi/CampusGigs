import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Check, Circle, Star } from "lucide-react";
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
  mockGigs,
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
  const recommended = mockGigs.slice(0, 2);

  const profileItems = [
    { label: "Avatar uploaded", done: !!user.avatarUrl },
    { label: "University verified", done: user.verified ?? false },
    { label: "Add a bio", done: !!user.bio && user.bio.length > 10 },
    { label: "Add skills / categories", done: user.skills.length > 0 },
  ];
  const profilePercent = Math.round((profileItems.filter((i) => i.done).length / profileItems.length) * 100);

  return (
    <PageWrapper>
      <DashboardShell role="WORKER">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}, {firstName} 👋</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Here's what's happening with your gigs today</p>
          </div>
          <Link
            to="/gigs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
          >
            Browse gigs
          </Link>
        </div>

        <motion.div variants={CONTAINER} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Active applications", value: stats.activeApplications, delta: `${stats.applicationsAwaitingResponse} awaiting response`, deltaCls: "text-amber-600 dark:text-amber-400" },
            { label: "Gigs completed", value: stats.gigsCompleted, delta: `+${stats.monthlyGigsCompleted} this month`, deltaCls: "text-green-600 dark:text-green-400" },
            { label: "Total earned", value: `XAF ${stats.totalEarned.toLocaleString("fr-CM")}`, delta: `+${(stats.monthlyGigsCompleted * 15000).toLocaleString("fr-CM")} this month`, deltaCls: "text-green-600 dark:text-green-400", isFormatted: true },
            { label: "Your rating", value: stats.rating.toFixed(1), delta: `From ${stats.reviewCount} reviews`, deltaCls: "text-muted-foreground", isRating: true },
          ].map((s) => (
            <motion.div key={s.label} variants={ITEM} className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold mt-1 flex items-center gap-1">
                {"isRating" in s && s.isRating && <Star size={18} className="fill-amber-400 text-amber-400" />}
                {"isFormatted" in s && s.isFormatted ? s.value : "isRating" in s && s.isRating ? s.value : <CountUp value={s.value as number} />}
              </div>
              <div className={cn("text-xs mt-1", "deltaCls" in s ? (s as any).deltaCls : "text-muted-foreground")}>{s.delta}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="font-semibold text-sm">My applications</h2>
              <Link to="/gigs" className="text-xs text-primary hover:underline">View all →</Link>
            </div>
            <div className="px-2 pb-2">
              {apps.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                  <CategoryIconCircle category={a.category} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.gigTitle}</div>
                    <div className="text-xs text-muted-foreground">{a.posterName} · {formatBudget(a.budget)}</div>
                  </div>
                  <GigStatusBadge status={a.status === "PENDING" ? "OPEN" : a.status === "IN_PROGRESS" ? "IN_PROGRESS" : "COMPLETED"} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <h2 className="font-semibold text-sm">Recommended for you</h2>
              <Link to="/gigs" className="text-xs text-primary hover:underline">See all →</Link>
            </div>
            <div className="px-2 pb-2 space-y-1">
              {recommended.map((g, i) => (
                <Link key={g.id} to={"/gigs/" + g.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors group">
                  <CategoryIconCircle category={g.category} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">{g.title}</div>
                      <div className="text-sm font-semibold text-primary shrink-0">{formatBudget(g.budget)}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{g.universityName}</span>
                      <span>·</span>
                      <span>{g.slots} slot{g.slots > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {i === 0 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">New</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{g.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
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
              {messages.slice(0, 3).map((m) => (
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

          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Profile strength</h2>
              <span className="text-xs text-muted-foreground">{profilePercent}%</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Complete your profile to get noticed by posters</p>
            <div className="w-full h-1 rounded-full bg-muted mb-4 overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${profilePercent}%` }} />
            </div>
            <div className="space-y-2.5">
              {profileItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-sm">
                  {item.done ? (
                    <Check size={16} className="text-green-500 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-muted-foreground/50 shrink-0" />
                  )}
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
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
