import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Compass,
  User,
  MessageCircle,
  Briefcase,
  Star,
  ArrowRight,
  GraduationCap,
  BadgeCheck,
  Clock,
  CheckCircle2,
  Zap,
  Sparkles,
} from "lucide-react";

/* ── step data ── */

const STEPS = [
  {
    title: "Discover Opportunities",
    icon: Compass,
    description:
      "Browse hundreds of gigs from students, families, businesses, and local communities across Cameroon.",
    side: "left" as const,
    color: "#0F8BFF",
    preview: <Step1Preview />,
  },
  {
    title: "Create Your Profile",
    icon: User,
    description:
      "Build a professional profile showcasing your skills, university, experience, ratings, and completed work.",
    side: "right" as const,
    color: "#8B5CF6",
    preview: <Step2Preview />,
  },
  {
    title: "Apply & Connect",
    icon: MessageCircle,
    description:
      "Submit applications, chat with clients, and discuss project requirements before getting hired.",
    side: "left" as const,
    color: "#EC4899",
    preview: <Step3Preview />,
  },
  {
    title: "Complete the Work",
    icon: Briefcase,
    description:
      "Deliver high-quality work, whether it's tutoring, cleaning, event assistance, design, development, or household support.",
    side: "right" as const,
    color: "#F59E0B",
    preview: <Step4Preview />,
  },
  {
    title: "Earn & Build Your Reputation",
    icon: Star,
    description:
      "Receive payments, earn reviews, grow your rating, and unlock more opportunities.",
    side: "left" as const,
    color: "#10B981",
    preview: <Step5Preview />,
  },
];

/* ── visual previews ── */

function Step1Preview() {
  const gigs = [
    { t: "Math Tutor Needed", color: "#0F8BFF" },
    { t: "Logo Designer Wanted", color: "#8B5CF6" },
    { t: "House Cleaner Needed", color: "#EC4899" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {gigs.map((g, i) => (
        <motion.div
          key={g.t}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium"
          style={{
            backgroundColor: `${g.color}12`,
            border: `1px solid ${g.color}30`,
            color: g.color,
          }}
        >
          <Zap size={11} />
          {g.t}
        </motion.div>
      ))}
    </div>
  );
}

function Step2Preview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-xl p-3 flex items-center gap-3"
      style={{
        backgroundColor: "var(--card-surface-sm)",
        border: "1px solid var(--card-chip-border)",
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ backgroundColor: "#8B5CF620", color: "#8B5CF6" }}
      >
        JD
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--card-text)" }}>
          John Doe
          <BadgeCheck size={11} style={{ color: "#0F8BFF" }} />
        </div>
        <div className="text-[10px]" style={{ color: "var(--card-text-muted)" }}>University of Yaoundé I</div>
        <div className="flex gap-1 mt-1">
          {["Tutoring", "Math", "Physics"].map((s) => (
            <span
              key={s}
              className="px-1.5 py-0.5 rounded text-[9px] font-medium"
              style={{
                backgroundColor: "#8B5CF615",
                color: "#8B5CF6",
                border: "1px solid #8B5CF625",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Step3Preview() {
  const msgs = [
    { t: "Hi, are you available next week?", me: false },
    { t: "Yes, I'm free on Tuesday!", me: true },
    { t: "Hired! Start on Monday.", me: false },
  ];
  return (
    <div className="space-y-1.5">
      {msgs.map((m, i) => (
        <motion.div
          key={m.t}
          initial={{ opacity: 0, x: m.me ? 8 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className={`flex ${m.me ? "justify-end" : "justify-start"}`}
        >
          <div
            className="px-2.5 py-1.5 rounded-xl text-[10px] leading-relaxed max-w-[75%]"
            style={{
              backgroundColor: m.me ? "#EC489920" : "var(--card-surface-sm)",
              border: "1px solid var(--card-chip-border)",
              color: "var(--card-text)",
            }}
          >
            {m.t}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Step4Preview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-xl p-3"
      style={{
        backgroundColor: "var(--card-surface-sm)",
        border: "1px solid var(--card-chip-border)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold" style={{ color: "var(--card-text)" }}>
          Tutoring Assignment
        </span>
        <span className="text-[10px] flex items-center gap-1" style={{ color: "#10B981" }}>
          <Clock size={10} /> 3 days left
        </span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        {["Research", "Lesson Plan", "Materials", "Final Session"].map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-0.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: i < 3 ? "#10B981" : "var(--card-chip-border)",
              }}
            >
              {i < 3 ? (
                <CheckCircle2 size={12} className="text-white" />
              ) : (
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--card-text-muted)" }} />
              )}
            </div>
            <span className="text-[7px]" style={{ color: "var(--card-text-muted)" }}>
              {s.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--card-chip-border)" }}
      >
        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: "75%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: "#10B981" }}
        />
      </div>
    </motion.div>
  );
}

function Step5Preview() {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
        style={{
          backgroundColor: "#F59B0B15",
          border: "1px solid #F59B0B30",
        }}
      >
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={10} className={i < 5 ? "fill-amber-400 text-amber-400" : "text-gray-500"} />
          ))}
        </div>
        <span className="text-[11px] font-bold" style={{ color: "#F59E0B" }}>4.9</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
        style={{
          backgroundColor: "#10B98115",
          border: "1px solid #10B98130",
        }}
      >
        <span className="text-[11px] font-bold" style={{ color: "#10B981" }}>XAF 85,000</span>
        <span className="text-[9px]" style={{ color: "var(--card-text-muted)" }}>earned</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.19 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
        style={{
          backgroundColor: "#0F8BFF15",
          border: "1px solid #0F8BFF30",
        }}
      >
        <Briefcase size={11} style={{ color: "#0F8BFF" }} />
        <span className="text-[11px] font-bold" style={{ color: "#0F8BFF" }}>12</span>
        <span className="text-[9px]" style={{ color: "var(--card-text-muted)" }}>jobs done</span>
      </motion.div>
    </div>
  );
}

/* ── floating decor ── */

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #0F8BFF, transparent)", top: "10%", left: "-5%" }}
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #8B5CF6, transparent)", bottom: "20%", right: "-10%" }}
        animate={{ y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #EC4899, transparent)", top: "50%", left: "50%" }}
        animate={{ y: [0, 15, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}

/* ── main component ── */

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ backgroundColor: "var(--section-bg)" }}
    >
      <FloatingOrbs />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-4"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--card-border)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <Sparkles size={12} /> Your Journey Starts Here
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            How Campus Gigs Works
          </h2>
          <p
            className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Whether you're looking to earn money as a student or hire trusted local talent, Campus Gigs makes
            the entire process simple and transparent.
          </p>
        </motion.div>

        {/* ── TIMELINE ── */}
        <div className="relative">
          {/* central line track */}
          <div
            className="absolute left-[22px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 rounded-full"
            style={{ backgroundColor: "var(--card-chip-border)" }}
          >
            {/* fill */}
            <motion.div
              className="w-full origin-top rounded-full"
              style={{
                scaleY: lineScale,
                background: "linear-gradient(180deg, #0F8BFF, #8B5CF6, #EC4899, #F59E0B, #10B981)",
              }}
            />
          </div>

          {/* steps */}
          <div className="space-y-16 sm:space-y-20">
            {STEPS.map((step, i) => (
              <StepRow key={step.title} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <BottomCTA />
      </div>
    </section>
  );
}

/* ── step row ── */

function StepRow({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const Icon = step.icon;

  const slideX = step.side === "left" ? -40 : 40;

  return (
    <div
      className={`flex flex-col md:flex-row items-start gap-6 md:gap-0 pl-12 md:pl-0 ${
        step.side === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* card */}
      <motion.div
        initial={{ opacity: 0, x: slideX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="w-full md:w-[calc(50%-32px)]"
      >
        <div
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden relative"
          style={{
            backdropFilter: "blur(20px)",
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          }}
        >
          {/* subtle gradient accent */}
          <div
            className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
            style={{ backgroundColor: step.color }}
          />

          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${step.color}15`,
                color: step.color,
              }}
            >
              <Icon size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-bold leading-tight"
                  style={{ color: "var(--foreground)" }}
                >
                  {step.title}
                </span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: `${step.color}15`,
                    color: step.color,
                  }}
                >
                  Step {index + 1}
                </span>
              </div>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {step.description}
              </p>
            </div>
          </div>

          {/* visual preview */}
          <div
            className="rounded-xl p-3 sm:p-4"
            style={{
              backgroundColor: "var(--card-surface-xs)",
            }}
          >
            {step.preview}
          </div>
        </div>
      </motion.div>

      {/* timeline node (desktop) */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="hidden shrink-0 md:flex items-center justify-center w-12"
        style={{ marginTop: "22px" }}
      >
        <div className="relative">
          <div
            className="w-[14px] h-[14px] rounded-full border-2 relative z-10"
            style={{
              backgroundColor: "var(--section-bg)",
              borderColor: step.color,
              boxShadow: `0 0 0 4px ${step.color}15`,
            }}
          />
          <motion.div
            className="absolute inset-[-6px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${step.color}30, transparent)`,
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* empty spacer for the other side (desktop) */}
      <div className="hidden md:block md:w-[calc(50%-32px)]" />
    </div>
  );
}

/* ── bottom cta ── */

function BottomCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="text-center mt-20 sm:mt-24 pt-12 sm:pt-16"
      style={{
        borderTop: "1px solid var(--card-border)",
      }}
    >
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl sm:text-3xl font-bold"
        style={{ color: "var(--foreground)" }}
      >
        Ready to start your journey?
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-3 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Join hundreds of students and employers already on Campus Gigs.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 flex flex-wrap gap-3 justify-center"
      >
        <Link
          to="/gigs"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.02]"
          style={{ backgroundColor: "#0F8BFF" }}
        >
          Find Work <ArrowRight size={16} />
        </Link>
        <Link
          to="/gigs/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all hover:scale-[1.02]"
          style={{
            color: "var(--foreground)",
            border: "1px solid var(--card-border)",
            backgroundColor: "var(--card-bg)",
          }}
        >
          <GraduationCap size={16} /> Hire Talent
        </Link>
      </motion.div>
    </motion.div>
  );
}
