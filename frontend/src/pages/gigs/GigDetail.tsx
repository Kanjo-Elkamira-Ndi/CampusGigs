import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, MapPin, Calendar, Users, Star, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGig, useGigs } from "@/hooks/useGigs";
import { CategoryIconCircle, GigBadge } from "@/components/gigs/GigBadge";
import { GigStatusBadge } from "@/components/gigs/GigStatusBadge";
import { UniversityBadge } from "@/components/shared/UniversityBadge";
import { EasyApplyBadge } from "@/components/shared/EasyApplyBadge";
import { Avatar } from "@/components/shared/Avatar";
import { formatBudget, getDeadlineLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { ApplyModal } from "@/components/applications/ApplyModal";
import { GigCard } from "@/components/gigs/GigCard";

export function GigDetail() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);

  const { data: gigResult } = useGig(id ?? "");
  const gig = gigResult ?? null;

  const { data: posterGigsResult } = useGigs(
    gig ? { posterId: gig.poster.id, limit: 3 } : {},
  );
  const otherFromPoster = (posterGigsResult?.data ?? []).filter((g) => g.id !== id).slice(0, 3);

  if (!gig) return <Navigate to="/gigs" replace />;
  const d = getDeadlineLabel(gig.deadline);
  const isOwn = user?.id === gig.poster.id;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <nav className="text-xs text-muted-foreground flex items-center gap-1 mb-4">
          <Link to="/gigs" className="hover:underline">Find work</Link>
          <ChevronRight size={12} />
          <Link to={`/gigs?category=${encodeURIComponent(gig.category)}`} className="hover:underline">{gig.category}</Link>
          <ChevronRight size={12} />
          <span className="truncate">{gig.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
          <div className="flex items-center gap-2 mb-3">
            <Avatar id={gig.poster.id} name={gig.poster.fullName} src={gig.poster.avatarUrl} size={40} className="border" />
            <div>
              <Link to={`/profile/${gig.poster.id}`} className="text-sm font-medium hover:underline">
                {gig.poster.fullName}
              </Link>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BadgeCheck className="h-3 w-3 text-brand" />
                <span>{gig.poster.universityName}</span>
              </div>
            </div>
          </div>
              <h1 className="text-3xl font-bold leading-tight">{gig.title}</h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <span className="inline-flex items-center gap-1"><GigBadge category={gig.category} /></span>
                <span className="inline-flex items-center gap-1"><MapPin size={14} /> {gig.location}</span>
                <UniversityBadge name={gig.universityName} city={gig.city} />
                <span className="inline-flex items-center gap-1"><Calendar size={14} /> {d.label}</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold mb-2">About this gig</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{gig.description}</p>
              {gig.tags && gig.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {gig.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
              <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                <Users size={12} /> {gig.applicationCount} applied · {gig.slotsRemaining} of {gig.slots} slots remaining
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 self-start">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-3xl font-bold text-[color:var(--brand-dark)] dark:text-brand">{formatBudget(gig.budget)}</div>
              <div className="text-xs text-muted-foreground">Total budget</div>

              {!user ? (
                <Button asChild className="w-full mt-4 bg-brand hover:bg-[color:var(--brand-dark)] text-white">
                  <Link to="/login">Sign up to apply</Link>
                </Button>
              ) : isOwn ? (
                <Button onClick={() => navigate("/dashboard/poster")} className="w-full mt-4">
                  Manage applicants
                </Button>
              ) : (
                <Button onClick={() => setApplyOpen(true)} className="w-full mt-4 bg-brand hover:bg-[color:var(--brand-dark)] text-white">
                  Apply to this gig ⚡
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs text-muted-foreground mb-3">Posted by</div>
              <div className="flex items-center gap-3">
                <Avatar id={gig.poster.id} name={gig.poster.fullName} size={44} />
                <div className="min-w-0">
                  <Link to={`/profile/${gig.poster.id}`} className="font-semibold hover:underline truncate block">
                    {gig.poster.fullName}
                  </Link>
                  <div className="text-xs text-muted-foreground">{gig.poster.universityName}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {gig.poster.avgRating.toFixed(1)} · {gig.poster.hiredCount}× hired
              </div>
              <Link to={`/profile/${gig.poster.id}`} className="mt-3 inline-block text-sm text-[color:var(--brand-dark)] dark:text-brand hover:underline">
                View profile →
              </Link>
            </div>

            {otherFromPoster.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="text-xs text-muted-foreground mb-3">Other open gigs from this poster</div>
                <div className="space-y-3">
                  {otherFromPoster.map((g) => <GigCard key={g.id} gig={g} />)}
                </div>
              </div>
            )}

            <button className="text-xs text-muted-foreground hover:text-foreground">Report this gig</button>
          </aside>
        </div>
      </div>

      <ApplyModal gig={gig} open={applyOpen} onOpenChange={setApplyOpen} />
    </PageWrapper>
  );
}
