---
name: ClinBrief
description: A suminagashi basin — one live ink-in-water field with washi sheets of type laid over it.
colors:
  paper: "#F6F7F8"
  paper-deep: "#ECEEF1"
  dilute: "#7A8698"
  quiet: "#4C5A70"
  current: "#243A63"
  depth: "#0B1D3A"
  sumi: "#1A1A1A"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.032em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 7.2vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.9vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.32
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.64
    letterSpacing: "normal"
  label:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.16em"
  data:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  script:
    fontFamily: "Noto Sans <Script>, sans-serif"
    fontSize: "clamp(1.25rem, 2.1vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
rounded:
  none: "0px"
  focus: "2px"
  pill: "999px"
spacing:
  gutter: "24px"
  gutter-lg: "40px"
  section: "96px"
  section-lg: "144px"
  water-gap: "18vh"
  water-gap-lg: "26vh"
  container: "92rem"
  measure: "68ch"
components:
  pill-solid:
    backgroundColor: "{colors.depth}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.8125rem 1.5rem"
  pill-solid-hover:
    backgroundColor: "{colors.current}"
    textColor: "{colors.paper}"
  pill-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.depth}"
    rounded: "{rounded.pill}"
    padding: "0.8125rem 1.5rem"
  pill-ghost-hover:
    textColor: "{colors.depth}"
  dye-pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.depth}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1rem"
  dye-pill-selected:
    backgroundColor: "{colors.depth}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1rem"
  sheet-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.depth}"
    rounded: "{rounded.none}"
    padding: "96px 24px"
  sheet-deep:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.depth}"
    rounded: "{rounded.none}"
    padding: "96px 24px"
  sheet-ink:
    backgroundColor: "{colors.depth}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "96px 24px"
  brief-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.depth}"
    rounded: "{rounded.none}"
    padding: "40px 28px"
    width: "52rem"
  nav-link:
    textColor: "{colors.current}"
    typography: "{typography.body}"
---

# Design System: ClinBrief

## Overview

**Creative North Star: "The Suminagashi Basin"**

The whole page is one basin of water with ink floating on it, and the content is paper laid on the surface. A single WebGL fluid simulation is fixed behind every section; sheets of washi — three tones of it — scroll over the top, and the gaps between the sheets are where the water shows through. The ink is not decoration bolted to a hero: it is the ground the site is built on, and it stays live for the whole scroll. The metaphor is load-bearing rather than ornamental — the call is ink dropped in water, the doctor's brief is the sheet lifted off it.

The mood is quiet, cool and hand-made. Nothing glows. The fluid display pass composites **subtractively** over paper white with a Beer–Lambert coverage curve, so ink darkens the water the way ink actually does; there is no additive bloom anywhere in the system, in the shader or in the CSS. Type is held to one weight, one metric ramp, and a left margin. Where a sheet has to end, it tears rather than rounds: deckled edges rendered through an SVG turbulence-displacement filter. The result is dense with material but very low on chrome — no cards-with-icons, no gradient panels, no glass.

The build refuses the AI-health hero explicitly and completely: no dark gradient, no glowing waveform, no tilted dashboard mockup, no logo row, no product screenshot in perspective. It also refuses government-adjacent visual language — no national colours, no emblem-style mark — because the product must never read as state-affiliated. The single mark is a drawn ripple: the concentric rings one drop leaves on still water.

**Key Characteristics:**
- One live WebGL ink basin fixed behind the entire page; content sheets scroll over it
- Cool paper white and indigo — never cream, never warm
- Torn deckled sheet edges instead of corner radii; pills are the only round form
- One type weight (400), one display metric, hairline rules, wide-tracked mono micro-labels
- Ink is subtractive: colour arrives by darkening, never by glowing
- Nine real Indic script faces, because the scripts are the product's argument
- Content visible by default; motion is additive and opt-out-aware

## Colors

A cool, ink-on-wet-paper palette: one indigo family from near-black to a mid current, one neutral line/text pair, and two paper grounds. There is no warm tone and no accent hue in the interface — colour saturation belongs to the water, not the chrome.

### Primary
- **Basin Indigo** (`{colors.depth}`): The dominant ink. Sets nearly all type on paper grounds, fills the solid pill, is the ground of the ink-toned sheets, and is the primary dye dropped into the water at page load. If something is dark in this system, it is this colour.
- **Wet Current** (`{colors.current}`): The indigo one stage diluted — the water's own colour, and the only interactive accent. It carries nav links, the "into the brief" annotations, the unresolved-field markers in the brief, hover states on both pills, the focus ring, and the selection highlight. It is also the second dye in the opening drop sequence.

### Secondary
- **Carbon Sumi** (`{colors.sumi}`): The minor note. Used only inside the basin — the small carbon drop in the opening sequence and one language dye. It is deliberately never given equal weight to indigo: an equal carbon drop averages the whole basin to neutral grey, which is the one colour this world cannot be. Not a text colour.

### Neutral
- **Cool Paper** (`{colors.paper}`): The page ground, the default sheet tone, the shader's paper constant, and the type colour on ink-toned sheets. Cool, never cream.
- **Damp Paper** (`{colors.paper-deep}`): The second sheet tone, one step deeper. Its only job is to distinguish an adjacent sheet from the default one without introducing a new hue.
- **Dilute** (`{colors.dilute}`): A **line colour only**. Every hairline rule, border, divider and ghost-pill outline is this colour mixed down to 30–55% alpha. It measures 3.3:1 on paper and must never set type.
- **Quiet** (`{colors.quiet}`): Dilute's text-safe partner at 6.1:1 on paper. Every small, secondary, caption, disclaimer and micro-label string uses this.

### The dye set (content, not chrome)
Ten dye hexes — one per language — live with the language content, not in the theme: Hindi `#12285C`, Bengali `#7A2036`, Tamil `#1A1A1A`, Telugu `#145257`, Marathi `#3B2A6B`, Kannada `#6B4A12`, Malayalam `#123D22`, Gujarati `#5C2A5C`, Punjabi `#1F4E8C`, Odia `#6B2B14`. They are all deep, desaturated and ink-dark by construction, so any of them can be dropped into the basin without breaking the world. They appear in the interface only as a 9px swatch on a language pill; they never set type, background or border.

### Named Rules
**The Dilute Line Rule.** `--color-dilute` draws lines and only lines. It fails text contrast on paper (3.3:1). Any text you were about to paint dilute takes `--color-quiet` (6.1:1) instead. No exceptions, including 11px labels.

**The Subtractive Rule.** Nothing in this world glows. Ink darkens paper; the display shader mixes toward the dye's own hue over the paper constant with `1 - exp(-a * 3.2)` coverage, and the interface follows the same physics — no additive blends, no bloom, no light-on-dark gradient, no coloured glow behind anything.

**The Mixed-Ink Rule.** Secondary text is not its own token. On paper grounds it is `color-mix(in srgb, var(--color-depth) 72–88%, var(--color-dilute))`; on ink grounds it is `color-mix(in srgb, var(--color-paper) 55–74%, var(--color-current))`. Mixing from the ground's own ink keeps every tint inside the basin's family instead of introducing greys.

## Typography

**Display Font:** Schibsted Grotesk (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Schibsted Grotesk — the same face, one family for all Latin text
**Label/Mono Font:** Azeret Mono (with `ui-monospace, monospace`), weights 400 and 500
**Script Faces:** Noto Sans Devanagari, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Gurmukhi, Oriya — nine real faces, weight 400, all loaded unpreloaded so none of them blocks the basin

**Character:** One grotesk doing everything, pulled tight at display sizes (−0.032em, 0.98 line-height) so headlines read as set type rather than as UI text. The mono is a second voice used only at micro scale — wide-tracked uppercase labels and machine-flavoured data — which makes it read as annotation on a document rather than as a font choice. The Indic faces are the emotional centre: the product's whole claim is that a patient speaks their own language, so the site sets those languages properly.

### Hierarchy
- **Headline** (400, `clamp(2.6rem, 7.2vw, 5.6rem)`, 0.98): The hero only. Balanced wrapping, held to a 46rem block against the left margin. The closing contact headline is a sibling at `clamp(2.25rem, 6vw, 4.75rem)`.
- **Display** (400, `clamp(2rem, 4.4vw, 3.4rem)`, 0.98): Every section heading. One per sheet.
- **Title** (400, `clamp(1.1875rem, 1.9vw, 1.5rem)`, 1.32, −0.02em): Sub-heads inside a section list; the brief card's own title at 1.375rem.
- **Lead** (400, `clamp(1.0625rem, 1.55vw, 1.3125rem)`, 1.62): The one paragraph directly under the hero headline.
- **Body** (400, 1.0625rem, 1.62–1.66): All running prose, capped at a 68ch measure.
- **Small** (400, 0.9375rem / 0.875rem, 1.6): Glosses, footnotes, footer text.
- **Label** (500, 0.6875rem, +0.16em, uppercase, mono): Section eyebrows are *not* a use of this. It labels data (`Language`, `Duration`, `Outcome`), brief fields, speaker attributions, and disclaimers.
- **Data** (400, 0.8125rem, mono): Brief values, extracted-fact annotations, ordinal numbering.
- **Script** (400, `clamp(1.25rem, 2.1vw, 1.75rem)`, 1.65): A patient utterance in its own script, with `lang` set. Call transcript turns sit slightly smaller at `clamp(1.125rem, 1.7vw, 1.375rem)`, 1.72.

### Named Rules
**The One Weight Rule.** The page uses a single weight. Nothing is bold — there is not one weight utility in the entire component tree — and `font-synthesis-weight: none` forbids the browser from faking one. Hierarchy comes from size, colour and space. The only exception is the mono micro-label at 500, which needs it to hold at 11px.

**The Endonym Rule.** A language is written in its own script, in a real face for that script, with `lang` set on the element. Never transliterate, never substitute a fallback stack, never show a language name in Latin only. The nine script faces are `preload: false` so the basin still paints first.

**The Mono Is Annotation Rule.** Azeret Mono never sets a sentence. It appears as a wide-tracked uppercase micro-label or as a short machine-flavoured value, and nowhere else.

## Layout

One column, one container, one margin. The container is `92rem` wide with `24px` gutters that open to `40px` at the `md` breakpoint (768px) — the only breakpoint the build uses. Sections are `96px` tall in padding, `144px` from `md` up.

Content sits in asymmetric two-column grids rather than equal halves: heading left in a `minmax(0, 30–34rem)` track, prose right in the remainder, with `64px` column gap and `32px` row gap; below `md` everything stacks in source order. Prose is capped at a 68ch measure regardless of its track width. The hero holds its type to a 46rem block on the left margin, vertically centred from `md` up and bottom-aligned on phones so the water stays open above the type.

The page is a stack of sheets on a fixed basin. `InkBasin` is `fixed inset-0 z-0`; `main` is `relative z-10`; every section is either a `Sheet` (an opaque ground) or a transparent section with a paper-tinted wash. The gaps are structural: an explicit `18vh` / `26vh` water gap sits between the call and the brief, and the transparent sections (Languages, Standing) are gaps that happen to contain type.

Motion in this layer is one thing only: `.settle`, a 14px rise with a 900ms opacity+transform transition on the `--ease-out` curve, released by an IntersectionObserver with a `-8% 0px -12% 0px` root margin and staggered 45–120ms between siblings.

### Named Rules
**The One Basin Rule.** There is exactly one canvas, fixed behind everything, owned by a single module-scope handle. Sections do not get their own backgrounds, videos, or gradients-as-atmosphere; if a section wants ink, it drops ink into the shared basin. The canvas never takes pointer events — stirring is bound to `window` — so scrolling and every control above it behave normally.

**The Water Gap Rule.** The space between two sheets is the design, not padding that got away. Never close a gap by making adjacent sheets contiguous; the water has to show through.

**The Paper Wash Rule.** Where type must sit over live water, put a paper-tinted linear gradient underneath it (`color-mix(in srgb, var(--color-paper) 30–95%, transparent)`, `pointer-events-none`, direction chosen to leave the ink visible). Never a blur, never a dark scrim, never a solid box.

**The Additive Reveal Rule.** Content renders visible. `.settle` sets `opacity: 1; transform: none` at baseline; the hidden state exists only inside `@media (prefers-reduced-motion: no-preference)` scoped to `.js` on the document element. Nothing is ever gated behind a script that might not run, and reduced-motion users get the settled state immediately.

## Elevation & Depth

The system is tonal first and shadowed almost never. Depth comes from three sheet grounds (`paper` → `paper-deep` → `ink`), from a washi-fibre noise overlay multiplied over every sheet at 0.5 opacity, and above all from the torn deckle edge that proves a sheet is a physical thing lying on top of something else. There are no borders-as-elevation and no glass panels; the only backdrop blur in the build is 10px on the nav bar once it has landed on paper.

Shadow appears in exactly one situation: a sheet lifted off another sheet. Both instances are large, soft, heavily negative-spread and cool-tinted — an object above a surface catching ambient light, not a UI card with a drop shadow.

### Shadow Vocabulary
- **Lifted Sheet** (`box-shadow: 0 34px 70px -28px rgba(4,12,26,0.62), 0 6px 16px -8px rgba(4,12,26,0.4)`): The pre-consultation brief card, floating on the ink-toned sheet. The two-layer form gives a contact shadow plus a long ambient one.
- **Resting Sheet** (`box-shadow: 0 22px 48px -26px rgba(4,12,26,0.42)`): The lighter version, for a paper card resting on open water rather than lifted off a dark ground.

### Named Rules
**The Deckle Layer Rule.** Deckled edges are separate absolutely-positioned `<span>` layers (`104%` wide, 26px tall, offset −13px, `aria-hidden`) that inherit the sheet's own ground through `--sheet-bg` and carry `filter: url(#deckle)`. They are never pseudo-elements on the sheet itself and never wrap content, so the turbulence-displacement filter can never touch live text. A dark sheet tears dark because the layer reads the sheet's own background variable.

**The Lift-Only Shadow Rule.** A shadow means "this sheet is off the one behind it". Shadows are never used for hover feedback, never for buttons, never for inputs, and never as a hard offset. If nothing is lifted, nothing casts.

## Shapes

Square by default, torn at the edges, round only where a thing is meant to be pressed. Sheets, cards, dividers and grids have no corner radius at all — their edge language is the deckle: `feTurbulence type="fractalNoise" baseFrequency="0.02 0.14" numOctaves="4" seed="7"` feeding an `feDisplacementMap` at `scale="17"`, defined once in the layout and referenced by every sheet edge. The horizontal frequency is deliberately much lower than the vertical so the tear runs along the edge rather than dissolving it.

The only fully round forms are the pill (999px), the small state dots (7–9px circles), and the ripple mark's concentric rings. Focus rings carry a 2px radius so they read as a ring rather than a box.

Rules are hairlines: 1px at 30–40% dilute. Never a thicker divider, never a double rule, never a boxed section.

### Named Rules
**The Torn Edge Rule.** Where a sheet ends, it tears. Do not introduce a corner radius on a sheet, card, or panel to soften it — the deckle is the softening. Radius belongs to pills and dots only.

## Components

### Buttons (Pills)
- **Character:** A pressed stamp. Small, calm, and physically responsive — they scale down on press rather than lighting up.
- **Shape:** Fully round (999px), `0.8125rem 1.5rem` padding, 0.9375rem label at −0.01em tracking, inline-flex with a `0.625rem` gap for a trailing drawn arrow.
- **Solid:** Indigo ground, paper text, 1px indigo border. Hover fills to Wet Current (background and border together). This is the primary action.
- **Ghost:** Transparent, indigo text, 1px border of 55% dilute. Hover moves the border to Wet Current and washes the interior with 6% of it.
- **Press:** `scale(0.972)` over 160ms on `--ease-out`; colour transitions run 220ms. Hover treatments are gated behind `@media (hover: hover) and (pointer: fine)` so touch devices never get a stuck hover state.
- **Compact:** The nav's "write to us" pill drops to `px-4 py-2` at 0.8125rem.

### Dye Pills (signature)
- **Character:** A language chip that is also an instrument — choosing one drops that language's dye into the shared basin.
- **Style:** Pill geometry with a 9px dye swatch, the endonym in its own script face, and the English name at 55% opacity. Unselected: paper ground, indigo text, 45% dilute border. Selected: indigo ground, paper text, indigo border, and a 50% paper outline ring around the swatch so it stays visible against the dark fill.
- **State:** Selection is expressed with `aria-pressed` inside a labelled `role="group"`, not with a hidden radio.

### Sheets / Containers
- **Corner Style:** None (0). The edge is a torn deckle layer, top and bottom.
- **Background:** One of three tones — `paper` (default), `paper-deep` (adjacent contrast), `ink` (indigo ground, paper text). The tone sets both `background` and a `--sheet-bg` custom property so the deckle tears in the sheet's own colour.
- **Texture:** A two-octave fractal-noise SVG grain, multiplied at 0.5 opacity, on every sheet.
- **Shadow Strategy:** None on the sheet itself; see Elevation for the two lift shadows used by cards *inside* sheets.
- **Internal Padding:** `96px` block, `144px` from `md`; `24px` / `40px` inline via the container.

### The Brief Card (signature)
The document the whole page is about: a paper sheet lifted off the ink-toned section, `52rem` wide, centred (the only centred block in the build), `28px/40px` padding opening to `56px`. It reclaims the paper-ground foreground explicitly rather than inheriting the ink sheet's light text. Structure is a header with a title and an illustrative-example disclaimer, a hairline rule, a 2/4-column metadata definition list in mono, then fields each preceded by its own hairline: 32% dilute for a settled field, 55% Wet Current for an unresolved one, with the field label taking the matching colour. Unresolved information is marked *up*, in the accent — the honest gap is the feature.

### Navigation
- **Style:** Fixed, transparent over the hero. Past 72% of viewport height it lands: 88% paper background, 10px backdrop blur, and a 1px 30%-dilute bottom border, all over a 500ms colour transition.
- **Typography:** Wordmark is 1.0625rem uppercase at +0.2em tracking beside the ripple mark. Links are 0.875rem in Wet Current, hovering to 60% opacity over 200ms.
- **Mobile:** Section links are hidden below `md`; the wordmark and the contact pill remain. There is no hamburger and no drawer.

### Marks and Icons
- **Ripple Mark:** The identity — three concentric circles (a 2.4r filled centre, a 6.1r stroke at 0.72 opacity, a 10.2r stroke at 0.38), drawn in `currentColor`, scaling to 1.06 over 400ms when its link is hovered. It is the rings a single drop leaves on still water.
- **Arrow:** One drawn arrow at 1.3 stroke, round caps, used for forward motion. There is no icon set: every glyph in this build is hand-drawn SVG in `currentColor`, and no icon font or emoji stands in for one.

### The Ink Basin (signature)
A WebGL2 stable-fluids solver (Stam) tuned as a suminagashi basin rather than a smoke demo. Dye is stored premultiplied (`rgb = colour × concentration`, `a = concentration`) so spreading ink thins toward the paper tone instead of toward black; the display pass composites subtractively over the paper constant with Beer–Lambert coverage; vorticity confinement at 30 is what turns diffuse clouds into feathered whorls. Density dissipation is held at 0.085 and velocity at 0.26 — a pattern stays on the water and keeps turning after the stroke that made it. Splat radius (0.0042) lands a drop about 6% of the viewport across.

The page opens with a composed sequence, not random splats: indigo, current, indigo, a small carbon note, then a drawn breath across the rings and a two-stroke comb pulled down through the bands. Resolution halves on phones (440/96 vs 700/128). Under `prefers-reduced-motion: reduce` the overture is composed once, settled 240 steps, presented as a still pattern, and the loop never starts. Without WebGL2 or float render targets the canvas hides itself and a three-stop radial-gradient marbling stands in.

## Do's and Don'ts

### Do:
- **Do** use `--color-quiet` (#4C5A70) for any small or secondary text; reserve `--color-dilute` (#7A8698) for lines, borders and dividers only.
- **Do** build secondary tints with `color-mix` from the ground's own ink — depth-toward-dilute on paper, paper-toward-current on ink — instead of adding new grey tokens.
- **Do** let the water show between sheets. A section that needs atmosphere becomes a transparent section with a paper wash, not a new background colour.
- **Do** render deckle edges as separate `aria-hidden` layers that read `--sheet-bg`, so the displacement filter never touches text.
- **Do** ship content visible and add motion on top: baseline `.settle` is settled, and the hidden state lives only inside `.js` plus `prefers-reduced-motion: no-preference`.
- **Do** set every Indic string in its own Noto face with a `lang` attribute, and keep those faces `preload: false`.
- **Do** gate hover treatments behind `@media (hover: hover) and (pointer: fine)`.
- **Do** keep one type weight and express hierarchy through size, colour and space.
- **Do** draw icons as inline SVG in `currentColor` at a 1.15–1.3 stroke.
- **Do** mark unresolved or uncertain information *up*, in Wet Current, rather than burying it.

### Don't:
- **Don't** set text in `--color-dilute`. It is 3.3:1 on paper and will fail at any size.
- **Don't** add glow, bloom, additive blending, or a dark-gradient hero. Ink darkens; it never emits.
- **Don't** put a corner radius on a sheet, card or panel. The edge language is the tear; radius belongs to pills and dots.
- **Don't** use shadow for hover, buttons, inputs, or emphasis — only for a sheet genuinely lifted off another sheet, and never as a hard offset.
- **Don't** add a second canvas or a per-section background animation. One basin, shared, with sections dropping ink into it.
- **Don't** introduce a bold weight or a third family. Two Latin families plus the script faces is the whole program.
- **Don't** apply the `#deckle` filter to any element containing live text.
- **Don't** rely on Tailwind's `text-current` / `border-current` utilities: this theme defines a colour token literally named `current` (#243A63), which shadows them. Set the colour explicitly.
- **Don't** use warm paper, cream, or a national-colour palette; the ground is cool white and the world must never read as state-affiliated.
- **Don't** reach for a glyph icon, an emoji, or an icon font in place of the drawn ripple mark and arrow.
