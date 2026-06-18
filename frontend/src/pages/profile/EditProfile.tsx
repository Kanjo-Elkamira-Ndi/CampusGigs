import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
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
import { useUpdateProfile } from "@/hooks/useUsers";
import { uploadAvatar as uploadAvatarApi, universityRequestsApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

function EditProfileContent() {
  const user = useAuthStore((s) => s.user)!;
  const activeRole = useAuthStore((s) => s.activeRole);
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [skills, setSkills] = useState<string[]>(user.skills);
  const [skillInput, setSkillInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const { data: pendingRequest, refetch: refetchRequest } = useQuery({
    queryKey: ["university-request", "my"],
    queryFn: () => universityRequestsApi.getMyRequest(),
    enabled: user.universityId === "other",
  });

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview !== user.avatarUrl) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
  };

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user.fullName,
      bio: user.bio ?? "",
      universityId: user.universityId,
      customUniversity: "",
      skills: user.skills,
      avatarUrl: user.avatarUrl ?? "",
    },
  });

  const selectedUniversityId = watch("universityId");

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v) || skills.length >= 10) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const onSubmit = async (d: EditProfileInput) => {
    let avatarUrl = user.avatarUrl;

    if (avatarFile) {
      setUploading(true);
      try {
        const result = await uploadAvatarApi(avatarFile);
        avatarUrl = result.avatarUrl;
      } catch {
        toast.error("Failed to upload avatar");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    updateProfile.mutate(
      {
        fullName: d.fullName,
        bio: d.bio,
        universityId: d.universityId,
        skills,
        avatarUrl: avatarUrl ?? undefined,
      },
      {
        onSuccess: () => {
          if (d.universityId === "other" && d.customUniversity) {
            setSubmittingRequest(true);
            universityRequestsApi
              .create({ name: d.customUniversity })
              .then(() => {
                toast.success("University request submitted for admin approval");
                refetchRequest();
              })
              .catch(() => toast.error("Failed to submit university request"))
              .finally(() => setSubmittingRequest(false));
          }
          navigate("/profile/" + user.id);
        },
      }
    );
  };

  return (
    <PageWrapper>
      <DashboardShell role={activeRole}>
        <div className="max-w-xl mx-auto py-8">
          <h1 className="text-2xl font-bold">Edit profile</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar id={user.id} name={user.fullName} src={avatarPreview} size={64} />
              <div className="flex-1">
                <label className="text-sm font-medium">Avatar</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className="flex gap-2 mt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} className="mr-1" />
                    {avatarFile ? "Change" : "Upload"}
                  </Button>
                  {avatarFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(user.avatarUrl);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
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
                {CAMEROON_UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              {selectedUniversityId === "other" && (
                <div className="mt-2">
                  <Input
                    {...register("customUniversity")}
                    placeholder="Type your university name…"
                  />
                  {pendingRequest && (
                    <p className="text-xs mt-1 text-muted-foreground">
                      Request status: <span className="font-medium">{pendingRequest.status === "PENDING" ? "Pending approval" : pendingRequest.status === "APPROVED" ? "Approved" : "Declined"}</span>
                    </p>
                  )}
                </div>
              )}
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
              <Button type="submit" disabled={updateProfile.isPending || uploading || submittingRequest} className="bg-brand hover:bg-[color:var(--brand-dark)] text-white">
                {uploading ? "Uploading…" : submittingRequest ? "Submitting…" : updateProfile.isPending ? "Saving…" : "Save changes"}
              </Button>
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
