import { useState, useRef, useCallback } from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (blob: Blob) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onSend, disabled }: Props) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setRecording(false);
    setDuration(0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          onSend(blob);
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d >= 30) {
            stopRecording();
            return 0;
          }
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, [onSend, stopRecording]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={recording ? stopRecording : startRecording}
      className={cn(
        "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-150 active:scale-95",
        recording
          ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 animate-pulse"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
      title={recording ? "Stop recording" : "Record voice message"}
    >
      {recording ? (
        <div className="flex items-center gap-1">
          <Square size={14} />
          <span className="text-[10px] font-mono tabular-nums">{duration}s</span>
        </div>
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
}
