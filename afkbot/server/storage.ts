
import { db } from "./db";
import {
  botSettings,
  botLogs,
  type InsertBotSettings,
  type UpdateBotSettings,
  type BotSettings,
  type InsertBotLog,
  type BotLog
} from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  // Settings
  getBotSettings(): Promise<BotSettings | undefined>;
  updateBotSettings(settings: InsertBotSettings): Promise<BotSettings>;
  
  // Logs
  getLogs(limit?: number): Promise<BotLog[]>;
  addLog(log: InsertBotLog): Promise<BotLog>;
  clearLogs(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getBotSettings(): Promise<BotSettings | undefined> {
    const [settings] = await db.select().from(botSettings).limit(1);
    return settings;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    // Check if settings exist
    const existing = await this.getBotSettings();
    if (existing) {
      const [updated] = await db
        .update(botSettings)
        .set(settings)
        .where(eq(botSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(botSettings).values(settings).returning();
      return created;
    }
  }

  async getLogs(limit: number = 100): Promise<BotLog[]> {
    return await db
      .select()
      .from(botLogs)
      .orderBy(desc(botLogs.timestamp))
      .limit(limit);
  }

  async addLog(log: InsertBotLog): Promise<BotLog> {
    const [newLog] = await db.insert(botLogs).values(log).returning();
    return newLog;
  }

  async clearLogs(): Promise<void> {
    await db.delete(botLogs);
  }
}

export const storage = new DatabaseStorage();
