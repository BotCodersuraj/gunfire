import { BotStatus } from "@shared/schema";
import { Activity, Power, PowerOff, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBotActions } from "@/hooks/use-bot";

interface StatusCardProps {
  status?: {
    running: boolean;
    username?: string;
    host?: string;
  };
}

export function StatusCard({ status }: StatusCardProps) {
  const { startBot, stopBot, restartBot, isStarting, isStopping, isRestarting } = useBotActions();
  const isRunning = status?.running ?? false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Status Indicator */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-lg relative overflow-hidden group">
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-bl-full transition-all duration-500",
          isRunning ? "from-emerald-500 to-green-500 group-hover:opacity-20" : "from-rose-500 to-red-500 group-hover:opacity-20"
        )} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-2 rounded-lg",
              isRunning ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Bot Status</h3>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className={cn(
              "text-3xl font-bold tracking-tight",
              isRunning ? "text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "text-rose-500"
            )}>
              {isRunning ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isRunning ? `Connected as ${status?.username}` : "Bot is currently stopped"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Control</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Manage the bot process directly from here.
          </p>
        </div>

        <div className="flex gap-3">
          {!isRunning ? (
            <Button 
              onClick={() => startBot()} 
              disabled={isStarting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
            >
              <Power className="w-4 h-4 mr-2" />
              {isStarting ? "Starting..." : "Start Bot"}
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => stopBot()} 
                disabled={isStopping}
                variant="destructive"
                className="flex-1 shadow-lg shadow-red-900/20"
              >
                <PowerOff className="w-4 h-4 mr-2" />
                {isStopping ? "Stopping..." : "Stop Bot"}
              </Button>
              <Button 
                onClick={() => restartBot()} 
                disabled={isRestarting}
                variant="secondary"
                className="flex-1"
              >
                Restart
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
