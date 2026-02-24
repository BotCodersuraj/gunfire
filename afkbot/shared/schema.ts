
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  botUsername: text("bot_username").notNull().default("SHADOWS_KING"),
  botPassword: text("bot_password").default(""),
  botAuthType: text("bot_auth_type").notNull().default("offline"), // 'mojang', 'microsoft', 'offline'
  
  serverIp: text("server_ip").notNull().default("LORTALSMP.ATERNOS.ME"),
  serverPort: integer("server_port").notNull().default(36896),
  serverVersion: text("server_version").notNull().default("1.21.1"),

  positionEnabled: boolean("position_enabled").default(false),
  positionX: integer("position_x").default(0),
  positionY: integer("position_y").default(0),
  positionZ: integer("position_z").default(0),

  autoAuthEnabled: boolean("auto_auth_enabled").default(false),
  autoAuthPassword: text("auto_auth_password").default(""),

  antiAfkEnabled: boolean("anti_afk_enabled").default(true),
  antiAfkSneak: boolean("anti_afk_sneak").default(true),

  chatMessagesEnabled: boolean("chat_messages_enabled").default(false),
  chatMessagesRepeat: boolean("chat_messages_repeat").default(false),
  chatMessagesRepeatDelay: integer("chat_messages_repeat_delay").default(60),
  chatMessagesList: text("chat_messages_list").array().default([]), // Store as array of strings

  autoReconnect: boolean("auto_reconnect").default(true),
  autoReconnectDelay: integer("auto_reconnect_delay").default(60000),
  
  isRunning: boolean("is_running").default(false), // To track desired state
});

export const botLogs = pgTable("bot_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  level: text("level").notNull(), // 'info', 'warn', 'error', 'chat'
  message: text("message").notNull(),
  source: text("source").default("system"), // 'bot', 'system'
});

// === SCHEMAS ===

export const insertBotSettingsSchema = createInsertSchema(botSettings).omit({ id: true });
export const insertBotLogSchema = createInsertSchema(botLogs).omit({ id: true, timestamp: true });

// === EXPLICIT TYPES ===

export type BotSettings = typeof botSettings.$inferSelect;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;
export type UpdateBotSettings = Partial<InsertBotSettings>;

export type BotLog = typeof botLogs.$inferSelect;
export type InsertBotLog = z.infer<typeof insertBotLogSchema>;

export type BotStatus = {
  isRunning: boolean;
  uptime?: number;
  lastError?: string;
};

// Request/Response types
export type BotSettingsResponse = BotSettings;
export type BotLogsResponse = BotLog[];
