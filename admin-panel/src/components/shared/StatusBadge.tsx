import { cn } from "@/lib/utils";

type Tone = "neutral" | "indigo" | "green" | "amber" | "red" | "blue" | "rose";

const tones: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  indigo: "bg-indigo-50 text-indigo-700",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  blue: "bg-blue-50 text-blue-700",
  rose: "bg-rose-50 text-rose-700",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

export function StatusBadge({ children, tone = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-[11px] font-medium px-2.5 py-0.5",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
