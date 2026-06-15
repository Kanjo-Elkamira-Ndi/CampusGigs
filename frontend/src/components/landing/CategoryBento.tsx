import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Home,
  Laptop,
  Camera,
  Calendar,
  Truck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CategoryItem {
  id: string;
  icon: typeof GraduationCap;
  name: string;
  description: string;
  cta: string;
  link: string;
  color: string;
  bg: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "academic",
    icon: GraduationCap,
    name: "Academic Support",
    description:
      "Find tutoring, exam preparation, assignment guidance, language coaching, and study support opportunities.",
    cta: "Browse Tutors",
    link: "/gigs?category=Tutoring",
    color: "#0F8BFF",
    bg: "#0F8BFF12",
  },
  {
    id: "household",
    icon: Home,
    name: "Household Services",
    description:
      "Explore cleaning, painting, laundry, moving assistance, and neighborhood service gigs.",
    cta: "Browse Services",
    link: "/gigs?category=Errands",
    color: "#10B981",
    bg: "#10B98112",
  },
  {
    id: "digital",
    icon: Laptop,
    name: "Digital & Creative",
    description:
      "Discover web development, graphic design, video editing, social media, and content creation projects.",
    cta: "Browse Digital Gigs",
    link: "/gigs?category=Creative",
    color: "#8B5CF6",
    bg: "#8B5CF612",
  },
  {
    id: "event",
    icon: Calendar,
    name: "Event Assistance",
    description:
      "Work as an usher, coordinator, photographer, or event support staff for local events.",
    cta: "Browse Events",
    link: "/gigs?category=Events",
    color: "#EC4899",
    bg: "#EC489912",
  },
  {
    id: "photo",
    icon: Camera,
    name: "Photography & Media",
    description:
      "Find photography, videography, editing, and content production opportunities.",
    cta: "Browse Media Gigs",
    link: "/gigs?category=Photography",
    color: "#F59E0B",
    bg: "#F59E0B12",
  },
  {
    id: "delivery",
    icon: Truck,
    name: "Delivery & Errands",
    description:
      "Earn money helping with deliveries, pickups, errands, and local transportation tasks.",
    cta: "Browse Deliveries",
    link: "/gigs?category=Delivery",
    color: "#EF4444",
    bg: "#EF444412",
  },
];

export function CategoryBento() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border mb-4"
          style={{
            color: "var(--text-secondary)",
            borderColor: "var(--card-border)",
            backgroundColor: "var(--card-bg)",
          }}
        >
          <Sparkles size={12} /> Categories
        </span>
        <h2
          className="text-2xl sm:text-3xl font-bold leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          Browse Opportunities by Category
        </h2>
        <p
          className="mt-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Find student jobs and local opportunities across academics, household services, events,
          technology, and creative work.
        </p>
      </motion.div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ cat, index }: { cat: CategoryItem; index: number }) {
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="flex flex-col rounded-3xl p-7 sm:p-8 transition-shadow duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* icon circle */}
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: cat.bg }}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.2 }}
      >
        <Icon size={26} style={{ color: cat.color }} />
      </motion.div>

      {/* name */}
      <h3
        className="text-lg font-bold leading-snug"
        style={{ color: "var(--foreground)" }}
      >
        {cat.name}
      </h3>

      {/* description */}
      <p
        className="text-sm leading-relaxed mt-2 flex-1"
        style={{ color: "var(--text-secondary)" }}
      >
        {cat.description}
      </p>

      {/* cta */}
      <motion.div className="mt-6" whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
        <Link
          to={cat.link}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:opacity-80"
          style={{ color: cat.color }}
        >
          {cat.cta} <ArrowRight size={14} />
        </Link>
      </motion.div>
    </motion.div>
  );
}
