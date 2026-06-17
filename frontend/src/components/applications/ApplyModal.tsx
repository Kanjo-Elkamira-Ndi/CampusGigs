import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateApplication } from "@/hooks/useApplications";
import type { Gig } from "@/types";

interface Props {
  gig: Gig | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ApplyModal({ gig, open, onOpenChange }: Props) {
  const [note, setNote] = useState("");
  const apply = useCreateApplication(gig?.id ?? "", {
    onSuccess: () => {
      onOpenChange(false);
      setNote("");
    },
  });
  if (!gig) return null;
  const submit = () => {
    if (note.trim().length < 10) {
      return;
    }
    apply.mutate({ coverNote: note });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to "{gig.title}"</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Tell {gig.poster.fullName} why you're a good fit. Keep it short and specific.
        </p>
        <Textarea
          placeholder="I've done this exact kind of work before…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-32"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={apply.isPending} className="bg-brand hover:bg-[color:var(--brand-dark)] text-white">
            {apply.isPending ? "Applying…" : "Submit application ⚡"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
