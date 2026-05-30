import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(0, 21, 46, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-sm">🎓</span>
          Campus Gigs
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm text-white/80">
          <Link to="/gigs" className="px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">Find Work</Link>
          <Link to="/freelancers" className="px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">Hire Talent</Link>
          <a href="/#how" className="px-3 py-2 rounded-md hover:bg-white/10 hover:text-white transition-colors">How It Works</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white/10 text-white">
                  <Avatar id={user.id} name={user.fullName} size={28} />
                  <span className="text-sm font-medium">{user.fullName.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => navigate("/profile/" + user.id)}>
                  My profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(user.role === "POSTER" ? "/dashboard/poster" : "/dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/messages")}>Messages</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile/edit")}>Edit profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { clearAuth(); navigate("/"); }}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="text-sm text-white/80 hover:text-white px-3 py-1.5 transition-colors">Log in</Link>
              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-lg font-medium text-white transition-all"
                style={{ backgroundColor: "var(--brand)" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-white" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1 text-white/80 text-sm bg-[#00152E]">
          <Link to="/gigs" onClick={() => setOpen(false)} className="block py-2 hover:text-white">Find Work</Link>
          <Link to="/freelancers" onClick={() => setOpen(false)} className="block py-2 hover:text-white">Hire Talent</Link>
          <a href="/#how" onClick={() => setOpen(false)} className="block py-2 hover:text-white">How It Works</a>
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => { clearAuth(); setOpen(false); navigate("/"); }}
                className="ml-auto px-3 py-1.5 rounded-md bg-white/10 text-white"
              >
                Log out
              </button>
            ) : (
              <div className="ml-auto flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-md bg-white/10 text-white">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-md text-white" style={{ backgroundColor: "var(--brand)" }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
