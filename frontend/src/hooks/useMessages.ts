import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/api";

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

export function useSendMessage(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => messagesApi.sendMessage(threadId, text),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages", "thread", threadId] });
      qc.invalidateQueries({ queryKey: ["messages", "threads"] });
    },
  });
}
