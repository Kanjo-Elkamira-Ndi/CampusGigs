import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  city?: string;
  className?: string;
  withIcon?: boolean;
}

export function UniversityBadge({ name, city, className, withIcon = true }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-brand-light text-[color:var(--brand-dark)] dark:text-brand-foreground border border-brand-border/60",
        className,
      )}
    >
      {withIcon && <GraduationCap size={11} />}
      {name}
      {city && <span className="opacity-70">· {city}</span>}
    </span>
  );
}
