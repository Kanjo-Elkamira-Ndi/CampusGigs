import { Link, Navigate, useParams } from "react-router-dom";
import { Loader2, Star } from "lucide-react";
import { format } from "date-fns";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useUserProfile, useUserReviews } from "@/hooks/useUsers";
import { useGigs } from "@/hooks/useGigs";
import { Avatar } from "@/components/shared/Avatar";
import { UniversityBadge } from "@/components/shared/UniversityBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewItem } from "@/components/reviews/ReviewItem";
import { GigCard } from "@/components/gigs/GigCard";
import { useAuthStore } from "@/store/authStore";
import { EmptyState } from "@/components/shared/EmptyState";
import { DashboardShell } from "@/components/layout/DashboardShell";

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const me = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const { data: userResult, isLoading, isError } = useUserProfile(id ?? "");
  const { data: reviewsResult } = useUserReviews(id ?? "");
  const { data: gigsResult } = useGigs(
    userResult ? { posterId: userResult.id, limit: 6 } : {},
  );
  const user = userResult ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !user) return <Navigate to="/" replace />;
  const isMe = me?.id === user.id;
  const reviews = reviewsResult?.reviews ?? [];
  const gigs = gigsResult?.data ?? [];

  const buckets = [5, 4, 3, 2, 1].map((s) => ({
    s, count: reviews.filter((r) => Math.round(r.rating) === s).length,
  }));
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <PageWrapper>
      <DashboardShell role={activeRole}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <Avatar id={user.id} name={user.fullName} src={user.avatarUrl} size={80} />
            <h1 className="font-bold text-lg mt-3">{user.fullName}</h1>
            <p className="text-sm text-muted-foreground">{user.skills[0] ?? user.role.toLowerCase()}</p>
            <div className="mt-2"><UniversityBadge name={user.universityName} city={user.city} /></div>
            <div className="mt-3 text-sm flex items-center gap-1 text-muted-foreground">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="font-medium text-foreground">{user.avgRating.toFixed(1)}</span>
              ({user.reviewCount} reviews) · {user.hiredCount}× hired
            </div>
            {user.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {user.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">{s}</span>
                ))}
              </div>
            )}
            {user.bio && <p className="text-sm mt-4 leading-relaxed">{user.bio}</p>}
            {isMe ? (
              <Button asChild variant="outline" className="w-full mt-5">
                <Link to="/profile/edit">Edit profile</Link>
              </Button>
            ) : (
              <Button className="w-full mt-5 bg-brand hover:bg-[color:var(--brand-dark)] text-white">
                Contact {user.fullName.split(" ")[0]}
              </Button>
            )}
            <div className="text-xs text-muted-foreground mt-3 text-center">
              Member since {format(new Date(user.createdAt), "MMM yyyy")}
            </div>
          </div>
        </aside>

        <div className="rounded-xl border border-border bg-card p-6">
          <Tabs defaultValue="reviews">
            <TabsList>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="gigs">{user.role === "POSTER" ? "Active gigs" : "Recent gigs"}</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-2 mb-6">
                {buckets.map((b) => (
                  <div key={b.s} className="flex items-center gap-2 text-xs">
                    <span className="w-3">{b.s}</span>
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${(b.count / max) * 100}%` }} />
                    </div>
                    <span className="w-6 text-right text-muted-foreground">{b.count}</span>
                  </div>
                ))}
              </div>
              {reviews.length === 0 ? <EmptyState title="No reviews yet" /> : reviews.map((r) => <ReviewItem key={r.id} review={r} />)}
            </TabsContent>
            <TabsContent value="gigs" className="mt-4">
              {gigs.length === 0 ? (
                <EmptyState title="Nothing here yet" description="Gigs will show up here once posted." />
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">{gigs.map((g) => <GigCard key={g.id} gig={g} />)}</div>
              )}
            </TabsContent>
            <TabsContent value="about" className="mt-4 space-y-3 text-sm">
              <div><span className="text-muted-foreground">Bio: </span>{user.bio ?? "—"}</div>
              <div><span className="text-muted-foreground">University: </span>{user.universityName}, {user.city}</div>
              <div><span className="text-muted-foreground">Skills: </span>{user.skills.join(", ") || "—"}</div>
              <div><span className="text-muted-foreground">Joined: </span>{format(new Date(user.createdAt), "d MMMM yyyy")}</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </DashboardShell>
    </PageWrapper>
  );
}
