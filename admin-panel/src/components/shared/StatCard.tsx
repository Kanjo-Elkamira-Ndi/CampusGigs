import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: "brand" | "green" | "amber" | "rose";
  delta?: string;
  isLoading?: boolean;
}

const colors: Record<NonNullable<StatCardProps["color"]>, string> = {
  brand: "bg-brand-light text-brand",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "brand",
  delta,
  isLoading,
}: StatCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs text-neutral-500 uppercase tracking-wide">{label}</span>
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center",
            colors[color]
          )}
        >
          <Icon size={18} />
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-9 w-24 mt-3" />
      ) : (
        <div className="text-4xl font-bold text-neutral-900 mt-3">{value}</div>
      )}
      {delta && !isLoading && (
        <div className={cn("text-xs mt-2", `text-${color}-600`)}>{delta}</div>
      )}
    </motion.div>
  );
}
