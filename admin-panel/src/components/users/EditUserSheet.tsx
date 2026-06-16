import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { AdminUserRow } from "@/api/users.api";
import { useUniversities } from "@/hooks/useUniversities";
import { useUpdateUser } from "@/hooks/useUsers";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  role: z.enum(["WORKER", "POSTER", "ADMIN"]),
  universityId: z.string().nullable().optional(),
  emailVerified: z.boolean(),
});

interface EditUserSheetProps {
  user: AdminUserRow | null;
  onClose: () => void;
}

export function EditUserSheet({ user, onClose }: EditUserSheetProps) {
  const update = useUpdateUser();
  const { data: universities = [] } = useUniversities();
  const [form, setForm] = useState({
    fullName: "",
    role: "WORKER" as "WORKER" | "POSTER" | "ADMIN",
    universityId: null as string | null,
    emailVerified: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        role: user.role,
        universityId: user.universityId ?? user.university?.id ?? null,
        emailVerified: user.emailVerified,
      });
      setErrors({});
    }
  }, [user]);

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        e[i.path[0] as string] = i.message;
      });
      setErrors(e);
      return;
    }
    if (!user) return;
    update.mutate(
      { id: user.id, payload: parsed.data },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Sheet open={!!user} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>Edit user</SheetTitle>
          <SheetDescription>Update profile details and permissions.</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-6 px-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, role: v as typeof f.role }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WORKER">WORKER</SelectItem>
                <SelectItem value="POSTER">POSTER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>University</Label>
            <Select
              value={form.universityId ?? "__none__"}
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  universityId: v === "__none__" ? null : v,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— None —</SelectItem>
                {universities.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="emailVerified">Email verified</Label>
            <Switch
              id="emailVerified"
              checked={form.emailVerified}
              onCheckedChange={(c) =>
                setForm((f) => ({ ...f, emailVerified: c }))
              }
            />
          </div>
        </div>

        <SheetFooter className="px-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={update.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
