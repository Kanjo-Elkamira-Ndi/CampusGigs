import { Zap } from "lucide-react";
export function EasyApplyBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 " +
        className
      }
    >
      <Zap size={11} className="fill-current" />
      Easy apply
    </span>
  );
}
