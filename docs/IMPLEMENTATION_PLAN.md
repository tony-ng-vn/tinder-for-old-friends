# Implementation Plan

Phased execution for Relationship Memory v0.

## Phase 0 — Contract freeze (blocking)

| Task | Owner | Output |
|------|-------|--------|
| PRD | Orchestrator | `docs/PRD.md` |
| Orchestration | Orchestrator | `docs/AGENT_ORCHESTRATION.md` |
| Shared contract | Contract/Schema | `packages/shared/` |
| Migrations | Contract/Schema | `supabase/migrations/001_initial_schema.sql` |
| Prototype decision | Orchestrator | Refactor existing Next.js code to contract |

**Gate**: Orchestrator marks contract locked.

## Phase 1a — Parallel workers

| Task | Owner | Depends on |
|------|-------|------------|
| AIService + Stub + Cursor | AI Service | Phase 0 |
| API routes + tests | Backend API | Phase 0, Stub AI |
| UI_BRIEF + design refs | UI/Design | Phase 0 |
| Expo shell + API client | Mobile Shell | Phase 0 |

## Phase 1b — Dependent UI

| Task | Owner | Depends on |
|------|-------|------------|
| Triage swipe deck | Triage UI | UI_BRIEF, Mobile Shell |
| Memory list + search | Search UI | UI_BRIEF, Mobile Shell |

## Phase 2 — Integration

| Task | Owner |
|------|-------|
| Mobile → API wiring | Orchestrator |
| Cursor provider in prod path | AI Service |
| End-to-end manual test | Orchestrator |

## Phase 3 — QA

| Task | Owner |
|------|-------|
| PRD compliance audit | QA/Audit |
| v0 scope leak check | QA/Audit |
| Core loop sign-off | Orchestrator |

## Mobile screen routes (frozen)

| Route | Purpose |
|-------|---------|
| `Home` | Start session or resume |
| `Monitoring` | Active capture UI |
| `Triage` | Swipe queue |
| `Memory` | Kept Encounters list |
| `Search` | NL search + results |

## Storage paths (frozen)

`captures/sessions/{session_id}/{capture_id}.{ext}`
