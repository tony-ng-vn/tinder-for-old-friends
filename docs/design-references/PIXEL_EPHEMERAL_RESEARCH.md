# Pixel + Ephemeral Design Research — Relationship Memory

**Date:** June 11, 2026  
**Purpose:** Design direction research combining (1) Blockd-style pixel atmosphere with modern typography and glowing teal CTAs, and (2) emotional mood of fleeting encounters, fading memories, and event aftermath.  
**Scope:** Design direction only — not implementation. Informs landing/onboarding and mobile screen adaptation.

---

## Executive summary

Relationship Memory sits at an unusual intersection: **Tinder-speed triage** (decisive, gestural) and **memorial quiet** (nostalgic, almost-lost). The winning aesthetic is a **two-layer UI**:

| Layer | Role | Reference lineage |
|-------|------|-----------------|
| **Decorative (pixel)** | Mood, world-building, motion accents | Blockd pond ref, Rain World, Oxenfree night palettes, Dice Heroes |
| **Functional (modern)** | Cards, search, CTAs, legibility | Blockd live product, MetMe, Pxlkit `surface="linear"`, Inbox0 glass calm |

**Core metaphor:** A **night pond after an event** — lily pads are people you met; some drift away (Forget), some you pull to shore (Keep). The water surface is memory itself: dark, reflective, slightly rippling. UI chrome floats above it in clean sans-serif with teal glow — not buried in retro noise.

**Emotional north star:** *"You met someone and you just never see them again."* Design should feel like **sorting through polaroids at 2am**, not like a dating app or a CRM.

---

## Part 1 — Design references (12)

Each reference is chosen for a specific borrowable trait. Links verified at research time.

### 1. Blockd — DNS accountability app (primary structural reference)

- **URL:** [blockd.app](https://blockd.app/)
- **Visual:** Dark near-black canvas (`#0a0a0f` range). Product UI is **modern and sparse** — not pixel-native on the live site, but the *intended* Blockd reference direction layers **pixel pond decor** (lily pads, fish, reeds, night sky) **behind** crisp product chrome.
- **Borrow:**
  - **Monitoring feed** pattern: timestamped activity rows (`Blocked tiktok.com · 4s`) → adapt to Capture/extraction events
  - **Pill badges:** `🔥 14D 6H · 5 RULES · 3 SVC` monospace-adjacent stat chips
  - **Formula/tag UI:** numbered sections (`01`, `02`, `03`) with short labels + live preview panel beside copy
  - **Glowing teal primary CTA:** "Download for iPhone" — soft outer glow, high contrast on dark bg
  - **Partner/accountability card:** avatar + name + compact metadata row — maps to Event session summary
- **Mood fit:** Accountability and intentionality — "someone will know" → Relationship Memory variant: *"Future-you will forget unless you decide now."*

### 2. Pxlkit — Retro-future React UI kit (dual-surface pattern)

- **URL:** [pxlkit.xyz/ui-kit](https://pxlkit.xyz/ui-kit) · [Templates](https://pxlkit.xyz/templates)
- **Visual:** Full pixel-art component library with explicit **`surface="pixel"` vs `surface="linear"`** toggle. Pixel mode: sharp borders, pressed shadows, mono fonts. Linear mode: 1px borders, rounded corners, **sans-serif** — same components, different skin.
- **Borrow:**
  - **Architectural proof** that pixel decor + modern functional UI can coexist in one product
  - **`PixelFlicker`** effect for ambient status text ("Monitoring…", queue count)
  - **`tone="cyan"`** token for teal CTAs with retro glow
  - Parallax floating pixel icons in hero backgrounds (lily pad / firefly equivalents)
- **Mood fit:** Retro without sacrificing readability — exactly the Blockd + modern type pairing.

### 3. Game Glitch — Retro pixel game studio landing (Behance)

- **URL:** [Behance — Game Glitch](https://www.behance.net/gallery/236365559/Game-Glitch-A-Retro-Pixel-Game-Studio-Landing-Page)
- **Visual:** Bold pixel typography in hero, **glowing arcade buttons**, starfield/dark bg, but section structure is **modern SaaS** (Hero → Games → About → Contact). Neon accents on interactive elements only.
- **Borrow:** Landing page rhythm — pixel personality in hero, clean grid below. Glowing button treatment for "Start monitoring" / onboarding CTAs.
- **Mood fit:** Playful retro energy contained in marketing layer; doesn't infect data-dense screens.

### 4. Dice Heroes — Pixel game UI (Dribbble)

- **URL:** [Dribbble — UI for pixel art game Dice Heroes](https://dribbble.com/shots/5777943-UI-for-pixel-art-game-Dice-Heroes)
- **Visual:** Dark teal-navy base palette: `#080F12`, `#2D4D4A`, `#526867`, accent `#D54130`, highlight `#C29E3F`. UI panels are **framed pixel borders** with **clean stat text** inside.
- **Borrow:** Color relationships for pond-at-night — deep blue-green water, muted sage reeds, warm amber for Draft badges, coral for Forget (not aggressive red).
- **Mood fit:** Dark atmospheric pixel without horror — "dungeon" becomes "pond edge at midnight."

### 5. Hyper Light Drifter — Neon pixel UI breakdown

- **URL:** [Medium — HLD UI Breakdown](https://medium.com/the-space-ape-games-experience/hyper-light-drifter-ui-breakdown-c2d9cfe0a192)
- **Visual:** **Neon flat color blocks** on dark backgrounds. UI uses bright accents for interactive/stateful elements; **map/info screens mute the bg** so content pops. Rhombus motif repeats as decorative glyph.
- **Borrow:**
  - **Selective neon:** only CTAs, active states, and swipe-commit feedback glow
  - **Muted containers** for Encounter card content (screenshot, name, role) — readability first
  - Abstract glyph vocabulary instead of emoji overload (pixel fish = "new capture", lily pad = "pending triage")
- **Mood fit:** Mysterious, liminal — "technology from a lost era" maps to memories you're trying not to lose.

### 6. Oxenfree — Night island atmosphere + palette

- **URL:** [Game Developer — Oxenfree art](https://www.gamedeveloper.com/design/road-to-the-igf-night-school-studio-s-i-oxenfree-i-) · [Oxenfreenite palette (Lospec)](https://lospec.com/palette-list/oxenfreenite)
- **Visual:** Watercolor-parallax night environments. Palette: `#111a24`, `#102e58`, `#11767f`, `#83b5b5` — **teal moonlight on dark water**. Supernatural elements are geometric/bright against organic darkness.
- **Borrow:** Night-event aftermath lighting — post-conference is "the island at night after everyone left." Teal accents feel like bioluminescence or phone glow on a dark pond.
- **Mood fit:** Nostalgic, haunted-but-warm, teenage summer ending — close to "fleeting connection" without being depressing.

### 7. Rain World — Pixel loneliness and depth

- **URL:** [YouTube — Rain World environments](https://www.youtube.com/watch?v=ujhBjiRpsyM) · [Steam](https://store.steampowered.com/app/312520/Rain_World/)
- **Visual:** Hyper-detailed pixel backgrounds with **layered parallax**, industrial decay, **neon light casting long shadows**, oppressive scale. UI minimal; world carries emotion.
- **Borrow:**
  - **Background depth layers:** reeds (far), lily pads (mid), ripple surface (near) — slow parallax on scroll
  - **Footstep-quiet loneliness** — sparse UI, generous negative space
  - Occasional **single bright panel** after darkness (Triage card reveal = "white panel after the dark")
- **Mood fit:** "Almost-lost" — things drifting out of reach. Use sparingly; full Rain World intensity is too heavy for a utility app.

### 8. Nijimu — "to seep into" (speculative memory wellness)

- **URL:** [Devpost — Nijimu](https://devpost.com/software/nijimu-to-blur)
- **Visual:** Abstract geometries whose **opacity, blur, and color saturation** reflect memory age. Fresh = dense/saturated; old = pale, diffuse, barely there. Ink-wash / SANAA minimalism.
- **Borrow:**
  - **Forget animation language:** card doesn't "delete" — it **dissolves**, desaturates, sinks below water line
  - **Keep animation:** card gains clarity/sharpness, glow stabilizes
  - Memory list rows show **dissolution stage** (optional v1+) — kept contacts slightly sharper over time
- **Mood fit:** Direct emotional thesis — friendships that faded, places left behind.

### 9. Kind Words — Fleeting anonymous connection

- **URL:** [Polygon — Kind Words interview](https://www.polygon.com/2019/8/2/20752088/kind-words-ziba-scott-steam-interview-game/) · [Game Developer deep dive](https://www.gamedeveloper.com/design/deep-dive-altruism-in-online-multiplayer-video-games-with-kind-words-and-sky-children-of-the-light)
- **Visual:** Cozy room, lo-fi beats, **one-off letters** — no persistent threads. Whisper, not broadcast. Warm window light on dark room.
- **Borrow:**
  - **No infinite feed anxiety** — Triage queue is finite ("12 people to review"), then peace
  - **Whisper-scale copy tone** — short, intimate microcopy on cards ("You met at…", "Do you want to remember them?")
  - Lo-fi ambient audio optional on Triage (muted pixel pond sounds)
- **Mood fit:** Connection without commitment — exactly the conference hallway exchange.

### 10. Oleg Frolov — Ambivalence / Swipeable Cards (interaction mood)

- **URL:** [Dribbble — Ambivalence ll: Monday](https://dribbble.com/shots/2313705-Ambivalence-ll-Monday) · [Swipeable Cards rebound](https://dribbble.com/shots/15977550-Swipeable-Cards)
- **Visual:** Soft, melancholic card UI — muted tones, emotional weight in swipe physics. Cards feel like **polaroids or diary entries**, not profiles to judge.
- **Borrow:** Swipe **rotation and exit curves** — gentle, not gamified. Ambivalence in the interaction: neither direction feels like "win/lose."
- **Mood fit:** Triage as emotional sorting, not hot-or-not.

### 11. LENSE — Memory as non-linear bubble network

- **URL:** [lifebypablo.com/work/lense](https://lifebypablo.com/work/lense)
- **Visual:** Honeycomb/bubble layouts for memories — **stumble-upon recall** vs chronological grid. Circles for flexibility and micro-interaction.
- **Borrow:**
  - Search results as **floating bubbles** that cluster by Event (not flat list)
  - Memory screen optional alternate view: Event "ponds" with kept contacts as lily pads clustered by gathering
- **Mood fit:** Brain-like, non-linear recall — "I remember the event, who was there again?"

### 12. Atropos — Programmed memory decay (Obsidian plugin)

- **URL:** [GitHub — matheusvfarah/atropos](https://github.com/matheusvfarah/atropos)
- **Visual:** Force-graph where nodes **lose edges and drift to periphery** as they decay. Color phases: teal (active) → gray → amber → coral → dark (fossilized).
- **Borrow:**
  - **Triage queue urgency visualization:** pending cards shift from teal → amber if untouched 2+ hours (matches PRD nudge)
  - Search graph view (future): kept Encounters as connected nodes; Forgotten ones fade out of graph
- **Mood fit:** Ephemerality as **system behavior**, not just aesthetic — memories literally fade if you don't act.

### Honorable mentions (contrast / adjacent)

| Reference | URL | Why not primary |
|-----------|-----|----------------|
| MetMe | [metme.app](https://metme.app/) | Clean Apple-native contact memory — good **functional** benchmark, opposite aesthetic |
| Inbox0 (Studio Sphere) | [studiosphere.co/case-studies/inbox0](https://www.studiosphere.co/case-studies/inbox0) | Glass triage calm — useful if pixel layer feels too heavy |
| A Short Hike | [Wikipedia](https://en.wikipedia.org/wiki/A_Short_Hike) | Pastel daytime pixel — wrong time-of-day; night variants only |
| Kentucky Route Zero | [Cardboard Computer](http://cardboardcomputer.com/kentucky-route-zero/) | Theatrical melancholy — flat vector, not pixel; mood reference only |

---

## Part 2 — Blockd-style trait analysis

Decomposing the Blockd reference direction into implementable design tokens.

### Visual stack (back → front)

```
┌─────────────────────────────────────────────┐
│  Layer 4: Modern UI (sans-serif, glass/panels) │
│  Layer 3: Glowing teal CTAs + pill badges      │
│  Layer 2: Pixel decorative sprites (anim)      │
│  Layer 1: Dark atmospheric gradient (pond/night)│
└─────────────────────────────────────────────┘
```

### Trait matrix

| Trait | Blockd expression | Relationship Memory adaptation |
|-------|-------------------|-------------------------------|
| **Dark bg** | Near-black with subtle blue undertone | Pond-night gradient: `#0B1020` → `#0F1F1A` (deep water to reed marsh) |
| **Pixel decorative layer** | Pond scene: lily pads, fish, reeds, fireflies | Event-themed variants; lily pad count = pending Triage items (subtle, not literal counter) |
| **Monospace / pill badges** | `🔥 14D · 5 RULES` stat chips | `📍 Ship Week · 12 pending` · `Draft` · `Monitoring active` — `JetBrains Mono` or `IBM Plex Mono` at 11–12px |
| **Glowing accent buttons** | Teal/cyan primary with outer glow | Keep CTA, "Start monitoring", Search submit — `box-shadow: 0 0 24px rgba(45,212,191,0.45)` |
| **Formula / tag UI** | Numbered steps + live preview panel | Onboarding: `01 Capture` → `02 Triage` → `03 Recall` with live mini phone mock |
| **Activity feed** | Real-time "Blocked tiktok.com" rows | Monitoring: "Extracted Maya Chen · Product @ Figma" with timestamp |
| **Accountability card** | Partner avatar + rules summary | Active session card: Event name + capture count + "End monitoring" |
| **Clean typography on top** | Inter/SF-style sans for headings & body | Card names, search input, instructions — **never** pixel font for Encounter facts |

### What to avoid from pure Blockd

- DNS/security metaphors (blocking, streaks as punishment)
- Over-gamification of streaks — Relationship Memory nudges should feel like **gentle tide**, not guilt
- Pixel font for body text — destroys OCR-adjacent legibility on screenshot cards

---

## Part 3 — Screen-by-screen adaptation

Maps to screens defined in [UI_BRIEF.md](../UI_BRIEF.md). Pixel layer is **consistent**; intensity varies by screen.

### Home

**Role:** Entry — name the Event, start or resume Monitoring.

**Layout:**
- Full-bleed pond-night background with **slow-animated pixel layer** (fish pass occasionally, lily pads bob)
- Center: modern glass panel (or solid `#121A24` at 88% opacity) with:
  - Title in clean sans: "Relationship Memory" (small pixel ornament left of title — e.g. 16×16 firefly)
  - Event Name text field — modern rounded input, mono placeholder: `e.g. Ship Week Demo Day`
  - Primary CTA: **"Start monitoring"** — teal glow pill
- If active session: Blockd-style **session card** — `Monitoring · {Event}` + `{n} captures` + "Resume"

**Emotional beat:** Calm before the event — pond at dusk, not yet rippling.

### Monitoring

**Role:** Passive capture mode during Event.

**Layout:**
- Compact top banner (not full pond — reduce visual noise): `Monitoring · {Event Name}` in mono pill + teal dot pulse
- Blockd-style **live activity feed** below instructions:
  ```
  2m ago   Extracted · Alex Kim · Engineer @ Stripe
  5m ago   Draft · (add name) · screenshot saved
  ```
- Pixel decor: subtle ripple animation when new Capture arrives (water distorts behind feed)
- **End monitoring** — secondary outline button, not glow (intentional friction — you're closing the chapter)

**Emotional beat:** Event in progress — ripples on water, each person a splash.

### Triage (swipe)

**Role:** Core emotional screen — Keep/Forget decisions.

**Layout:**
- **Dim the pond** — background darker, only card illuminated (Hyper Light Drifter selective neon)
- Full-screen Encounter card stack (max 3 visible) — **modern glass card**, NOT pixel-bordered:
  - Screenshot 60% height
  - Name / role / Event in sans-serif
  - Draft badge: amber pixel pill
- Queue count: mono badge top-center: `12 to review`
- Swipe overlays: Keep = teal glow trail right; Forget = desaturate + sink animation left
- Bottom: Keep / Forget tap buttons — teal glow (Keep), muted gray (Forget)

**Emotional beat:** 2am polaroid sort — each swipe is "do I carry you forward?"

**Motion (Forget):** Card opacity 100→40%, slight scale down, **submerge below horizon line** (Nijimu dissolve), 280ms. No harsh red flash.

**Motion (Keep):** Brief teal pulse, optional context sheet slides up — card **sharpens** (blur 0).

### Memory

**Role:** Browse kept Encounters.

**Layout:**
- Lighter pond — post-triage calm, dawn-adjacent palette shift (still dark mode)
- List rows: glass or solid rows — name, role, Event tag (mono pill)
- Optional **LENSE bubble view** toggle: contacts as lily pads clustered by Event pond
- Empty state: single empty lily pad + "People you Keep appear here"

**Emotional beat:** What you chose to carry — still, reflective water.

### Search

**Role:** NL recall across kept Memory.

**Layout:**
- Search bar: modern, full-width, teal focus ring glow
- Query placeholder: `robotics founder at Ship Week` (sans, italic muted)
- Results: ranked cards with **reason caption** in mono below name:
  ```
  Maya Chen
  Matched: role · company · event tag
  ```
- Pixel accent: faint **connection lines** between result cards sharing Event tags (Atropos graph hint)

**Emotional beat:** dredging the pond — something surfaces.

---

## Part 4 — Color palette

### Core tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `bg.pond.deep` | `#0B1020` | Base background top |
| `bg.pond.floor` | `#0F1F1A` | Base background bottom / marsh |
| `bg.panel` | `#121A24` @ 88% | Functional panels |
| `accent.teal` | `#2DD4BF` | Primary CTA, Keep, active monitoring |
| `accent.teal.glow` | `rgba(45,212,191,0.45)` | Button outer glow |
| `accent.teal.dim` | `#11767f` | Oxenfree-inspired secondary teal |
| `accent.amber` | `#C29E3F` | Draft badge (Dice Heroes gold) |
| `accent.forget` | `#64748B` | Forget action (muted, not red) |
| `accent.coral` | `#E07A5F` | Urgent nudge / decay phase 2 (Atropos) |
| `text.primary` | `#F1F5F9` | Names, titles |
| `text.muted` | `#94A3B8` | Captions, timestamps |
| `text.mono` | `#83B5B5` | Pill badges, stats (Oxenfree moonlight) |
| `pixel.reed` | `#2D4D4A` | Decorative sprites |
| `pixel.lily` | `#526867` | Lily pad base |
| `pixel.fish` | `#34D399` | Ambient fish accent |

### Palette rationale

- **Teal glow on dark** = phone screen / bioluminescence on water (Blockd CTA + Oxenfree night)
- **Forget is gray**, not red — Forgetting is natural fading, not rejection (emotional brief)
- **Amber Draft** = incomplete memory, still worth saving (warm, not error-yellow)
- Limited pixel palette per sprite: **≤8 colors** (Stardew rule) — keeps decorative layer cohesive

---

## Part 5 — Typography pairing

### Display / pixel accent

| Font | Role | Notes |
|------|------|-------|
| **Press Start 2P** or **VT323** | Landing hero, onboarding step numbers, empty-state headlines | Use at 12–16px max; letter-spacing +0.02em |
| **JetBrains Mono** or **IBM Plex Mono** | Pills, timestamps, queue counts, search `reason` lines | 11–13px, `#83B5B5` |

### Functional / clean sans

| Font | Role | Notes |
|------|------|-------|
| **Inter** or **SF Pro** (system) | Body, card names, instructions, search input | 15–22px per UI_BRIEF scale |
| Weight 600 for names, 400 for body | Encounter facts must scan in <1s at event fatigue |

### Pairing rules

1. **Never set Encounter name, role, or company in pixel font**
2. Pixel display font = **≤5 words per screen** (hero, empty states, step labels)
3. Mono pills always **UPPERCASE or small-caps** for Blockd formula feel: `MONITORING · SHIP WEEK`
4. Line-height 1.5+ on sans body over dark bg

---

## Part 6 — Motion ideas

| Moment | Duration | Easing | Description |
|--------|----------|--------|-------------|
| Pond ambient loop | 8–12s cycle | linear | Lily pads bob ±2px; fish crosses every 20–30s; firefly blink random |
| New Capture (Monitoring) | 400ms | ease-out | Ripple origin from top of feed; mono row slides in |
| Triage drag | realtime | spring (tension 180, friction 12) | Card rotate ±8°, teal/gray overlay opacity ∝ drag distance |
| Keep commit | 250ms | ease-out | Teal pulse ring expands from card center; exits right |
| Forget commit | 280ms | ease-in | Desaturate, scale 0.92, translate Y +40px "below water" |
| Queue count decrement | 150ms | — | Mono badge number ticks down with pixel flicker (`PixelFlicker` 220ms) |
| Session end → Triage | 300ms | ease-out | Pond darkens; first card rises from water (translate Y +20→0) |
| Search result appear | 200ms stagger | ease-out | Cards fade up; connection lines draw between related results |
| Decay nudge (2hr) | — | — | Pending badge shifts teal → amber; single lily pad dims |

**Accessibility:** `Reduce Motion` → disable pond parallax, replace swipe exit with cross-fade, no submerge animation.

**Performance:** Pixel decor is CSS sprite sheet or Lottie — single layer, `will-change: transform` only on active animations. UI cards stay native views.

---

## Part 7 — Three hero moment UI concepts (landing / onboarding)

### Hero A — "The Pond After the Party"

**Scene:** Full-viewport cross-section of a pixel pond at night. Event is over — a few glowing phone screens (tiny rectangles) reflected in water. Lily pads drift; some have faint face silhouettes (abstract, not photos).

**Headline (pixel, 14px):** `YOU MET THEM.`  
**Subhead (sans, 20px):** *You just never see them again.*  
**CTA:** Glowing teal — `Start remembering`  
**Below fold:** Blockd-style `01 · 02 · 03` formula strip with mini UI previews.

**Why it works:** Instant emotional hook + visual metaphor. Pond = memory surface.

---

### Hero B — "Screenshot → Swipe → Search"

**Scene:** Split layout. Left: modern phone mock showing LinkedIn screenshot capture. Center: pixel fish carries the screenshot underwater. Right: card emerges on lily pad for swipe.

**Headline (sans):** *Relationship Memory*  
**Tagline (mono pill):** `CAPTURE · TRIAGE · RECALL`  
**Three glowing teal CTAs (ghost steps):** not buttons — animated sequence auto-plays on loop.

**Why it works:** Product clarity for hackathon/demo audience without losing pixel mood.

---

### Hero C — "The Fading Queue"

**Scene:** Dark pond, **12 lily pads** visible — some bright (pending), some already sunken/dim (forgotten). Timer in mono: `2:14 AM · 12 PEOPLE WAITING`

**Headline (sans, quiet):** *Who do you want to remember?*  
**Subhead (sans, muted):** *Swipe Keep or Forget. Search when it matters.*  
**CTA:** `Open triage` — teal glow, urgent but calm  
**Footer line (pixel, tiny):** `memories fade. you decide what stays.`

**Why it works:** Leans hardest into ephemerality + urgency (PRD 2-hour nudge). Atropos decay language without guilt.

---

## Part 8 — Relationship to existing UI_BRIEF

Current [UI_BRIEF.md](../UI_BRIEF.md) specifies **Apple Liquid Glass** on dark gradient. This research **extends** (does not replace) that foundation:

| UI_BRIEF element | Pixel + Ephemeral adjustment |
|------------------|------------------------------|
| Glass tokens | Keep blur/radius; tint glass `#121A24` greener for pond reflection |
| Keep `#34d399` / Forget `#f87171` | Shift Forget to muted gray-coral; Keep stays teal family |
| Swipe thresholds | Unchanged (28% width, ±8° rotation) |
| Glass cards | Cards stay modern; pixel only in bg + badges |
| Motion ≤500ms | All proposals comply |

**Recommendation:** Treat pixel pond as **Phase 2 visual identity** for landing + key moments; ship Triage/Memory with glass cards on pond bg first.

---

## Part 9 — Source index

| # | Reference | URL |
|---|-----------|-----|
| 1 | Blockd | https://blockd.app/ |
| 2 | Pxlkit UI Kit | https://pxlkit.xyz/ui-kit |
| 3 | Game Glitch (Behance) | https://www.behance.net/gallery/236365559/Game-Glitch-A-Retro-Pixel-Game-Studio-Landing-Page |
| 4 | Dice Heroes UI (Dribbble) | https://dribbble.com/shots/5777943-UI-for-pixel-art-game-Dice-Heroes |
| 5 | Hyper Light Drifter UI Breakdown | https://medium.com/the-space-ape-games-experience/hyper-light-drifter-ui-breakdown-c2d9cfe0a192 |
| 6 | Oxenfree / Oxenfreenite | https://lospec.com/palette-list/oxenfreenite |
| 7 | Rain World | https://store.steampowered.com/app/312520/Rain_World/ |
| 8 | Nijimu | https://devpost.com/software/nijimu-to-blur |
| 9 | Kind Words | https://www.polygon.com/2019/8/2/20752088/kind-words-ziba-scott-steam-interview-game/ |
| 10 | Ambivalence / Swipeable Cards | https://dribbble.com/shots/2313705-Ambivalence-ll-Monday |
| 11 | LENSE | https://lifebypablo.com/work/lense |
| 12 | Atropos | https://github.com/matheusvfarah/atropos |

---

## Next steps (design, not code)

1. **Mood board:** Composite Blockd pond ref + Dice Heroes palette + Oxenfree night screenshot
2. **Figma:** One frame each for Home, Triage (mid-swipe), Search results — validate sans/pixel layering
3. **Motion prototype:** Forget "submerge" + Keep "sharpen" in Principle/Figma Smart Animate
4. **Copy pass:** Kind Words tone for Triage microcopy — whisper, not broadcast
5. **Accessibility audit:** Teal glow CTAs against `#0B1020` — target 4.5:1 on button label text
