import { BotLog } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Trash2, Terminal as TerminalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClearLogs } from "@/hooks/use-bot";
import { useEffect, useRef } from "react";

interface LogViewerProps {
  logs: BotLog[];
  className?: string;
  maxHeight?: string;
}

export function LogViewer({ logs, className, maxHeight = "500px" }: LogViewerProps) {
  const { mutate: clearLogs } = useClearLogs();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return "text-rose-400";
      case 'warn': return "text-amber-400";
      case 'chat': return "text-emerald-400";
      case 'info': return "text-blue-400";
      default: return "text-zinc-400";
    }
  };

  return (
    <div className={`flex flex-col bg-[#0d1117] rounded-xl border border-border shadow-2xl overflow-hidden ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <TerminalIcon className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">system_logs.log</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] h-5 border-white/10 text-muted-foreground">
            {logs.length} Lines
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-white/10 hover:text-rose-400"
            onClick={() => clearLogs()}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Logs Area */}
      <ScrollArea className="flex-1 w-full bg-[#0d1117]" style={{ height: maxHeight }}>
        <div className="p-4 font-mono text-xs space-y-1.5">
          {logs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground/50 italic">
              No logs available. Start the bot to see activity.
            </div>
          )}
          
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 hover:bg-white/5 p-0.5 rounded px-2 transition-colors group">
              <span className="text-zinc-500 select-none w-20 shrink-0">
                {log.timestamp ? format(new Date(log.timestamp), "HH:mm:ss") : "--:--:--"}
              </span>
              <span className={`font-bold w-12 shrink-0 uppercase ${getLogColor(log.level)}`}>
                [{log.level}]
              </span>
              <span className="text-zinc-300 break-all group-hover:text-white transition-colors">
                {log.message}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
