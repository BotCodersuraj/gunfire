# Overview

This is a **Minecraft AFK Bot Control Panel** — a full-stack web application that lets users configure, start, stop, and monitor a Minecraft bot (powered by `mineflayer`) through a browser-based dashboard. The bot connects to Minecraft servers and performs AFK tasks like anti-AFK movements, auto-authentication, chat messaging, and position holding. The web UI provides real-time status monitoring, a terminal-style log viewer, and a settings page for bot configuration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

- **Framework**: React 18 with TypeScript
- **Routing**: `wouter` (lightweight client-side router)
- **State/Data Fetching**: `@tanstack/react-query` with polling (2-second interval for bot status)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (dark theme by default with emerald/teal accent colors)
- **Animations**: Framer Motion for layout transitions
- **Forms**: `react-hook-form` with `zod` validation via `@hookform/resolvers`
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Pages
- `/` — Dashboard: Shows bot status and live log viewer (terminal-style)
- `/settings` — Settings: Full bot configuration form
- `/logs` — Logs: Dedicated full-screen log viewer

### Key Frontend Patterns
- Custom hooks in `client/src/hooks/use-bot.ts` encapsulate all API calls (status polling, start/stop/restart actions, settings CRUD, log fetching)
- The `LogViewer` component renders a terminal-style interface with auto-scroll and color-coded log levels
- The `Sidebar` component provides persistent navigation

## Backend

- **Runtime**: Node.js with TypeScript (via `tsx`)
- **Framework**: Express 5
- **Bot Engine**: `mineflayer` with `mineflayer-pathfinder` for Minecraft bot functionality
- **API Pattern**: REST API with a shared route contract (`shared/routes.ts`) defining paths, methods, input schemas, and response schemas using Zod
- **Build**: esbuild for server bundling, Vite for client bundling (see `script/build.ts`)

### API Endpoints (defined in `shared/routes.ts`)
- `GET /api/settings` — Get bot settings
- `POST /api/settings` — Update bot settings (upsert pattern)
- `POST /api/bot/start` — Start the bot
- `POST /api/bot/stop` — Stop the bot
- `POST /api/bot/restart` — Restart the bot
- `GET /api/bot/status` — Get current bot status (polled by frontend)
- `GET /api/logs` — Get bot logs
- `DELETE /api/logs` — Clear all logs

### Key Backend Patterns
- `BotManager` class (`server/bot.ts`) manages the mineflayer bot lifecycle (start, stop, reconnect)
- `IStorage` interface (`server/storage.ts`) abstracts database operations, implemented by `DatabaseStorage`
- Development uses Vite middleware for HMR; production serves static files from `dist/public`

## Shared Layer (`shared/`)

- **Schema** (`shared/schema.ts`): Drizzle ORM table definitions and Zod schemas for validation
- **Routes** (`shared/routes.ts`): API contract shared between frontend and backend, defining endpoints, input/output schemas

## Database

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **Session Store**: `connect-pg-simple` (available but may not be actively used for this app)
- **Schema Push**: `npm run db:push` uses `drizzle-kit push`

### Tables
1. **`bot_settings`** — Single-row table storing all bot configuration (username, server IP/port, auth type, anti-AFK settings, chat messages, auto-reconnect, etc.)
2. **`bot_logs`** — Append-only log table with timestamp, level (info/warn/error/chat), message, and source

## Scripts
- `npm run dev` — Start development server with hot reload
- `npm run build` — Build client (Vite) and server (esbuild) for production
- `npm start` — Run production build
- `npm run db:push` — Push schema changes to database
- `npm run check` — TypeScript type checking

# External Dependencies

- **PostgreSQL** — Primary database, connection via `DATABASE_URL` environment variable. Required for the app to function.
- **Minecraft Servers** — The bot connects to external Minecraft servers (configured via settings). Default target is an Aternos server.
- **mineflayer** — Node.js library for creating Minecraft bots. Handles the actual Minecraft protocol communication.
- **mineflayer-pathfinder** — Plugin for mineflayer that enables pathfinding/movement to specific coordinates.
- **Google Fonts** — DM Sans, JetBrains Mono, Fira Code, Geist Mono loaded via CDN for typography.
- **Replit Plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` for Replit-specific development features (conditionally loaded in dev mode).