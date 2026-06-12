# Relationship Memory — PRD (v0)

Personal relationship Memory for people met at real-world Events. Uses domain language from [CONTEXT.md](../CONTEXT.md).

## Problem Statement

When attending conferences, hackathons, meetups, and other networking Events, the user meets many people but quickly loses the context that made each connection valuable — names, what they discussed, and whether follow-up was intended. Existing tools (Contacts, Notes, LinkedIn, personal CRMs like Dex/Clay/Orvo) either lack low-friction in-event capture, gamified post-event cleanup, or searchable personal Memory tied to where people were met.

The user is building this **for personal use first**, not monetization. The acute pain is **post-Event relationship decay within ~48 hours**: fragments exist (LinkedIn screenshots, camera roll) but no structured, searchable Memory with a fun way to decide who matters.

## Solution

A personal **relationship Memory system** with two pillars:

1. **Triage** — After an Event, swipe through Encounter cards (Keep or Forget) in a Tinder-inspired UI with glass design language.
2. **Recall** — Search kept Encounters in natural language and get ranked results.

### Core loop

1. User starts a **Monitoring Session** and types an **Event Name**
2. During the Event, user screenshots LinkedIn profiles (Captures)
3. Each Capture is AI-extracted into an **Encounter** (or **Draft Encounter**)
4. User ends Monitoring → **Triage Queue** opens; nudge ~2 hours later if untouched
5. Swipe **Keep** (optional context) or **Forget**
6. Later, **search** across kept Memory

## User Stories

### Monitoring & Capture

1. As a networker at an Event, I want to start a Monitoring Session by typing an Event Name, so that all Captures are grouped to that Event.
2. As a user during an Event, I want to screenshot LinkedIn profiles with minimal friction, so that I capture people without interrupting conversations.
3. As a user, I want each screenshot to become a Capture linked to my active Monitoring Session, so that I don't manually upload later.
4. As a user, I want to see that Monitoring is active, so that I know Captures are being collected.
5. As a user, I want to end a Monitoring Session when the Event is over, so that I transition from capture mode to review mode.

### Extraction & Draft Encounters

6. As a user, I want the app to extract name, number, location, company, role, and LinkedIn URL from LinkedIn screenshots, so that Encounter cards are mostly pre-filled.
7. As a user, I want a Draft Encounter when extraction fails, so that I never silently lose a Capture.
8. As a user, I want to manually fill name, number, location, and context on Draft Encounters, so that non-LinkedIn Captures still work.
9. As a user, I want every Encounter auto-tagged with the Event Name from the Monitoring Session.
10. As a user, I want the original Capture image attached to each Encounter card during Triage.

### Triage

11. As a user, I want the Triage Queue to open immediately when I end Monitoring.
12. As a user, I want a notification ~2 hours later if my Triage Queue is still untouched.
13. As a user, I want to swipe right to Keep an Encounter.
14. As a user, I want to optionally add how-we-met context when Keeping.
15. As a user, I want to swipe left to Forget an Encounter.
16. As a user, I want Forgotten Encounters excluded from search.
17. As a user, I want Triage to feel fun (Tinder/Bumble/Hinge-style card stack).
18. As a user, I want glass-style UI (Apple Liquid Glass and similar).

### Recall / Search

19. As a user, I want to search kept Encounters in natural language.
20. As a user, I want search results as ranked Encounter cards with a relevance reason.
21. As a user, I want search to match across name, role, company, context, location, and Event Name.
22. As a user, I want empty search to return no matches (not invented people).

### Session & data

23. As a user, I want to see how many Encounters are pending in my Triage Queue.
24. As a user, I want to browse all kept Encounters.
25. As a user, I want Capture images stored reliably.

### Builder / hackathon

26. As the builder, I want a working end-to-end demo after one real Event.
27. As the builder, I want the backend API testable without calling real Cursor on every CI run.
28. As the builder, I want researched swipe UX references adapted to glass design.

## Implementation Decisions

### Product scope (v0)

- Personal tool; no payments, no multi-tenant auth
- Manual Monitoring Session with typed Event Name — no Google Calendar in v0
- LinkedIn screenshot-first capture; Draft Encounter fallback
- Triage unit = Encounter (person)
- Triage trigger: End Monitoring + ~2hr nudge if pending
- Search: AIService ranks kept Encounters via structured JSON — no pgvector, no chatbot answers
- Canonical rejection term: **Forget**

### Architecture

- **Mobile**: Expo/React Native — share sheet / photo import for Captures
- **Backend**: Next.js API routes
- **Database**: Supabase Postgres + Storage
- **AI**: `AIService` interface; `StubAIService` for tests; `CursorComposerProvider` for production

### API contracts (v0)

| Endpoint | Purpose |
|----------|---------|
| `POST /api/sessions` | Start Monitoring — `{ event_name }` |
| `POST /api/extract` | Capture + extract — `{ session_id, image_base64, mime_type }` |
| `POST /api/sessions/:id/end` | End Monitoring → Triage Queue |
| `POST /api/encounters/:id/triage` | `{ action: "keep" \| "forget", context?, name?, number?, location? }` |
| `POST /api/search` | `{ query }` → ranked kept Encounters |

### Capture (iOS)

v0: Share Sheet → app or in-app import from Photos. Background screenshot interception is not required.

## Testing Decisions

- Test HTTP API behavior with stubbed `AIService`
- Journeys: start session, extract, end session, keep, forget, search
- No real Cursor API in CI
- Mobile: manual visual QA against `docs/UI_BRIEF.md`

## Out of Scope (v0)

Google Calendar, face recognition, LinkedIn scraping, pgvector, chatbot search answers, multi-user auth, CRM pipelines, monetization, analytics.

## Further Notes

- Wedge: screenshot-native capture + gamified Triage + Memory search
- UI research via browser + design skills (Mobbin out of scope)
- Repo working title: `tinder-for-old-friends`
