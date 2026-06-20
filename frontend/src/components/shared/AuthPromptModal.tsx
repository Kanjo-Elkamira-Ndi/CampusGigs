import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthPromptModal({ open, onOpenChange }: Props) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap size={24} />
          </div>
          <DialogTitle className="text-center">Create an account</DialogTitle>
          <DialogDescription className="text-center">
            Sign up for free to view profiles, hire talent, and post gigs on your campus.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={() => { onOpenChange(false); navigate("/register"); }}
            className="w-full bg-brand hover:bg-[color:var(--brand-dark)] text-white"
          >
            Create account
          </Button>
          <Button
            variant="outline"
            onClick={() => { onOpenChange(false); navigate("/login"); }}
            className="w-full"
          >
            Log in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
