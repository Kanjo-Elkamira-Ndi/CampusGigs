import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Avatar } from "@/components/shared/Avatar";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Search, FileText, MessageSquare, Star, User, LogOut, Briefcase } from "lucide-react";

interface Props { role: "WORKER" | "POSTER"; children: ReactNode; }

export function DashboardShell({ role, children }: Props) {
  const user = useAuthStore((s) => s.user)!;
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const links = role === "WORKER" ? [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/gigs", label: "Browse gigs", icon: Search },
    { to: "/dashboard", label: "My applications", icon: FileText },
    { to: "/messages", label: "Messages", icon: MessageSquare },
    { to: "/profile/$id", label: "Profile", icon: User, params: { id: user.id } },
  ] : [
    { to: "/dashboard/poster", label: "Dashboard", icon: LayoutDashboard },
    { to: "/gigs/new", label: "Post a gig", icon: Briefcase },
    { to: "/freelancers", label: "Browse talent", icon: Search },
    { to: "/messages", label: "Messages", icon: MessageSquare },
    { to: "/profile/$id", label: "Profile", icon: User, params: { id: user.id } },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
      <aside className="hidden md:block w-60 shrink-0">
        <div className="rounded-xl border border-border bg-card p-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar id={user.id} name={user.fullName} size={40} />
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{user.fullName}</div>
              <div className="text-xs text-muted-foreground truncate">{user.universityName}</div>
            </div>
          </div>
        </div>
        <nav className="space-y-0.5 text-sm">
          {links.map((l) => {
            const active = path === l.to || (l.to === "/dashboard" && path === "/dashboard");
            const Icon = l.icon;
            return (
              <Link
                key={l.label}
                to={l.to as any}
                params={l.params as any}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted",
                  active && "border-l-2 border-brand bg-brand-light/60 dark:bg-brand-light/20 font-medium",
                )}
              >
                <Icon size={16} /> {l.label}
              </Link>
            );
          })}
          <Link to="/profile/edit" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
            <Star size={16} /> My reviews
          </Link>
          <button onClick={clearAuth} className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-left">
            <LogOut size={16} /> Log out
          </button>
        </nav>
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
