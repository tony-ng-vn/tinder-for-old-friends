# UI Brief — Relationship Memory

Design source of truth for mobile implementation.

**Aesthetic:** Pixel pond atmosphere (Blockd-inspired) + modern glass functional layer.  
**Mood:** *You met someone and you might never see them again.*  
**Research:** [PIXEL_EPHEMERAL_RESEARCH.md](design-references/PIXEL_EPHEMERAL_RESEARCH.md)

## Two-layer model

| Layer | Role |
|-------|------|
| **Decorative (pixel)** | Night pond — lily pads, fish, reeds; slow ambient motion |
| **Functional (modern)** | Glass panels, sans-serif Encounter facts, teal glow CTAs |

**Metaphor:** Lily pads = pending encounters. Keep = pull to shore. Forget = drift away and sink.

## Color tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `bg.pond.deep` | `#0B1020` | Background top |
| `bg.pond.floor` | `#0F1F1A` | Background bottom |
| `bg.panel` | `rgba(18,26,36,0.88)` | Glass/panel fill |
| `accent.teal` | `#2DD4BF` | Keep, primary CTA |
| `accent.teal.glow` | `rgba(45,212,191,0.45)` | Button outer glow |
| `accent.forget` | `#64748B` | Forget (muted gray, not red) |
| `accent.amber` | `#C29E3F` | Draft badge |
| `text.primary` | `#F1F5F9` | Names, titles |
| `text.muted` | `#94A3B8` | Body secondary |
| `text.mono` | `#83B5B5` | Pills, timestamps, reasons |
| `pixel.reed` | `#2D4D4A` | Decorative sprites |
| `pixel.lily` | `#526867` | Lily pads |
| `pixel.fish` | `#34D399` | Ambient fish |

## Typography

| Role | Font | Size |
|------|------|------|
| Pixel accent | Press Start 2P | 11–14px (hero, empty states only) |
| Mono pills | JetBrains Mono | 11–13px uppercase |
| Body / names | System (SF Pro) | 15–22px per scale below |

**Rule:** Never set Encounter name, role, or company in pixel font.

| Role | Size | Weight |
|------|------|--------|
| Title | 14px pixel / 28px sans | 700 |
| Card name | 22px | 600 |
| Subtitle | 16px | 500 |
| Body | 15px | 400 |
| Caption | 13px | 400 |

## Components

| Component | Purpose |
|-----------|---------|
| `PixelPondBackground` | Animated decor; variants: home, monitoring, triage (dim), memory, search |
| `ScreenShell` | Gradient + pond + content |
| `GlassCard` | Functional panels over pond |
| `GlowButton` | Teal primary CTA with outer glow |
| `MonoPill` | Blockd-style stat chips (`MONITORING · SHIP WEEK`) |
| `EncounterGalleryCard` | Photo-first grid tile for Memory / Search |
| `SwipeDeck` | Tinder-style photo card stack for Triage |

## Swipe behavior (Triage)

- Card stack: max 3 visible; scale 0.96 / 0.92 behind
- Threshold: 28% screen width
- Rotation: ±8° max
- **Photo-first:** imported screenshot fills the card; minimal text overlay (draft badge only)
- **Swipe-only:** no Keep/Forget tap buttons — gestures only
- **Keep:** swipe right → card exits right (250ms) → optional context sheet
- **Forget:** desaturate + sink below horizon (translate Y +48px, 280ms) — not red flash
- Context sheet after keep: optional memory note; draft encounters can fill name/number/location

## Screens

### Home
- Pond at full brightness; bobbing lily pads
- Mono pill: onboarding tagline
- Pixel title + emotional subcopy
- Formula steps: `01 Capture` → `02 Triage` → `03 Recall`
- **Two-path choice UI:**
  - **Resume unfinished session** — glass cards for each event with pending triage queue (`{n} people waiting`)
  - **Start new session** — tap through to event name form + glow CTA "Start monitoring →"
- Footer links: Memory · Search

### Monitoring
- Reduced pond opacity (65%)
- Mono pill: `MONITORING · {Event}`
- Import from Photos (glow button) — **multi-select** in one picker session
- Batch extract: one API call per selected image
- Capture count shown after imports
- End monitoring: outline button (intentional friction)

### Triage
- Pond dimmed (35%) — card photo is the light source
- Mono pill queue count: `{n} to review`
- **Picture-first card stack** (Tinder-style); swipe right = Keep, left = Forget
- Draft: small amber badge on photo corner only
- After swipe-right commit: glass context sheet (optional notes + draft field fill-in)

### Memory
- Calm pond (55%)
- **Gallery grid** (2 columns) of kept people with screenshot thumbnails
- Name + company/location overlay on each tile
- Empty: pixel "Empty pond"

### Search
- **Fixed search bar at top** (name, company, location, or memory/context)
- Teal search action; keyboard submit
- Results as **gallery grid** with photos + match % subtitle
- Client-side fallback filter over kept encounters for demo

## Demo data (stub AI)

| Import order | Person | Fields |
|--------------|--------|--------|
| 1st capture | Alex Chen | Stripe · San Francisco · "Talked about payments infra" |
| 2nd+ capture | (draft) | Company maybe "Acme Corp"; name/location missing — fill on Keep |

Capture images stored as base64 data URLs on in-memory backend for display in triage/gallery.

## Motion

| Moment | Duration | Notes |
|--------|----------|-------|
| Pond ambient | 8–12s loop | Lily pad bob, fish cross every ~20s |
| Forget commit | 280ms | Sink below horizon |
| Keep commit | 250ms | Exit right + haptic |
| Screen transitions | 300ms | ease-out |
| Max animation | 500ms | baseline-ui |

## Empty states

| Screen | Copy |
|--------|------|
| Triage | "All caught up" / "The pond is still again." |
| Memory | "Empty pond" / "People you Keep will appear here" |
| Search | "Search your memory — e.g. Stripe engineer in San Francisco" |

## Accessibility

- Tap targets ≥ 44px
- Swipe deck: accessibility label describes swipe directions for Keep/Forget
- Contrast ≥ 4.5:1 on text over panels
- `Reduce Motion`: disable pond animation (future)

## Implementation map

```
apps/mobile/src/
  theme.ts                 # tokens
  api.ts                   # capture_url on encounters
  components/
    PixelPondBackground.tsx
    ScreenShell.tsx
    GlowButton.tsx
    MonoPill.tsx
    GlassCard.tsx
    SwipeDeck.tsx            # photo-first, swipe-only
    EncounterGalleryCard.tsx # Memory + Search tiles
  screens/
    HomeScreen.tsx           # two-path choice
    MonitoringScreen.tsx     # multi-select import
    TriageScreen.tsx
    MemoryScreen.tsx         # gallery
    SearchScreen.tsx         # fixed bar + gallery
```
