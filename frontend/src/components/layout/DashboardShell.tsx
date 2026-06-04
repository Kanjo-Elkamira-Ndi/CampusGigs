import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
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
  Star,
  DollarSign,
  Settings,
  LogOut,
  ArrowLeftRight,
  StarHalf,
  CreditCard,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/shared/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface Props {
  role: "WORKER" | "POSTER";
  children: ReactNode;
}

const WORKER_NAV = [
  { to: "/gigs", label: "Find Gigs" },
  { to: "/gigs", label: "Saved" },
  { to: "/dashboard", label: "My Applications" },
  { to: "/messages", label: "Messages" },
  { label: "Tools", dimmed: true },
] as const;

const POSTER_NAV = [
  { to: "/dashboard/poster", label: "My Gigs" },
  { to: "/gigs/new", label: "Post a Gig" },
  { to: "/dashboard/poster", label: "Applicants", badge: true },
  { to: "/messages", label: "Messages" },
  { label: "Tools", dimmed: true },
] as const;

const WORKER_SIDEBAR = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/gigs", icon: Search, label: "Browse Gigs" },
  { to: "/gigs", icon: Heart, label: "Saved" },
  { to: "/dashboard", icon: FileText, label: "Applications" },
  { to: "/messages", icon: MessageSquare, label: "Messages", dot: true },
] as const;

const POSTER_SIDEBAR = [
  { to: "/dashboard/poster", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/poster", icon: Briefcase, label: "My Gigs" },
  { to: "/gigs/new", icon: PlusCircle, label: "Post a Gig" },
  { to: "/dashboard/poster", icon: Users, label: "Applicants", dot: true },
  { to: "/messages", icon: MessageSquare, label: "Messages" },
] as const;

export function DashboardShell({ role, children }: Props) {
  const user = useAuthStore((s) => s.user)!;
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const activeRole = useAuthStore((s) => s.activeRole);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const nav = role === "WORKER" ? WORKER_NAV : POSTER_NAV;
  const sidebar = role === "WORKER" ? WORKER_SIDEBAR : POSTER_SIDEBAR;

  const dropdownItems = role === "WORKER" ? [
    { icon: User, label: "Profile", to: "/profile/" + user.id },
    { icon: FileText, label: "My Applications", to: "/dashboard" },
    { icon: Star, label: "Reviews Received", to: "/profile/" + user.id },
    { icon: DollarSign, label: "Earnings", to: "/dashboard" },
  ] : [
    { icon: User, label: "Profile", to: "/profile/" + user.id },
    { icon: Briefcase, label: "Posted Gigs", to: "/dashboard/poster" },
    { icon: Users, label: "Applicants", to: "/dashboard/poster" },
    { icon: StarHalf, label: "Reviews Given", to: "/profile/" + user.id },
    { icon: CreditCard, label: "Payments", to: "/dashboard/poster" },
  ];

  const switchLabel = role === "WORKER" ? "Switch to poster mode" : "Switch to worker mode";
  const switchTarget = role === "WORKER" ? "POSTER" : "WORKER";

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <aside className="hidden md:flex w-[52px] shrink-0 flex-col items-center gap-1 py-3 border-r border-border bg-background">
        {sidebar.map((item) => {
          const Icon = item.icon;
          const active = path === item.to || (item.to === "/dashboard" && path === "/dashboard") || (item.to === "/dashboard/poster" && path === "/dashboard/poster");
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-label={item.label}
            >
              <Icon size={18} />
              {"dot" in item && item.dot && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-1 ring-background" />
              )}
            </Link>
          );
        })}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[52px] shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-background">
          <Link to="/" className="flex items-center gap-2 font-bold text-base shrink-0">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs bg-muted text-muted-foreground">
              CG
            </span>
            Campus Gigs
          </Link>

          <TooltipProvider>
            <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              if ("dimmed" in item && item.dimmed) {
                return (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <span className="px-3 py-1.5 text-sm text-muted-foreground/50 cursor-not-allowed select-none">
                          {item.label}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        Coming soon
                      </TooltipContent>
                    </Tooltip>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={"to" in item ? item.to! : "#"}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted relative"
                >
                  {item.label}
                  {"badge" in item && item.badge && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-semibold">
                      3
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          </TooltipProvider>

          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-background" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors">
                  <Avatar id={user.id} name={user.fullName} size={28} />
                  <span className="text-sm font-medium hidden sm:inline">{user.fullName.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => { setActiveRole(switchTarget); navigate(switchTarget === "WORKER" ? "/dashboard" : "/dashboard/poster"); }}>
                  <ArrowLeftRight size={14} className="mr-2" />
                  {switchLabel}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {dropdownItems.map((item) => (
                  <DropdownMenuItem key={item.label} onClick={() => navigate(item.to)}>
                    <item.icon size={14} className="mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile/edit")}>
                  <Settings size={14} className="mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { clearAuth(); navigate("/"); }}>
                  <LogOut size={14} className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
