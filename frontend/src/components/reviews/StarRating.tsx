import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
}

export function StarRating({ value, onChange, size = 16, readOnly = false, className }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const v = hover ?? value;
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(v);
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(i)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange?.(i)}
            className={cn(!readOnly && "cursor-pointer")}
            aria-label={`${i} stars`}
          >
            <Star size={size} className={filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground"} />
          </button>
        );
      })}
    </div>
  );
}
