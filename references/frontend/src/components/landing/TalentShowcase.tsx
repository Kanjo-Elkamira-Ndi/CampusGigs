import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { PublicUser } from "@/types";
import { Avatar } from "@/components/shared/Avatar";

const RESPONSE_TIMES = [
  "under 1 hour",
  "under 2 hours",
  "under 30 minutes",
  "under 3 hours",
  "under 1 hour",
  "under 2 hours",
];

const HIRED_COUNTS = [38, 24, 31, 17, 22, 19];

const ROLES = [
  "Mathematics Tutor",
  "Web Developer",
  "Event Assistant",
  "Graphic Designer",
  "Home Tutor",
  "Photographer",
];

const EXTRA_SKILLS: Record<string, string[]> = {
  u1: ["Mathematics", "Physics", "Exam Coaching"],
  u2: ["React", "TypeScript", "UI/UX"],
  u5: ["Event Planning", "Crowd Management", "Logistics"],
  u6: ["Adobe Suite", "Branding", "Illustration"],
  u8: ["English", "Mathematics", "Science"],
  u0: ["Portrait", "Event Photography", "Lightroom"],
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-600"}
        />
      ))}
    </div>
  );
}

function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            Meet Talented Students Ready to Work
          </h2>
        </div>
        <p className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          Hire verified university students with skills in academics, household services, events, technology, and creative work.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StarRating rating={5} />
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>4.9</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Average Rating</span>
      </div>
    </motion.div>
  );
}

function TalentCard({
  user,
  index,
  isCenter,
  onHire,
}: {
  user: PublicUser;
  index: number;
  isCenter: boolean;
  onHire: () => void;
}) {
  const role = ROLES[index % ROLES.length];
  const hired = HIRED_COUNTS[index % HIRED_COUNTS.length];
  const responseTime = RESPONSE_TIMES[index % RESPONSE_TIMES.length];
  const skills = EXTRA_SKILLS[user.id] ?? user.skills;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--card-border)",
        boxShadow: isCenter
          ? "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Top gradient bar */}
      <div
        className="h-1.5 shrink-0"
        style={{
          background: `linear-gradient(90deg, #0F8BFF, #8B5CF6, #EC4899)`,
        }}
      />

      <div className="p-5 sm:p-6 lg:p-7 flex flex-col flex-1">
        {/* Avatar + Name + University */}
        <div className="flex items-start gap-4">
          <motion.div
            whileHover={isCenter ? { scale: 1.05 } : undefined}
            transition={{ duration: 0.2 }}
          >
            <Avatar id={user.id} name={user.fullName} size={56} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3
                className="text-lg font-bold truncate"
                style={{ color: "var(--card-text)" }}
              >
                {user.fullName}
              </h3>
              <BadgeCheck size={15} style={{ color: "#0F8BFF" }} />
            </div>
            <div className="text-sm font-medium mt-0.5" style={{ color: "#0F8BFF" }}>
              {role}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: "var(--card-text-muted)" }}>
              <GraduationCap size={12} />
              <span className="truncate">{user.universityName}</span>
            </div>
          </div>
        </div>

        {/* Rating + Stats row */}
        <div
          className="mt-4 rounded-xl p-3 flex items-center justify-between"
          style={{ backgroundColor: "var(--card-surface-xs)" }}
        >
          <div className="flex items-center gap-1.5">
            <StarRating rating={user.avgRating} />
            <span className="text-sm font-bold" style={{ color: "var(--card-text)" }}>
              {user.avgRating.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--card-text-muted)" }}>
            <span className="flex items-center gap-1">
              <Briefcase size={12} /> {hired} jobs
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {responseTime}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--card-text-muted)" }}>
            Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg text-[12px] font-medium"
                style={{
                  backgroundColor: "var(--card-surface-sm)",
                  border: "1px solid var(--card-chip-border)",
                  color: "var(--card-chip-text)",
                }}
              >
                {s}
              </span>
            ))}
            {skills.length > 3 && (
              <span
                className="px-2.5 py-1 rounded-lg text-[12px] font-medium"
                style={{
                  backgroundColor: "var(--card-surface-sm)",
                  border: "1px solid var(--card-chip-border)",
                  color: "var(--card-chip-text)",
                }}
              >
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-auto pt-5 flex gap-2.5">
          <Link
            to={"/profile/" + user.id}
            className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: "var(--card-surface-sm)",
              border: "1px solid var(--card-chip-border)",
              color: "var(--card-text)",
            }}
          >
            View Profile
          </Link>
          <Link
            to={`/messages/new?user=${user.id}`}
            onClick={onHire}
            className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "#0F8BFF" }}
          >
            Hire Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Dots({ total, current, onDot }: { total: number; current: number; onDot: (i: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot(i)}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            backgroundColor: i === current ? "#0F8BFF" : "var(--card-chip-border)",
          }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

function StatsBar() {
  const stats = [
    { value: "500+", label: "Verified Students" },
    { value: "1,000+", label: "Completed Gigs" },
    { value: "4.9", label: "Average Rating" },
    { value: "20+", label: "Universities" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.3 + i * 0.08 }}
          className="rounded-xl px-4 py-3.5 text-center"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <div className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            {s.value}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function TalentShowcase({ talents }: { talents: PublicUser[] }) {
  const [current, setCurrent] = useState(0);
  const total = talents.length;
  if (!total) return null;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const getVisible = () => {
    const items: { user: PublicUser; position: "center" | "side" | "far"; index: number }[] = [];
    for (let offset = -2; offset <= 2; offset++) {
      const idx = (current + offset + total) % total;
      if (offset === 0) items.push({ user: talents[idx], position: "center", index: idx });
      else if (Math.abs(offset) === 1) items.push({ user: talents[idx], position: "side", index: idx });
      else items.push({ user: talents[idx], position: "far", index: idx });
    }
    return items;
  };

  const visible = getVisible();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 overflow-hidden">
      <SectionHeader />

      {/* Desktop Carousel */}
      <div className="hidden md:flex items-center justify-center gap-0 relative h-[520px]">
        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-0 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--card-border)",
            color: "var(--foreground)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-0 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--card-border)",
            color: "var(--foreground)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>

        <div className="flex items-center justify-center w-full max-w-[900px] h-full relative">
          {visible.map((item, i) => {
            const isCenter = item.position === "center";
            const isSide = item.position === "side";
            const zIndex = isCenter ? 10 : isSide ? 5 : 1;
            const scale = isCenter ? 1 : isSide ? 0.85 : 0.7;
            const xOffset = isCenter ? 0 : isSide ? (i < 2 ? -240 : 240) : (i < 2 ? -380 : 380);
            const opacity = isCenter ? 1 : isSide ? 0.6 : 0;

            return (
              <motion.div
                key={item.user.id + "-" + current}
                initial={{ opacity: 0, x: xOffset > 0 ? 60 : -60, scale }}
                animate={{ opacity, x: xOffset, scale }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ zIndex, width: isCenter ? 380 : isSide ? 300 : 260, pointerEvents: isCenter ? "auto" : "none" }}
              >
                <TalentCard
                  user={item.user}
                  index={item.index}
                  isCenter={isCenter}
                  onHire={next}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            <TalentCard
              user={talents[current]}
              index={current}
              isCenter
              onHire={next}
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "var(--card-surface-sm)",
              border: "1px solid var(--card-chip-border)",
              color: "var(--card-text)",
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <Dots total={total} current={current} onDot={setCurrent} />
          <button
            onClick={next}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "var(--card-surface-sm)",
              border: "1px solid var(--card-chip-border)",
              color: "var(--card-text)",
            }}
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Desktop dots */}
      <div className="hidden md:flex">
        <Dots total={total} current={current} onDot={setCurrent} />
      </div>

      <StatsBar />
    </section>
  );
}
