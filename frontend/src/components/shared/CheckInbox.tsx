import { Mail, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export interface CheckInboxProps {
  icon: "mail" | "lock";
  heading: string;
  body: string;
  resendLabel?: string;
  onResend?: () => void;
  backHref: string;
  backLabel: string;
}

export function CheckInbox({
  icon,
  heading,
  body,
  resendLabel,
  onResend,
  backHref,
  backLabel,
}: CheckInboxProps) {
  const Icon = icon === "mail" ? Mail : Lock;
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-light/60 dark:bg-brand-light/20 text-[color:var(--brand-dark)] dark:text-brand">
        <Icon size={28} />
      </div>
      <h1 className="text-2xl font-bold">{heading}</h1>
      <p className="text-sm text-muted-foreground mt-2">{body}</p>
      {resendLabel && onResend && (
        <Button variant="outline" className="w-full mt-6" onClick={onResend}>
          {resendLabel}
        </Button>
      )}
      <div className="text-center text-sm mt-6">
        <Link
          to={backHref as any}
          className="text-[color:var(--brand-dark)] dark:text-brand font-medium hover:underline"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
