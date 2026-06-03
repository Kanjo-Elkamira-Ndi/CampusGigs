import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, Filter } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { TalentCard } from "@/components/talents/TalentCard";
import { FilterSidebar, type TalentFilters, DEFAULT_FILTERS } from "@/components/talents/FilterSidebar";
import { ResultsHeader } from "@/components/talents/ResultsHeader";
import { mockUsers } from "@/lib/mockData";
import type { User } from "@/types";

const PER_PAGE = 12;
/* ── map user to PublicUser shape ── */
function toPublic(u: User) {
  return {
    id: u.id, fullName: u.fullName, avatarUrl: u.avatarUrl,
    universityName: u.universityName, city: u.city,
    avgRating: u.avgRating, reviewCount: u.reviewCount, hiredCount: u.hiredCount,
    skills: u.skills,
    hourlyRate: u.hourlyRate, responseTime: u.responseTime, availability: u.availability,
    verified: u.verified, experienceLevel: u.experienceLevel, remoteAvailable: u.remoteAvailable,
    bio: u.bio, universityId: u.universityId, createdAt: u.createdAt,
  };
}

/* ── derive role-based category from skills ── */
function inferCategory(skills: string[]): string {
  if (skills.some((s) => ["Python", "Algorithms", "React", "Laravel", "JavaScript", "Web Development", "Django", "PostgreSQL", "CSS", "Networking"].includes(s))) return "Tech help";
  if (skills.some((s) => ["Graphic design", "Graphic Design", "Canva", "Illustrator", "Illustration", "Poster Design", "Branding", "Photoshop"].includes(s))) return "Creative";
  if (skills.some((s) => ["Photography", "Video editing", "Lightroom"].includes(s))) return "Photography";
  if (skills.some((s) => ["Events", "Event Setup", "Catering", "Sound Engineering", "MC", "Audio Editing"].includes(s))) return "Events";
  if (skills.some((s) => ["Delivery", "Bike Riding"].includes(s))) return "Delivery";
  if (skills.some((s) => ["Cleaning", "Organization", "Laundry", "Cooking", "Electrician", "Repairs"].includes(s))) return "Errands";
  if (skills.some((s) => ["Translation", "English", "French", "Proofreading"].includes(s))) return "Translation";
  if (skills.some((s) => ["Mathematics", "Math", "Physics", "Calculus", "Statistics", "Tutoring"].includes(s))) return "Tutoring";
  return "Other";
}

export function FreelancerDirectory() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<TalentFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("relevant");
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const allWorkers = useMemo(() => mockUsers.filter((u) => u.role === "WORKER"), []);

  const allCities = useMemo(
    () => [...new Set(allWorkers.map((u) => u.city))],
    [allWorkers],
  );

  const filtered = useMemo(() => {
    let out = allWorkers.map(toPublic);

    /* search */
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.skills.some((s) => s.toLowerCase().includes(q)) ||
          u.universityName.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.bio?.toLowerCase().includes(q),
      );
    }

    /* category */
    if (filters.categories.length > 0) {
      out = out.filter((u) => filters.categories.includes(inferCategory(u.skills)));
    }

    /* city */
    if (filters.cities.length > 0) {
      out = out.filter((u) => filters.cities.includes(u.city));
    }

    /* university */
    if (filters.universityIds.length > 0) {
      out = out.filter((u) => filters.universityIds.includes(u.universityId));
    }

    /* rating */
    if (filters.minRating > 0) {
      out = out.filter((u) => u.avgRating >= filters.minRating);
    }

    /* availability */
    if (filters.availability.length > 0) {
      out = out.filter((u) => u.availability && filters.availability.includes(u.availability));
    }

    /* hourly rate */
    out = out.filter((u) => {
      const rate = u.hourlyRate ?? 0;
      return rate >= filters.minRate && rate <= filters.maxRate;
    });

    /* remote */
    if (filters.remoteOnly) {
      out = out.filter((u) => u.remoteAvailable);
    }

    /* verified */
    if (filters.verifiedOnly) {
      out = out.filter((u) => u.verified);
    }

    /* experience */
    if (filters.experienceLevels.length > 0) {
      out = out.filter((u) => u.experienceLevel && filters.experienceLevels.includes(u.experienceLevel));
    }

    /* sort */
    if (sort === "rating") out.sort((a, b) => b.avgRating - a.avgRating);
    else if (sort === "hired") out.sort((a, b) => b.hiredCount - a.hiredCount);
    else if (sort === "newest") out.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    else if (sort === "rate-asc") out.sort((a, b) => (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0));
    else if (sort === "rate-desc") out.sort((a, b) => (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0));
    else {
      /* relevant: rating × sqrt(hired) heuristic */
      out.sort((a, b) => b.avgRating * Math.sqrt(b.hiredCount) - a.avgRating * Math.sqrt(a.hiredCount));
    }

    return out;
  }, [allWorkers, search, filters, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeFilterCount =
    filters.categories.length +
    filters.cities.length +
    filters.universityIds.length +
    (filters.minRating > 0 ? 1 : 0) +
    filters.availability.length +
    (filters.minRate > 0 || filters.maxRate < 20000 ? 1 : 0) +
    (filters.remoteOnly ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    filters.experienceLevels.length;

  /* reset page on filter/sort/search change */
  useEffect(() => {
    setPage(1);
  }, [search, filters, sort]);

  return (
    <PageWrapper>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* ── page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>
            Find Student Talent
          </h1>
          <p className="mt-2 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Browse verified university students ready to help with tutoring, creative projects, household services,
            technology, events, and more.
          </p>
          <p className="mt-3 text-sm font-semibold" style={{ color: "var(--brand)" }}>
            <Users size={15} className="inline mr-1" />
            {allWorkers.length.toLocaleString()}+ Verified Students
          </p>
        </motion.div>

        {/* ── search bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-8"
        >
          <div
            className="rounded-2xl flex items-center gap-3 px-5 py-3.5 transition-shadow duration-200"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            }}
          >
            <Search size={18} style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills, services, universities or student names..."
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
              style={{ color: "var(--foreground)" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-1 rounded-md hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </motion.div>

        {/* ── mobile filter toggle ── */}
        <div className="flex md:hidden items-center gap-2 mb-5">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
            style={{
              borderColor: "var(--card-border)",
              color: "var(--foreground)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <Filter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{ backgroundColor: "var(--brand)" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── main layout ── */}
        <div className="flex gap-8 lg:gap-10">
          {/* ─── sidebar (desktop) ─── */}
          <div className="hidden md:block w-[280px] lg:w-[320px] shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                allCities={allCities}
              />
            </div>
          </div>

          {/* ─── results grid ─── */}
          <div className="flex-1 min-w-0">
            <ResultsHeader
              totalCount={filtered.length}
              page={page}
              perPage={PER_PAGE}
              sort={sort}
              onSortChange={setSort}
            />

            <AnimatePresence mode="wait">
              {paged.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6"
                >
                  {paged.map((user, i) => (
                    <TalentCard key={user.id} user={user} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-20"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: "var(--card-bg)" }}
                  >
                    <Search size={24} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                    No students found matching your criteria
                  </h3>
                  <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(""); }}
                    className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "var(--brand)" }}
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 pb-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-30"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 7) {
                    p = i + 1;
                  } else if (page <= 4) {
                    p = i + 1;
                  } else if (page >= totalPages - 3) {
                    p = totalPages - 6 + i;
                  } else {
                    p = page - 3 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: p === page ? "var(--brand)" : "transparent",
                        color: p === page ? "white" : "var(--foreground)",
                        border: p === page ? "none" : "1px solid var(--card-border)",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-30"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── mobile filter drawer ── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm z-50 overflow-y-auto md:hidden"
              style={{
                backgroundColor: "var(--card-bg)",
                borderLeft: "1px solid var(--card-border)",
              }}
            >
              <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b z-10"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Filters</span>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1" style={{ color: "var(--text-secondary)" }}>
                  <X size={18} />
                </button>
              </div>
              <div className="px-5 py-2">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  allCities={allCities}
                />
              </div>
              <div className="sticky bottom-0 px-5 py-4 border-t"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  Show Results ({filtered.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}