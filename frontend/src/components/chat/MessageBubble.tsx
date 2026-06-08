import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Props {
  text: string;
  sentAt: string;
  isMe: boolean;
  isConsecutive?: boolean;
}

export function MessageBubble({ text, sentAt, isMe, isConsecutive }: Props) {
  return (
    <div className={cn("flex group", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[65ch] px-3.5 py-2 text-sm leading-relaxed transition-shadow duration-200",
          "border",
          isMe
            ? cn(
                "bg-indigo-600 text-white border-indigo-500/20",
                isConsecutive ? "rounded-2xl" : "rounded-2xl rounded-br-md",
              )
            : cn(
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200/60 dark:border-gray-700/60",
                isConsecutive ? "rounded-2xl" : "rounded-2xl rounded-bl-md",
              ),
        )}
      >
        <p className="text-pretty">{text}</p>
        <div
          className={cn(
            "flex items-center gap-1 mt-1 transition-opacity duration-200",
            "opacity-0 group-hover:opacity-100",
          )}
        >
          <span
            className={cn(
              "text-[10px] tabular-nums leading-none",
              isMe ? "text-indigo-200" : "text-gray-400 dark:text-gray-500",
            )}
          >
            {format(new Date(sentAt), "HH:mm")}
          </span>
        </div>
      </div>
    </div>
  );
}
