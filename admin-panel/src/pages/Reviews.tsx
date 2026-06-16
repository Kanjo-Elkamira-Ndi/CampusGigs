import { useState } from "react";
import { Construction, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { Pagination } from "@/components/shared/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDeleteReview, useReviews } from "@/hooks/useReviews";
import { initials, relativeTime, truncate } from "@/lib/format";
import type { AdminReviewRow } from "@/api/reviews.api";

const LIMIT = 20;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= rating ? "text-amber-500 fill-amber-500" : "text-neutral-200"
          }
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useReviews({ page, limit: LIMIT });
  const deleteReview = useDeleteReview();
  const [deleteTarget, setDeleteTarget] = useState<AdminReviewRow | null>(null);

  const is404 = (error as any)?.response?.status === 404;

  if (is404) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-900">Reviews</h1>
          <StatusBadge tone="amber">Moderation queue</StatusBadge>
        </div>
        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-8 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Construction size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">
              Reviews endpoint coming in Phase 6 of the API build
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Once the backend ships <code>/superadmin/reviews</code>, this page will list,
              filter, and let you moderate reviews here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const columns: DataTableColumn<AdminReviewRow>[] = [
    {
      key: "reviewer",
      header: "Reviewer",
      render: (r) =>
        r.reviewer ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold flex items-center justify-center">
              {initials(r.reviewer.fullName)}
            </div>
            <span className="text-sm">{r.reviewer.fullName}</span>
          </div>
        ) : (
          <span className="text-neutral-300">—</span>
        ),
    },
    {
      key: "reviewee",
      header: "Reviewee",
      render: (r) =>
        r.reviewee ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold flex items-center justify-center">
              {initials(r.reviewee.fullName)}
            </div>
            <span className="text-sm">{r.reviewee.fullName}</span>
          </div>
        ) : (
          <span className="text-neutral-300">—</span>
        ),
    },
    {
      key: "gig",
      header: "Gig",
      render: (r) => (
        <span className="text-sm text-neutral-700">{truncate(r.gig?.title ?? "—", 40)}</span>
      ),
    },
    { key: "rating", header: "Rating", render: (r) => <Stars rating={r.rating} /> },
    {
      key: "comment",
      header: "Comment",
      render: (r) => (
        <span className="text-sm text-neutral-600" title={r.comment ?? ""}>
          {truncate(r.comment ?? "—", 80)}
        </span>
      ),
    },
    {
      key: "posted",
      header: "Posted",
      render: (r) => <span className="text-xs text-neutral-500">{relativeTime(r.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-12",
      render: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => setDeleteTarget(r)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">Reviews</h1>
        {data && <StatusBadge tone="neutral">{data.total.toLocaleString()}</StatusBadge>}
        <StatusBadge tone="amber">Moderation queue</StatusBadge>
      </div>

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(r) => r.id}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        emptyIcon={Star}
        emptyTitle="No reviews to moderate"
      />

      {data && data.total > 0 && (
        <Pagination page={page} limit={LIMIT} total={data.total} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this review?"
        description="This will remove the review and recalculate the reviewer's rating."
        confirmLabel="Delete review"
        isLoading={deleteReview.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteReview.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          });
        }}
      />
    </div>
  );
}
