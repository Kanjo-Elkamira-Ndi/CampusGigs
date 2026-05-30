import { useMemo, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { FreelancerGrid } from "@/components/freelancers/FreelancerGrid";
import { mockUsers } from "@/lib/mockData";
import { CAMEROON_UNIVERSITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FreelancerDirectory() {
  const [uniIds, setUniIds] = useState<string[]>([]);
  const [skill, setSkill] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"rating" | "hired" | "newest">("rating");

  const workers = useMemo(() => {
    let out = mockUsers.filter((u) => u.role === "WORKER");
    if (uniIds.length) out = out.filter((u) => uniIds.includes(u.universityId));
    if (skill) out = out.filter((u) => u.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())));
    if (minRating > 0) out = out.filter((u) => u.avgRating >= minRating);
    if (sort === "rating") out.sort((a, b) => b.avgRating - a.avgRating);
    if (sort === "hired") out.sort((a, b) => b.hiredCount - a.hiredCount);
    if (sort === "newest") out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return out;
  }, [uniIds, skill, minRating, sort]);

  const toggleUni = (id: string) =>
    setUniIds(uniIds.includes(id) ? uniIds.filter((x) => x !== id) : [...uniIds, id]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold">Find talented students across Cameroon</h1>
        <p className="text-muted-foreground mt-1">Hire vetted students for tutoring, design, tech help, events and more.</p>

        <div className="flex gap-8 mt-8">
          <aside className="hidden md:block w-64 shrink-0 space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Sort by</h4>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                <option value="rating">Top rated</option>
                <option value="hired">Most hired</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Skill</h4>
              <input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. Python, Canva" className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Min rating: {minRating.toFixed(1)}</h4>
              <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={(e) => setMinRating(+e.target.value)} className="w-full accent-[color:var(--brand)]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">University</h4>
              <ul className="space-y-0.5 max-h-72 overflow-auto">
                {CAMEROON_UNIVERSITIES.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => toggleUni(u.id)}
                      className={cn("w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-muted", uniIds.includes(u.id) && "border-l-2 border-brand bg-brand-light/60 dark:bg-brand-light/30 font-medium")}
                    >
                      {u.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-4">{workers.length} students available</p>
            <FreelancerGrid users={workers.map((u) => ({
              id: u.id, fullName: u.fullName, avatarUrl: u.avatarUrl,
              universityName: u.universityName, city: u.city,
              avgRating: u.avgRating, reviewCount: u.reviewCount, hiredCount: u.hiredCount, skills: u.skills,
            }))} />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
