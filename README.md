# Relationship Memory

Personal relationship Memory for people met at events — screenshot capture, Tinder-style Triage (Keep/Forget), and natural language search.

## Docs

- [PRD](docs/PRD.md)
- [UI Brief](docs/UI_BRIEF.md)
- [Agent Orchestration](docs/AGENT_ORCHESTRATION.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [QA Audit](docs/QA_AUDIT.md)
- [Domain glossary](CONTEXT.md)

## Structure

```
packages/shared/     # Types, Zod schemas, AIService interface
src/                 # Next.js API backend
apps/mobile/         # Expo React Native client
supabase/migrations/ # Postgres schema
scripts/             # Integration test scripts
```

## Quick start

```bash
npm install
```

### Backend (local dev)

```bash
cp .env.example .env
# Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for persistent storage
# Optional: SUPABASE_SERVICE_ROLE_KEY for elevated server access
# Optional: CURSOR_API_KEY for real extraction

npm run dev
```

`AI_PROVIDER=stub` (default) uses fixture AI — no Cursor key needed.

**Supabase setup** (one-time):

```bash
supabase link --project-ref YOUR_PROJECT_REF --yes
supabase db push --yes
npm run supabase:check   # verify tables + insert permissions
```

For local API testing without Supabase, use `USE_IN_MEMORY=1` (set automatically by `npm run e2e`).

### Tests

```bash
npm test              # unit tests (services layer)
npm run typecheck     # TypeScript
npm run e2e           # API core loop integration (starts dev server, curl tests, cleanup)
```

### Mobile

From repo root (after `npm install` at root):

```bash
# Terminal 1 — backend
USE_IN_MEMORY=1 npm run dev

# Terminal 2 — Expo UI
EXPO_PUBLIC_API_URL=http://localhost:3000 npm run mobile
```

Or from `apps/mobile`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000 npm start
```

First start may sit on **"Added config plugins"** or **"rebuilding cache"** for ~30–60s — that's normal. You should then see **"Waiting on http://localhost:8081"** and a QR code. Press `i` for iOS Simulator.

If port 8081 is busy: `lsof -ti :8081 | xargs kill` then restart.

Point `EXPO_PUBLIC_API_URL` at your running Next.js backend (use your machine's LAN IP when testing on a physical device).

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/sessions` | Start monitoring |
| POST | `/api/extract` | Screenshot → Encounter |
| POST | `/api/sessions/:id/end` | End → Triage queue |
| POST | `/api/encounters/:id/triage` | Keep / Forget |
| POST | `/api/search` | NL search |
| GET | `/api/encounters?status=kept` | Memory list |
