import { useState, useEffect, useRef, useCallback } from "react";
import { useBlocker, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CAMEROON_UNIVERSITIES } from "@/lib/constants";
import { cn, getAvatarColor, getInitials } from "@/lib/utils";
import { useUpdateProfile } from "@/hooks/useUsers";
import { useChangePassword, useDeleteAccount, useSignOutAll, useLogout } from "@/hooks/useAuth";
import { authApi } from "@/api/auth";
import {
  Camera,
  X,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Shield,
  Trash2,
  LogOut,
} from "lucide-react";

const NOTIF_KEY = "campus-gigs-notification-prefs";

const NOTIF_ITEMS = [
  { key: "new_messages", label: "New messages" },
  { key: "new_applicants", label: "New applicants" },
  { key: "gig_updates", label: "Gig status updates" },
  { key: "marketing_emails", label: "Marketing & promotions" },
  { key: "weekly_digest", label: "Weekly digest" },
] as const;

type NotifMap = Record<string, boolean>;

function loadNotifs(): NotifMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return Object.fromEntries(NOTIF_ITEMS.map((n) => [n.key, true]));
}

function saveNotifs(prefs: NotifMap) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
}

function passwordStrength(pw: string): "weak" | "fair" | "strong" | null {
  if (!pw) return null;
  if (pw.length < 8) return "weak";
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  const variety = +hasUpper + +hasLower + +hasDigit + +hasSymbol;
  if (variety >= 3 && pw.length >= 10) return "strong";
  if (variety >= 2) return "fair";
  return "weak";
}

const strengthColors = { weak: "bg-red-500", fair: "bg-amber-500", strong: "bg-green-500" };
const strengthLabels = { weak: "Weak", fair: "Fair", strong: "Strong" };

function SettingsContent() {
  const user = useAuthStore((s) => s.user)!;
  const activeRole = useAuthStore((s) => s.activeRole);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();
  const signOutAll = useSignOutAll();
  const signOut = useLogout();

  const isWorker = user.role === "WORKER" || activeRole === "WORKER";

  const [fullName, setFullName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio ?? "");
  const [universityId, setUniversityId] = useState(user.universityId);
  const [skills, setSkills] = useState<string[]>(user.skills);
  const [skillInput, setSkillInput] = useState("");
  const [avatarSrc, setAvatarSrc] = useState(user.avatarUrl ?? "");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifs, setNotifs] = useState<NotifMap>(loadNotifs);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [blockerOpen, setBlockerOpen] = useState(false);

  const profileDirty =
    fullName !== user.fullName ||
    bio !== (user.bio ?? "") ||
    universityId !== user.universityId ||
    JSON.stringify(skills) !== JSON.stringify(user.skills) ||
    avatarSrc !== (user.avatarUrl ?? "");

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      profileDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setBlockerOpen(true);
    }
  }, [blocker.state]);

  const handleBlockerStay = () => {
    setBlockerOpen(false);
    blocker.reset?.();
  };

  const handleBlockerLeave = () => {
    setBlockerOpen(false);
    blocker.proceed?.();
  };

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarSrc(url);
    toast.success("Avatar updated (preview) — save to persist");
  }, []);

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v) || skills.length >= 10) return;
    setSkills([...skills, v]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s));

  const handleSaveProfile = () => {
    updateProfile.mutate({
      fullName,
      bio: bio || undefined,
      universityId,
      skills,
    });
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  const handleResendVerification = () => {
    authApi.resendVerification().then(() => {
      toast.success("Verification email sent to " + user.email);
    });
  };

  const handleSignOutAll = () => {
    signOutAll.mutate();
  };

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => navigate("/"),
    });
  };

  const handleDeleteAccount = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        setDeleteOpen(false);
        navigate("/");
      },
    });
  };

  const pwStrength = passwordStrength(newPassword);
  const pwValid =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword &&
    pwStrength !== null &&
    pwStrength !== "weak";

  const handleNotifToggle = (key: string, checked: boolean) => {
    const next = { ...notifs, [key]: checked };
    setNotifs(next);
    saveNotifs(next);
  };

  return (
    <PageWrapper>
      <DashboardShell role={activeRole}>
        <div className="max-w-2xl mx-auto py-6 space-y-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your profile, account, and preferences
            </p>
          </div>

          {/* ─── Section 1: Profile settings ─── */}
          <section>
            <h2 className="text-base font-semibold mb-4">Profile settings</h2>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative group rounded-full overflow-hidden"
                >
                  <Avatar className="h-16 w-16">
                    {avatarSrc ? (
                      <AvatarImage src={avatarSrc} alt={user.fullName} />
                    ) : (
                      <AvatarFallback
                        className="text-base font-semibold"
                        style={{ backgroundColor: getAvatarColor(user.id) }}
                      >
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera size={16} className="text-white" />
                  </span>
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{user.fullName}</p>
                  <p>Click to change photo</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-name">Display name</Label>
                <Input
                  id="display-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself…"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Select value={universityId} onValueChange={setUniversityId}>
                  <SelectTrigger id="university" className="w-full">
                    <SelectValue placeholder="Select a university" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMEROON_UNIVERSITIES.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isWorker && (
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (max 10)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. Python"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSkill}
                      disabled={!skillInput.trim() || skills.length >= 10}
                    >
                      Add
                    </Button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => removeSkill(s)}
                            className="hover:text-destructive transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Press Enter or click Add to add a skill
                  </p>
                </div>
              )}

              <Button onClick={handleSaveProfile} disabled={!profileDirty}>
                {!profileDirty ? "Saved" : "Save changes"}
              </Button>
            </div>
          </section>

          <Separator />

          {/* ─── Section 2: Account & email ─── */}
          <section>
            <h2 className="text-base font-semibold mb-4">Account &amp; email</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Email address</p>
                </div>
                <Badge
                  variant={user.emailVerified ? "default" : "secondary"}
                  className={cn(
                    "gap-1 shrink-0",
                    user.emailVerified &&
                      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800",
                  )}
                >
                  {user.emailVerified ? (
                    <>
                      <CheckCircle size={12} /> Verified
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={12} /> Unverified
                    </>
                  )}
                </Badge>
              </div>

              {!user.emailVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                >
                  Resend verification email
                </Button>
              )}

              <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Change email</p>
                  <p className="text-xs text-muted-foreground">
                    Update your email address
                  </p>
                </div>
                <span className="text-xs text-muted-foreground italic">
                  Coming soon
                </span>
              </div>
            </div>
          </section>

          <Separator />

          {/* ─── Section 3: Password ─── */}
          <section>
            <h2 className="text-base font-semibold mb-4">Password</h2>
            <div className="space-y-4 max-w-sm">
              <div className="space-y-2">
                <Label htmlFor="current-pw">Current password</Label>
                <Input
                  id="current-pw"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pw">New password</Label>
                <Input
                  id="new-pw"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword && pwStrength && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {(["weak", "fair", "strong"] as const).map((lvl) => (
                        <div
                          key={lvl}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-colors",
                            lvl === "weak"
                              ? pwStrength === "weak"
                                ? strengthColors.weak
                                : "bg-muted"
                              : lvl === "fair"
                                ? pwStrength === "fair" || pwStrength === "strong"
                                  ? strengthColors.fair
                                  : "bg-muted"
                                : pwStrength === "strong"
                                  ? strengthColors.strong
                                  : "bg-muted",
                          )}
                        />
                      ))}
                    </div>
                    <p
                      className={cn(
                        "text-[11px] font-medium",
                        pwStrength === "weak" && "text-red-500",
                        pwStrength === "fair" && "text-amber-500",
                        pwStrength === "strong" && "text-green-500",
                      )}
                    >
                      {strengthLabels[pwStrength]}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pw">Confirm new password</Label>
                <Input
                  id="confirm-pw"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-red-500">Passwords do not match</p>
                )}
              </div>
              <Button
                onClick={handleUpdatePassword}
                disabled={!pwValid}
              >
                Update password
              </Button>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                After updating, you&apos;ll need to sign in again on all devices.
              </p>
            </div>
          </section>

          <Separator />

          {/* ─── Section 4: Notifications ─── */}
          <section>
            <h2 className="text-base font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
              {NOTIF_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3"
                >
                  <Label
                    htmlFor={`notif-${item.key}`}
                    className="text-sm cursor-pointer"
                  >
                    {item.label}
                  </Label>
                  <Switch
                    id={`notif-${item.key}`}
                    checked={notifs[item.key] ?? true}
                    onCheckedChange={(checked) =>
                      handleNotifToggle(item.key, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* ─── Section 5: Active sessions ─── */}
          <section>
            <h2 className="text-base font-semibold mb-4">Active sessions</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-sm font-medium">This device</p>
                    <p className="text-xs text-muted-foreground">
                      {navigator.platform ?? "Web"} &middot; Active now
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800">
                  <Shield size={10} className="mr-1" />
                  Current
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOutAll}>
                Sign out all other devices
              </Button>
            </div>
          </section>

          <Separator />

          {/* ─── Section 6: Danger zone ─── */}
          <section>
            <h2 className="text-base font-semibold mb-4 text-red-600 dark:text-red-400">
              Danger zone
            </h2>
            <div className="rounded-xl border border-red-200 dark:border-red-900/60 p-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOut size={15} className="mr-1.5" />
                  Sign out
                </Button>

                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDeleteOpen(true)}
                    className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 size={15} className="mr-1.5" />
                    Delete account
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete your account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This cannot be undone. To confirm, type{" "}
                        <strong className="text-foreground">{user.email}</strong>{" "}
                        below.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder={user.email}
                      className="mt-2"
                    />
                    <AlertDialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDeleteOpen(false);
                          setConfirmEmail("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={confirmEmail !== user.email}
                        onClick={handleDeleteAccount}
                      >
                        Delete my account
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </section>
        </div>
      </DashboardShell>

      {/* ─── Unsaved changes blocker ─── */}
      <AlertDialog open={blockerOpen} onOpenChange={setBlockerOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved profile changes. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleBlockerStay}>
              Keep editing
            </Button>
            <Button variant="destructive" onClick={handleBlockerLeave}>
              Discard changes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}

export function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
