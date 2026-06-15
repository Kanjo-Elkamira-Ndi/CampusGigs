import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { CAMEROON_UNIVERSITIES } from "@/lib/constants";

/* ── types ── */

export interface TalentFilters {
  search: string;
  categories: string[];
  cities: string[];
  universityIds: string[];
  minRating: number;
  availability: string[];
  minRate: number;
  maxRate: number;
  remoteOnly: boolean;
  verifiedOnly: boolean;
  experienceLevels: string[];
}

export const DEFAULT_FILTERS: TalentFilters = {
  search: "",
  categories: [],
  cities: [],
  universityIds: [],
  minRating: 0,
  availability: [],
  minRate: 0,
  maxRate: 20000,
  remoteOnly: false,
  verifiedOnly: false,
  experienceLevels: [],
};

interface Props {
  filters: TalentFilters;
  onChange: (filters: TalentFilters) => void;
  allCities: string[];
  className?: string;
}

/* ── collapsible group ── */

function FilterGroup({
  label,
  defaultOpen = true,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: "var(--card-border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-left transition-colors hover:opacity-80"
        style={{ color: "var(--foreground)" }}
      >
        {label}
        <motion.div
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={label}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-1.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── checkbox row ── */

function CheckRow({
  checked,
  label,
  count,
  onChange,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2 w-full text-left py-1 group"
    >
      <span
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors border"
        style={{
          backgroundColor: checked ? "var(--brand)" : "transparent",
          borderColor: checked ? "var(--brand)" : "var(--card-border)",
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-sm flex-1" style={{ color: "var(--foreground)" }}>
        {label}
      </span>
      {count != null && (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ─── toggle row ── */

function ToggleRow({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="flex items-center justify-between w-full py-1.5 group"
    >
      <span className="text-sm" style={{ color: "var(--foreground)" }}>
        {label}
      </span>
      <span
        className="relative inline-block w-9 h-5 rounded-full transition-colors duration-200"
        style={{
          backgroundColor: active ? "var(--brand)" : "var(--card-border)",
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
          style={{ transform: active ? "translateX(16px)" : "translateX(0)" }}
        />
      </span>
    </button>
  );
}

/* ── rating stars selector ── */

function RatingSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      {[4, 3, 2, 1].map((min) => (
        <CheckRow
          key={min}
          checked={value === min}
          label={`${min}+ stars`}
          onChange={() => onChange(value === min ? 0 : min)}
        />
      ))}
    </div>
  );
}

/* ── main component ── */

export function FilterSidebar({ filters, onChange, allCities, className = "" }: Props) {
  const set = (patch: Partial<TalentFilters>) => onChange({ ...filters, ...patch });

  /* available cities for the filter (Yaoundé, Douala, Buea, etc.) */
  const cities = [...new Set(allCities)].sort();

  /* universities grouped by type */
  const publicUnis = CAMEROON_UNIVERSITIES.filter((u) => u.type === "public");
  const privateUnis = CAMEROON_UNIVERSITIES.filter((u) => u.type === "private");

  return (
    <aside className={`w-full ${className}`}>
      {/* header */}
      <div className="flex items-center gap-2 pb-4 mb-1">
        <SlidersHorizontal size={15} style={{ color: "var(--text-secondary)" }} />
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Filters
        </span>
      </div>

      {/* category */}
      <FilterGroup label="Category">
        {[
          "Tutoring",
          "Creative",
          "Tech help",
          "Events",
          "Delivery",
          "Photography",
          "Errands",
          "Translation",
        ].map((cat) => (
          <CheckRow
            key={cat}
            checked={filters.categories.includes(cat)}
            label={cat}
            onChange={() =>
              set({
                categories: filters.categories.includes(cat)
                  ? filters.categories.filter((c) => c !== cat)
                  : [...filters.categories, cat],
              })
            }
          />
        ))}
      </FilterGroup>

      {/* location */}
      <FilterGroup label="Location">
        {cities.map((city) => (
          <CheckRow
            key={city}
            checked={filters.cities.includes(city)}
            label={city}
            onChange={() =>
              set({
                cities: filters.cities.includes(city)
                  ? filters.cities.filter((c) => c !== city)
                  : [...filters.cities, city],
              })
            }
          />
        ))}
        {cities.length === 0 && (
          <p className="text-xs py-1" style={{ color: "var(--text-muted)" }}>No cities available</p>
        )}
      </FilterGroup>

      {/* university */}
      <FilterGroup label="University">
        <p className="text-[11px] font-medium mb-1 mt-1 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Public
        </p>
        {publicUnis.map((u) => (
          <CheckRow
            key={u.id}
            checked={filters.universityIds.includes(u.id)}
            label={u.name}
            onChange={() =>
              set({
                universityIds: filters.universityIds.includes(u.id)
                  ? filters.universityIds.filter((id) => id !== u.id)
                  : [...filters.universityIds, u.id],
              })
            }
          />
        ))}
        <p className="text-[11px] font-medium mb-1 mt-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Private
        </p>
        {privateUnis.map((u) => (
          <CheckRow
            key={u.id}
            checked={filters.universityIds.includes(u.id)}
            label={u.name}
            onChange={() =>
              set({
                universityIds: filters.universityIds.includes(u.id)
                  ? filters.universityIds.filter((id) => id !== u.id)
                  : [...filters.universityIds, u.id],
              })
            }
          />
        ))}
      </FilterGroup>

      {/* rating */}
      <FilterGroup label="Rating" defaultOpen={false}>
        <RatingSelector
          value={filters.minRating}
          onChange={(v) => set({ minRating: v })}
        />
      </FilterGroup>

      {/* availability */}
      <FilterGroup label="Availability" defaultOpen={false}>
        {["Immediately", "This Week", "Next Week", "Flexible"].map((a) => (
          <CheckRow
            key={a}
            checked={filters.availability.includes(a)}
            label={a === "Immediately" ? "Available Now" : a === "This Week" ? "Available This Week" : a === "Next Week" ? "Available Next Week" : "Flexible"}
            onChange={() =>
              set({
                availability: filters.availability.includes(a)
                  ? filters.availability.filter((x) => x !== a)
                  : [...filters.availability, a],
              })
            }
          />
        ))}
      </FilterGroup>

      {/* hourly rate */}
      <FilterGroup label="Hourly Rate" defaultOpen={false}>
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.minRate}
              onChange={(e) => set({ minRate: +e.target.value })}
              placeholder="Min"
              className="w-full h-8 rounded-lg border px-2 text-xs bg-transparent outline-none"
              style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>to</span>
            <input
              type="number"
              value={filters.maxRate}
              onChange={(e) => set({ maxRate: +e.target.value })}
              placeholder="Max"
              className="w-full h-8 rounded-lg border px-2 text-xs bg-transparent outline-none"
              style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
            />
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {filters.minRate.toLocaleString()} – {filters.maxRate.toLocaleString()} FCFA/hr
          </p>
        </div>
      </FilterGroup>

      {/* remote / on-site */}
      <FilterGroup label="Work Mode" defaultOpen={false}>
        <ToggleRow
          label="Remote Only"
          active={filters.remoteOnly}
          onChange={() => set({ remoteOnly: !filters.remoteOnly })}
        />
      </FilterGroup>

      {/* verified */}
      <FilterGroup label="Verification" defaultOpen={false}>
        <ToggleRow
          label="Verified Students Only"
          active={filters.verifiedOnly}
          onChange={() => set({ verifiedOnly: !filters.verifiedOnly })}
        />
      </FilterGroup>

      {/* experience */}
      <FilterGroup label="Experience Level" defaultOpen={false}>
        {(["Entry", "Intermediate", "Expert"] as const).map((level) => (
          <CheckRow
            key={level}
            checked={filters.experienceLevels.includes(level)}
            label={level}
            onChange={() =>
              set({
                experienceLevels: filters.experienceLevels.includes(level)
                  ? filters.experienceLevels.filter((l) => l !== level)
                  : [...filters.experienceLevels, level],
              })
            }
          />
        ))}
      </FilterGroup>
    </aside>
  );
}
