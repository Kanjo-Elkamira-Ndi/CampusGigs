import type { MessageAttachment } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FileText, Download } from "lucide-react";

interface Props {
  text: string;
  sentAt: string;
  isMe: boolean;
  isConsecutive?: boolean;
  attachments?: MessageAttachment[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ImageAttachment({ att }: { att: MessageAttachment }) {
  return (
    <div
      className="relative mt-1.5 overflow-hidden rounded-xl border border-foreground/10 bg-muted"
      style={{ aspectRatio: att.width && att.height ? `${att.width}/${att.height}` : "16/9" }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
        <img
          src={att.url}
          alt={att.fileName ?? "image"}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).parentElement!.classList.add("flex");
          }}
        />
      </div>
    </div>
  );
}

function FileAttachment({ att, isMe }: { att: MessageAttachment; isMe: boolean }) {
  return (
    <a
      href={att.url}
      download={att.fileName}
      className={cn(
        "flex items-center gap-3 mt-1.5 px-3 py-2 rounded-xl border transition-colors",
        isMe
          ? "border-indigo-400/30 bg-indigo-500/20 hover:bg-indigo-500/30"
          : "border-border/60 bg-muted/30 hover:bg-muted/60",
      )}
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/60 text-muted-foreground shrink-0">
        <FileText size={18} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{att.fileName}</div>
        {att.fileSize && (
          <div className="text-[11px] text-muted-foreground">{formatSize(att.fileSize)}</div>
        )}
      </div>
      <Download size={15} className="shrink-0 text-muted-foreground" />
    </a>
  );
}

export function MessageBubble({ text, sentAt, isMe, isConsecutive, attachments }: Props) {
  const hasAttachments = attachments && attachments.length > 0;
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
        {text && <p className="text-pretty">{text}</p>}
        {hasAttachments &&
          attachments.map((att) =>
            att.type === "image" ? (
              <ImageAttachment key={att.url} att={att} />
            ) : (
              <FileAttachment key={att.url} att={att} isMe={isMe} />
            ),
          )}
        <div
          className={cn(
            "flex items-center gap-1",
            "transition-opacity duration-200",
            text || hasAttachments ? "opacity-0 group-hover:opacity-100 mt-1" : "",
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
