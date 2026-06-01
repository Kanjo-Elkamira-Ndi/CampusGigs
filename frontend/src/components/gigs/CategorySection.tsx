import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import type { Gig, GigCategory } from "@/types";
import { CATEGORY_META } from "@/lib/constants";
import { GigCard } from "@/components/gigs/GigCard";

export function CategorySection({
  category,
  gigs,
  totalCount,
}: {
  category: GigCategory;
  gigs: Gig[];
  totalCount: number;
}) {
  const meta = CATEGORY_META[category];
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const amt = rowRef.current.clientWidth * 0.7;
    rowRef.current.scrollBy({ left: dir === "left" ? -amt : amt, behavior: "smooth" });
  };

  if (!gigs.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      id={`cat-${category}`}
    >
      {/* category header */}
      <div className="flex items-end justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ backgroundColor: meta.bg }}
          >
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className="text-lg sm:text-xl font-bold leading-snug"
                style={{ color: "var(--foreground)" }}
              >
                {category}
              </h2>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: meta.bg, color: meta.text }}
              >
                {totalCount} active
              </span>
            </div>
            <p className="text-[11px] sm:text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {getCategoryDescription(category)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--card-surface-sm)", border: "1px solid var(--card-chip-border)", color: "var(--text-secondary)" }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--card-surface-sm)", border: "1px solid var(--card-chip-border)", color: "var(--text-secondary)" }}
            aria-label="Scroll right"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* gig cards row */}
      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2"
      >
        {gigs.slice(0, 6).map((gig, i) => (
          <div key={gig.id} className="snap-start shrink-0 w-[300px] sm:w-[320px]">
            <GigCard gig={gig} />
          </div>
        ))}
        {totalCount > 6 && (
          <motion.div
            whileHover={{ x: 2 }}
            className="snap-start shrink-0 w-[200px] flex items-center justify-center"
          >
            <Link
              to={`/gigs?category=${category}`}
              className="flex flex-col items-center gap-1.5 px-4 py-6 rounded-xl sm:rounded-2xl text-center transition-all hover:brightness-95"
              style={{ backgroundColor: "var(--card-surface-sm)", border: "1px solid var(--card-chip-border)" }}
            >
              <Sparkles size={16} style={{ color: "var(--brand)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                View all {totalCount}
              </span>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {category} gigs
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

function getCategoryDescription(cat: GigCategory): string {
  const map: Record<GigCategory, string> = {
    Tutoring: "Academic support across all subjects and levels",
    Errands: "Household help, moving, cleaning, and everyday tasks",
    "Tech help": "Computer repairs, installations, and technical support",
    Events: "Event setup, MC, sound, and coordination services",
    Creative: "Design, video, content creation, and branding",
    Delivery: "Same-day document and package delivery",
    Translation: "English-French document translation services",
    Photography: "Event, portrait, and graduation photography",
    Other: "Miscellaneous tasks and specialized services",
  };
  return map[cat] ?? "Browse available gigs in this category";
}
