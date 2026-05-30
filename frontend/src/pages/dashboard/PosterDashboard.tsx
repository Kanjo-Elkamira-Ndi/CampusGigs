import { Link } from "react-router-dom";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mockApplications, mockGigs } from "@/lib/mockData";
import { CategoryIconCircle } from "@/components/gigs/GigBadge";
import { GigStatusBadge } from "@/components/gigs/GigStatusBadge";
import { UniversityBadge } from "@/components/shared/UniversityBadge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/shared/Avatar";
import { Star, Check, X as XIcon } from "lucide-react";
import { toast } from "sonner";
import { getDeadlineLabel } from "@/lib/utils";
import type { Gig } from "@/types";

function PosterDashboardContent() {
  const user = useAuthStore((s) => s.user)!;
  const [active, setActive] = useState<Gig | null>(null);
  const myGigs = mockGigs.slice(0, 6);

  return (
    <PageWrapper>
      <DashboardShell role="POSTER">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hi {user.fullName.split(" ")[0]} 👋</h1>
            <p className="text-sm text-muted-foreground">Manage your posted gigs and applicants.</p>
          </div>
          <Link to="/gigs/new" className="px-4 py-2 rounded-md bg-brand hover:bg-[color:var(--brand-dark)] text-white text-sm font-medium">
            Post a new gig +
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Active gigs", v: 4 },
            { l: "Total applicants", v: 21 },
            { l: "Gigs completed", v: 12 },
            { l: "Universities reached", v: 6 },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="text-2xl font-bold mt-1">{s.v}</div>
            </div>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="font-semibold mb-3">My gigs</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {myGigs.map((g) => {
              const d = getDeadlineLabel(g.deadline);
              return (
                <div key={g.id} className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
                  <CategoryIconCircle category={g.category} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{g.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                      <UniversityBadge name={g.universityName} />
                      <span>· {g.applicationCount} applicants</span>
                      <span>· {d.label}</span>
                    </div>
                  </div>
                  <GigStatusBadge status={g.status} />
                  <Button size="sm" variant="outline" onClick={() => setActive(g)}>Manage</Button>
                </div>
              );
            })}
          </div>
        </section>
      </DashboardShell>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="overflow-auto w-full sm:max-w-md">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.title}</SheetTitle>
              </SheetHeader>
              <p className="text-xs text-muted-foreground mt-1">{active.applicationCount} applicants</p>
              <div className="mt-4 space-y-3">
                {mockApplications.slice(0, 4).map((a) => (
                  <div key={a.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start gap-3">
                      <Avatar id={a.worker.id} name={a.worker.fullName} size={40} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{a.worker.fullName}</div>
                        <div className="text-xs text-muted-foreground">{a.worker.universityName}</div>
                        <div className="text-xs flex items-center gap-1 mt-0.5">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          {a.worker.avgRating.toFixed(1)} · {a.worker.hiredCount}× hired
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{a.coverNote}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="bg-brand hover:bg-[color:var(--brand-dark)] text-white" onClick={() => toast.success("Accepted!")}>
                        <Check size={14} className="mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast("Declined")}>
                        <XIcon size={14} className="mr-1" /> Decline
                      </Button>
                      <Link to={`/profile/${a.worker.id}`} className="ml-auto text-xs text-[color:var(--brand-dark)] dark:text-brand hover:underline self-center">
                        View profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageWrapper>
  );
}

export function PosterDashboard() {
  return <ProtectedRoute><PosterDashboardContent /></ProtectedRoute>;
}
