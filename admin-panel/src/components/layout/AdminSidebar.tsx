import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Briefcase,
  Building2,
  ScrollText,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useLogout } from "@/hooks/useAdminAuth";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: UsersIcon },
  { to: "/gigs", label: "Gigs", icon: Briefcase },
  { to: "/universities", label: "Universities", icon: Building2 },
  { to: "/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/reviews", label: "Reviews", icon: Star },
];

export function AdminSidebar() {
  const admin = useAdminAuthStore((s) => s.admin);
  const logout = useLogout();
  useLocation();

  return (
    <aside className="w-[240px] shrink-0 bg-white border-r border-neutral-200 flex flex-col h-full">
      <div className="px-4 pt-5 pb-2 flex items-center gap-2">
        <Link to="/dashboard" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#4f46e5">
            <path d="M12 1L3 6v12l9 5 9-5V6l-9-5z" />
          </svg>
          <span className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">
            Admin Panel
          </span>
        </Link>
      </div>

      <div className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 px-4 mt-6 mb-1">
        Menu
      </div>
      <nav className="flex-1 overflow-y-auto">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-neutral-600 hover:bg-neutral-100"
              )
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 px-4 mt-6 mb-1">
          Account
        </div>
        <button
          type="button"
          className="w-full flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm text-neutral-600 hover:bg-neutral-100"
          style={{ width: "calc(100% - 1rem)" }}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button
          type="button"
          onClick={() => logout.mutate()}
          className="w-full flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm text-neutral-600 hover:bg-neutral-100"
          style={{ width: "calc(100% - 1rem)" }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      {admin && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-indigo-600 text-white p-3 mx-3 mb-4"
        >
          <div className="text-sm font-medium truncate">{admin.fullName}</div>
          <div className="text-xs text-indigo-200 truncate">{admin.email}</div>
        </motion.div>
      )}
    </aside>
  );
}
