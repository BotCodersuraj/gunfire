
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { BotManager } from "./bot"; // We'll create this to manage the mineflayer instance

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize Bot Manager
  const botManager = new BotManager(storage);

  // --- Settings Routes ---
  app.get(api.settings.get.path, async (req, res) => {
    let settings = await storage.getBotSettings();
    if (!settings) {
        // Initialize default settings if none exist
        const defaultSettings = {
            botUsername: "MyBot",
            botAuthType: "offline",
            serverIp: "localhost",
            serverPort: 25565,
            serverVersion: "1.20.1",
            positionEnabled: false,
            autoAuthEnabled: false,
            antiAfkEnabled: true,
            chatMessagesEnabled: false,
            autoReconnect: true,
            isRunning: false,
            chatMessagesList: []
        };
        settings = await storage.updateBotSettings(defaultSettings);
    }
    res.json(settings);
  });

  app.post(api.settings.update.path, async (req, res) => {
    try {
      const input = api.settings.update.input.parse(req.body);
      const settings = await storage.updateBotSettings(input);
      
      // If bot is running, we might need to restart it or update live config
      // For simplicity, we just update DB. User needs to restart bot to apply major changes.
      
      res.json(settings);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // --- Bot Control Routes ---
  app.post(api.bot.start.path, async (req, res) => {
    const success = await botManager.start();
    if (success) {
      res.json({ message: "Bot started successfully", status: "running" });
    } else {
      res.status(400).json({ message: "Bot failed to start or is already running" });
    }
  });

  app.post(api.bot.stop.path, async (req, res) => {
    await botManager.stop();
    res.json({ message: "Bot stopped", status: "stopped" });
  });

  app.post(api.bot.restart.path, async (req, res) => {
      await botManager.stop();
      // Small delay to ensure cleanup
      setTimeout(async () => {
          await botManager.start();
      }, 1000);
      res.json({ message: "Bot restarting...", status: "restarting" });
  });

  app.get(api.bot.status.path, async (req, res) => {
    const status = botManager.getStatus();
    res.json(status);
  });

  // --- Logs Routes ---
  app.get(api.logs.list.path, async (req, res) => {
    const limit = Number(req.query.limit) || 100;
    const logs = await storage.getLogs(limit);
    res.json(logs);
  });

  app.delete(api.logs.clear.path, async (req, res) => {
      await storage.clearLogs();
      res.status(204).send();
  });

  return httpServer;
}
