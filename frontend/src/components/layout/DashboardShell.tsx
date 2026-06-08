import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  Heart,
  FileText,
  MessageSquare,
  Briefcase,
  PlusCircle,
  Users,
  Bell,
  User,
  Settings,
  LogOut,
  ArrowLeftRight,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/Avatar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface Props {
  role: "WORKER" | "POSTER";
  children: ReactNode;
}

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  section: "menu" | "general";
}

const WORKER_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, section: "menu" },
  { to: "/gigs", label: "Browse Gigs", icon: Search, section: "menu" },
  { to: "/dashboard/saved", label: "Saved", icon: Heart, section: "menu" },
  { to: "/dashboard/applications", label: "Applications", icon: FileText, section: "menu" },
  { to: "/messages", label: "Messages", icon: MessageSquare, section: "menu", badge: 3 },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell, section: "general" },
  { to: "/profile/edit", label: "Settings", icon: Settings, section: "general" },
];

const POSTER_NAV: NavItem[] = [
  { to: "/dashboard/poster", label: "Dashboard", icon: LayoutDashboard, section: "menu" },
  { to: "/dashboard/poster/gigs", label: "My Gigs", icon: Briefcase, section: "menu" },
  { to: "/gigs/new", label: "Post a Gig", icon: PlusCircle, section: "menu" },
  { to: "/dashboard/poster/applicants", label: "Applicants", icon: Users, section: "menu", badge: 7 },
  { to: "/messages", label: "Messages", icon: MessageSquare, section: "menu" },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell, section: "general" },
  { to: "/profile/edit", label: "Settings", icon: Settings, section: "general" },
];

export function DashboardShell({ role, children }: Props) {
  const user = useAuthStore((s) => s.user)!;
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const nav = role === "WORKER" ? WORKER_NAV : POSTER_NAV;

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-gray-950">
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="h-16 shrink-0 flex items-center px-5 border-b border-gray-100 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-base">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white text-sm font-bold tracking-tight">
              CG
            </span>
            <span className="text-gray-900 dark:text-white">Campus Gigs</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 mb-2">
              Menu
            </p>
            <div className="space-y-0.5">
              {nav.filter((n) => n.section === "menu").map((item) => {
                const Icon = item.icon;
                const active =
                  path === item.to ||
                  (item.to === "/dashboard" && path.startsWith("/dashboard") && role === "WORKER" && !path.startsWith("/dashboard/poster")) ||
                  (item.to === "/dashboard/poster" && (path === "/dashboard/poster" || path.startsWith("/dashboard/poster/")));
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm border-l-[3px] border-indigo-600 dark:border-indigo-400 rounded-l-none"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200",
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold leading-none">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 mb-2">
              General
            </p>
            <div className="space-y-0.5">
              {nav.filter((n) => n.section === "general").map((item) => {
                const Icon = item.icon;
                const active = path === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 shadow-sm border-l-[3px] border-indigo-600 dark:border-indigo-400 rounded-l-none"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200",
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500")}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 transition-all">
                <Sun size={18} className="text-gray-400 dark:hidden" />
                <Moon size={18} className="text-gray-500 hidden dark:block" />
                <span className="flex-1">Theme</span>
                <ThemeToggle />
              </div>
              <button
                onClick={() => { clearAuth(); navigate("/"); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 transition-all"
              >
                <LogOut size={18} className="text-gray-400 dark:text-gray-500" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-[18px] text-white"
          >
            <Sparkles size={20} className="mb-2 text-indigo-200" />
            <p className="text-sm font-semibold mb-0.5">Go Unlimited</p>
            <p className="text-[11px] text-indigo-200 leading-relaxed mb-3">
              Get early access to premium gigs and priority support.
            </p>
            <button className="w-full py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold transition-colors backdrop-blur-sm">
              Upgrade now
            </button>
          </motion.div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="relative w-full max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              placeholder="Search..."
              className="w-full h-9 pl-9 pr-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 leading-none pointer-events-none">
              ⌘F
            </kbd>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/dashboard/notifications"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Avatar id={user.id} name={user.fullName} size={32} />
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.fullName}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{user.email}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => { setActiveRole(role === "WORKER" ? "POSTER" : "WORKER"); navigate(role === "WORKER" ? "/dashboard/poster" : "/dashboard"); }}>
                  <ArrowLeftRight size={14} className="mr-2" />
                  Switch to {role === "WORKER" ? "poster" : "worker"} mode
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile/" + user.id)}>
                  <User size={14} className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
                  <Settings size={14} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { clearAuth(); navigate("/"); }}>
                  <LogOut size={14} className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
