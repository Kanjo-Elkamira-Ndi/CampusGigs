import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { mockGigs } from "@/lib/mockData";
import { CATEGORY_META } from "@/lib/constants";
import type { GigCategory } from "@/types";
import { CategoryIcon } from "@/components/shared/CategoryIcon";
import { GigCard } from "@/components/gigs/GigCard";

const CATEGORY_DESCRIPTIONS: Record<GigCategory, string> = {
  Tutoring: "Find tutoring, exam prep, assignment guidance, and coaching",
  Errands: "Explore cleaning, moving, laundry, and everyday tasks",
  "Tech help": "Fix computers, install software, and get tech support",
  Events: "Work as usher, coordinator, sound tech, or event staff",
  Creative: "Design, video editing, content creation, and branding",
  Delivery: "Earn with deliveries, pickups, and local transport",
  Translation: "Translate documents between English and French",
  Photography: "Shoot events, portraits, and graduation photos",
  Other: "Browse miscellaneous tasks and specialized gigs",
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
            /* ── Category cards grid ── */
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {CATEGORY_ORDER.map((cat, i) => {
                const count = ACTIVE_GIGS.filter((g) => g.category === cat).length;
                const meta = CATEGORY_META[cat];
                return (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectCategory(cat)}
                    className="flex flex-col items-start text-left rounded-2xl p-6 transition-shadow duration-200"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--card-border)",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: meta.bg }}
                    >
                      <CategoryIcon category={cat} size={22} />
                    </div>
                    <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
                      {cat}
                    </h3>
                    <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                      {CATEGORY_DESCRIPTIONS[cat]}
                    </p>
                    <span className="text-xs font-medium mt-3" style={{ color: "var(--brand)" }}>
                      {count} gig{count !== 1 ? "s" : ""}
                    </span>
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
