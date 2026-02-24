
import mineflayer from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
const { pathfinder, Movements, goals } = pathfinderPkg;
import minecraftData from 'minecraft-data';
import { IStorage } from './storage';
import { BotSettings } from '@shared/schema';

type BotStatus = {
    running: boolean;
    username?: string;
    host?: string;
};

export class BotManager {
    private bot: mineflayer.Bot | null = null;
    private storage: IStorage;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private isStopping = false;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    async start(): Promise<boolean> {
        if (this.bot) return false;
        
        const settings = await this.storage.getBotSettings();
        if (!settings) return false;

        this.isStopping = false;

        try {
            this.bot = mineflayer.createBot({
                username: settings.botUsername,
                password: settings.botPassword || undefined,
                auth: settings.botAuthType as 'mojang' | 'microsoft' | 'offline',
                host: settings.serverIp,
                port: settings.serverPort,
                version: settings.serverVersion === "auto" ? undefined : settings.serverVersion,
            });

            this.setupEvents(this.bot, settings);
            
            // Update running state
            await this.storage.updateBotSettings({ ...settings, isRunning: true });
            
            return true;
        } catch (error) {
            console.error("Failed to start bot:", error);
            await this.storage.addLog({
                level: 'error',
                message: `Failed to start bot: ${error}`,
                source: 'system'
            });
            return false;
        }
    }

    async stop(): Promise<void> {
        this.isStopping = true;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        if (this.bot) {
            this.bot.quit();
            this.bot = null;
        }
        
        const settings = await this.storage.getBotSettings();
        if (settings) {
            await this.storage.updateBotSettings({ ...settings, isRunning: false });
        }
    }

    getStatus(): BotStatus {
        return {
            running: !!this.bot,
            username: this.bot?.username,
            host: (this.bot as any)?.options?.host
        };
    }

    private setupEvents(bot: mineflayer.Bot, settings: BotSettings) {
        bot.loadPlugin(pathfinder);

        bot.once('spawn', () => {
            this.storage.addLog({
                level: 'info',
                message: 'Bot joined the server',
                source: 'bot'
            });

            const mcData = minecraftData(bot.version);
            const defaultMove = new Movements(bot);
            bot.pathfinder.setMovements(defaultMove);

            this.handleAutoAuth(bot, settings);
            this.handleAntiAfk(bot, settings);
            this.handleChatMessages(bot, settings);
            this.handlePosition(bot, settings);
        });

        bot.on('chat', (username, message) => {
            if (username === bot.username) return;
            this.storage.addLog({
                level: 'chat',
                message: `<${username}> ${message}`,
                source: 'bot'
            });
        });

        bot.on('kicked', (reason) => {
            const reasonText = JSON.stringify(reason);
            this.storage.addLog({
                level: 'warn',
                message: `Bot was kicked: ${reasonText}`,
                source: 'bot'
            });
        });

        bot.on('error', (err) => {
            this.storage.addLog({
                level: 'error',
                message: `Bot error: ${err.message}`,
                source: 'bot'
            });
        });

        bot.on('end', () => {
            this.bot = null;
            this.storage.addLog({
                level: 'info',
                message: 'Bot disconnected',
                source: 'system'
            });

            if (!this.isStopping && settings.autoReconnect) {
                const delay = settings.autoReconnectDelay || 60000;
                this.storage.addLog({
                    level: 'info',
                    message: `Reconnecting in ${delay / 1000} seconds...`,
                    source: 'system'
                });
                this.reconnectTimeout = setTimeout(() => {
                    this.start();
                }, delay);
            }
        });
    }

    private handleAutoAuth(bot: mineflayer.Bot, settings: BotSettings) {
        if (!settings.autoAuthEnabled || !settings.autoAuthPassword) return;

        const password = settings.autoAuthPassword;
        
        // Simple Register/Login flow based on chat patterns
        // In a real scenario, we might want more robust handling or a dedicated plugin
        setTimeout(() => {
            bot.chat(`/register ${password} ${password}`);
            bot.chat(`/login ${password}`);
        }, 2000);
    }

    private handleAntiAfk(bot: mineflayer.Bot, settings: BotSettings) {
        if (!settings.antiAfkEnabled) return;

        bot.setControlState('jump', true);
        if (settings.antiAfkSneak) {
            bot.setControlState('sneak', true);
        }
        
        // Simple spin to avoid AFK
        setInterval(() => {
            if(bot.entity) {
                bot.look(bot.entity.yaw + 1, bot.entity.pitch);
            }
        }, 5000);
    }

    private handleChatMessages(bot: mineflayer.Bot, settings: BotSettings) {
        if (!settings.chatMessagesEnabled || !settings.chatMessagesList) return;
        
        const messages = settings.chatMessagesList as string[];
        if (messages.length === 0) return;

        if (settings.chatMessagesRepeat) {
            let i = 0;
            const delay = (settings.chatMessagesRepeatDelay || 60) * 1000;
            
            setInterval(() => {
                if (bot.entity) { // Check if still connected
                    bot.chat(messages[i]);
                    i = (i + 1) % messages.length;
                }
            }, delay);
        } else {
            messages.forEach(msg => {
                setTimeout(() => {
                    if (bot.entity) bot.chat(msg);
                }, 1000);
            });
        }
    }

    private handlePosition(bot: mineflayer.Bot, settings: BotSettings) {
        if (!settings.positionEnabled) return;
        
        const { positionX, positionY, positionZ } = settings;
        if (positionX === null || positionY === null || positionZ === null) return;
        
        const { GoalBlock } = goals;
        // Wait a bit for chunks to load
        setTimeout(() => {
            if (!bot.entity) return;
            
            this.storage.addLog({
                level: 'info',
                message: `Moving to ${positionX}, ${positionY}, ${positionZ}`,
                source: 'bot'
            });
            
            try {
                bot.pathfinder.setGoal(new GoalBlock(positionX, positionY, positionZ));
            } catch (e) {
                 this.storage.addLog({
                    level: 'error',
                    message: `Pathfinding error: ${e}`,
                    source: 'bot'
                });
            }
        }, 5000);
    }
}
