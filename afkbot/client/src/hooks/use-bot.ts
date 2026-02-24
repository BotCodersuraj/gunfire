import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// ============================================
// BOT STATUS & ACTIONS
// ============================================

export function useBotAction(action: "start" | "stop" | "restart") {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const path = action === "start" ? api.bot.start.path : 
                   action === "stop" ? api.bot.stop.path : 
                   api.bot.restart.path;
      const res = await fetch(path, { method: "POST" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to ${action} bot`);
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: `Bot ${action}ed`, description: data.message });
      queryClient.invalidateQueries({ queryKey: [api.bot.status.path] });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useBotStatus() {
  return useQuery({
    queryKey: [api.bot.status.path],
    queryFn: async () => {
      const res = await fetch(api.bot.status.path);
      if (!res.ok) throw new Error("Failed to fetch bot status");
      return api.bot.status.responses[200].parse(await res.json());
    },
    refetchInterval: 2000, // Poll every 2 seconds
  });
}

export function useBotActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const startMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.bot.start.path, { method: "POST" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to start bot");
      }
      return api.bot.start.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({ title: "Bot Started", description: data.message, variant: "default" });
      queryClient.invalidateQueries({ queryKey: [api.bot.status.path] });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.bot.stop.path, { method: "POST" });
      if (!res.ok) throw new Error("Failed to stop bot");
      return api.bot.stop.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({ title: "Bot Stopped", description: data.message });
      queryClient.invalidateQueries({ queryKey: [api.bot.status.path] });
    },
  });

  const restartMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.bot.restart.path, { method: "POST" });
      if (!res.ok) throw new Error("Failed to restart bot");
      return api.bot.restart.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      toast({ title: "Bot Restarting", description: data.message });
      queryClient.invalidateQueries({ queryKey: [api.bot.status.path] });
    },
  });

  return {
    startBot: startMutation.mutate,
    stopBot: stopMutation.mutate,
    restartBot: restartMutation.mutate,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
    isRestarting: restartMutation.isPending,
  };
}

// ============================================
// LOGS
// ============================================

export function useLogs(limit = 100) {
  return useQuery({
    queryKey: [api.logs.list.path, limit],
    queryFn: async () => {
      const url = buildUrl(api.logs.list.path) + `?limit=${limit}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch logs");
      return api.logs.list.responses[200].parse(await res.json());
    },
    refetchInterval: 2000,
  });
}

export function useClearLogs() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.logs.clear.path, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear logs");
    },
    onSuccess: () => {
      toast({ title: "Logs Cleared", description: "All system logs have been removed." });
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
    },
  });
}
