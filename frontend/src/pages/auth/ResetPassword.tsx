import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckInbox } from "@/components/shared/CheckInbox";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: (s) => searchSchema.parse(s),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type FormInput = z.infer<typeof schema>;

function scorePassword(pw: string): { score: 0 | 1 | 2 | 3; label: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  const score = Math.min(3, s) as 0 | 1 | 2 | 3;
  return { score, label: ["Weak", "Weak", "Fair", "Strong"][score] };
}

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expired] = useState(token === "expired");
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<FormInput>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!token) {
      navigate({ to: "/auth/forgot-password" });
      return;
    }
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, [token, navigate]);

  const pw = watch("password") ?? "";
  const { score, label } = scorePassword(pw);

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 300));
    setDone(true);
  };

  if (!token) return null;

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-12 mx-auto rounded-xl" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <div className="space-y-2 mt-6">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ) : done ? (
            <CheckInbox
              icon="lock"
              heading="Password updated"
              body="Your password has been changed. You can now log in."
              backHref="/login"
              backLabel="Go to login"
            />
          ) : expired ? (
            <CheckInbox
              icon="lock"
              heading="Link expired"
              body="This reset link has expired. Request a new one."
              backHref="/auth/forgot-password"
              backLabel="Request new link"
            />
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap size={24} />
                </div>
                <h1 className="text-2xl font-bold">Set a new password</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a strong password you haven't used before.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-6">
                <div>
                  <label className="text-sm font-medium">New password</label>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      {...register("password")}
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="mt-1 grid grid-cols-3 gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 rounded",
                          i < score
                            ? score === 1
                              ? "bg-red-500"
                              : score === 2
                                ? "bg-yellow-500"
                                : "bg-brand"
                            : "bg-muted",
                        )}
                      />
                    ))}
                  </div>
                  {pw && (
                    <p className="text-[11px] text-muted-foreground mt-1">Strength: {label}</p>
                  )}
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm password</label>
                  <Input type="password" {...register("confirmPassword")} />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand hover:bg-[color:var(--brand-dark)] text-white"
                >
                  Update password
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
