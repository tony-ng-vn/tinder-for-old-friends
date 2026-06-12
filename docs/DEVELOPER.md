# Developer setup

## Structure

```
packages/shared/     # Types, Zod schemas, AIService interface
src/                 # Next.js API backend
apps/mobile/         # Expo React Native client
supabase/migrations/ # Postgres schema
scripts/             # Integration test scripts
```

## Docs

- [PRD](PRD.md)
- [UI Brief](UI_BRIEF.md)
- [Domain glossary](../CONTEXT.md)

## Quick start

```bash
npm install
cp .env.example .env
# Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

`AI_PROVIDER=stub` (default) uses fixture AI — no Cursor key needed.

**Supabase** (one-time):

```bash
supabase link --project-ref YOUR_PROJECT_REF --yes
supabase db push --yes
npm run supabase:check
```

For local API testing without Supabase: `USE_IN_MEMORY=1 npm run dev`

## Mobile

```bash
# Terminal 1
npm run dev

# Terminal 2
EXPO_PUBLIC_API_URL=http://localhost:3000 npm run mobile:ios
```

Use your machine's LAN IP for `EXPO_PUBLIC_API_URL` on a physical device.

## Tests

```bash
npm test
npm run typecheck
npm run e2e
```

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/sessions` | Start monitoring |
| POST | `/api/extract` | Screenshot → Encounter |
| POST | `/api/sessions/:id/end` | End → Triage queue |
| POST | `/api/encounters/:id/triage` | Keep / Forget |
| POST | `/api/search` | NL search |
| GET | `/api/encounters?status=kept` | Memory list |
