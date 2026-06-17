import { getCategoryMeta } from "@/lib/constants";
import type { GigCategory } from "@/types";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/shared/CategoryIcon";

export function GigBadge({ category, className }: { category: GigCategory; className?: string }) {
  const m = getCategoryMeta(category);
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium", m.bg, m.text, className)}>
      <CategoryIcon category={category} size={11} />
      {category}
    </span>
  );
}

export function CategoryIconCircle({ category, size = 40 }: { category: GigCategory; size?: number }) {
  const m = getCategoryMeta(category);
  return (
    <div className={cn("rounded-full grid place-items-center shrink-0", m.bg)} style={{ width: size, height: size }}>
      <CategoryIcon category={category} size={size * 0.45} />
    </div>
  );
}
