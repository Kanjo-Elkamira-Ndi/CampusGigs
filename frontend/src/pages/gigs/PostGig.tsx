import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { postGigStep1, postGigStep2, type PostGigStep1, type PostGigStep2 } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CATEGORY_META, CAMEROON_UNIVERSITIES } from "@/lib/constants";
import { GigListRow } from "@/components/gigs/GigListRow";
import { useAuthStore } from "@/store/authStore";
import type { Gig, GigCategory } from "@/types";
import { cn } from "@/lib/utils";

function PostGigForm() {
  const user = useAuthStore((s) => s.user)!;
  const activeRole = useAuthStore((s) => s.activeRole);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [s1, setS1] = useState<PostGigStep1 | null>(null);
  const [s2, setS2] = useState<PostGigStep2 | null>(null);

  const f1 = useForm<PostGigStep1>({ resolver: zodResolver(postGigStep1), defaultValues: { remote: false, category: "Tutoring" as GigCategory } });
  const f2 = useForm<PostGigStep2>({ resolver: zodResolver(postGigStep2), defaultValues: { slots: 1, isEasyApply: true, universityId: user.universityId } });

  const onStep1 = (d: PostGigStep1) => { setS1(d); setStep(2); };
  const onStep2 = (d: PostGigStep2) => { setS2(d); setStep(3); };
  const submit = () => {
    toast.success("Your gig is live! 🎉");
    navigate("/gigs");
  };

  const preview: Gig | null = s1 && s2 ? {
    id: "preview",
    title: s1.title,
    description: s1.description,
    budget: Number(s2.budget),
    location: s1.location,
    universityId: s2.universityId,
    universityName: CAMEROON_UNIVERSITIES.find((u) => u.id === s2.universityId)?.name ?? "",
    city: CAMEROON_UNIVERSITIES.find((u) => u.id === s2.universityId)?.city ?? "",
    category: s1.category,
    status: "OPEN",
    slots: Number(s2.slots),
    slotsRemaining: Number(s2.slots),
    deadline: new Date(s2.deadline).toISOString(),
    createdAt: new Date().toISOString(),
    poster: {
      id: user.id, fullName: user.fullName, avatarUrl: user.avatarUrl,
      universityName: user.universityName, city: user.city,
      avgRating: user.avgRating, reviewCount: user.reviewCount, hiredCount: user.hiredCount, skills: user.skills,
    },
    applicationCount: 0,
    isEasyApply: s2.isEasyApply,
  } : null;

  return (
    <DashboardShell role={activeRole}>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold">Post a gig</h1>
        <div className="mt-3 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className={cn("h-1.5 flex-1 rounded-full", step >= n ? "bg-brand" : "bg-muted")} />
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">Step {step} of 3</div>

        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          {step === 1 && (
            <form onSubmit={f1.handleSubmit(onStep1)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input {...f1.register("title")} placeholder="e.g. Python tutor for DS exam" />
                {f1.formState.errors.title && <p className="text-xs text-red-600 mt-1">{f1.formState.errors.title.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select {...f1.register("category")} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                  {Object.keys(CATEGORY_META).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea {...f1.register("description")} className="min-h-32" placeholder="Describe the work, expectations, schedule." />
                <div className="text-xs text-muted-foreground mt-1">{f1.watch("description")?.length ?? 0} / 2000</div>
                {f1.formState.errors.description && <p className="text-xs text-red-600 mt-1">{f1.formState.errors.description.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input {...f1.register("location")} placeholder="e.g. Library Ground Floor, UB" />
                {f1.formState.errors.location && <p className="text-xs text-red-600 mt-1">{f1.formState.errors.location.message}</p>}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...f1.register("remote")} /> Remote-friendly
              </label>
              <Button type="submit" className="bg-brand hover:bg-[color:var(--brand-dark)] text-white">Next →</Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={f2.handleSubmit(onStep2)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">University</label>
                <select {...f2.register("universityId")} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
                  <option value="">Choose…</option>
                  {CAMEROON_UNIVERSITIES.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                {f2.formState.errors.universityId && <p className="text-xs text-red-600 mt-1">{f2.formState.errors.universityId.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Budget (XAF)</label>
                  <Input type="number" {...f2.register("budget")} placeholder="5000" />
                  {f2.formState.errors.budget && <p className="text-xs text-red-600 mt-1">{f2.formState.errors.budget.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Slots</label>
                  <Input type="number" {...f2.register("slots")} min={1} max={10} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Deadline</label>
                <Input type="date" {...f2.register("deadline")} />
                {f2.formState.errors.deadline && <p className="text-xs text-red-600 mt-1">{f2.formState.errors.deadline.message}</p>}
              </div>
              <label className="flex items-center justify-between text-sm">
                <span>⚡ Enable Easy Apply</span>
                <Switch checked={f2.watch("isEasyApply")} onCheckedChange={(v) => f2.setValue("isEasyApply", v)} />
              </label>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                <Button type="submit" className="bg-brand hover:bg-[color:var(--brand-dark)] text-white">Next →</Button>
              </div>
            </form>
          )}
          {step === 3 && preview && (
            <div>
              <h3 className="font-semibold mb-3">Preview</h3>
              <div className="rounded-xl border border-border overflow-hidden">
                <GigListRow gig={preview} />
              </div>
              <div className="mt-6 flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>← Edit</Button>
                <Button onClick={submit} className="bg-brand hover:bg-[color:var(--brand-dark)] text-white">Post gig</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export function PostGig() {
  return <ProtectedRoute><PostGigForm /></ProtectedRoute>;
}
