import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { initials } from "@/lib/format";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/gigs": "Gigs",
  "/universities": "Universities",
  "/audit-logs": "Audit Logs",
  "/reviews": "Reviews",
};

export function AdminTopbar() {
  const { pathname } = useLocation();
  const admin = useAdminAuthStore((s) => s.admin);
  const title = titles[pathname] ?? "Admin";

  return (
    <header className="h-14 shrink-0 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
        >
          <Bell size={18} />
        </button>
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center">
          {initials(admin?.fullName ?? "A")}
        </div>
      </div>
    </header>
  );
}
