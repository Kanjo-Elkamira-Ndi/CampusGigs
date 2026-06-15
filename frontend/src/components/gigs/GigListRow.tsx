import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import type { Gig } from "@/types";
import { formatBudget, getDeadlineLabel, timeAgo, cn } from "@/lib/utils";
import { CategoryIconCircle, GigBadge } from "./GigBadge";
import { EasyApplyBadge } from "@/components/shared/EasyApplyBadge";
import { UniversityBadge } from "@/components/shared/UniversityBadge";

const URGENCY = {
  red: "text-red-600 dark:text-red-400",
  amber: "text-amber-600 dark:text-amber-400",
  green: "text-muted-foreground",
  gray: "text-muted-foreground",
};

export function GigListRow({ gig }: { gig: Gig }) {
  const d = getDeadlineLabel(gig.deadline);
  return (
    <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.12 }} className="group">
      <Link
        to={"/gigs/" + gig.id}
        className="flex items-start gap-4 p-5 border-b border-border hover:bg-muted/40 hover:border-l-2 hover:border-l-brand transition-colors"
      >
        <CategoryIconCircle category={gig.category} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-[15px] leading-snug truncate group-hover:text-[color:var(--brand-dark)] dark:group-hover:text-brand">
              {gig.title}
            </h3>
            <div className="text-right shrink-0">
              <div className="font-bold text-[color:var(--brand-dark)] dark:text-brand">
                {formatBudget(gig.budget)}
              </div>
              <div className={cn("text-[11px] mt-0.5", URGENCY[d.urgency])}>
                <Clock className="inline mr-0.5" size={11} />
                {d.label}
              </div>
            </div>
          </div>

          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground/80">{gig.poster.fullName}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">{gig.universityName}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><MapPin size={11} />{gig.city}</span>
            <span>·</span>
            <span>{timeAgo(gig.createdAt)}</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <GigBadge category={gig.category} />
            <UniversityBadge name={gig.universityName} />
            {gig.tags?.slice(0, 2).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">{t}</span>
            ))}
            {gig.isEasyApply && <EasyApplyBadge className="ml-auto" />}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
