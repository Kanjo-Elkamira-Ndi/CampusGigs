import { Link } from "react-router-dom";
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-bold text-base mb-3">Campus Gigs</div>
          <p className="text-muted-foreground">
            On-campus odd jobs for students across Cameroon.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-3">Find work</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/gigs" className="hover:text-foreground">Browse gigs</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Create profile</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Worker dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Hire talent</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/gigs/new" className="hover:text-foreground">Post a gig</Link></li>
            <li><Link to="/freelancers" className="hover:text-foreground">Browse talent</Link></li>
            <li><Link to="/dashboard/poster" className="hover:text-foreground">Poster dashboard</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Resources</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">How it works</Link></li>
            <li><Link to="/" className="hover:text-foreground">Safety</Link></li>
            <li><Link to="/" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Campus Gigs. Built for students across Cameroon.
      </div>
    </footer>
  );
}
