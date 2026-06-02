// src/components/auth/AuthSplitPanel.tsx
import { motion } from "framer-motion";

const ORBS = [
  { size: 340, x: "10%", y: "15%", color: "#6d28d9", delay: 0 },
  { size: 260, x: "55%", y: "55%", color: "#0ea5e9", delay: 1.2 },
  { size: 200, x: "20%", y: "65%", color: "#7c3aed", delay: 2.1 },
  { size: 180, x: "65%", y: "10%", color: "#38bdf8", delay: 0.7 },
];

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 12 + 10,
  delay: Math.random() * 8,
}));

const GRID_LINES = Array.from({ length: 10 }, (_, i) => i);

interface AuthSplitPanelProps {
  headline?: string;
  subtext?: string;
}

export function AuthSplitPanel({
  headline = "Campus Gigs",
  subtext = "Find freelance work, hire student talent, and grow your campus career.",
}: AuthSplitPanelProps) {
  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full overflow-hidden bg-[#0a0412] px-12 py-14">
      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        {GRID_LINES.map((i) => (
          <g key={i}>
            <line
              x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%"
              stroke="white" strokeWidth="0.5"
            />
            <line
              x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`}
              stroke="white" strokeWidth="0.5"
            />
          </g>
        ))}
      </svg>

      {/* Animated blobs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[80px] opacity-30 pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: p.x, bottom: "-10px", width: p.size, height: p.size }}
          animate={{ y: [0, -900], opacity: [0, 0.6, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Ring accent */}
      <motion.div
        className="absolute right-[-80px] top-[30%] w-[320px] h-[320px] rounded-full border border-violet-500/20 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      <motion.div
        className="absolute right-[-120px] top-[28%] w-[420px] h-[420px] rounded-full border border-sky-500/10 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Logo / Brand */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="white" fillOpacity="0.9" />
          </svg>
        </div>
        <span className="text-white font-semibold tracking-tight">Campus Gigs</span>
      </motion.div>

      {/* Center text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative z-10"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300/70 mb-3 font-medium">
          Student Platform
        </p>
        <h2 className="text-4xl font-bold text-white leading-[1.15] mb-4">
          {headline}
        </h2>
        <p className="text-sm text-white/50 leading-relaxed max-w-xs">
          {subtext}
        </p>

        {/* Stats row */}
        <div className="flex gap-6 mt-8">
          {[["1.2k+", "Students"], ["340+", "Gigs posted"], ["98%", "Satisfaction"]].map(([val, label]) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-xl font-bold text-white">{val}</p>
              <p className="text-[11px] text-white/40 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 text-[11px] text-white/25"
      >
        © {new Date().getFullYear()} Campus Gigs · Yaoundé, Cameroon
      </motion.p>
    </div>
  );
}