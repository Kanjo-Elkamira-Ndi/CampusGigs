import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { PublicUser } from "@/types";
import { Avatar } from "@/components/shared/Avatar";
import { UniversityBadge } from "@/components/shared/UniversityBadge";
import { Button } from "@/components/ui/button";

interface Props {
  user: PublicUser;
  variant?: "default" | "mini";
}

export function FreelancerCard({ user, variant = "default" }: Props) {
  if (variant === "mini") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3 }} transition={{ duration: 0.15 }}
        className="rounded-xl border border-border bg-card p-3 flex items-center gap-3"
      >
        <Avatar id={user.id} name={user.fullName} size={40} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm truncate">{user.fullName}</div>
          <div className="text-xs text-muted-foreground truncate">{user.skills[0] ?? "Student"}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {user.avgRating.toFixed(1)} · {user.hiredCount}× hired
          </div>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }} transition={{ duration: 0.18 }}
      className="rounded-xl border border-border bg-card p-5 flex flex-col"
    >
      <div className="flex items-start gap-3">
        <Avatar id={user.id} name={user.fullName} size={52} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate">{user.fullName}</h3>
          <p className="text-xs text-muted-foreground truncate">{user.skills[0] ?? "Student"}</p>
          <div className="mt-1.5"><UniversityBadge name={user.universityName} city={user.city} /></div>
        </div>
      </div>
      <div className="text-sm mt-3 flex items-center gap-2 text-muted-foreground">
        <Star size={14} className="fill-amber-400 text-amber-400" />
        <span className="font-medium text-foreground">{user.avgRating.toFixed(1)}</span>
        <span>· {user.hiredCount}× hired</span>
        <span>· {user.reviewCount} reviews</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {user.skills.slice(0, 3).map((s) => (
          <span key={s} className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">{s}</span>
        ))}
        {user.skills.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">+{user.skills.length - 3} more</span>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Button asChild className="flex-1 bg-brand hover:bg-[color:var(--brand-dark)] text-white">
          <Link to="/profile/$id" params={{ id: user.id }}>View profile</Link>
        </Button>
        <Button variant="outline" className="flex-1">Contact</Button>
      </div>
    </motion.div>
  );
}
