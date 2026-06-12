# Tinder for Old Friends

**Reconnect with people you meet at events — before they fade.**

You go to conferences, meetups, and demo days. You screenshot LinkedIn profiles and business cards. Then life moves on and you forget who they were. Tinder for Old Friends helps you decide, in the moment, who is worth keeping.

---

## How it works

### 1. Start a session

Open the app and tap **Start new session**. Name the event you're at (e.g. "Ship Week Demo Day").

This begins **monitoring** — you're actively collecting people you meet.

### 2. Capture screenshots

During the event, screenshot LinkedIn profiles, business cards, or contact info on your phone like you normally would.

When you're ready, tap **Import from Photos** and select **all your screenshots at once**. Each screenshot becomes one person on your "pond."

The app reads names and details **from your screenshots** when real AI extraction is enabled. In demo mode (default for local setup), placeholder names are used instead — your photos are still saved.

Wait until importing finishes before tapping **End monitoring**.

### 3. Triage — Keep or Forget

After monitoring ends, you get a **swipe deck** (like Tinder):

- **Swipe right** → Keep this person in your memory
- **Swipe left** → Forget them (gone for good)

The screenshot is front and center — you're judging the *person*, not a wall of text.

If you keep someone, you can optionally add context: what you talked about, their name if unclear, etc.

### 4. Memory & Search

**Memory** — a gallery of everyone you kept, with their screenshots.

**Search** — ask in plain language: *"Who did I meet from Stripe?"* or *"Founder in healthcare at Ship Week"*. The app finds matches from your kept contacts.

---

## The idea

Most networking apps assume you'll follow up with everyone. Tinder for Old Friends assumes the opposite: **you'll forget most people, and that's fine** — as long as you consciously choose who to remember.

Forgotten contacts are not searchable and not stored in your memory. Kept contacts stay with their screenshot, event name, and any context you added.

---

## Getting the app

Tinder for Old Friends runs as a mobile app (iOS/Android via Expo). You need the backend running on your machine or a deployed server — see [docs/DEVELOPER.md](docs/DEVELOPER.md) for setup.

---

## Privacy

Your screenshots and contact data are stored in your Supabase project. Nothing is shared with other users — this is a personal memory tool, not a social network.
