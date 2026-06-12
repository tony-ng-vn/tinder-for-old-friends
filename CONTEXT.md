# Relationship Memory

A personal system for deciding which people from real-world events are worth remembering, and searching those memories later.

## Language

**Event**:
A bounded occasion where the user meets people — conference, hackathon, meetup, residency, school event, etc.
_Avoid_: Session, gathering (too vague)

**Encounter**:
A person the user met at an Event. Proposed from a Capture via AI extraction, or as a Draft Encounter when extraction is incomplete. Mapped to the active Monitoring Session's Event.
_Avoid_: Contact, connection, lead

**Draft Encounter**:
An Encounter card where AI could not fully extract identity. Shows whatever was parsed plus empty fields for manual input.
_Avoid_: Unknown contact, partial match

**Encounter Fields**:
The core facts on every Encounter — **name**, **number**, **location**, **context** (how/why you met). AI fills what it can; user completes the rest.
_Avoid_: Profile fields, attributes

**Capture**:
A screenshot taken during a Monitoring Session. Raw input — AI reads it to propose an Encounter.
_Avoid_: Screenshot (too generic), clip, snap

**Triage**:
The post-Event review where the user decides whether to Keep or Forget each Encounter. Opens when the user ends a Monitoring Session; a nudge fires ~2 hours later if the queue is still untouched.
_Avoid_: Review, cleanup, sorting

**Triage Queue**:
The stack of Encounter cards waiting for Keep/Forget decisions from a Monitoring Session.
_Avoid_: Inbox, backlog, deck

**Keep**:
A Triage outcome — the Encounter is saved to Memory. User may optionally add how-they-met context; otherwise the app relies on extracted info + Event mapping.
_Avoid_: Like, match, save

**Forget**:
A Triage outcome — the Encounter is dropped and not searchable later.
_Avoid_: Pass, skip, reject, discard

**Memory**:
The searchable personal context attached to a kept Encounter — what they talked about, why they mattered, photos, notes.
_Avoid_: Profile, record, CRM entry

**Monitoring Session**:
A user-started capture period tied to a typed Event name. While active, every screenshot is collected as a Capture for later Triage.
_Avoid_: Recording, tracking, logging

**Event Name**:
What the user types when starting a Monitoring Session (e.g. "Vercel Ship Week", "YC Demo Day"). Becomes the Event label on every Encounter from that session.
_Avoid_: Title, label

