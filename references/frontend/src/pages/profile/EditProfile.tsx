import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { editProfileSchema, type EditProfileInput } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { CAMEROON_UNIVERSITIES } from "@/lib/constants";
import { Avatar } from "@/components/shared/Avatar";
import { DashboardShell } from "@/components/layout/DashboardShell";

function EditProfileContent() {
  const user = useAuthStore((s) => s.user)!;
  const activeRole = useAuthStore((s) => s.activeRole);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>(user.skills);
  const [skillInput, setSkillInput] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user.fullName, bio: user.bio ?? "",
      universityId: user.universityId, skills: user.skills, avatarUrl: user.avatarUrl ?? "",
    },
  });

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v) || skills.length >= 10) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const onSubmit = (d: EditProfileInput) => {
    const uni = CAMEROON_UNIVERSITIES.find((u) => u.id === d.universityId)!;
    setAuth({
      ...user, fullName: d.fullName, bio: d.bio,
      universityId: uni.id, universityName: uni.name, city: uni.city,
      skills, avatarUrl: d.avatarUrl || undefined,
    }, "mock-token");
    toast.success("Profile updated");
    navigate("/profile/" + user.id);
  };

  const avatarPreview = watch("avatarUrl");

  return (
    <PageWrapper>
      <DashboardShell role={activeRole}>
        <div className="max-w-xl mx-auto py-8">
        <h1 className="text-2xl font-bold">Edit profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar id={user.id} name={user.fullName} src={avatarPreview || undefined} size={64} />
            <div className="flex-1">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input {...register("avatarUrl")} placeholder="https://…" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Full name</label>
            <Input {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea {...register("bio")} className="min-h-24" />
            <div className="text-xs text-muted-foreground mt-1">{watch("bio")?.length ?? 0}/300</div>
          </div>
          <div>
            <label className="text-sm font-medium">University</label>
            <select {...register("universityId")} className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm">
              {CAMEROON_UNIVERSITIES.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Skills (max 10)</label>
            <div className="flex gap-2">
              <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g. Python" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
              <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-muted">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-brand hover:bg-[color:var(--brand-dark)] text-white">Save changes</Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/profile/" + user.id)}>Cancel</Button>
          </div>
        </form>
      </div>
      </DashboardShell>
    </PageWrapper>
  );
}

export function EditProfile() {
  return <ProtectedRoute><EditProfileContent /></ProtectedRoute>;
}
