import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckInbox } from "@/components/shared/CheckInbox";
import { AuthSplitPanel } from "@/components/auth/AuthSplitPanel";
import { useForgotPassword } from "@/hooks/useAuth";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormInput = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const forgotPassword = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormInput) => {
    forgotPassword.mutate(data, { onSuccess: () => setSentEmail(data.email) });
  };

  return (
    <div className="h-full overflow-hidden grid lg:grid-cols-2">
      <AuthSplitPanel
        headline="Your campus,\nyour career."
        subtext="Find freelance work, hire student talent, and grow your campus career — all in one place."
      />
      <div className="flex items-center justify-start bg-background pl-12 pr-12 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {sentEmail ? (
            <CheckInbox
              icon="mail"
              heading="Check your inbox"
              body={`We sent a reset link to ${sentEmail}. It expires in 1 hour.`}
              backHref="/forgot-password"
              backLabel="Try a different email"
              resendLabel="Resend email"
              onResend={() => toast.info("Already sent — check your spam folder.")}
            />
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <GraduationCap size={24} />
                </div>
                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" {...register("email")} placeholder="you@campus.cm" />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
                  <Button
                    type="submit"
                    disabled={forgotPassword.isPending}
                    className="w-full bg-brand hover:bg-[color:var(--brand-dark)] text-white"
                  >
                    {forgotPassword.isPending ? "Sending…" : "Send reset link"}
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
        </motion.div>
      </div>
    </div>
  );
}
