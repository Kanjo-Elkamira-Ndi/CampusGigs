import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useAdminAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const login = useLogin();
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => login.mutate(values);

  const pills = ["Secure access", "Full audit trail", "Real-time data"];

  return (
    <div className="min-h-screen flex bg-neutral-950">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="hidden lg:flex w-[480px] shrink-0 bg-gradient-to-br from-brand to-[#00152E] flex-col justify-between p-12"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          className="flex items-center gap-3"
        >
          <svg viewBox="0 0 24 24" className="w-9 h-9" fill="#ffffff">
            <path d="M12 1L3 6v12l9 5 9-5V6l-9-5z" />
          </svg>
          <span className="text-white font-semibold text-lg">Campus Gigs</span>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
        >
          <h1 className="text-5xl font-bold text-white leading-tight whitespace-pre-line">
            {"Platform\nControl Center."}
          </h1>
          <p className="text-blue-200 text-sm mt-3">
            Manage users, gigs, universities, and audit every action across the platform.
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          className="flex flex-wrap gap-2"
        >
          {pills.map((p) => (
            <span
              key={p}
              className="rounded-full bg-white/10 text-white/80 text-xs px-3 py-1.5"
            >
              {p}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-0">
        <div className="w-full max-w-md px-4 sm:px-12">
          <h2 className="text-2xl font-bold text-neutral-900">Welcome back</h2>
          <p className="text-sm text-neutral-500 mt-1 mb-8">Super Admin access only</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={login.isPending}
                  className="pl-9"
                  placeholder="admin@campusgigs.com"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={login.isPending}
                  className="pl-9 pr-9"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-brand hover:bg-brand-dark h-11"
            >
              {login.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in to Admin Panel
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-[11px] text-neutral-400 text-center mt-6">
            Read-only access. All actions are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
