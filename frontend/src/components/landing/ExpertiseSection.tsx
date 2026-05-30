import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Drill, Laptop, Star, ArrowRight, MapPin } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";

function AcademicPreview() {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Available Tutors</div>
      <div className="space-y-2.5">
        {[
          { id: "u1", name: "Sarah N.", skill: "Mathematics Tutor" },
          { id: "u6", name: "Brian K.", skill: "Physics Tutor" },
          { id: "u8", name: "Linda T.", skill: "English Tutor" },
        ].map((t) => (
          <div key={t.id} className="flex items-center gap-2.5">
            <Avatar id={t.id} name={t.name} size={28} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white/80 truncate">{t.name}</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{t.skill}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--brand)" }}>
          <span>+120 Active Tutors</span>
        </div>
      </div>
    </div>
  );
}

function LocalPreview() {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Today's Jobs</div>
      <div className="space-y-2.5">
        {[
          { title: "Apartment Cleaning", price: "15,000 FCFA" },
          { title: "Wall Painting", price: "25,000 FCFA" },
          { title: "Furniture Moving", price: "10,000 FCFA" },
        ].map((job, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
              <span className="text-xs text-white/80">{job.title}</span>
            </div>
            <span className="text-xs font-semibold text-white/90">{job.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DigitalPreview() {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Top Skills</div>
      <div className="space-y-2.5">
        {["UI Design", "Web Development", "Video Editing"].map((skill) => (
          <div key={skill} className="flex items-center gap-2">
            <div
              className="px-2 py-0.5 rounded-md text-[11px] font-medium"
              style={{ backgroundColor: "rgba(15, 139, 255, 0.1)", color: "var(--brand)" }}
            >
              {skill}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="font-semibold text-white/80">4.9</span>
          <span>Average Rating</span>
        </div>
      </div>
    </div>
  );
}

interface CardConfig {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  cta: string;
  ctaTo: string;
  preview: React.ReactNode;
}

const CARDS: CardConfig[] = [
  {
    icon: GraduationCap,
    title: "Academic Support",
    description:
      "Find qualified students for tutoring, exam preparation, assignment guidance, language coaching, and study groups.",
    cta: "Browse tutors",
    ctaTo: "/gigs?category=Tutoring",
    preview: <AcademicPreview />,
  },
  {
    icon: Drill,
    title: "Household & Local Services",
    description:
      "Hire trusted students for house cleaning, painting, laundry, moving assistance, deliveries, and other local tasks.",
    cta: "Browse local services",
    ctaTo: "/gigs?category=Errands",
    preview: <LocalPreview />,
  },
  {
    icon: Laptop,
    title: "Digital & Creative Services",
    description:
      "Connect with talented students offering graphic design, web development, video editing, social media management, and data entry services.",
    cta: "Browse digital talent",
    ctaTo: "/freelancers",
    preview: <DigitalPreview />,
  },
];

export function ExpertiseSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Find student talent for any task</h2>
        <p className="mt-4 text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
          Whether you need help around the house, academic support, event staffing, or digital services, Campus Gigs connects you with verified university students ready to get the job done.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.02)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              }}
            >
              <div className="p-6 flex flex-col flex-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(15, 139, 255, 0.1)" }}
                >
                  <Icon size={20} style={{ color: "var(--brand)" }} />
                </div>

                <h3 className="text-lg font-bold text-white">{card.title}</h3>
                <p className="text-sm mt-2 leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {card.description}
                </p>

                <Link
                  to={card.ctaTo}
                  className="inline-flex items-center gap-1.5 text-sm font-medium mt-4 mb-5 transition-all hover:gap-2"
                  style={{ color: "var(--brand)" }}
                >
                  {card.cta} <ArrowRight size={13} />
                </Link>

                {card.preview}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
