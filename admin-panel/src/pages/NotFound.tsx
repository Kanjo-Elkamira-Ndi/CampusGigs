import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="text-center">
        <div className="text-7xl font-bold text-brand">404</div>
        <h1 className="text-2xl font-semibold text-neutral-900 mt-2">Page not found</h1>
        <p className="text-sm text-neutral-500 mt-1">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-6 bg-brand hover:bg-brand-dark">
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
