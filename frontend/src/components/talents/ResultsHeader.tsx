import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "relevant", label: "Most Relevant" },
  { value: "rating", label: "Highest Rated" },
  { value: "hired", label: "Most Jobs Completed" },
  { value: "newest", label: "Newest" },
  { value: "rate-asc", label: "Lowest Rate" },
  { value: "rate-desc", label: "Highest Rate" },
] as const;

interface Props {
  totalCount: number;
  page: number;
  perPage: number;
  sort: string;
  onSortChange: (sort: string) => void;
}

export function ResultsHeader({ totalCount, page, perPage, sort, onSortChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const start = totalCount === 0 ? 0 : (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalCount);
  const currentLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Most Relevant";

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-1">
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Showing{" "}
        <span className="font-semibold" style={{ color: "var(--foreground)" }}>
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold" style={{ color: "var(--foreground)" }}>
          {totalCount.toLocaleString()}
        </span>{" "}
        Students
      </p>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-80"
          style={{ color: "var(--foreground)" }}
        >
          Sort: {currentLabel}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} />
          </motion.span>
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-1.5 min-w-[200px] rounded-xl border shadow-lg z-50 overflow-hidden"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--card-border)",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSortChange(opt.value);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                style={{
                  color: sort === opt.value ? "var(--brand)" : "var(--foreground)",
                  backgroundColor: sort === opt.value ? "color-mix(in srgb, var(--brand) 8%, transparent)" : "transparent",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
