import { CAMEROON_UNIVERSITIES, CATEGORY_META } from "@/lib/constants";
import type { GigCategory, GigStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CategoryIcon } from "@/components/shared/CategoryIcon";

export interface FiltersState {
  q: string;
  universityId: string | null;
  category: GigCategory | null;
  minBudget: string;
  maxBudget: string;
  status: GigStatus | "ALL";
  easyApply: boolean;
  sort: "newest" | "budget-desc" | "budget-asc" | "deadline";
}

export const defaultFilters: FiltersState = {
  q: "", universityId: null, category: null, minBudget: "", maxBudget: "",
  status: "OPEN", easyApply: false, sort: "newest",
};

interface Props {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  counts?: { category?: Record<string, number>; university?: Record<string, number> };
}

export function GigFilters({ value, onChange, counts }: Props) {
  const set = <K extends keyof FiltersState>(k: K, v: FiltersState[K]) => onChange({ ...value, [k]: v });
  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search gigs…"
            value={value.q}
            onChange={(e) => set("q", e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Sort by</h4>
        <select
          value={value.sort}
          onChange={(e) => set("sort", e.target.value as FiltersState["sort"])}
          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="budget-desc">Budget: high to low</option>
          <option value="budget-asc">Budget: low to high</option>
          <option value="deadline">Deadline: soonest</option>
        </select>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">University</h4>
        <ul className="space-y-0.5 max-h-64 overflow-auto pr-1">
          <li>
            <button
              onClick={() => set("universityId", null)}
              className={cn(
                "w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-muted",
                !value.universityId && "border-l-2 border-brand bg-brand-light/60 dark:bg-brand-light/30 font-medium",
              )}
            >
              All universities
            </button>
          </li>
          {CAMEROON_UNIVERSITIES.map((u) => (
            <li key={u.id}>
              <button
                onClick={() => set("universityId", u.id)}
                className={cn(
                  "w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-muted flex justify-between items-center",
                  value.universityId === u.id && "border-l-2 border-brand bg-brand-light/60 dark:bg-brand-light/30 font-medium",
                )}
              >
                <span className="truncate">{u.name}</span>
                {counts?.university?.[u.id] != null && (
                  <span className="text-[11px] text-muted-foreground ml-1">{counts.university[u.id]}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Category</h4>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => set("category", null)}
              className={cn(
                "w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-muted",
                !value.category && "border-l-2 border-brand bg-brand-light/60 dark:bg-brand-light/30 font-medium",
              )}
            >
              All categories
            </button>
          </li>
          {Object.entries(CATEGORY_META).map(([cat, m]) => (
            <li key={cat}>
              <button
                onClick={() => set("category", cat as GigCategory)}
                className={cn(
                  "w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-muted flex items-center gap-2",
                  value.category === cat && "border-l-2 border-brand bg-brand-light/60 dark:bg-brand-light/30 font-medium",
                )}
              >
                <CategoryIcon category={cat as GigCategory} size={14} />
                <span className="flex-1">{cat}</span>
                {counts?.category?.[cat] != null && (
                  <span className="text-[11px] text-muted-foreground">{counts.category[cat]}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Budget (XAF)</h4>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min" value={value.minBudget} onChange={(e) => set("minBudget", e.target.value)} className="h-9" />
          <Input type="number" placeholder="Max" value={value.maxBudget} onChange={(e) => set("maxBudget", e.target.value)} className="h-9" />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Status</h4>
        <div className="flex flex-wrap gap-1">
          {(["OPEN", "IN_PROGRESS", "ALL"] as const).map((s) => (
            <button
              key={s}
              onClick={() => set("status", s)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs border",
                value.status === s
                  ? "bg-brand text-white border-brand"
                  : "border-border hover:bg-muted",
              )}
            >
              {s === "ALL" ? "All" : s === "OPEN" ? "Open" : "In progress"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">⚡ Easy apply only</label>
        <Switch checked={value.easyApply} onCheckedChange={(v) => set("easyApply", v)} />
      </div>
    </aside>
  );
}
