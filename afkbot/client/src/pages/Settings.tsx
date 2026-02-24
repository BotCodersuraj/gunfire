import { Sidebar } from "@/components/Sidebar";
import { useSettings, useUpdateSettings } from "@/hooks/use-bot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBotSettingsSchema } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";
import { Save, Server, Shield, MessageSquare, MapPin, User, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm({
    resolver: zodResolver(insertBotSettingsSchema),
    defaultValues: {
      botUsername: "",
      botPassword: "",
      botAuthType: "offline",
      serverIp: "",
      serverPort: 25565,
      serverVersion: "1.20.1",
      positionEnabled: false,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      autoAuthEnabled: false,
      autoAuthPassword: "",
      antiAfkEnabled: true,
      antiAfkSneak: true,
      chatMessagesEnabled: false,
      chatMessagesRepeat: false,
      chatMessagesRepeatDelay: 60,
      chatMessagesList: [],
      autoReconnect: true,
      autoReconnectDelay: 30000,
    },
  });

  // Load settings into form when data arrives
  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  function onSubmit(values: any) {
    updateSettings.mutate(values);
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">Configure your bot's behavior and connection details.</p>
            </div>
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={updateSettings.isPending}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateSettings.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Account & Server */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <CardTitle>Account & Server</CardTitle>
                    </div>
                    <CardDescription>Connection credentials and target server details.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="botUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="BotName" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="botAuthType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auth Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select auth type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="offline">Offline (Cracked)</SelectItem>
                              <SelectItem value="microsoft">Microsoft</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch("botAuthType") === "microsoft" && (
                      <FormField
                        control={form.control}
                        name="botPassword"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Password (Microsoft)</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Leave empty for cache" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <Separator className="col-span-2 my-2" />
                    <FormField
                      control={form.control}
                      name="serverIp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Server IP</FormLabel>
                          <FormControl>
                            <Input placeholder="play.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serverPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Port</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serverVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Version</FormLabel>
                          <FormControl>
                            <Input placeholder="1.20.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Movement & Position */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <CardTitle>Movement & Position</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="positionEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Move to coordinates</FormLabel>
                            <FormDescription>
                              The bot will attempt to pathfind to these coordinates after joining.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    {form.watch("positionEnabled") && (
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="positionX"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>X</FormLabel>
                              <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="positionY"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Y</FormLabel>
                              <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="positionZ"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Z</FormLabel>
                              <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Anti-AFK & Automation */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <CardTitle>Automation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="antiAfkEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Anti-AFK</FormLabel>
                            <FormDescription>Prevent getting kicked for inactivity.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="autoReconnect"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Auto Reconnect</FormLabel>
                            <FormDescription>Reconnect automatically when disconnected.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-2">
                        <Separator className="my-2" />
                        <h4 className="text-sm font-medium mb-4 mt-4 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" /> Auto-Auth (LoginSecurity)
                        </h4>
                    </div>

                    <FormField
                      control={form.control}
                      name="autoAuthEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Enable Auto-Auth</FormLabel>
                            <FormDescription>Automatically run /register and /login.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    {form.watch("autoAuthEnabled") && (
                        <FormField
                            control={form.control}
                            name="autoAuthPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Auth Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Server password" {...field} value={field.value || ""} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Chat & Messages */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <CardTitle>Chat & Spam</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="chatMessagesEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Enable Chat Messages</FormLabel>
                            <FormDescription>Send automated messages to the server chat.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("chatMessagesEnabled") && (
                        <div className="space-y-4 border-l-2 border-primary/20 pl-4">
                            <FormField
                                control={form.control}
                                name="chatMessagesRepeat"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel className="font-normal">Loop messages</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="chatMessagesRepeatDelay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delay (seconds)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <div className="flex justify-end">
                <Button 
                    size="lg" 
                    onClick={form.handleSubmit(onSubmit)} 
                    disabled={updateSettings.isPending}
                    className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
                >
                    {updateSettings.isPending ? "Saving..." : "Save All Changes"}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
