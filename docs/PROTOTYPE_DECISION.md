# Prototype Decision

## Decision: Refactor in place

The exploratory Next.js prototype is **kept and refactored** to align with the frozen contract.

## What was kept

- Supabase migration shape (minor path convention update via `captureStoragePath`)
- API route structure (`/api/sessions`, `/api/extract`, etc.)
- Cursor Cloud Agents integration (moved behind `AIService`)

## What changed

- Added `packages/shared` for types, Zod schemas, constants, `AIService` interface
- Replaced direct Cursor calls in routes with `src/lib/services.ts`
- Added `StubAIService` + in-memory store for tests without Supabase
- Removed duplicate `src/lib/cursor.ts`, `extraction.ts`, `prompts.ts` (consolidated under `src/lib/ai/`)

## Rationale

Refactoring is faster than reset and preserves working route handlers. All routes now depend on shared contract, not prototype ad-hoc types.
