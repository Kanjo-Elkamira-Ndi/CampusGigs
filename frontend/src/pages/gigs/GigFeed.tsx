import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { mockGigs } from "@/lib/mockData";

import type { GigCategory } from "@/types";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { GigCard } from "@/components/gigs/GigCard";

const CATEGORY_DESCRIPTIONS: Record<GigCategory, string> = {
  Tutoring: "Find tutoring, exam preparation, assignment guidance, language coaching, and study support opportunities.",
  Errands: "Explore cleaning, painting, laundry, moving assistance, and neighborhood service gigs.",
  "Tech help": "Discover computer repair, software installation, printer setup, and technical troubleshooting gigs.",
  Events: "Work as an usher, coordinator, photographer, or event support staff for local events.",
  Creative: "Discover web development, graphic design, video editing, social media, and content creation projects.",
  Delivery: "Earn money helping with deliveries, pickups, errands, and local transportation tasks.",
  Translation: "Find English-French document translation, interpretation, and language service opportunities.",
  Photography: "Find photography, videography, editing, and content production opportunities.",
  Other: "Browse miscellaneous tasks and specialized service opportunities on campus.",
};

const CATEGORY_ORDER: GigCategory[] = [
  "Tutoring",
  "Errands",
  "Tech help",
  "Events",
  "Creative",
  "Delivery",
  "Translation",
  "Photography",
  "Other",
];

const ACTIVE_GIGS = mockGigs.filter((g) => g.status !== "CANCELLED");

/* ── per-category accent colors ── */

const CAT_COLORS: Record<GigCategory, string> = {
  Tutoring: "#0F8BFF",
  Errands: "#10B981",
  "Tech help": "#6366F1",
  Events: "#EC4899",
  Creative: "#8B5CF6",
  Delivery: "#F59E0B",
  Translation: "#14B8A6",
  Photography: "#F97316",
  Other: "#6B7280",
};

export function GigFeed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const selectedCategory = searchParams.get("category") as GigCategory | null;

  const filtered = useMemo(() => {
    let out = [...ACTIVE_GIGS];
    if (selectedCategory) out = out.filter((g) => g.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.city.toLowerCase().includes(q) ||
          g.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return out;
  }, [selectedCategory, search]);

  const selectCategory = (cat: GigCategory) => {
    setSearchParams({ category: cat });
    setSearch("");
  };

  const clearCategory = () => {
    setSearchParams({});
    setSearch("");
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-4"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--card-border)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <Sparkles size={12} /> Browse Gigs
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>
            {selectedCategory ? (
              <span className="inline-flex items-center gap-3">
                <CategoryIcon category={selectedCategory} size={28} />
                {selectedCategory}
              </span>
            ) : (
              "Find Work"
            )}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {selectedCategory
              ? CATEGORY_DESCRIPTIONS[selectedCategory]
              : "Browse gigs by category or search for specific opportunities"}
          </p>
        </motion.div>

        {/* search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-xl mx-auto mb-10"
        >
          <div
            className="rounded-xl flex items-center gap-2 px-4 py-3"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <Search size={16} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={selectedCategory ? `Search in ${selectedCategory}...` : "Search gigs, categories, or keywords..."}
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
              style={{ color: "var(--foreground)" }}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedCategory ? (
            /* ── Gig listing for selected category ── */
            <motion.div
              key="gigs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <button
                onClick={clearCategory}
                className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-all hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                <ArrowLeft size={14} /> All Categories
              </button>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "var(--card-surface-sm)" }}
                  >
                    <Search size={20} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                    No gigs found
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    Try a different search or category
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            /* ── Category cards grid (Twine-style landing pages) ── */
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {CATEGORY_ORDER.map((cat, i) => {
                const count = ACTIVE_GIGS.filter((g) => g.category === cat).length;
                const color = CAT_COLORS[cat];
                const bg = `${color}12`;
                return (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => selectCategory(cat)}
                    className="flex flex-col items-start text-left rounded-3xl p-7 sm:p-8 transition-shadow duration-300"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* large icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: bg, color }}
                    >
                      <CategoryIcon category={cat} size={26} />
                    </div>

                    {/* title */}
                    <h3 className="text-lg font-bold leading-snug" style={{ color: "var(--foreground)" }}>
                      {cat}
                    </h3>

                    {/* description */}
                    <p className="text-sm leading-relaxed mt-2 flex-1" style={{ color: "var(--text-secondary)" }}>
                      {CATEGORY_DESCRIPTIONS[cat]}
                    </p>

                    {/* cta + count */}
                    <div className="flex items-center justify-between w-full mt-6">
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all"
                        style={{ color }}
                      >
                        Browse {cat} <ArrowRight size={14} />
                      </span>
                      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                        {count} gig{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
