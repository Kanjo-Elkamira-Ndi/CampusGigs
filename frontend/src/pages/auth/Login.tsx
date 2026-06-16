import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useLogin } from "@/hooks/useAuth";
import { AuthSplitPanel } from "@/components/auth/AuthSplitPanel";

export function Login() {
  const user = useAuthStore((s) => s.user);
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const [showPw, setShowPw] = useState(false);
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  if (user) return <Navigate to={from ?? "/dashboard"} replace />;

  const onSubmit = (data: LoginInput) => {
    login.mutate(data, {
      onSuccess: () => {
        window.location.href = from ?? "/dashboard";
      },
    });
  };

  return (
    <div className="h-full overflow-hidden grid lg:grid-cols-2">
      {/* Left panel */}
      <AuthSplitPanel
        headline={"Your campus,\nyour career."}
        subtext="Find freelance work, hire student talent, and grow your campus career — all in one place."
      />

      {/* Right panel — form */}
      <div className="flex items-center justify-start bg-background pl-12 pr-12 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Log in to your Campus Gigs account.</p>
          </div>

          <Button variant="outline" className="w-full">Continue with Google</Button>

          <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...register("email")} placeholder="you@campus.cm" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input type={showPw ? "text" : "password"} {...register("password")} placeholder="password123" />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={login.isPending} className="w-full bg-brand hover:bg-[color:var(--brand-dark)] text-white">
              {login.isPending ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>
          <div className="text-center text-sm mt-4">
            New here?{" "}
            <Link to="/register" className="text-[color:var(--brand-dark)] dark:text-brand font-medium hover:underline">
              Sign up
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}