import { cn, getAvatarColor, getInitials } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

export function Avatar({ id, name, src, size = 40, className }: Props) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover shrink-0", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full shrink-0 flex items-center justify-center font-semibold text-[color:var(--brand-dark)]",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: getAvatarColor(id),
        fontSize: size * 0.4,
      }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
