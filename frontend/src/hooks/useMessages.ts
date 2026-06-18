import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/api";
import type { MessageAttachment } from "@/types";

export function useThreads() {
  return useQuery({
    queryKey: ["messages", "threads"],
    queryFn: messagesApi.listThreads,
    refetchInterval: 30_000,
  });
}

export function useThread(threadId: string) {
  return useQuery({
    queryKey: ["messages", "thread", threadId],
    queryFn: () => messagesApi.getThread(threadId),
    enabled: !!threadId,
  });
}

interface SendPayload {
  text: string;
  attachments?: MessageAttachment[];
  isVoice?: boolean;
}

export function useSendMessage(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendPayload) => messagesApi.sendMessage(threadId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages", "thread", threadId] });
      qc.invalidateQueries({ queryKey: ["messages", "threads"] });
    },
  });
}
