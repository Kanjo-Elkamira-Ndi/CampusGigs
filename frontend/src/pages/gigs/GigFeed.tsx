import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search,
  Briefcase,
  Users,
  Layers,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { mockGigs, mockUsers } from "@/lib/mockData";
import { CATEGORY_META } from "@/lib/constants";
import type { GigCategory } from "@/types";
import { CategoryNavigation } from "@/components/gigs/CategoryNavigation";
import { TrendingGigs } from "@/components/gigs/TrendingGigs";
import { CategorySection } from "@/components/gigs/CategorySection";
import { MarketplaceActivity } from "@/components/gigs/MarketplaceActivity";

const ACTIVE_GIGS = mockGigs.filter((g) => g.status === "OPEN" || g.status === "IN_PROGRESS");
const UNIQUE_CATS = new Set(ACTIVE_GIGS.map((g) => g.category));
const UNIQUE_UNIS = new Set(ACTIVE_GIGS.map((g) => g.universityId));

const STATS = [
  { icon: Briefcase, value: ACTIVE_GIGS.length, label: "Active Gigs", color: "#0F8BFF" },
  { icon: Users, value: mockUsers.filter((u) => u.role === "POSTER").length + 200, label: "Verified Clients", color: "#8B5CF6" },
  { icon: Layers, value: UNIQUE_CATS.size, label: "Categories", color: "#EC4899" },
  { icon: TrendingUp, value: UNIQUE_UNIS.size, label: "Universities", color: "#10B981" },
];

/* ── helpers ── */

function groupByCategory(gigs: typeof mockGigs) {
  const groups: Record<string, typeof gigs> = {};
  for (const g of gigs) {
    if (!groups[g.category]) groups[g.category] = [];
    groups[g.category].push(g);
  }
  return groups;
}

/* ── search widget ── */

function SearchBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
      className="relative"
    >
      <div
        className="rounded-xl sm:rounded-2xl flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <Search size={18} style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for gigs, categories, locations, or skills..."
          className="flex-1 bg-transparent text-sm sm:text-base outline-none min-w-0"
          style={{ color: "var(--foreground)" }}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110 shrink-0"
          style={{ backgroundColor: "var(--brand)" }}
        >
          Search
        </motion.button>
      </div>
    </form>
  );
}

/* ── hero stats ── */

function HeroStats() {
  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
          className="flex items-center gap-2"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${s.color}15` }}
          >
            <s.icon size={14} style={{ color: s.color }} />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              {s.value.toLocaleString()}+
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── main component ── */

export function GigFeed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const heroRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState<GigCategory | null>(
    (searchParams.get("category") as GigCategory) ?? null,
  );

  // Filter gigs
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

  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  // Trending = most applied + recent
  const trending = useMemo(
    () =>
      [...ACTIVE_GIGS]
        .sort((a, b) => b.applicationCount - a.applicationCount || +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 8),
    [],
  );

  // Parallax effect for hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);

  const handleCategoryNav = (catId: string) => {
    setSelectedCategory(catId as GigCategory);
    setSearchParams({ category: catId });
    setTimeout(() => {
      document.getElementById(`cat-${catId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <PageWrapper>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--section-bg)" }}
      >
        {/* floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <motion.div
            className="absolute w-64 h-64 rounded-full opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #0F8BFF, transparent)", top: "-10%", left: "-5%" }}
            animate={{ y: [0, 15, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full opacity-[0.025]"
            style={{ background: "radial-gradient(circle, #8B5CF6, transparent)", bottom: "-20%", right: "-10%" }}
            animate={{ y: [0, -20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
          <motion.div style={{ y: heroY }}>
            {/* header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-4"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--card-border)",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <Sparkles size={12} /> Marketplace
              </span>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                Find Work
              </h1>
              <p
                className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed max-w-xl"
                style={{ color: "var(--text-secondary)" }}
              >
                Discover opportunities posted by students, businesses, families, and communities across Cameroon.
              </p>
            </motion.div>

            {/* stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 sm:mt-8"
            >
              <HeroStats />
            </motion.div>

            {/* search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 sm:mt-10 max-w-3xl"
            >
              <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={() => {
                  if (search) setSearchParams({ q: search });
                  // scroll to results
                  document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
                }}
              />
              <div className="flex flex-wrap gap-2 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Popular:</span>
                {["Tutoring", "Events", "Creative", "Delivery", "Photography"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryNav(cat)}
                    className="hover:underline font-medium"
                    style={{ color: "var(--brand)" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12" id="results">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            {/* category nav */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Browse by Category
              </h3>
              <CategoryNavigation onSelect={handleCategoryNav} />
            </div>

            {/* activity */}
            <div className="hidden lg:block">
              <MarketplaceActivity />
            </div>
          </aside>

          {/* main */}
          <div className="flex-1 min-w-0 space-y-10">
            {/* trending */}
            <TrendingGigs gigs={trending} />

            {/* divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--card-chip-border)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Browse all categories
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--card-chip-border)" }} />
            </div>

            {/* category sections */}
            {Object.entries(CATEGORY_META).map(([catKey]) => {
              const cat = catKey as GigCategory;
              const gigs = grouped[catKey] ?? [];
              return (
                <CategorySection
                  key={catKey}
                  category={cat}
                  gigs={gigs}
                  totalCount={ACTIVE_GIGS.filter((g) => g.category === cat).length}
                />
              );
            })}

            {/* empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "var(--card-surface-sm)" }}
                >
                  <Search size={24} style={{ color: "var(--text-muted)" }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  No gigs found
                </h3>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  Try a different search or category
                </p>
              </div>
            )}
          </div>
        </div>

        {/* mobile activity feed */}
        <div className="mt-10 lg:hidden">
          <MarketplaceActivity />
        </div>

        {/* bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 sm:mt-16 text-center py-10 sm:py-12 rounded-2xl sm:rounded-3xl"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <h3
            className="text-xl sm:text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Can't find what you're looking for?
          </h3>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            Post a gig and let students come to you.
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mt-6 inline-flex"
          >
            <Link
              to="/gigs/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Post a Gig <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}


