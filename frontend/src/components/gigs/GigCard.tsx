import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
} from "lucide-react";
import type { Gig } from "@/types";
import { formatBudget, getDeadlineLabel, timeAgo } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/constants";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { ApplyModal } from "@/components/applications/ApplyModal";

export function GigCard({ gig }: { gig: Gig }) {
  const meta = CATEGORY_META[gig.category];
  const deadline = getDeadlineLabel(gig.deadline);
  const d = new Date(gig.createdAt);
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="group rounded-xl sm:rounded-2xl overflow-hidden transition-shadow duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <Link to={"/gigs/" + gig.id} className="block p-4 sm:p-5">
        {/* Top: Title + Budget */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-base font-bold leading-snug line-clamp-2 flex-1 min-w-0 transition-colors"
            style={{ color: "var(--foreground)" }}
          >
            {gig.title}
          </h3>
          <div className="text-right shrink-0">
            <div
              className="text-base font-bold whitespace-nowrap"
              style={{ color: "var(--brand)" }}
            >
              {formatBudget(gig.budget)}
            </div>
            <div
              className="text-[10px] font-medium mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              fixed price
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm mt-2 leading-relaxed line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {gig.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
          <span className="inline-flex items-center gap-1">
            <MapPin size={11} />
            {gig.city ?? gig.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(gig.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={11} />
            {gig.applicationCount} applicants
          </span>
          {gig.poster.avgRating > 0 && (
            <span className="inline-flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {gig.poster.avgRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Bottom: Badge + Deadline + Actions */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3" style={{ borderTop: "1px solid var(--card-chip-border)" }}>
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0"
              style={{
                backgroundColor: meta.bg ? `${meta.bg.replace("dark:", "")}` : undefined,
                color: meta.text,
              }}
            >
              <CategoryIcon category={gig.category} size={11} /> {gig.category}
            </span>
            {gig.deadline && (
              <span
                className="text-[10px] font-medium truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {deadline.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "var(--text-muted)" }}
              aria-label="Save gig"
            >
              <Bookmark size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setApplyOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Quick Apply <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </Link>
      <ApplyModal gig={gig} open={applyOpen} onOpenChange={setApplyOpen} />
    </motion.div>
  );
}
