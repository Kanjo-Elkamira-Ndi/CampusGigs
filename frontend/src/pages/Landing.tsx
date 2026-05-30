import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, GraduationCap, CheckCircle } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GigListRow } from "@/components/gigs/GigListRow";
import { FreelancerCard } from "@/components/freelancers/FreelancerCard";
import { CATEGORY_META } from "@/lib/constants";
import { mockGigs, mockUsers } from "@/lib/mockData";
import { Avatar } from "@/components/shared/Avatar";
import { RotatingWords } from "@/components/landing/RotatingWords";
import { SearchWidget } from "@/components/landing/SearchWidget";
import { FloatingExpertCards } from "@/components/landing/FloatingExpertCards";
import { TrustBar } from "@/components/landing/TrustBar";
import { ExpertiseSection } from "@/components/landing/ExpertiseSection";

const HOW_WORKER = [
  { n: 1, t: "Create your free profile", d: "Add your university, skills and a few past gigs." },
  { n: 2, t: "Apply to gigs you like", d: "One tap with Easy Apply. Get hired fast." },
  { n: 3, t: "Get paid on completion", d: "Build a rating, earn more, repeat." },
];
const HOW_POSTER = [
  { n: 1, t: "Post your gig in 60 seconds", d: "Title, budget, deadline. Done." },
  { n: 2, t: "Review applicants", d: "See ratings, university and reviews at a glance." },
  { n: 3, t: "Hire and finish the job", d: "Pay only when you're happy with the work." },
];

export function Landing() {
  const [mode, setMode] = useState<"worker" | "poster">("worker");
  const featured = mockUsers.filter((u) => u.role === "WORKER").slice(0, 4);
  const latest = mockGigs.slice(0, 3);
  const browseTalent = mockUsers.filter((u) => u.role === "WORKER").slice(0, 4);
  const categories = Object.entries(CATEGORY_META).slice(0, 9);
  const catCount = (cat: string) => mockGigs.filter((g) => g.category === cat).length;

  return (
    <PageWrapper>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden -mt-16" style={{ minHeight: "calc(90vh + 4rem)", backgroundColor: "#00152E" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16" style={{ minHeight: "calc(90vh + 4rem)" }}>
          <div className="grid lg:grid-cols-2 gap-20 items-center" style={{ minHeight: "90vh" }}>
            {/* Left column */}
            <div className="pt-24 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-6"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    borderColor: "rgba(255,255,255,0.12)",
                    backgroundColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <GraduationCap size={13} /> Trusted by students across Cameroon
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white"
              >
                Hire trusted student<br />
                <RotatingWords />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)", maxWidth: "28rem" }}
              >
                Connect with verified university students ready to help with tutoring, household tasks, events, creative projects and technical work.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 max-w-lg"
              >
                <SearchWidget />
              </motion.div>
            </div>

            {/* Right column — floating cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="hidden lg:block pt-24 lg:pt-0"
            >
              <FloatingExpertCards />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <TrustBar />

      {/* ── WHAT YOU CAN FIND ── */}
      <ExpertiseSection />

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="grid md:grid-cols-2">
        <div className="px-6 md:px-12 py-16" style={{ backgroundColor: "#0A1F3B" }}>
          <div className="max-w-md mx-auto md:mx-0 md:ml-auto md:mr-12">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand)" }}>For students</span>
            <h2 className="text-3xl font-bold mt-2 text-white">Turn free time into income</h2>
            <ol className="mt-6 space-y-5">
              {HOW_WORKER.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span
                    className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-bold"
                    style={{ backgroundColor: "rgba(15, 139, 255, 0.12)", color: "var(--brand)" }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{s.t}</div>
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              to="/gigs"
              className="mt-6 inline-flex items-center gap-2 font-medium hover:underline text-sm"
              style={{ color: "var(--brand)" }}
            >
              Find work <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="px-6 md:px-12 py-16" style={{ backgroundColor: "#00152E" }}>
          <div className="max-w-md mx-auto md:mx-0 md:mr-auto md:ml-12">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand)" }}>For posters</span>
            <h2 className="text-3xl font-bold mt-2 text-white">Get things done on campus</h2>
            <ol className="mt-6 space-y-5">
              {HOW_POSTER.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span
                    className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-bold"
                    style={{ backgroundColor: "rgba(15, 139, 255, 0.12)", color: "var(--brand)" }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{s.t}</div>
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              to="/gigs/new"
              className="mt-6 inline-flex items-center gap-2 font-medium hover:underline text-sm"
              style={{ color: "var(--brand)" }}
            >
              Post a gig <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ backgroundColor: "#0A1F3B" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-3 gap-4 text-center">
          {[
            ["1,200+", "Students"],
            ["12", "Universities"],
            ["3,400+", "Gigs posted"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl md:text-4xl font-bold text-white">{n}</div>
              <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Browse by category</h2>
          <Link to="/gigs" className="text-sm hover:underline" style={{ color: "var(--brand)" }}>See all gigs →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map(([cat, m]) => {
            const Icon = m.icon;
            return (
              <Link
                key={cat}
                to={`/gigs?category=${encodeURIComponent(cat)}`}
                className="rounded-xl p-5 flex items-center gap-3 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className={`w-12 h-12 rounded-full ${m.bg} ${m.text} grid place-items-center`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="font-semibold text-white">{cat}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{catCount(cat)} gigs open</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── LATEST GIGS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest gigs across Cameroon</h2>
          <Link to="/gigs" className="text-sm hover:underline" style={{ color: "var(--brand)" }}>See all →</Link>
        </div>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          {latest.map((g) => <GigListRow key={g.id} gig={g} />)}
        </div>
      </section>

      {/* ── BROWSE TALENT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Talented students you can hire</h2>
          <Link to="/freelancers" className="text-sm hover:underline" style={{ color: "var(--brand)" }}>Browse all talent →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {browseTalent.map((u) => <FreelancerCard key={u.id} user={u} />)}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">What students are saying</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { u: mockUsers[0], q: "Earned XAF 60,000 last semester tutoring. Paid my hostel rent." },
            { u: mockUsers[1], q: "Best way to get freelance design experience while still in school." },
            { u: mockUsers[7], q: "Booked 5 graduation shoots through Campus Gigs in one month." },
          ].map(({ u, q }) => (
            <div
              key={u.id}
              className="rounded-xl p-6"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm leading-relaxed text-white/70">"{q}"</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar id={u.id} name={u.fullName} size={36} />
                <div>
                  <div className="font-medium text-sm text-white">{u.fullName}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{u.universityName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ backgroundColor: "#0A1F3B" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to earn on campus?</h2>
          <p className="mt-2" style={{ color: "rgba(255,255,255,0.55)" }}>Join 1,200+ students already getting paid for their skills.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "var(--brand)" }}
            >
              Sign up free
            </Link>
            <Link
              to="/gigs"
              className="px-6 py-2.5 rounded-lg font-semibold transition-all"
              style={{
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Browse gigs
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
