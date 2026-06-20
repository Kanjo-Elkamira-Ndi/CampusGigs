import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { initials } from "@/lib/format";
import { useIsMobile } from "@/hooks/use-mobile";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/gigs": "Gigs",
  "/universities": "Universities",
  "/audit-logs": "Audit Logs",
  "/reviews": "Reviews",
  "/settings": "Settings",
  "/notifications": "Notifications",
};

interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const { pathname } = useLocation();
  const admin = useAdminAuthStore((s) => s.admin);
  const isMobile = useIsMobile();
  const title = titles[pathname] ?? "Admin";

  return (
    <header className="h-14 shrink-0 bg-white border-b border-neutral-200 flex items-center justify-between gap-3 px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        {isMobile && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 shrink-0"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="text-lg font-bold text-neutral-900 truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
        >
          <Bell size={18} />
        </button>
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center shrink-0">
          {initials(admin?.fullName ?? "A")}
        </div>
      </div>
    </header>
  );
}