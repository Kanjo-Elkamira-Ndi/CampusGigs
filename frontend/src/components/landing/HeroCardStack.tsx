import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, BadgeCheck, GraduationCap, Briefcase } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { AuthPromptModal } from "@/components/shared/AuthPromptModal";
import { useAuthStore } from "@/store/authStore";

interface HeroCard {
  id: string;
  name: string;
  university: string;
  role: string;
  rating: number;
  jobs: string;
  jobsLabel: string;
  skills: string[];
}

const HERO_CARDS: HeroCard[] = [
  {
    id: "u1",
    name: "Kofi Asante",
    university: "University of Buea",
    role: "Mathematics Tutor",
    rating: 4.9,
    jobs: "38",
    jobsLabel: "Tutoring Sessions",
    skills: ["Mathematics", "Physics", "Exam Coaching"],
  },
  {
    id: "u2",
    name: "Ama Mensah",
    university: "University of Yaoundé I",
    role: "Web Developer",
    rating: 5.0,
    jobs: "22",
    jobsLabel: "Projects Completed",
    skills: ["React", "Node.js", "PostgreSQL"],
  },
  {
    id: "u5",
    name: "Sara Ndongo",
    university: "University of Dschang",
    role: "Event Assistant",
    rating: 4.8,
    jobs: "41",
    jobsLabel: "Events Completed",
    skills: ["Event Planning", "Coordination", "Customer Service"],
  },
  {
    id: "u6",
    name: "Paul Mbarga",
    university: "ENSP",
    role: "Graphic Designer",
    rating: 4.9,
    jobs: "67",
    jobsLabel: "Designs Delivered",
    skills: ["Figma", "Photoshop", "Brand Design"],
  },
  {
    id: "u8",
    name: "Lionel Tchoupo",
    university: "University of Bamenda",
    role: "Photographer",
    rating: 4.8,
    jobs: "53",
    jobsLabel: "Shoots Completed",
    skills: ["Photography", "Lightroom", "Event Covers"],
  },
];

const VISIBLE_COUNT = 4;

const POSITIONS = [
  { y: 0, scale: 1, opacity: 1, z: 10, blur: 0 },
  { y: 18, scale: 0.97, opacity: 0.85, z: 9, blur: 0.3 },
  { y: 36, scale: 0.94, opacity: 0.7, z: 8, blur: 0.6 },
  { y: 54, scale: 0.91, opacity: 0.5, z: 7, blur: 1 },
];

const EXIT_TARGET = { y: -60, scale: 0.92, opacity: 0, blur: 2 };
const ENTER_INITIAL = { y: 54, scale: 0.91, opacity: 0.5, blur: 1 };

const CARD_T = { duration: 0.5, ease: [0.32, 0.72, 0, 1] } as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-600"}
        />
      ))}
    </div>
  );
}

function HeroProfileCard({ card, index, total }: { card: HeroCard; index: number; total: number }) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const [authOpen, setAuthOpen] = useState(false);

  const requireAuth = useCallback(
    (to: string) => {
      if (currentUser) {
        navigate(to);
      } else {
        setAuthOpen(true);
      }
    },
    [currentUser, navigate],
  );

  return (
    <div
      className="w-full rounded-2xl overflow-hidden flex flex-col select-none"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--card-border)",
        boxShadow:
          index === 0
            ? "0 12px 48px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)"
            : "0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Gradient top bar */}
      <div
        className="h-1 shrink-0"
        style={{ background: "linear-gradient(90deg, #0F8BFF, #8B5CF6, #EC4899)" }}
      />

      <div className="p-4 sm:p-5 flex flex-col gap-3">
        {/* Row: Avatar + Name/Uni */}
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <Avatar id={card.id} name={card.name} size={44} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3
                className="text-base font-bold truncate"
                style={{ color: "var(--card-text)" }}
              >
                {card.name}
              </h3>
              <BadgeCheck size={14} style={{ color: "#0F8BFF" }} className="shrink-0" />
            </div>
            <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#0F8BFF" }}>
              {card.role}
            </p>
            <div
              className="flex items-center gap-1 mt-0.5 text-[11px] truncate"
              style={{ color: "var(--card-text-muted)" }}
            >
              <GraduationCap size={11} className="shrink-0" />
              <span className="truncate">{card.university}</span>
            </div>
          </div>
        </div>

        {/* Rating + Jobs */}
        <div
          className="rounded-xl px-3 py-2.5 flex items-center justify-between"
          style={{ backgroundColor: "var(--card-surface-xs)" }}
        >
          <div className="flex items-center gap-1.5">
            <StarRating rating={card.rating} />
            <span className="text-sm font-bold" style={{ color: "var(--card-text)" }}>
              {card.rating.toFixed(1)}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-[11px] font-medium"
            style={{ color: "var(--card-text-muted)" }}
          >
            <Briefcase size={11} />
            <span>
              {card.jobs} {card.jobsLabel}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div>
          <div
            className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: "var(--card-text-muted)" }}
          >
            Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {card.skills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-lg text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--card-surface-sm)",
                  border: "1px solid var(--card-chip-border)",
                  color: "var(--card-chip-text)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={() => requireAuth(`/profile/${card.id}`)}
            className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-95"
            style={{
              backgroundColor: "var(--card-surface-sm)",
              border: "1px solid var(--card-chip-border)",
              color: "var(--card-text)",
            }}
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => requireAuth(`/messages/new?user=${card.id}`)}
            className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "#0F8BFF" }}
          >
            Hire Now
          </button>
        </div>
      </div>
      <AuthPromptModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}

export function HeroCardStack() {
  const [front, setFront] = useState(0);
  const hovering = useRef(false);
  const N = HERO_CARDS.length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (hovering.current) return;
      setFront((p) => (p + 1) % N);
    }, 3000);
    return () => clearInterval(interval);
  }, [N]);

  const visible = [];
  for (let i = 0; i < VISIBLE_COUNT; i++) {
    visible.push(HERO_CARDS[(front + i) % N]);
  }

  return (
    <div
      className="relative w-full h-[480px] sm:h-[520px]"
      onMouseEnter={() => {
        hovering.current = true;
      }}
      onMouseLeave={() => {
        hovering.current = false;
      }}
    >
      <AnimatePresence mode="popLayout">
        {visible.map((card, i) => {
          const pos = POSITIONS[i];
          return (
            <motion.div
              key={card.id}
              layout
              initial={i === VISIBLE_COUNT - 1 ? ENTER_INITIAL : false}
              animate={{
                y: pos.y,
                scale: pos.scale,
                opacity: pos.opacity,
                filter: `blur(${pos.blur}px)`,
              }}
              exit={{
                y: EXIT_TARGET.y,
                scale: EXIT_TARGET.scale,
                opacity: EXIT_TARGET.opacity,
                filter: `blur(${EXIT_TARGET.blur}px)`,
              }}
              transition={CARD_T}
              className="absolute left-1/2 w-[280px] sm:w-[320px] -translate-x-1/2 origin-top"
              style={{
                zIndex: pos.z,
                pointerEvents: i === 0 ? "auto" : "none",
              }}
            >
              <HeroProfileCard card={card} index={i} total={VISIBLE_COUNT} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* bottom fade hint */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--hero-bg) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
