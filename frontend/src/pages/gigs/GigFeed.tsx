import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Filter as FilterIcon, X } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GigFilters, defaultFilters, type FiltersState } from "@/components/gigs/GigFilters";
import { GigListRow } from "@/components/gigs/GigListRow";
import { GigSkeleton } from "@/components/gigs/GigSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { mockGigs } from "@/lib/mockData";
import { CAMEROON_UNIVERSITIES } from "@/lib/constants";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function GigFeed() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>({
    ...defaultFilters,
    category: (searchParams.get("category") as FiltersState["category"]) ?? null,
    universityId: searchParams.get("university") ?? null,
    easyApply: searchParams.get("easyApply") === "true",
  });
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    let out = [...mockGigs];
    if (filters.status !== "ALL") out = out.filter((g) => g.status === filters.status);
    if (filters.category) out = out.filter((g) => g.category === filters.category);
    if (filters.universityId) out = out.filter((g) => g.universityId === filters.universityId);
    if (filters.q) {
      const q = filters.q.toLowerCase();
      out = out.filter((g) => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
    if (filters.minBudget) out = out.filter((g) => g.budget >= Number(filters.minBudget));
    if (filters.maxBudget) out = out.filter((g) => g.budget <= Number(filters.maxBudget));
    if (filters.easyApply) out = out.filter((g) => g.isEasyApply);
    switch (filters.sort) {
      case "budget-desc": out.sort((a, b) => b.budget - a.budget); break;
      case "budget-asc": out.sort((a, b) => a.budget - b.budget); break;
      case "deadline": out.sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline)); break;
      default: out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return out;
  }, [filters]);

  const counts = useMemo(() => {
    const category: Record<string, number> = {};
    const university: Record<string, number> = {};
    mockGigs.forEach((g) => {
      category[g.category] = (category[g.category] ?? 0) + 1;
      university[g.universityId] = (university[g.universityId] ?? 0) + 1;
    });
    return { category, university };
  }, []);

  const uniCount = new Set(filtered.map((g) => g.universityId)).size;

  const removeFilter = (k: keyof FiltersState) =>
    setFilters({ ...filters, [k]: defaultFilters[k] });

  const chips: Array<[string, () => void, string]> = [];
  if (filters.category) chips.push([`Category: ${filters.category}`, () => removeFilter("category"), "cat"]);
  if (filters.universityId) {
    const u = CAMEROON_UNIVERSITIES.find((u) => u.id === filters.universityId);
    if (u) chips.push([`Uni: ${u.name}`, () => removeFilter("universityId"), "uni"]);
  }
  if (filters.easyApply) chips.push(["Easy apply", () => removeFilter("easyApply"), "ea"]);
  if (filters.q) chips.push([`"${filters.q}"`, () => removeFilter("q"), "q"]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="md:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm"><FilterIcon size={14} className="mr-1" /> Filters</Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-auto">
              <GigFilters value={filters} onChange={setFilters} counts={counts} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block">
            <GigFilters value={filters} onChange={setFilters} counts={counts} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-3">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filtered.length}</span> {filters.status === "OPEN" ? "open " : ""}gigs across <span className="font-medium text-foreground">{uniCount}</span> universities
              </p>
              <Link to="/gigs/new" className="text-sm font-medium px-3 py-1.5 rounded-md bg-brand hover:bg-[color:var(--brand-dark)] text-white">
                Post a gig +
              </Link>
            </div>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {chips.map(([label, on, key]) => (
                  <button key={key} onClick={on} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-muted hover:bg-muted/70">
                    {label} <X size={12} />
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <GigSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    title="No gigs match your filters"
                    description="Try removing a filter or browsing a different category."
                    action={<Button variant="outline" onClick={() => setFilters(defaultFilters)}>Reset filters</Button>}
                  />
                </div>
              ) : (
                filtered.map((g) => <GigListRow key={g.id} gig={g} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
