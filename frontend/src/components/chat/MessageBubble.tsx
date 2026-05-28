import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Props {
  text: string;
  sentAt: string;
  isMe: boolean;
}

export function MessageBubble({ text, sentAt, isMe }: Props) {
  return (
    <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
          isMe
            ? "bg-brand text-white rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm",
        )}
      >
        <div>{text}</div>
        <div className={cn("text-[10px] mt-1 opacity-70", isMe ? "text-white/80" : "text-muted-foreground")}>
          {format(new Date(sentAt), "HH:mm")}
        </div>
      </div>
    </div>
  );
}
