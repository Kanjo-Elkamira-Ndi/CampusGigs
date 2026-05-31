import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  BadgeCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { Gig } from "@/types";
import { formatBudget, timeAgo } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, { accent: string; bg: string }> = {
  Tutoring: { accent: "#0F8BFF", bg: "rgba(15,139,255,0.12)" },
  Errands: { accent: "#10B981", bg: "rgba(16,185,129,0.12)" },
  "Tech help": { accent: "#06B6D4", bg: "rgba(6,182,212,0.12)" },
  Events: { accent: "#EC4899", bg: "rgba(236,72,153,0.12)" },
  Creative: { accent: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  Delivery: { accent: "#F97316", bg: "rgba(249,115,22,0.12)" },
  Photography: { accent: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  Translation: { accent: "#14B8A6", bg: "rgba(20,184,166,0.12)" },
  Other: { accent: "#6B7280", bg: "rgba(107,114,128,0.12)" },
};

const TRENDING = [
  "Math Tutor",
  "Graphic Designer",
  "House Cleaner",
  "Event Assistant",
  "Web Developer",
];

function SectionHeader({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            Latest Opportunities Across Cameroon
          </h2>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
            style={{
              backgroundColor: "rgba(16,185,129,0.15)",
              color: "#10B981",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {count} Active Gigs
          </motion.span>
        </div>
        <p className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          Discover active gigs posted by students, families, businesses, and local communities.
        </p>
      </div>
      <Link
        to="/gigs"
        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline shrink-0"
        style={{ color: "var(--brand)" }}
      >
        View all gigs <ArrowRight size={14} />
      </Link>
    </motion.div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: c.bg, color: c.accent }}
    >
      {category}
    </span>
  );
}

function FeaturedCard({ gig }: { gig: Gig }) {
  const c = CATEGORY_COLORS[gig.category] ?? CATEGORY_COLORS.Other;
  const initial = gig.poster.fullName.charAt(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden md:col-span-6 md:row-span-2"
      style={{
        border: "1px solid var(--card-border)",
        backgroundColor: "var(--card)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
        style={{
          boxShadow: `inset 0 0 0 1px ${c.accent}33, 0 0 30px ${c.accent}22`,
        }}
      />

      <div className="relative z-10 p-5 sm:p-7 lg:p-8 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <CategoryBadge category={gig.category} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            <Clock className="inline mr-1" size={11} />
            {timeAgo(gig.createdAt)}
          </span>
        </div>

        <h3
          className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2"
          style={{ color: "var(--card-text)" }}
        >
          {gig.title}
        </h3>

        <p
          className="text-sm leading-relaxed line-clamp-3 mb-4"
          style={{ color: "var(--card-text-sub)" }}
        >
          {gig.description}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--card-text-muted)" }}>
              Budget
            </div>
            <div className="text-base font-bold" style={{ color: c.accent }}>
              {formatBudget(gig.budget)}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--card-text-muted)" }}>
              Location
            </div>
            <div className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--card-text)" }}>
              <MapPin size={13} /> {gig.location}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--card-text-muted)" }}>
              Applicants
            </div>
            <div className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--card-text)" }}>
              <Users size={13} /> {gig.applicationCount}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: c.bg, color: c.accent }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--card-text)" }}>
              {gig.poster.fullName}
              <BadgeCheck size={13} style={{ color: c.accent }} />
            </div>
            <div className="text-[11px]" style={{ color: "var(--card-text-muted)" }}>
              {gig.universityName} · Verified Poster
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            to={"/gigs/" + gig.id}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: c.accent }}
          >
            Apply Now <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function SecondaryCard({ gig, delay }: { gig: Gig; delay: number }) {
  const c = CATEGORY_COLORS[gig.category] ?? CATEGORY_COLORS.Other;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="group relative rounded-2xl overflow-hidden shrink-0 w-[280px] md:w-auto md:col-span-3"
      style={{
        border: "1px solid var(--card-border)",
        backgroundColor: "var(--card)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-[inherit]"
        style={{
          boxShadow: `inset 0 0 0 1px ${c.accent}22, 0 0 20px ${c.accent}11`,
        }}
      />

      <Link to={"/gigs/" + gig.id} className="relative z-10 block p-4 sm:p-5 h-full">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CategoryBadge category={gig.category} />
          <span
            className="text-[11px] font-semibold shrink-0"
            style={{ color: c.accent }}
          >
            {formatBudget(gig.budget)}
          </span>
        </div>

        <h4
          className="text-sm font-bold leading-snug mb-2 line-clamp-2"
          style={{ color: "var(--card-text)" }}
        >
          {gig.title}
        </h4>

        <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--card-text-muted)" }}>
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {gig.city}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} /> {gig.applicationCount} apps
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {timeAgo(gig.createdAt)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function TrendingTicker() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-10 pt-6"
      style={{ borderTop: "1px solid var(--card-border)" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <TrendingUp size={14} style={{ color: "var(--text-muted)" }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Trending Searches
        </span>
      </div>
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...TRENDING, ...TRENDING].map((term, i) => (
            <Link
              key={i}
              to={`/gigs?q=${encodeURIComponent(term)}`}
              className="shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all hover:brightness-110"
              style={{
                backgroundColor: "var(--card-surface-sm)",
                border: "1px solid var(--card-chip-border)",
                color: "var(--card-chip-text)",
              }}
            >
              {term}
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function GigsShowcase({ gigs }: { gigs: Gig[] }) {
  if (!gigs.length) return null;

  const [featured, ...secondary] = gigs;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <SectionHeader count={gigs.length} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 auto-rows-[minmax(180px,auto)]">
        <FeaturedCard gig={featured} />

        <div className="md:col-span-6 flex md:grid md:grid-cols-2 gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-2 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0">
          {secondary.map((gig, i) => (
            <SecondaryCard key={gig.id} gig={gig} delay={0.1 + i * 0.08} />
          ))}
        </div>
      </div>

      <TrendingTicker />
    </section>
  );
}
