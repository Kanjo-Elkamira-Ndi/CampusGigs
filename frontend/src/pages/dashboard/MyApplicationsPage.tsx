import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Briefcase } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ApplicationRow } from "@/components/applications/ApplicationRow";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockApplications } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { AppStatus } from "@/types";

type Filter = "ALL" | AppStatus;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "REJECTED", label: "Rejected" },
  { key: "COMPLETED", label: "Completed" },
];

const FADE_IN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function MyApplicationsContent() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const apps = filter === "ALL" ? mockApplications : mockApplications.filter((a) => a.status === filter);

  return (
    <PageWrapper>
      <DashboardShell role="WORKER">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My applications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{mockApplications.length} total</p>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {apps.length === 0 ? (
          <EmptyState
            title="No applications here"
            description={filter === "ALL" ? "You haven't applied to any gigs yet." : `No ${filter.toLowerCase()} applications.`}
            action={<Link to="/gigs" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all">Browse gigs</Link>}
            icon={<Briefcase size={36} />}
          />
        ) : (
          <motion.div {...FADE_IN} className="rounded-xl border border-border bg-card overflow-hidden">
            {apps.map((a) => (
              <ApplicationRow key={a.id} application={a} />
            ))}
          </motion.div>
        )}
      </DashboardShell>
    </PageWrapper>
  );
}

export function MyApplicationsPage() {
  return <ProtectedRoute><MyApplicationsContent /></ProtectedRoute>;
}
