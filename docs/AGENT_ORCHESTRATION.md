# Agent Orchestration

How parallel agents implement Relationship Memory without merge chaos.

## Rule: contract freeze first

Phase 0 must complete before parallel feature work. Locked after sign-off:

- `packages/shared/**`
- `supabase/migrations/**`
- `docs/PRD.md`
- `docs/UI_BRIEF.md` (after UI agent publishes)

## Agent roles

| Agent | Owns | Must NOT touch |
|-------|------|----------------|
| Orchestrator | `docs/*`, merge order, integration | Feature code |
| Contract/Schema | `packages/shared/`, migrations | Routes, UI |
| Backend API | `src/app/api/**`, API tests | Schema without approval; direct Cursor |
| AI Service | `src/lib/ai/**` | Routes, UI, schema |
| Mobile Shell | `apps/mobile/` scaffold, nav, API client | Triage/search UI details |
| UI/Design | `docs/UI_BRIEF.md`, `docs/design-references/` | App code |
| Triage UI | Triage swipe deck in `apps/mobile/` | Search screen, API |
| Search/Memory UI | Memory list + search in `apps/mobile/` | Triage deck, API |
| QA/Audit | `docs/QA_AUDIT.md` | Feature commits |

## Integration order

1. **Phase 0** — PRD, orchestration docs, contract package, migrations
2. **Phase 1a** — Backend (stub AI), AI service, mobile shell, UI brief (parallel)
3. **Phase 1b** — Triage UI, Search UI (after brief + shell)
4. **Phase 2** — Wire Cursor provider; connect mobile to API
5. **Phase 3** — QA audit; core loop verification

## Core loop acceptance

> Start Monitoring → Capture → Extract Encounter → End Monitoring → Keep → Search finds Encounter

## Merge protocol

- One agent per directory owner per PR
- Orchestrator resolves conflicts in `packages/shared` and integration glue
- QA runs after Phase 2 integration

## Environment

- `AI_PROVIDER=stub|cursor` — backend uses stub in test/CI
- `CURSOR_API_KEY` — required only when `AI_PROVIDER=cursor`
