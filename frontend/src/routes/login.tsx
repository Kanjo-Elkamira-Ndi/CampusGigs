import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { mockUsers } from "@/lib/mockData";

const searchSchema = z.object({ from: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: (s) => searchSchema.parse(s),
  component: LoginPage,
});

function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const { from } = Route.useSearch();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  if (user) return <Navigate to={(from as any) ?? "/dashboard"} />;

  const onSubmit = async (data: LoginInput) => {
    await new Promise((r) => setTimeout(r, 300));
    if (data.password !== "password123") {
      toast.error("Invalid credentials. Try password: password123");
      return;
    }
    const found = mockUsers.find((u) => u.email === data.email) ?? mockUsers[2];
    setAuth(found, "mock-token");
    toast.success(`Welcome back, ${found.fullName.split(" ")[0]}!`);
    navigate({ to: (from as any) ?? "/dashboard" });
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Log in to your Campus Gigs account.</p>
          </div>
          <Button variant="outline" className="w-full mt-6">Continue with Google</Button>
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
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand hover:bg-[color:var(--brand-dark)] text-white">
              Log in
            </Button>
          </form>
          <div className="text-center text-sm text-muted-foreground mt-4">
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>
          <div className="text-center text-sm mt-4">
            New here? <Link to="/register" className="text-[color:var(--brand-dark)] dark:text-brand font-medium hover:underline">Sign up</Link>
          </div>
          <p className="text-[11px] text-center text-muted-foreground mt-6">
            Demo: any email + password <code className="px-1 bg-muted rounded">password123</code>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
