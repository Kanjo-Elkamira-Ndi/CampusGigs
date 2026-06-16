import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useCreateUniversity, useUniversities } from "@/hooks/useUniversities";
import type { University } from "@/api/universities.api";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  type: z.enum(["public", "private"]),
});
type FormValues = z.infer<typeof schema>;

export default function Universities() {
  const { data = [], isLoading, error, refetch } = useUniversities();
  const create = useCreateUniversity();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "public" },
  });
  const typeValue = watch("type");

  const onSubmit = (values: FormValues) =>
    create.mutate(values, {
      onSuccess: () => {
        reset({ name: "", city: "", type: "public" });
        setOpen(false);
        refetch();
      },
    });

  const columns: DataTableColumn<University>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => <span className="font-medium text-neutral-900">{u.name}</span>,
    },
    {
      key: "city",
      header: "City",
      render: (u) => <span className="text-neutral-500">{u.city}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (u) => (
        <StatusBadge tone={u.type === "public" ? "blue" : "amber"}>{u.type}</StatusBadge>
      ),
    },
    { key: "users", header: "Users", render: (u) => u.userCount ?? 0 },
    { key: "gigs", header: "Gigs", render: (u) => u.gigCount ?? 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Universities</h1>
        <Button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus size={16} className="mr-2" /> Add University
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={data}
        rowKey={(u) => u.id}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        emptyIcon={Building2}
        emptyTitle="No universities yet"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add university</DialogTitle>
            <DialogDescription>
              Create a new university that students can affiliate with.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="u-name">Name</Label>
              <Input id="u-name" {...register("name")} placeholder="University of Yaoundé I" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="u-city">City</Label>
              <Input id="u-city" {...register("city")} placeholder="Yaoundé" />
              {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={typeValue}
                onValueChange={(v) => setValue("type", v as "public" | "private")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={create.isPending}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
