import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import type { Gig } from "@/types";

interface Props {
  gig: Gig | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ApplyModal({ gig, open, onOpenChange }: Props) {
  const [note, setNote] = useState("");
  if (!gig) return null;
  const submit = () => {
    if (note.trim().length < 10) {
      toast.error("Add a short cover note (10+ chars).");
      return;
    }
    toast.success("Application submitted! 🎉");
    onOpenChange(false);
    setNote("");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to “{gig.title}”</DialogTitle>
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
          <Button onClick={submit} className="bg-brand hover:bg-[color:var(--brand-dark)] text-white">
            Submit application ⚡
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
