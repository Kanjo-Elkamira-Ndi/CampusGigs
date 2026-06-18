import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, UserPlus, GraduationCap } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CAMEROON_UNIVERSITIES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useRegister } from "@/hooks/useAuth";
import { universityRequestsApi } from "@/api";
import { cn } from "@/lib/utils";
import { AuthSplitPanel } from "@/components/auth/AuthSplitPanel";
import { toast } from "sonner";

export function RegisterPage() {
  const user = useAuthStore((s) => s.user);
  const [role, setRole] = useState<"WORKER" | "POSTER">("WORKER");
  const [customUniversity, setCustomUniversity] = useState("");
  const registerMut = useRegister();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "WORKER" },
  });

  const selectedUniversityId = watch("universityId");

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = (data: RegisterInput) => {
    if (data.universityId === "other" && !customUniversity.trim()) {
      toast.error("Please type your university name");
      return;
    }
    registerMut.mutate(data, {
      onSuccess: () => {
        if (data.universityId === "other" && customUniversity.trim()) {
          universityRequestsApi.create({ name: customUniversity.trim() })
            .then(() => toast.success("University request submitted for admin approval"))
            .catch(() => toast.error("Failed to submit university request"));
        }
      },
    });
  };

  return (
    <div className="h-screen overflow-hidden grid lg:grid-cols-2">
      <AuthSplitPanel
        headline={"Your campus,\nyour career."}
        subtext="Find freelance work, hire student talent, and grow your campus career — all in one place."
      />

      <div className="flex items-center justify-start bg-background pl-12 pr-12 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-2xl font-bold">Join Campus Gigs</h1>
            <p className="text-sm text-muted-foreground mt-1">Free for students across Cameroon.</p>
          </div>

          <Button variant="outline" className="w-full">Continue with Google</Button>

          <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <Input {...register("fullName")} placeholder="Ama Mensah" />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...register("email")} placeholder="you@campus.cm" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" {...register("password")} placeholder="At least 8 characters" />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Confirm password</label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">University</label>
              <select {...register("universityId")} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                <option value="">Choose your university…</option>
                {CAMEROON_UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}{u.id === "other" ? "" : ` — ${u.city}`}</option>
                ))}
              </select>
              {selectedUniversityId === "other" && (
                <Input
                  value={customUniversity}
                  onChange={(e) => setCustomUniversity(e.target.value)}
                  placeholder="Type your university name…"
                  className="mt-2"
                />
              )}
              {errors.universityId && <p className="text-xs text-red-600 mt-1">{errors.universityId.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">I want to…</label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { v: "WORKER" as const, t: "Find work", i: UserPlus, d: "Apply to gigs and earn" },
                  { v: "POSTER" as const, t: "Hire help", i: Briefcase, d: "Post gigs and hire" },
                ]).map(({ v, t, i: Icon, d }) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => { setRole(v); setValue("role", v); }}
                    className={cn(
                      "rounded-lg border p-3 text-left",
                      role === v ? "border-brand bg-brand-light/60 dark:bg-brand-light/20" : "border-border hover:bg-muted",
                    )}
                  >
                    <Icon size={18} className="text-[color:var(--brand-dark)] dark:text-brand" />
                    <div className="font-medium text-sm mt-1">{t}</div>
                    <div className="text-xs text-muted-foreground">{d}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={registerMut.isPending} className="w-full bg-brand hover:bg-[color:var(--brand-dark)] text-white">
              {registerMut.isPending ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[color:var(--brand-dark)] dark:text-brand font-medium hover:underline">
              Log in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
