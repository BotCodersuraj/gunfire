
import { z } from 'zod';
import { insertBotSettingsSchema, botSettings, botLogs, insertBotLogSchema } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings' as const,
      responses: {
        200: z.custom<typeof botSettings.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'POST' as const, // Using POST for upsert-like behavior on single settings row
      path: '/api/settings' as const,
      input: insertBotSettingsSchema,
      responses: {
        200: z.custom<typeof botSettings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  bot: {
    start: {
      method: 'POST' as const,
      path: '/api/bot/start' as const,
      responses: {
        200: z.object({ message: z.string(), status: z.string() }),
        400: errorSchemas.validation, // e.g. already running
      },
    },
    stop: {
      method: 'POST' as const,
      path: '/api/bot/stop' as const,
      responses: {
        200: z.object({ message: z.string(), status: z.string() }),
      },
    },
    restart: {
        method: 'POST' as const,
        path: '/api/bot/restart' as const,
        responses: {
            200: z.object({ message: z.string(), status: z.string() }),
        }
    },
    status: {
      method: 'GET' as const,
      path: '/api/bot/status' as const,
      responses: {
        200: z.object({ 
            running: z.boolean(),
            username: z.string().optional(),
            host: z.string().optional()
        }),
      },
    },
  },
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs' as const,
      input: z.object({
        limit: z.coerce.number().optional().default(100),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof botLogs.$inferSelect>()),
      },
    },
    clear: {
        method: 'DELETE' as const,
        path: '/api/logs' as const,
        responses: {
            204: z.void()
        }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
