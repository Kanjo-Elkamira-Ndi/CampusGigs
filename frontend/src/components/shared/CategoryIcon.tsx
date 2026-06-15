import {
  GraduationCap,
  ShoppingCart,
  Monitor,
  PartyPopper,
  Palette,
  Bike,
  Languages,
  Camera,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { GigCategory } from "@/types";

const ICON_MAP: Record<GigCategory, LucideIcon> = {
  Tutoring: GraduationCap,
  Errands: ShoppingCart,
  "Tech help": Monitor,
  Events: PartyPopper,
  Creative: Palette,
  Delivery: Bike,
  Translation: Languages,
  Photography: Camera,
  Other: Wrench,
};

export function CategoryIcon({ category, size = 16 }: { category: GigCategory; size?: number }) {
  const Icon = ICON_MAP[category];
  return <Icon size={size} />;
}
