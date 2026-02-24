import { LogViewer } from "@/components/LogViewer";
import { useBotStatus, useLogs, useBotAction } from "@/hooks/use-bot";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: status, isLoading: statusLoading } = useBotStatus();
  const { data: logs, isLoading: logsLoading } = useLogs(50);
  const { mutate: startBot, isPending: isStarting } = useBotAction("start");

  useEffect(() => {
    if (status && !status.running && !isStarting) {
      startBot();
    }
  }, [status?.running, isStarting]);

  if (statusLoading || logsLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-mono">
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-full mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-white/20 pb-2">
            <h1 className="text-xl font-bold text-green-500">SHADOWS_KING Console</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status?.running ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {status?.running ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
              <span className="text-white/60">LORTALSMP.ATERNOS.ME:36896</span>
            </div>
          </div>
          <LogViewer logs={logs || []} maxHeight="calc(100vh - 80px)" />
        </div>
      </main>
    </div>
  );
}
