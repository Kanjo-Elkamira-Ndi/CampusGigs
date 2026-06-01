import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap,
  Wrench,
  Palette,
  Camera,
  PartyPopper,
  Bike,
  Monitor,
  ChevronRight,
} from "lucide-react";

interface NavCategory {
  id: string;
  label: string;
  icon: typeof GraduationCap;
  color: string;
  bg: string;
  count: number;
  preview: string;
}

const NAV_CATEGORIES: NavCategory[] = [
  { id: "Tutoring", label: "Academic Support", icon: GraduationCap, color: "#10B981", bg: "#10B98110", count: 4, preview: "Math, Science, Languages & more" },
  { id: "Errands", label: "Household Services", icon: Wrench, color: "#F59E0B", bg: "#F59E0B10", count: 2, preview: "Cleaning, Moving, Repairs" },
  { id: "Creative", label: "Digital & Creative", icon: Palette, color: "#EC4899", bg: "#EC489910", count: 3, preview: "Design, Video, Content" },
  { id: "Photography", label: "Photography", icon: Camera, color: "#8B5CF6", bg: "#8B5CF610", count: 2, preview: "Events, Portraits, Graduation" },
  { id: "Events", label: "Events", icon: PartyPopper, color: "#0F8BFF", bg: "#0F8BFF10", count: 3, preview: "Setup, MC, Sound & more" },
  { id: "Delivery", label: "Delivery", icon: Bike, color: "#EF4444", bg: "#EF444410", count: 2, preview: "Documents, Packages, Food" },
  { id: "Tech help", label: "Tech Support", icon: Monitor, color: "#6366F1", bg: "#6366F110", count: 2, preview: "Repairs, Setup, Troubleshooting" },
];

export function CategoryNavigation({ onSelect }: { onSelect: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });

  const showRightArrow = useTransform(scrollXProgress, [0.9, 0.95], [1, 0]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth"
      >
        {NAV_CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(cat.id)}
            className="snap-start shrink-0 w-[180px] sm:w-[200px] rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left transition-shadow duration-200"
            style={{
              backgroundColor: cat.bg,
              border: `1px solid ${cat.color}20`,
            }}
          >
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
            >
              <cat.icon size={18} />
            </div>
            <h4 className="text-sm font-bold leading-snug" style={{ color: "var(--foreground)" }}>
              {cat.label}
            </h4>
            <p className="text-[11px] mt-1 font-medium" style={{ color: cat.color }}>
              {cat.count} active gigs
            </p>
            <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {cat.preview}
            </p>
          </motion.button>
        ))}
      </div>

      {/* right arrow hint */}
      <motion.div
        style={{ opacity: showRightArrow, backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center pointer-events-none"
      >
        <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
      </motion.div>
    </div>
  );
}
