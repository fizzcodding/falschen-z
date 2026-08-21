# Team Fälschen Design Direction

## Three possible approaches

### Theme Name: Signal Forge
Very Brief Intro: A disciplined Swiss-grid research showcase with CRT scanlines, hard-edged panels, and a restrained phosphor accent. It treats the team's work like a readable instrument panel rather than a marketing site.
Probability: 0.03

### Theme Name: Field Manual
Very Brief Intro: A monochrome engineering dossier with indexed sections, annotated diagrams, and paper-like technical spacing. It feels archival, methodical, and competition-ready.
Probability: 0.08

### Theme Name: Night Lab
Very Brief Intro: A dark observatory-inspired interface with sparse luminous data marks and a low-poly research map. It creates a more cinematic, nocturnal tone without becoming a neon dashboard.
Probability: 0.02

## Chosen approach: Signal Forge

### Design Movement
Swiss International Typographic Style crossed with restrained retro-CRT instrumentation and technical schematic notation.

### Core Principles
1. **Sharp structure:** every interactive surface uses `border-radius: 0` and a 3px ink border; separation comes from borders and hard offset shadows only.
2. **Ordered asymmetry:** sections use a strict column system with deliberate offsets, index labels, and generous negative space rather than centered marketing stacks.
3. **Quiet signal:** scanlines, coordinate marks, and one phosphor accent provide atmosphere without overpowering the research content.
4. **Evidence first:** awards, subsystem specifications, and research details are presented as legible system data, never as decorative filler.

### Color Philosophy
The base is `#F6F6F6`, chosen as a soft instrument-paper field instead of stark white. Logo navy `#101A2E` is the primary ink, carrying authority and continuity from the supplied anvil mark. The single accent is phosphor green `#8BFF6A`: it evokes CRT signal and live system state while remaining visibly distinct from navy. No other saturated colors are introduced.

### Layout Paradigm
An asymmetric Swiss-grid page: a narrow persistent index rail on larger screens, wide hero copy offset against a schematic globe field, then split diagnostic panels and horizontal research/team records. Mobile collapses the rail into a compact top dock while preserving the same indexed reading order.

### Signature Elements
- Fine scanline texture and coordinate ticks over the page background.
- Hard-offset black/navy shadows on selected panels, like a printed schematic lifted from a workbench.
- A dithered wireframe globe and measurement labels in the hero, reused only as a hero motif.

### Interaction Philosophy
Interactions should clarify orientation. Navigation highlights the active section, the floating dock exposes the page index and return-to-top action, and buttons provide immediate press feedback. Hover states reveal system metadata rather than decorative motion.

### Animation
Use a short double-staircase preloader with synchronized steps entering from the top and bottom. After reveal, use subtle opacity/translate entrances gated by `prefers-reduced-motion`. Keep transitions below 240ms, animate only transform and opacity, and avoid scroll-jacking, looping background motion, cursor effects, and animated arrows.

### Typography System
Use **IBM Plex Mono** for headings, navigation, indexes, labels, and technical data. Use **Manrope** for body copy and readable descriptions. Headings are uppercase or title case with tight tracking and strong weight contrast; body copy uses a restrained 1.6 line-height. No serif fonts, Inter, Geist, or Space Grotesk.

### Brand Essence
Team Fälschen is a two-person researcher-engineer team for judges, collaborators, and curious technical audiences, distinguished by building and competing across robotics, physics, and AI as one connected practice. Personality: **precise, inventive, stubborn**.

### Brand Voice
Headlines sound declarative and engineered. CTAs sound like invitations into the work, not generic conversion language. Microcopy is concise, specific, and slightly human.

Example lines:
- “Five subsystems. One caregiving ecosystem.”
- “Trace the build.”

### Wordmark & Logo
Use the supplied navy anvil and hammer mark as-is, paired with the custom wordmark text “FÄLSCHEN” in IBM Plex Mono ExtraBold with tracked capitals and a compact technical lockup. The mark remains the source of truth and is never redrawn.

### Signature Brand Color
Phosphor green `#8BFF6A`, reserved for active states, tiny signal marks, and one or two high-value emphasis moments against navy and `#F6F6F6`.

## Style Decisions
- Sharp edges and 3px borders override any rounded defaults from sourced components.
- Sourced component structure is retained where useful, but visual treatment is adapted to Signal Forge.
- The supplied anvil mark is the only brand mark used; no generated replacement logo is allowed.

## Style Decisions
- Phosphor green `#8BFF6A` is reserved for signal marks, active states, key numerals, offset shadows, and one controlled emphasis per page; it is never a full-section background.
- Privacy, terms, and 404 routes must read as Signal Forge dossiers, with indexed metadata, hard navy rules, panel framing, and restrained coordinate atmosphere.
- CTA and utility copy should sound like entering or tracing a build, not generic SaaS conversion language.
