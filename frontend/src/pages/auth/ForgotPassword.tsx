import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckInbox } from "@/components/shared/CheckInbox";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
});

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormInput = z.infer<typeof schema>;

function ForgotPasswordPage() {
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [sentSet] = useState(() => new Set<string>());
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormInput) => {
    await new Promise((r) => setTimeout(r, 300));
    if (sentSet.has(data.email)) {
      toast.info("Already sent — check your spam folder.");
      setSentEmail(data.email);
      return;
    }
    sentSet.add(data.email);
    setSentEmail(data.email);
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          {sentEmail ? (
            <CheckInbox
              icon="mail"
              heading="Check your inbox"
              body={`We sent a reset link to ${sentEmail}. It expires in 1 hour.`}
              backHref="/auth/forgot-password"
              backLabel="Try a different email"
              resendLabel="Resend email"
              onResend={() => toast.info("Already sent — check your spam folder.")}
            />
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap size={24} />
                </div>
                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-6">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" {...register("email")} placeholder="you@campus.cm" />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand hover:bg-[color:var(--brand-dark)] text-white"
                >
                  Send reset link
                </Button>
              </form>
              <div className="text-center text-sm mt-4">
                <Link
                  to="/login"
                  className="text-[color:var(--brand-dark)] dark:text-brand font-medium hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
