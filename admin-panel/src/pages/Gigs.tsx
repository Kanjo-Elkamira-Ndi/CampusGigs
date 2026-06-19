import { useState } from "react";
import { Briefcase, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useCategories, useDeleteGig, useGigs } from "@/hooks/useGigs";
import type { AdminGigRow } from "@/api/gigs.api";
import { formatDate, initials, truncate } from "@/lib/format";

const LIMIT = 20;

function statusTone(status: AdminGigRow["status"]) {
  switch (status) {
    case "OPEN":
      return "green" as const;
    case "IN_PROGRESS":
      return "blue" as const;
    case "COMPLETED":
      return "neutral" as const;
    case "CANCELLED":
      return "red" as const;
  }
}

export default function Gigs() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [categorySlug, setCategorySlug] = useState("all");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 400);

  const { data, isLoading, error, refetch } = useGigs({
    search: debounced || undefined,
    status: status === "all" ? undefined : status,
    categorySlug: categorySlug === "all" ? undefined : categorySlug,
    page,
    limit: LIMIT,
  });
  const { data: categories = [] } = useCategories();
  const deleteGig = useDeleteGig();
  const [deleteTarget, setDeleteTarget] = useState<AdminGigRow | null>(null);

  const columns: DataTableColumn<AdminGigRow>[] = [
    {
      key: "gig",
      header: "Gig",
      render: (g) => (
        <div className="min-w-0 max-w-xs">
          <div className="font-medium text-neutral-900 truncate">{g.title}</div>
          <div className="text-xs text-neutral-500 truncate">
            {truncate(g.description, 60)}
          </div>
        </div>
      ),
    },
    {
      key: "budget",
      header: "Budget",
      render: (g) => (
        <span className="font-semibold text-indigo-600">
          {g.budget.toLocaleString()} XAF
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (g) =>
        g.category ? (
          <span className="rounded-full bg-neutral-100 text-neutral-700 text-xs px-2 py-0.5">
            {g.category.name}
          </span>
        ) : (
          <span className="text-neutral-300">—</span>
        ),
    },
    {
      key: "poster",
      header: "Poster",
      render: (g) =>
        g.poster ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold flex items-center justify-center">
              {initials(g.poster.fullName)}
            </div>
            <span className="text-neutral-700 text-sm">{g.poster.fullName}</span>
          </div>
        ) : (
          <span className="text-neutral-300">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (g) => <StatusBadge tone={statusTone(g.status)}>{g.status}</StatusBadge>,
    },
    { key: "slots", header: "Slots", render: (g) => g.slots },
    {
      key: "deadline",
      header: "Deadline",
      render: (g) => {
        if (!g.deadline) return <span className="text-neutral-400">—</span>;
        const past = new Date(g.deadline).getTime() < Date.now();
        return (
          <span className={past ? "text-red-500" : "text-neutral-700"}>
            {formatDate(g.deadline)}
          </span>
        );
      },
    },
    {
      key: "apps",
      header: "Apps",
      render: (g) => g.applicationCount ?? 0,
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-12",
      render: (g) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => setDeleteTarget(g)}
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
        <h1 className="text-2xl font-bold text-neutral-900">Gigs</h1>
        {data && <StatusBadge tone="neutral">{data.total.toLocaleString()}</StatusBadge>}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white border border-neutral-200 rounded-2xl p-2 sm:p-3">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search gigs…"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="OPEN">OPEN</SelectItem>
            <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={categorySlug}
          onValueChange={(v) => {
            setCategorySlug(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(g) => g.id}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        emptyIcon={Briefcase}
        emptyTitle="No gigs found"
      />

      {data && data.total > 0 && (
        <Pagination page={page} limit={LIMIT} total={data.total} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this gig?"
        description="This will delete the gig and notify all applicants."
        confirmLabel="Delete gig"
        isLoading={deleteGig.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteGig.mutate(deleteTarget.id, {
            onSuccess: () => { setDeleteTarget(null); refetch(); },
          });
        }}
      />
    </div>
  );
}
