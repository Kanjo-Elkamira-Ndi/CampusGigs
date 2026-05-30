import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { ApplicationRow } from "@/components/applications/ApplicationRow";
import { GigListRow } from "@/components/gigs/GigListRow";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockApplications, mockGigs } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const s = useSpring(mv, { stiffness: 80, damping: 18 });
  const t = useTransform(s, (v) => Math.round(v).toLocaleString());
  useEffect(() => { mv.set(value); }, [mv, value]);
  return <motion.span>{t}</motion.span>;
}

function WorkerDashboardContent() {
  const user = useAuthStore((s) => s.user)!;
  const [tab, setTab] = useState<"ALL" | "PENDING" | "ACCEPTED" | "COMPLETED">("ALL");
  const apps = mockApplications.slice(0, 6);
  const filtered = tab === "ALL" ? apps : apps.filter((a) => a.status === tab);

  return (
    <PageWrapper>
      <DashboardShell role="WORKER">
        <h1 className="text-2xl font-bold">Welcome back, {user.fullName.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening on your gigs.</p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Active applications", v: 3 },
            { l: "Gigs completed", v: user.hiredCount },
            { l: "Avg rating", v: Math.round(user.avgRating * 10) / 10 },
            { l: "Universities browsed", v: 5 },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="text-2xl font-bold mt-1"><CountUp value={s.v} /></div>
            </div>
          ))}
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">My applications</h2>
            <div className="flex gap-1">
              {(["ALL", "PENDING", "ACCEPTED", "COMPLETED"] as const).map((s) => (
                <button key={s} onClick={() => setTab(s)} className={cn("px-2.5 py-1 rounded-full text-xs", tab === s ? "bg-brand text-white" : "bg-muted text-muted-foreground hover:bg-muted/70")}>
                  {s === "ALL" ? "All" : s.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-6"><EmptyState title="No applications here" description="Browse gigs and apply to get started." action={<Link to="/gigs" className="px-4 py-2 rounded-md bg-brand text-white text-sm">Browse gigs</Link>} /></div>
            ) : (
              filtered.map((a) => <ApplicationRow key={a.id} application={a} />)
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Recommended for you</h2>
            <Link to="/gigs" className="text-sm text-[color:var(--brand-dark)] dark:text-brand hover:underline">Browse all →</Link>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {mockGigs.slice(0, 3).map((g) => <GigListRow key={g.id} gig={g} />)}
          </div>
        </section>
      </DashboardShell>
    </PageWrapper>
  );
}

export function WorkerDashboard() {
  return <ProtectedRoute><WorkerDashboardContent /></ProtectedRoute>;
}
