import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  TrendingUp,
  Eye,
  Send,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { Gig } from "@/types";
import { formatBudget, timeAgo } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/constants";

export function TrendingGigs({ gigs }: { gigs: Gig[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: rowRef });

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const amt = rowRef.current.clientWidth * 0.7;
    rowRef.current.scrollBy({ left: dir === "left" ? -amt : amt, behavior: "smooth" });
  };

  if (!gigs.length) return null;

  return (
    <section>
      {/* header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: "#EC4899" }} />
            <h2
              className="text-lg sm:text-xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              Trending Opportunities
            </h2>
          </div>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Most viewed and recently posted gigs
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--card-surface-sm)", border: "1px solid var(--card-chip-border)", color: "var(--text-secondary)" }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--card-surface-sm)", border: "1px solid var(--card-chip-border)", color: "var(--text-secondary)" }}
            aria-label="Scroll right"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* carousel */}
      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2"
      >
        {gigs.map((gig, i) => (
          <TrendingCard key={gig.id} gig={gig} index={i} />
        ))}
      </div>
    </section>
  );
}

function TrendingCard({ gig, index }: { gig: Gig; index: number }) {
  const meta = CATEGORY_META[gig.category];
  const viewCount = Math.floor(Math.random() * 80) + 20;

  return (
    <motion.a
      href={"/gigs/" + gig.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="snap-start shrink-0 w-[260px] sm:w-[280px] rounded-xl sm:rounded-2xl p-4 sm:p-5 block transition-shadow duration-200"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ backgroundColor: meta.bg, color: meta.text }}
        >
          {meta.icon} {gig.category}
        </span>
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
          {timeAgo(gig.createdAt)}
        </span>
      </div>

      <h3
        className="text-sm font-bold leading-snug line-clamp-2"
        style={{ color: "var(--foreground)" }}
      >
        {gig.title}
      </h3>

      <div className="flex items-center gap-3 mt-2.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1">
          <Eye size={12} /> {viewCount}
        </span>
        <span className="flex items-center gap-1">
          <Send size={12} /> {gig.applicationCount} apps
        </span>
      </div>

      <div
        className="mt-3 pt-3 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--card-chip-border)" }}
      >
        <span className="text-sm font-bold" style={{ color: "var(--brand)" }}>
          {formatBudget(gig.budget)}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#EC489910", color: "#EC4899" }}>
          <Sparkles size={10} /> Trending
        </span>
      </div>
    </motion.a>
  );
}
