import { Sidebar } from "@/components/Sidebar";
import { LogViewer } from "@/components/LogViewer";
import { useLogs } from "@/hooks/use-bot";
import { motion } from "framer-motion";

export default function Logs() {
  const { data: logs, isLoading } = useLogs(500); // Fetch more logs for the full viewer

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 h-full flex flex-col">
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col gap-6">
          
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
            <p className="text-muted-foreground">Detailed history of bot actions, chat messages, and errors.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex-1 min-h-0"
          >
            {isLoading ? (
               <div className="w-full h-full flex items-center justify-center bg-card rounded-xl border border-border">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               </div>
            ) : (
                <LogViewer logs={logs || []} className="h-full" maxHeight="100%" />
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}
