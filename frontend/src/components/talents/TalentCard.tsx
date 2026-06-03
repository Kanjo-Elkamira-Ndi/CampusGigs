import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, Briefcase, BadgeCheck, ArrowUpRight } from "lucide-react";
import type { PublicUser } from "@/types";
import { Avatar } from "@/components/shared/Avatar";
import { UniversityBadge } from "@/components/shared/UniversityBadge";

interface Props {
  user: PublicUser;
  index?: number;
}

function roleTitle(skills: string[]): string {
  if (skills.includes("Python") || skills.includes("Algorithms")) return "Software Developer";
  if (skills.includes("Graphic design") || skills.includes("Graphic Design")) return "Graphic Designer";
  if (skills.includes("Photography")) return "Photographer";
  if (skills.includes("Events") || skills.includes("Event Setup")) return "Event Assistant";
  if (skills.includes("Catering") || skills.includes("Cleaning")) return "House Cleaner";
  if (skills.includes("Electrician") || skills.includes("Repairs")) return "Handyman";
  if (skills.includes("Translation")) return "Translator";
  if (skills.includes("Mathematics") || skills.includes("Math")) return "Mathematics Tutor";
  if (skills.includes("Physics")) return "Physics Tutor";
  if (skills.includes("React") || skills.includes("Laravel") || skills.includes("Web Development")) return "Web Developer";
  if (skills.includes("Delivery")) return "Delivery Rider";
  if (skills.includes("Sound Engineering")) return "Sound Engineer";
  if (skills.includes("Social Media") || skills.includes("Content Creation")) return "Social Media Manager";
  if (skills.includes("French") || skills.includes("English")) return "Language Tutor";
  if (skills.includes("Tutoring")) return "Academic Tutor";
  return skills[0] ?? "Student";
}

export function TalentCard({ user, index = 0 }: Props) {
  const role = roleTitle(user.skills);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 h-full flex flex-col"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      <div className="flex flex-col p-5 sm:p-6 h-full">
        {/* profile image */}
        <motion.div
          className="mb-4"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.25 }}
        >
          <Link to={"/profile/" + user.id}>
            <Avatar
              id={user.id}
              name={user.fullName}
              size={80}
              className="rounded-xl w-20 h-20 object-cover"
            />
          </Link>
        </motion.div>

        {/* content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* name + badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={"/profile/" + user.id}
              className="text-lg font-bold hover:underline"
              style={{ color: "var(--foreground)" }}
            >
              {user.fullName}
            </Link>
            {user.verified && (
              <BadgeCheck size={18} className="text-blue-500 shrink-0" />
            )}
          </div>

          {/* university + role */}
          <div className="flex items-center gap-2 flex-wrap">
            <UniversityBadge name={user.universityName} city={user.city} />
            <span className="text-sm font-semibold" style={{ color: "var(--brand)" }}>
              {role}
            </span>
          </div>

          {/* description */}
          {user.skills.length > 0 && (
            <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
              {user.bio ?? `${user.fullName} is a ${role.toLowerCase()} available for hire on campus.`}
            </p>
          )}

          {/* skill tags */}
          {user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {user.skills.slice(0, 5).map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--foreground)",
                  }}
                >
                  {s}
                </span>
              ))}
              {user.skills.length > 5 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  +{user.skills.length - 5}
                </span>
              )}
            </div>
          )}

          {/* metadata row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs pt-1" style={{ color: "var(--text-secondary)" }}>
            {/* rating */}
            <span className="inline-flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-medium" style={{ color: "var(--foreground)" }}>{user.avgRating.toFixed(1)}</span>
            </span>

            {/* completed jobs */}
            <span className="inline-flex items-center gap-1">
              <Briefcase size={13} />
              {user.hiredCount} job{user.hiredCount !== 1 ? "s" : ""} completed
            </span>

            {/* response time */}
            {user.responseTime && (
              <span className="inline-flex items-center gap-1">
                <Clock size={13} />
                Responds {user.responseTime}
              </span>
            )}

            {/* location */}
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} />
              {user.city}
            </span>

            {/* availability */}
            {user.availability && (
              <span className="inline-flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: user.availability === "Immediately" ? "#10B981"
                      : user.availability === "This Week" ? "#F59E0B"
                      : "#6B7280",
                  }}
                />
                {user.availability === "Immediately" ? "Available Now"
                  : user.availability === "This Week" ? "Available This Week"
                  : user.availability}
              </span>
            )}
          </div>

          {/* hourly rate + cta */}
          <div className="flex items-center justify-between pt-2">
            {user.hourlyRate != null && (
              <span className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
                {user.hourlyRate.toLocaleString()} FCFA
                <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>/hr</span>
              </span>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <Link
                to={"/profile/" + user.id}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
                style={{
                  border: "1px solid var(--card-border)",
                  color: "var(--foreground)",
                }}
              >
                View Profile
              </Link>
              <Link
                to={"/profile/" + user.id}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: "var(--brand)" }}
              >
                Hire Now <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}