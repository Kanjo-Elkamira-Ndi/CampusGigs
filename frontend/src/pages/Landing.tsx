import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, GraduationCap } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { GigListRow } from "@/components/gigs/GigListRow";
import { FreelancerCard } from "@/components/freelancers/FreelancerCard";
import { CATEGORY_META } from "@/lib/constants";
import { mockGigs, mockUsers } from "@/lib/mockData";
import { Avatar } from "@/components/shared/Avatar";

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
      <section className="bg-gradient-to-b from-brand-light/60 to-background dark:from-brand-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-card text-xs font-medium border border-brand-border/60 text-[color:var(--brand-dark)] dark:text-brand">
              <GraduationCap size={13} /> For students across Cameroon
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
              Campus gigs.{" "}
              <span className="text-[color:var(--brand-dark)] dark:text-brand">Get paid</span> to help classmates.
            </h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-md">
              Tutoring, errands, design, tech help — earn money or get things done, all on your campus.
            </p>

            <div className="mt-6 inline-flex rounded-full bg-muted p-1">
              {(["worker", "poster"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors " +
                    (mode === m ? "bg-white dark:bg-card shadow text-foreground" : "text-muted-foreground")
                  }
                >
                  {m === "worker" ? "I want to find work" : "I need to hire"}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {mode === "worker" ? (
                <>
                  <Link to="/gigs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand hover:bg-[color:var(--brand-dark)] text-white font-medium">
                    Browse gigs <ArrowRight size={16} />
                  </Link>
                  <Link to="/register" className="inline-flex items-center px-5 py-2.5 rounded-md border border-border hover:bg-muted font-medium">
                    Create profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/gigs/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand hover:bg-[color:var(--brand-dark)] text-white font-medium">
                    Post a gig <ArrowRight size={16} />
                  </Link>
                  <Link to="/freelancers" className="inline-flex items-center px-5 py-2.5 rounded-md border border-border hover:bg-muted font-medium">
                    Browse talent
                  </Link>
                </>
              )}
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 gap-3"
            initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            {featured.map((u) => (
              <motion.div key={u.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <FreelancerCard user={u} variant="mini" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="how" className="grid md:grid-cols-2">
        <div className="px-6 md:px-12 py-14 bg-card">
          <div className="max-w-md mx-auto md:mx-0 md:ml-auto md:mr-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--brand-dark)] dark:text-brand">For students</span>
            <h2 className="text-3xl font-bold mt-2">Turn free time into income</h2>
            <ol className="mt-6 space-y-5">
              {HOW_WORKER.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-brand-light text-[color:var(--brand-dark)] dark:text-brand font-bold grid place-items-center">{s.n}</span>
                  <div>
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-sm text-muted-foreground">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/gigs" className="mt-6 inline-flex items-center gap-2 text-[color:var(--brand-dark)] dark:text-brand font-medium hover:underline">
              Find work <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        <div className="px-6 md:px-12 py-14 bg-brand-muted dark:bg-brand-light/10">
          <div className="max-w-md mx-auto md:mx-0 md:mr-auto md:ml-12">
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--brand-dark)] dark:text-brand">For posters</span>
            <h2 className="text-3xl font-bold mt-2">Get things done on campus</h2>
            <ol className="mt-6 space-y-5">
              {HOW_POSTER.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-white dark:bg-card text-[color:var(--brand-dark)] dark:text-brand font-bold grid place-items-center border border-brand-border/60">{s.n}</span>
                  <div>
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-sm text-muted-foreground">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/gigs/new" className="mt-6 inline-flex items-center gap-2 text-[color:var(--brand-dark)] dark:text-brand font-medium hover:underline">
              Post a gig <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-3 gap-4 text-center">
          {[
            ["1,200+", "Students"],
            ["12", "Universities"],
            ["3,400+", "Gigs posted"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl md:text-4xl font-bold">{n}</div>
              <div className="text-sm opacity-80 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">Browse by category</h2>
          <Link to="/gigs" className="text-sm text-[color:var(--brand-dark)] dark:text-brand hover:underline">See all gigs →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map(([cat, m]) => {
            const Icon = m.icon;
            return (
              <Link
                key={cat}
                to={`/gigs?category=${encodeURIComponent(cat)}`}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary hover:shadow-[var(--shadow-card)] transition-all flex items-center gap-3"
              >
                <div className={`w-12 h-12 rounded-full ${m.bg} ${m.text} grid place-items-center`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="font-semibold">{cat}</div>
                  <div className="text-xs text-muted-foreground">{catCount(cat)} gigs open</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-2xl font-bold">Latest gigs across Cameroon</h2>
          <Link to="/gigs" className="text-sm text-[color:var(--brand-dark)] dark:text-brand hover:underline">See all →</Link>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {latest.map((g) => <GigListRow key={g.id} gig={g} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">Talented students you can hire</h2>
          <Link to="/freelancers" className="text-sm text-[color:var(--brand-dark)] dark:text-brand hover:underline">Browse all talent →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {browseTalent.map((u) => <FreelancerCard key={u.id} user={u} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <h2 className="text-2xl font-bold mb-6">What students are saying</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { u: mockUsers[0], q: "Earned XAF 60,000 last semester tutoring. Paid my hostel rent." },
            { u: mockUsers[1], q: "Best way to get freelance design experience while still in school." },
            { u: mockUsers[7], q: "Booked 5 graduation shoots through Campus Gigs in one month." },
          ].map(({ u, q }) => (
            <div key={u.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm leading-relaxed">“{q}”</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar id={u.id} name={u.fullName} size={36} />
                <div>
                  <div className="font-medium text-sm">{u.fullName}</div>
                  <div className="text-xs text-muted-foreground">{u.universityName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-3xl font-bold">Ready to earn on campus?</h2>
          <p className="mt-2 opacity-90">Join 1,200+ students already getting paid for their skills.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/register" className="px-5 py-2.5 rounded-md bg-white text-[color:var(--brand-dark)] font-semibold hover:bg-white/90">
              Sign up free
            </Link>
            <Link to="/gigs" className="px-5 py-2.5 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10">
              Browse gigs
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
