import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, GraduationCap } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { CategoryBento } from "@/components/landing/CategoryBento";
import { TalentShowcase } from "@/components/landing/TalentShowcase";
import { GigsShowcase } from "@/components/landing/GigsShowcase";
import { mockGigs, mockUsers } from "@/lib/mockData";
import { Avatar } from "@/components/shared/Avatar";
import { RotatingWords } from "@/components/landing/RotatingWords";
import { SearchWidget } from "@/components/landing/SearchWidget";
import { HeroCardStack } from "@/components/landing/HeroCardStack";
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
  const latest = mockGigs.filter((g) => g.status === "OPEN").slice(0, 5);
  const browseTalent = mockUsers.filter((u) => u.role === "WORKER");

  return (
    <PageWrapper>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden -mt-16" style={{ minHeight: "calc(90vh + 4rem)", backgroundColor: "var(--hero-bg)" }}>
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
                    color: "var(--text-secondary)",
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  <GraduationCap size={13} /> Trusted by students across Cameroon
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]"
                style={{ color: "var(--foreground)" }}
              >
                Hire trusted student<br />
                <RotatingWords />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)", maxWidth: "28rem" }}
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

            {/* Right column — hero card stack */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="hidden lg:block pt-24 lg:pt-0"
            >
              <HeroCardStack />
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
        <div className="px-6 md:px-12 py-16" style={{ backgroundColor: "var(--section-bg)" }}>
          <div className="max-w-md mx-auto md:mx-0 md:ml-auto md:mr-12">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand)" }}>For students</span>
            <h2 className="text-3xl font-bold mt-2" style={{ color: "var(--foreground)" }}>Turn free time into income</h2>
            <ol className="mt-6 space-y-5">
              {HOW_WORKER.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span
                    className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-bold"
                    style={{ backgroundColor: "var(--badge-bg)", color: "var(--brand)" }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--foreground)" }}>{s.t}</div>
                    <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.d}</div>
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
        <div className="px-6 md:px-12 py-16" style={{ backgroundColor: "var(--section-alt)" }}>
          <div className="max-w-md mx-auto md:mx-0 md:mr-auto md:ml-12">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand)" }}>For posters</span>
            <h2 className="text-3xl font-bold mt-2" style={{ color: "var(--foreground)" }}>Get things done on campus</h2>
            <ol className="mt-6 space-y-5">
              {HOW_POSTER.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span
                    className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-bold"
                    style={{ backgroundColor: "var(--badge-bg)", color: "var(--brand)" }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--foreground)" }}>{s.t}</div>
                    <div className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.d}</div>
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
      <section style={{ backgroundColor: "var(--section-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-3 gap-4 text-center">
          {[
            ["1,200+", "Students"],
            ["12", "Universities"],
            ["3,400+", "Gigs posted"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl md:text-4xl font-bold" style={{ color: "var(--foreground)" }}>{n}</div>
              <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY BENTO ── */}
      <CategoryBento />

      {/* ── GIGS SHOWCASE ── */}
      <GigsShowcase gigs={latest} />

      {/* ── BROWSE TALENT ── */}
      <TalentShowcase talents={browseTalent} />

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: "var(--foreground)" }}>What students are saying</h2>
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
                border: "1px solid var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>"{q}"</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar id={u.id} name={u.fullName} size={36} />
                <div>
                  <div className="font-medium text-sm" style={{ color: "var(--foreground)" }}>{u.fullName}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{u.universityName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ backgroundColor: "var(--section-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>Ready to earn on campus?</h2>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>Join 1,200+ students already getting paid for their skills.</p>
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
                color: "var(--foreground)",
                border: "1px solid var(--card-border)",
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
