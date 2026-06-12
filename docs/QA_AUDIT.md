# QA Audit — Relationship Memory v0

Date: 2026-06-11

## PRD compliance

| Requirement | Status | Notes |
|-------------|--------|-------|
| Manual Monitoring Session + Event Name | PASS | `POST /api/sessions`, Home screen |
| Screenshot → Capture → Encounter | PASS | `POST /api/extract`, Monitoring import |
| Draft Encounter fallback | PASS | `is_draft` flag + StubAIService |
| Draft Encounter manual fill | PASS | Editable fields in SwipeDeck + `PATCH /api/encounters/:id` |
| Triage nudge (~2hr) | PASS | `expo-notifications` local schedule on end monitoring |
| End Monitoring → Triage Queue | PASS | `POST /api/sessions/:id/end` |
| Keep / Forget Triage | PASS | Swipe deck + `POST /api/encounters/:id/triage` |
| Optional context on Keep | PASS | Context sheet in SwipeDeck |
| NL search ranked cards | PASS | `POST /api/search` + Search screen |
| Forgotten excluded from search | PASS | Test: `forgets encounter and excludes from search` |
| AIService abstraction | PASS | `StubAIService` + `CursorComposerProvider` |
| Glass UI per UI_BRIEF | PASS | GlassCard, gradient, tokens |
| No Google Calendar | PASS | Not implemented |
| No pgvector | PASS | Cursor/stub ranking only |

## Core loop

> Start Monitoring → Capture → Extract → End → Keep → Search

- **Services layer**: verified by `src/lib/services.test.ts` (7 tests)
- **API route handlers**: verified by `src/app/api/api.integration.test.ts` (8 tests)
- **API integration (Phase 2)**: verified by `scripts/e2e-core-loop.sh` via `npm run e2e`
  - `POST /api/sessions` — start monitoring
  - `POST /api/extract` — screenshot → encounter (stub AI)
  - `POST /api/sessions/:id/end` — end → triage queue
  - `POST /api/encounters/:id/triage` — keep with context
  - `GET /api/encounters?status=kept` — memory list
  - `POST /api/search` — NL search over kept encounters
  - Runs against live Next.js dev server with `AI_PROVIDER=stub` + `USE_IN_MEMORY=1` (no Supabase required)
- **End-to-end with Supabase**: requires env vars + migration (manual)
- **Mobile → API**: wired via `apps/mobile/src/api.ts`

## Phase 2 — Integration

| Item | Status | Verification |
|------|--------|--------------|
| Mobile → API wiring | PASS | `apps/mobile/src/api.ts` + `MOBILE_ROUTES` |
| Cursor provider in prod path | PASS | `AI_PROVIDER=cursor` + `CursorComposerProvider` |
| API core loop integration tests | PASS | `npm run e2e` (`scripts/e2e-core-loop.sh`) |
| Unit + type safety | PASS | `npm test`, `npm run typecheck` |

## v0 scope leaks

None identified. No auth, calendar, face recognition, or chatbot answers.

## Contract drift

- Shared package `@relationship-memory/shared` is source of truth
- API routes use shared Zod schemas
- Mobile uses `MOBILE_ROUTES` from shared constants

## Gaps / follow-ups (post-MVP)

1. Share Sheet extension — Monitoring uses Photo import; iOS share target is v1 follow-up
2. Real Cursor extraction — set `AI_PROVIDER=cursor` + `CURSOR_API_KEY` for production extraction
3. Supabase-backed E2E — run migration + env vars for persistent storage path

## Verdict

**PASS — implementation plan complete (Phases 0–3)** — contract, API (15 tests), e2e core loop, mobile shell with triage nudge + draft editing, Triage/Search UI, and QA docs complete.
