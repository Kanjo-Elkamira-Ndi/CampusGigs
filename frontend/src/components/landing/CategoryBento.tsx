import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Home,
  Laptop,
  Camera,
  CalendarCheck,
  Package,
  Cpu,
  ArrowRight,
  Star,
  Sparkles,
} from "lucide-react";

interface GradientConfig {
  from: string;
  via: string;
  to: string;
  accent: string;
  glow: string;
}

const GRADIENTS: Record<string, GradientConfig> = {
  academic: {
    from: "rgba(15, 139, 255, 0.12)",
    via: "rgba(15, 139, 255, 0.04)",
    to: "rgba(59, 130, 246, 0.02)",
    accent: "#0F8BFF",
    glow: "rgba(15, 139, 255, 0.3)",
  },
  household: {
    from: "rgba(16, 185, 129, 0.12)",
    via: "rgba(16, 185, 129, 0.04)",
    to: "rgba(5, 150, 105, 0.02)",
    accent: "#10B981",
    glow: "rgba(16, 185, 129, 0.3)",
  },
  digital: {
    from: "rgba(139, 92, 246, 0.12)",
    via: "rgba(139, 92, 246, 0.04)",
    to: "rgba(168, 85, 247, 0.02)",
    accent: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.3)",
  },
  photo: {
    from: "rgba(249, 115, 22, 0.12)",
    via: "rgba(249, 115, 22, 0.04)",
    to: "rgba(234, 88, 12, 0.02)",
    accent: "#F97316",
    glow: "rgba(249, 115, 22, 0.3)",
  },
  event: {
    from: "rgba(236, 72, 153, 0.12)",
    via: "rgba(236, 72, 153, 0.04)",
    to: "rgba(219, 39, 119, 0.02)",
    accent: "#EC4899",
    glow: "rgba(236, 72, 153, 0.3)",
  },
  delivery: {
    from: "rgba(20, 184, 166, 0.12)",
    via: "rgba(20, 184, 166, 0.04)",
    to: "rgba(13, 148, 136, 0.02)",
    accent: "#14B8A6",
    glow: "rgba(20, 184, 166, 0.3)",
  },
  tech: {
    from: "rgba(6, 182, 212, 0.12)",
    via: "rgba(6, 182, 212, 0.04)",
    to: "rgba(8, 145, 178, 0.02)",
    accent: "#06B6D4",
    glow: "rgba(6, 182, 212, 0.3)",
  },
};

function BentoCard({
  children,
  className = "",
  gradient,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  gradient: GradientConfig;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.via}, ${gradient.to})`,
        border: "1px solid var(--card-border)",
        boxShadow: `0 4px 24px rgba(0,0,0,0.12)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
        style={{
          boxShadow: `inset 0 0 0 1px ${gradient.glow}, 0 0 30px ${gradient.glow}`,
        }}
      />
      <div className="relative z-10 p-5 sm:p-6 lg:p-7 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-600"}
        />
      ))}
    </div>
  );
}

function FloatingTutorCard({
  name,
  skill,
  rating,
  index,
}: {
  name: string;
  skill: string;
  rating: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2"
      style={{
        backgroundColor: "var(--card-surface-sm)",
        border: "1px solid var(--card-chip-border)",
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
        style={{
          background: `linear-gradient(135deg, ${GRADIENTS.academic.accent}, ${GRADIENTS.academic.glow})`,
        }}
      >
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate" style={{ color: "var(--card-text)" }}>{name}</div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]" style={{ color: "var(--card-text-muted)" }}>{skill}</span>
        </div>
      </div>
      <StarRating rating={rating} />
    </motion.div>
  );
}

function SectionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12 sm:mb-16"
    >
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium mb-4"
        style={{
          border: "1px solid var(--card-border)",
          backgroundColor: "var(--card-surface-xs)",
          color: "var(--card-text-sub)",
        }}
      >
        <Sparkles size={12} />
        Browse by category
      </div>
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1]"
        style={{ color: "var(--foreground)" }}
      >
        Explore opportunities by category
      </h2>
      <p
        className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        From tutoring and household assistance to creative and technical work, discover verified student talent across a wide range of services.
      </p>
    </motion.div>
  );
}

function LargeAcademicCard() {
  const g = GRADIENTS.academic;
  return (
    <BentoCard
      className="md:col-span-7 md:row-span-2"
      gradient={g}
      delay={0.1}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "var(--card-surface)" }}
        >
          <GraduationCap size={24} style={{ color: g.accent }} />
        </div>
        <motion.div
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={18} style={{ color: g.accent, opacity: 0.5 }} />
        </motion.div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--card-text)" }}>Academic Support</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--card-text-sub)" }}>
        Connect with top-performing students across Cameroon for tutoring, exam prep, language coaching, and academic guidance.
      </p>

      <div className="mt-4 flex gap-5">
        <div>
          <div className="text-lg font-bold" style={{ color: "var(--card-text)" }}>1,200+</div>
          <div className="text-[11px]" style={{ color: "var(--card-text-muted)" }}>Active Tutors</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{ color: "var(--card-text)" }}>350+</div>
          <div className="text-[11px]" style={{ color: "var(--card-text-muted)" }}>Jobs Completed</div>
        </div>
        <div>
          <div className="text-lg font-bold" style={{ color: "var(--card-text)" }}>4.9</div>
          <div className="text-[11px]" style={{ color: "var(--card-text-muted)" }}>Avg Rating</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <FloatingTutorCard name="Sarah N." skill="Mathematics Tutor" rating={5} index={0} />
        <FloatingTutorCard name="Brian K." skill="Physics Tutor" rating={5} index={1} />
        <FloatingTutorCard name="Linda T." skill="English Tutor" rating={4} index={2} />
      </div>

      <Link
        to="/gigs?category=Tutoring"
        className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2"
        style={{ color: g.accent }}
      >
        Browse Tutors <ArrowRight size={14} />
      </Link>
    </BentoCard>
  );
}

function MediumHouseholdCard() {
  const g = GRADIENTS.household;
  const services = ["House Cleaning", "Laundry", "Painting", "Moving Assistance"];
  return (
    <BentoCard className="md:col-span-5 md:row-span-1" gradient={g} delay={0.15}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "var(--card-surface)" }}
        >
          <Home size={22} style={{ color: g.accent }} />
        </div>
      </div>

      <h3 className="text-lg font-bold" style={{ color: "var(--card-text)" }}>Household Services</h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--card-text-sub)" }}>
        Hire trusted students to help with everyday tasks around your home or dorm.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {services.map((s) => (
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
      </div>

      <div
        className="mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm"
        style={{ backgroundColor: "var(--card-surface-xs)" }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: g.accent }}
        />
        <span style={{ color: "var(--card-text-sub)" }}>500+ active student workers</span>
      </div>

      <Link
        to="/gigs?category=Errands"
        className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2"
        style={{ color: g.accent }}
      >
        Explore Services <ArrowRight size={14} />
      </Link>
    </BentoCard>
  );
}

function MediumDigitalCard() {
  const g = GRADIENTS.digital;
  const skills = ["Graphic Design", "Web Development", "Video Editing", "Social Media"];
  return (
    <BentoCard className="md:col-span-5 md:row-span-1" gradient={g} delay={0.2}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "var(--card-surface)" }}
        >
          <Laptop size={22} style={{ color: g.accent }} />
        </div>
      </div>

      <h3 className="text-lg font-bold" style={{ color: "var(--card-text)" }}>Digital & Creative</h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--card-text-sub)" }}>
        Find skilled students for design, development, content creation, and more.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-lg text-[12px] font-medium"
            style={{
              backgroundColor: "var(--card-surface-sm)",
              border: "1px solid var(--card-chip-border)",
              color: g.accent,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div
        className="mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm"
        style={{ backgroundColor: "var(--card-surface-xs)" }}
      >
        <Star size={13} className="fill-amber-400 text-amber-400" />
        <span style={{ color: "var(--card-text-sub)" }}>4.8 average rating across all skills</span>
      </div>

      <Link
        to="/freelancers"
        className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2"
        style={{ color: g.accent }}
      >
        View Talent <ArrowRight size={14} />
      </Link>
    </BentoCard>
  );
}

function SmallCard({
  icon: Icon,
  title,
  metric,
  gradient,
  linkTo,
  delay,
}: {
  icon: typeof GraduationCap;
  title: string;
  metric: string;
  gradient: GradientConfig;
  linkTo: string;
  delay: number;
}) {
  return (
    <BentoCard className="md:col-span-3" gradient={gradient} delay={delay}>
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: "var(--card-surface)" }}
        >
          <Icon size={20} style={{ color: gradient.accent }} />
        </div>
        <motion.div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight size={16} style={{ color: gradient.accent }} />
        </motion.div>
      </div>

      <h4 className="text-base font-bold" style={{ color: "var(--card-text)" }}>{title}</h4>
      <p className="mt-1 text-xs" style={{ color: "var(--card-text-muted)" }}>{metric}</p>

      <Link
        to={linkTo}
        className="mt-auto pt-3 text-xs font-medium transition-all inline-flex items-center gap-1 group-hover:gap-1.5"
        style={{ color: gradient.accent }}
      >
        Browse <ArrowRight size={11} />
      </Link>
    </BentoCard>
  );
}

export function CategoryBento() {
  const smallCards = [
    {
      icon: Camera,
      title: "Photography",
      metric: "180 Active Students",
      gradient: GRADIENTS.photo,
      linkTo: "/gigs?category=Photography",
    },
    {
      icon: CalendarCheck,
      title: "Event Assistance",
      metric: "300 Active Workers",
      gradient: GRADIENTS.event,
      linkTo: "/gigs?category=Events",
    },
    {
      icon: Package,
      title: "Delivery & Errands",
      metric: "240 Active Runners",
      gradient: GRADIENTS.delivery,
      linkTo: "/gigs?category=Delivery",
    },
    {
      icon: Cpu,
      title: "Tech Support",
      metric: "160 Active Specialists",
      gradient: GRADIENTS.tech,
      linkTo: "/gigs?category=Tech help",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <SectionHeader />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 auto-rows-[minmax(180px,auto)]">
        <LargeAcademicCard />
        <MediumHouseholdCard />
        <MediumDigitalCard />

        {smallCards.map((card, i) => (
          <SmallCard key={card.title} {...card} delay={0.25 + i * 0.08} />
        ))}
      </div>
    </section>
  );
}
