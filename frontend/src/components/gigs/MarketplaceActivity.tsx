import { motion } from "framer-motion";
import {
  Send,
  UserPlus,
  CheckCircle2,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { mockUsers, mockApplications } from "@/lib/mockData";

const ACTIVITY_ICONS = [Send, UserPlus, CheckCircle2, Briefcase, Sparkles] as const;
const ACTIVITY_COLORS = ["#0F8BFF", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899"];

function buildActivities() {
  const activities: Array<{
    id: string;
    icon: typeof Send;
    color: string;
    user: (typeof mockUsers)[number];
    text: string;
    time: string;
  }> = [];

  mockApplications.forEach((app, i) => {
    const user = mockUsers.find((u) => u.id === app.worker.id);
    if (!user) return;
    const iconIdx = i % ACTIVITY_ICONS.length;
    const verb =
      app.status === "ACCEPTED"
        ? "was hired for"
        : app.status === "COMPLETED"
          ? "completed"
          : "applied to";

    activities.push({
      id: app.id,
      icon: ACTIVITY_ICONS[iconIdx],
      color: ACTIVITY_COLORS[iconIdx],
      user,
      text: `${verb} "${app.gig.title}"`,
      time: app.appliedAt,
    });
  });

  // Shuffle for natural feel
  return activities.sort(() => Math.random() - 0.5).slice(0, 4);
}

export function MarketplaceActivity() {
  const activities = buildActivities();

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: "#10B981" }}
        />
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Marketplace Activity
        </h2>
      </div>

      <div
        className="rounded-xl sm:rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
        }}
      >
        <div className="divide-y" style={{ borderColor: "var(--card-chip-border)" }}>
          {activities.map((act, i) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="flex items-center gap-3 px-4 sm:px-5 py-3"
            >
              <div className="relative shrink-0">
                <Avatar id={act.user.id} name={act.user.fullName} size={32} />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: act.color, color: "#fff" }}
                >
                  <act.icon size={8} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {act.user.fullName.split(" ")[0]}
                  </span>{" "}
                  {act.text}
                </p>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: "var(--text-muted)" }}>
                {getTimeLabel(act.time)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getTimeLabel(iso: string) {
  const h = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 3600000));
  if (h < 1) return "now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
