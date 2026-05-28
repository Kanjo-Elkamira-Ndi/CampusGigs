import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar } from "@/components/shared/Avatar";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full" style={{ backgroundColor: "var(--brand)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between text-white">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="inline-block w-7 h-7 rounded-md bg-white/15 grid place-items-center text-base">🎓</span>
          Campus Gigs
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/gigs" className="px-3 py-2 rounded-md hover:bg-white/10">Find work</Link>
          <Link to="/freelancers" className="px-3 py-2 rounded-md hover:bg-white/10">Hire talent</Link>
          <a href="/#how" className="px-3 py-2 rounded-md hover:bg-white/10">How it works</a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/10">
                  <Avatar id={user.id} name={user.fullName} size={28} />
                  <span className="text-sm font-medium">{user.fullName.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => navigate({ to: "/profile/$id", params: { id: user.id } })}>
                  My profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: user.role === "POSTER" ? "/dashboard/poster" : "/dashboard" })}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/messages" })}>Messages</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/profile/edit" })}>Edit profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { clearAuth(); navigate({ to: "/" }); }}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1.5 rounded-md hover:bg-white/10">Log in</Link>
              <Link to="/register" className="text-sm px-3 py-1.5 rounded-md bg-white text-[color:var(--brand-dark)] font-medium hover:bg-white/90">
                Sign up free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1 text-white text-sm">
          <Link to="/gigs" onClick={() => setOpen(false)} className="block py-2">Find work</Link>
          <Link to="/freelancers" onClick={() => setOpen(false)} className="block py-2">Hire talent</Link>
          <a href="/#how" onClick={() => setOpen(false)} className="block py-2">How it works</a>
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => { clearAuth(); setOpen(false); navigate({ to: "/" }); }}
                className="ml-auto px-3 py-1.5 rounded-md bg-white/10"
              >
                Log out
              </button>
            ) : (
              <div className="ml-auto flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-md bg-white/10">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-md bg-white text-[color:var(--brand-dark)] font-medium">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
