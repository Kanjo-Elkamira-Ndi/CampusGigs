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
        backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: "var(--foreground)" }}>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>🎓</span>
          Campus Gigs
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
          <Link to="/gigs" className="px-3 py-2 rounded-md hover:bg-[var(--muted)] transition-colors" style={{ color: "var(--muted-foreground)" }}>Find Work</Link>
          <Link to="/freelancers" className="px-3 py-2 rounded-md hover:bg-[var(--muted)] transition-colors" style={{ color: "var(--muted-foreground)" }}>Hire Talent</Link>
          <a href="/#how" className="px-3 py-2 rounded-md hover:bg-[var(--muted)] transition-colors" style={{ color: "var(--muted-foreground)" }}>How It Works</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-[var(--muted)] transition-colors" style={{ color: "var(--foreground)" }}>
                  <Avatar id={user.id} name={user.fullName} src={user.avatarUrl} size={28} />
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
              <Link to="/login" className="text-sm px-3 py-1.5 transition-colors" style={{ color: "var(--muted-foreground)" }}>Log in</Link>
              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-lg font-medium transition-all"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-foreground)" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" style={{ color: "var(--foreground)" }} onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-1 text-sm" style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--muted-foreground)" }}>
          <Link to="/gigs" onClick={() => setOpen(false)} className="block py-2" style={{ color: "var(--muted-foreground)" }}>Find Work</Link>
          <Link to="/freelancers" onClick={() => setOpen(false)} className="block py-2" style={{ color: "var(--muted-foreground)" }}>Hire Talent</Link>
          <a href="/#how" onClick={() => setOpen(false)} className="block py-2" style={{ color: "var(--muted-foreground)" }}>How It Works</a>
          <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <ThemeToggle />
            {user ? (
              <button
                onClick={() => { clearAuth(); setOpen(false); navigate("/"); }}
                className="ml-auto px-3 py-1.5 rounded-md"
                style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
              >
                Log out
              </button>
            ) : (
              <div className="ml-auto flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-md" style={{ backgroundColor: "var(--brand)", color: "var(--brand-foreground)" }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
