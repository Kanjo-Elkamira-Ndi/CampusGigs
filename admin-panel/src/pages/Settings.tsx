import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAuthStore } from "@/store/adminAuthStore";

export default function Settings() {
  const admin = useAdminAuthStore((s) => s.admin);

  /* Profile */
  const [name, setName] = useState(admin?.fullName ?? "");
  const [saving, setSaving] = useState(false);

  const saveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated");
    }, 400);
  };

  /* Security */
  const [pw, setPw] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [changingPw, setChangingPw] = useState(false);

  const changePassword = () => {
    if (!pw.current || !pw.new || !pw.confirm) {
      toast.error("Fill in all password fields");
      return;
    }
    if (pw.new !== pw.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (pw.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setChangingPw(true);
    setTimeout(() => {
      setChangingPw(false);
      setPw({ current: "", new: "", confirm: "" });
      toast.success("Password changed");
    }, 400);
  };

  /* Notifications */
  const [prefs, setPrefs] = useState({
    emailDigest: true,
    newUserAlert: true,
    newGigAlert: true,
    reviewFlagged: false,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const savePrefs = () => {
    setSavingPrefs(true);
    setTimeout(() => {
      setSavingPrefs(false);
      toast.success("Notification preferences saved");
    }, 300);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your profile, security, and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-neutral-900">Profile</h3>
              <p className="text-sm text-neutral-500 mt-0.5">Your name and email as shown across the panel.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-name">Full name</Label>
              <Input
                id="s-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="s-email">Email</Label>
              <Input
                id="s-email"
                value={admin?.email ?? ""}
                disabled
                className="bg-neutral-50 text-neutral-500"
              />
              <p className="text-xs text-neutral-400">Email cannot be changed here.</p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={saveProfile}
                disabled={saving}
                className="bg-brand hover:bg-brand-dark"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-neutral-900">Change password</h3>
              <p className="text-sm text-neutral-500 mt-0.5">Update your admin account password.</p>
            </div>

            {(
              [
                { key: "current", label: "Current password", value: pw.current, show: showPw.current, setShow: (v: boolean) => setShowPw((p) => ({ ...p, current: v })), onChange: (v: string) => setPw((p) => ({ ...p, current: v })) },
                { key: "new", label: "New password", value: pw.new, show: showPw.new, setShow: (v: boolean) => setShowPw((p) => ({ ...p, new: v })), onChange: (v: string) => setPw((p) => ({ ...p, new: v })) },
                { key: "confirm", label: "Confirm new password", value: pw.confirm, show: showPw.confirm, setShow: (v: boolean) => setShowPw((p) => ({ ...p, confirm: v })), onChange: (v: string) => setPw((p) => ({ ...p, confirm: v })) },
              ] as const).map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`pw-${field.key}`}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={`pw-${field.key}`}
                    type={field.show ? "text" : "password"}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => field.setShow(!field.show)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    aria-label={field.show ? "Hide" : "Show"}
                  >
                    {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                onClick={changePassword}
                disabled={changingPw}
                className="bg-brand hover:bg-brand-dark"
              >
                {changingPw && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update password
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 space-y-5">
            <div>
              <h3 className="font-semibold text-neutral-900">Email notifications</h3>
              <p className="text-sm text-neutral-500 mt-0.5">
                Choose which platform events send you an email.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { key: "emailDigest" as const, label: "Daily digest", desc: "A summary of platform activity every 24 hours" },
                { key: "newUserAlert" as const, label: "New user registrations", desc: "When someone creates a new account" },
                { key: "newGigAlert" as const, label: "New gigs posted", desc: "When a new gig is published on the platform" },
                { key: "reviewFlagged" as const, label: "Flagged reviews", desc: "When a review is reported for moderation" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{item.label}</div>
                    <div className="text-xs text-neutral-500">{item.desc}</div>
                  </div>
                  <Switch
                    checked={prefs[item.key]}
                    onCheckedChange={(c) => setPrefs((p) => ({ ...p, [item.key]: c }))}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={savePrefs}
                disabled={savingPrefs}
                className="bg-brand hover:bg-brand-dark"
              >
                {savingPrefs && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save preferences
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
