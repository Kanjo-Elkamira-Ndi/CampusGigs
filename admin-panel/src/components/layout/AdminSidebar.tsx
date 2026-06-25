import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Briefcase,
  Building2,
  ScrollText,
  Star,
  Bell,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useLogout } from "@/hooks/useAdminAuth";
import { useIsMobile } from "@/hooks/use-mobile";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: UsersIcon },
  { to: "/gigs", label: "Gigs", icon: Briefcase },
  { to: "/universities", label: "Universities", icon: Building2 },
  { to: "/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/reviews", label: "Reviews", icon: Star },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const admin = useAdminAuthStore((s) => s.admin);
  const logout = useLogout();
  const isMobile = useIsMobile();
  useLocation();

  const sidebarContent = (
    <aside
      className={cn(
        "w-[260px] shrink-0 bg-white border-r border-neutral-200 flex flex-col h-full",
      )}
    >
      <div className="px-4 pt-5 pb-2 flex items-center justify-between gap-2">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#0F8BFF">
            <path d="M12 1L3 6v12l9 5 9-5V6l-9-5z" />
          </svg>
          <span className="text-sm font-semibold text-neutral-500 uppercase tracking-widest">
            Admin Panel
          </span>
        </Link>
        {isMobile && (
          <button type="button" onClick={onClose} className="p-1 rounded-md hover:bg-neutral-100">
            <X size={18} className="text-neutral-500" />
          </button>
        )}
      </div>

      <div className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 px-4 mt-6 mb-1">
        Menu
      </div>
      <nav className="flex-1 overflow-y-auto">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm transition-colors",
                isActive
                  ? "bg-brand-light text-brand font-medium"
                  : "text-neutral-600 hover:bg-neutral-100",
            )
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 px-4 mt-6 mb-1">
          Account
        </div>
        <NavLink
          to="/notifications"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm transition-colors w-[calc(100%-1rem)]",
              isActive
                ? "bg-brand-light text-brand font-medium"
                : "text-neutral-600 hover:bg-neutral-100",
            )
          }
        >
          <Bell size={18} />
          <span>Notifications</span>
        </NavLink>
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm transition-colors w-[calc(100%-1rem)]",
              isActive
                ? "bg-brand-light text-brand font-medium"
                : "text-neutral-600 hover:bg-neutral-100",
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
        <NavLink
          to="/notifications"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm transition-colors w-[calc(100%-1rem)]",
              isActive
                ? "bg-brand-light text-brand font-medium"
                : "text-neutral-600 hover:bg-neutral-100",
            )
          }
        >
          <Bell size={18} />
          <span>Notifications</span>
        </NavLink>
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm transition-colors w-[calc(100%-1rem)]",
              isActive
                ? "bg-brand-light text-brand font-medium"
                : "text-neutral-600 hover:bg-neutral-100",
            )
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
        <button
          type="button"
          onClick={() => logout.mutate()}
          className="w-[calc(100%-1rem)] flex items-center gap-3 h-10 rounded-lg mx-2 px-3 text-sm text-neutral-600 hover:bg-neutral-100"
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
          className="rounded-xl bg-brand text-white p-3 mx-3 mb-4"
        >
          <div className="text-sm font-medium truncate">{admin.fullName}</div>
          <div className="text-xs text-blue-200 truncate">{admin.email}</div>
        </motion.div>
      )}
    </aside>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return sidebarContent;
}