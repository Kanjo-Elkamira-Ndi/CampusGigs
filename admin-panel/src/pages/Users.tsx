import { useState } from "react";
import { Check, Download, MoreHorizontal, Star, Users as UsersIcon } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EditUserSheet } from "@/components/users/EditUserSheet";
import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteUser, useUpdateUser, useUsers } from "@/hooks/useUsers";
import { useUniversities } from "@/hooks/useUniversities";
import type { AdminUserRow } from "@/api/users.api";
import { initials, relativeTime } from "@/lib/format";

const LIMIT = 20;

export default function Users() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [banned, setBanned] = useState("all");
  const [universityId, setUniversityId] = useState("all");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 400);

  const params = {
    search: debounced || undefined,
    role: role === "all" ? undefined : role,
    isBanned: banned === "all" ? undefined : banned === "banned" ? "true" : "false",
    universityId: universityId === "all" ? undefined : universityId,
    page,
    limit: LIMIT,
  };

  const { data, isLoading, error, refetch } = useUsers(params);
  const { data: universities = [] } = useUniversities();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [banTarget, setBanTarget] = useState<AdminUserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);

  const columns: DataTableColumn<AdminUserRow>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-muted text-brand text-xs font-semibold flex items-center justify-center">
            {initials(u.fullName)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-neutral-900 truncate">{u.fullName}</div>
            <div className="text-xs text-neutral-500 truncate">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <StatusBadge
          tone={u.role === "ADMIN" ? "amber" : u.role === "POSTER" ? "brand" : "neutral"}
        >
          {u.role}
        </StatusBadge>
      ),
    },
    {
      key: "university",
      header: "University",
      render: (u) => (
        <span className="text-neutral-700">{u.university?.name ?? "—"}</span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (u) => (
        <span className="inline-flex items-center gap-1 text-neutral-700">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          {(u.avgRating ?? 0).toFixed(1)}
          <span className="text-neutral-400 text-xs">({u.reviewCount ?? 0})</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <StatusBadge tone={u.isBanned ? "red" : "green"}>
          {u.isBanned ? "Banned" : "Active"}
        </StatusBadge>
      ),
    },
    {
      key: "verified",
      header: "Verified",
      render: (u) =>
        u.emailVerified ? (
          <Check size={16} className="text-green-600" />
        ) : (
          <span className="text-neutral-300">—</span>
        ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (u) => (
        <span className="text-neutral-500 text-xs">{relativeTime(u.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right w-12",
      render: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditing(u)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setBanTarget(u)}>
              {u.isBanned ? "Unban user" : "Ban user"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => setDeleteTarget(u)}
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
          {data && (
            <StatusBadge tone="neutral">{data.total.toLocaleString()}</StatusBadge>
          )}
        </div>
        <Button variant="outline" size="sm">
          <Download size={14} className="mr-2" /> Export
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white border border-neutral-200 rounded-2xl p-2 sm:p-3">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by name, email…"
        />
        <Select
          value={role}
          onValueChange={(v) => {
            setRole(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="WORKER">WORKER</SelectItem>
            <SelectItem value="POSTER">POSTER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={banned}
          onValueChange={(v) => {
            setBanned(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active only</SelectItem>
            <SelectItem value="banned">Banned only</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={universityId}
          onValueChange={(v) => {
            setUniversityId(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="University" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All universities</SelectItem>
            {universities.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={data?.data ?? []}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        emptyIcon={UsersIcon}
        emptyTitle="No users found"
        emptyAction={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setRole("all");
              setBanned("all");
              setUniversityId("all");
              setPage(1);
            }}
          >
            Clear filters
          </Button>
        }
      />

      {data && data.total > 0 && (
        <Pagination
          page={page}
          limit={LIMIT}
          total={data.total}
          onPageChange={setPage}
        />
      )}

      <EditUserSheet user={editing} onClose={() => { setEditing(null); refetch(); }} />

      <ConfirmDialog
        open={!!banTarget}
        onOpenChange={(o) => !o && setBanTarget(null)}
        title={banTarget?.isBanned ? "Unban this user?" : "Ban this user?"}
        description={
          banTarget?.isBanned
            ? "The user will regain access to the platform immediately."
            : "The user will be prevented from logging in. This action is logged."
        }
        confirmLabel={banTarget?.isBanned ? "Unban" : "Ban"}
        isLoading={updateUser.isPending}
        onConfirm={() => {
          if (!banTarget) return;
          updateUser.mutate(
            { id: banTarget.id, payload: { isBanned: !banTarget.isBanned } },
            { onSuccess: () => { setBanTarget(null); refetch(); } }
          );
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this user?"
        description="This will permanently delete the user and all their data. This cannot be undone."
        confirmLabel="Delete user"
        isLoading={deleteUser.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteUser.mutate(deleteTarget.id, {
            onSuccess: () => { setDeleteTarget(null); refetch(); },
          });
        }}
      />
    </div>
  );
}
