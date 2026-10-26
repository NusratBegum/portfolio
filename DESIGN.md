# Design system

A small system for a six-slide portfolio deck over a live 3D sky. Everything lives in two places:
tokens and the two material recipes in [`src/styles/global.css`](src/styles/global.css), primitives in
[`src/components/ui/`](src/components/ui). Slides compose primitives and decide layout, nothing else.

## Principles

- **Context over decoration.** Every element carries information or an action. The fake sparklines, corner
  icons and film grain went because they implied data or added noise without saying anything.
- **One accent, one meaning.** Terracotta marks what you can act on (buttons, links, focus) and at most one
  emphasis per card (core skills, the thesis card's hairline). Numbers and data are ink.
- **Glass is a material with a contrast budget.** Cards sit over a moving WebGL sky, so surfaces are
  translucent but dense enough that text passes 4.5:1 over the brightest thing behind them (the moon).
- **Semantic tokens only.** Components never see a hex value. Tailwind's default colors, radii, shadows and
  easings are cleared, so `bg-red-500` or `rounded-2xl` generate no CSS.
- **One slide, one screen.** The deck can't scroll vertically per slide, so every layout is designed to fit
  390×664 up to 1600×900, and degrades to a scrolling column below that.

## Tokens

Three tiers. **Primitives** (`--oat-*`, `--midnight-*`, `--terracotta-*`, blur, motion) are raw values in
`:root`, outside `@theme`, so no utility can reach them. **Semantic roles** map primitives per theme (`:root` =
oat daylight, `.dark` = Apple midnight). **`@theme inline`** exposes roles as utilities (`bg-surface`,
`text-muted`, `border-line`…) that resolve at use time, so the theme switch is just a class on `<html>`.

| Role | Utility | Light | Dark | Used for |
|---|---|---|---|---|
| bg | `bg-bg` | oat-200 `#e8e1d4` | midnight-900 `#0c0c0e` | page, behind the sky |
| surface | `glass` | oat-50 @ 62% | midnight-700 @ 66% | cards |
| surface-feature | `glass-feature` | oat-50 84% + terracotta-600 4% | midnight-700 78% + terracotta-400 8% | the feature card |
| surface-strong | `glass-chrome`, `.btn-secondary` | oat-50 @ 84% | midnight-700 @ 84% | nav pills, rail, secondary buttons |
| ink | `text-ink` | oat-900 `#1d1d1f` | midnight-50 `#f5f5f7` | text |
| muted | `text-muted` | oat-700 `#5d594f` | midnight-300 `#aeaeb2` | secondary text, every label and caption |
| line | `border-line`, `divide-line` | oat-900 @ 14% | midnight-50 @ 16% | hairlines, tag outlines (feature: accent @ 40–45%) |
| accent | `bg-accent`; `text-accent` ≥ 24px only | terracotta-600 `#b04e2e` | terracotta-400 `#e0704a` | primary button, lead tags, dots, the contact "fly" |
| accent-hover | `.btn-primary:hover` | terracotta-700 | terracotta-300 | primary hover |
| accent-ink | `text-accent-ink` | terracotta-700 `#93401f` | terracotta-300 `#f28a63` | small accent text: CTA labels, links, active rail |
| on-accent | `text-on-accent` | white | oat-900 | text on accent fills |
| focus | `:focus-visible` | terracotta-700 | terracotta-300 | the one focus ring |

| Group | Utilities | Values | Why |
|---|---|---|---|
| Spacing | Tailwind 4px grid; `p-card`, `gap-grid`, `px-gutter` | card 16→24px, grid 8→16px, gutter 16→64px (phone→md) | three layout aliases keep slides, nav and cards on one column |
| Radius | `rounded-sm`, `rounded-card`, `rounded-pill` | 8px, 20px, pill | cards one radius at every size; controls and tags are pills |
| Elevation | `shadow-sm` / `md` / `lg` | one recipe tinted umber-900 @ 22% by day, black @ 60% at night | md for cards, lg for floating chrome |
| Blur | inside `glass*` | 16px cards, 28px chrome | chrome stays legible over cards and clouds |
| Motion | `duration-fast/base/slow`, `ease-out` | 150 / 250 / 500ms, expo-out (default transition = base) | hover is calm (1–2px lift); hover styles only under `(hover: hover)` |
| Z-index | `z-content`, `z-chrome`, `z-cursor` | 2, 50, 100 (sky canvas is 1) | one stacking order, named |

## Components

| Component | File | Variants | Rule |
|---|---|---|---|
| Card, CardLink | `ui/Card.tsx` | `default` (glass), `feature` | Every content box. `feature` at most once per slide: the thesis result (Highlights), Backend (the role applied for, Skills), the first-author paper (Writing). Work has none; order carries priority. A CardLink is one link: name = title + CTA (`aria-labelledby`), summary as description. |
| Tag, TagList | `ui/Tag.tsx` | `default`, `lead`, `live` | One recipe for Skills and Work. `lead` = a flock's core skills, listed first. `live` = dot + LIVE, deliberately not a pill: status isn't a technology. |
| Eyebrow | `ui/Eyebrow.tsx` | — | The label role: kind, source, card section. Short, never a sentence. |
| Stat | `ui/Stat.tsx` | size `display` / `stat` / `metric`; layout `stack` / `row-to-stack`; `count` | Number + caption + optional source (the project it comes from). `count` wires the GSAP counter; animated digits are `aria-hidden`, the real value is in the markup and an sr-only copy. |
| Button, CtaButton | `ui/Button.tsx`; `.btn*` in `@layer components` | `primary`, `secondary`; `md` 44px, `lg` 48/56px, `icon` | One primary per view (plus the nav's "Email me"). A CTA with `slide` flies the deck (DeckContext → `goTo`) and keeps `href` as fallback; external links open a new tab with ↗ and a screen-reader notice (a brand icon replaces ↗). In a layer so `px-4` on the nav brand wins. |
| CtaLabel, TextLink | `ui/Link.tsx` | — | CtaLabel names where a card link goes (mono, accent-ink). TextLink: underlined inline link. |
| Materials | `global.css` | `glass`, `glass-feature`, `glass-chrome`, `sky-text` | `sky-text` gives copy set on the sky (hero, contact) a halo of the page color. |
| Slide | `slides/Slide.tsx` | — | Section id + region name from `SECTIONS`, chrome-clearing padding, scroll fallback. |

**Removed.** `Bars` sparklines and Work's `SPARKS` / `num === '01'` (invented trends next to real numbers);
the cream / tint / accent card tones (four tones on one slide meant nothing); corner icons (a timer for
"detectors compared"; the CTA line already says it's a link); Skills' icon tiles (three more accent blocks);
the film grain (`body::after` at z-90 with `mix-blend-mode: overlay` over every glyph: softer text,
unmeasurable contrast, a full-screen blended layer while WebGL repaints each frame); `.btn-ink` and `.btn-sm`
(40px, under the target size); the flat-flamingo art on the data slide. Writing keeps its two covers, small and
beside the text.

## Accessibility

| Pair (flat) | Light | Dark | Rendered minimum over the live sky |
|---|---|---|---|
| ink on bg / surface | 12.9 / 14.6 | 18.0 / 14.7 | light 12.1 · dark 8.0 |
| muted on bg / surface (labels, captions) | 5.4 / 6.0 | 8.8 / 7.3 | light 5.0 · dark 4.8 |
| accent-ink on bg / surface | 5.4 / 6.1 | 8.0 / 6.6 | light 5.4 · dark 5.5 |
| on-accent on accent / hover | 5.3 / 7.0 | 5.3 / 6.9 | — |
| accent (large text only) on bg | 4.1 | 6.1 | light 4.1 · dark 5.8 (needs 3) |

"Rendered" is measured, not computed: Playwright screenshots each slide with all text made transparent, then
takes the 5th-percentile ratio of every text run against the real pixels behind it (glass, sky, bird, sun or
moon), at 375/390/768/1024/1280/1600px in both themes. That pass is why dark glass is 66% (not 55%), dark muted
is `#aeaeb2` (not `#a1a1a6`), the contact blurb is ink and sky copy has a halo: the moon sits behind them.
axe-core (WCAG 2 A/AA, `scripts/audit.mjs`): 0 violations on every slide, both themes, desktop and phone.

- **Focus.** One 2px `focus` ring, 3px offset, following each element's radius. Tab into an off-screen slide and
  the deck flies there; rail buttons and CTAs move focus to the target section (`aria-current` on the rail).
- **Targets.** Buttons and rail items are ≥ 44px. The colophon's inline link is padded to ~33px (inline text).
- **Reduced motion.** CSS animations and transitions collapse; counters show final values; no custom cursor.
- **Structure.** Six named regions (`SECTIONS`), one h1, sr-only h2 per slide, lists for tags and stats,
  decorative images `alt=""`.

## Constraints

- **3D canvas behind glass.** The flamingo flies through per-slide clear zones (`src/three/Bird.tsx`): right of
  the hero copy and above the cards on desktop, and in a sky band over the top ~20% on phones. So hero and
  contact copy sit low on phones; the denser slides fill the screen and the bird passes behind their glass.
- **Horizontal GSAP deck.** A slide is exactly one viewport, and the track is `overflow: hidden`, so anchors
  can't jump: in-deck links go through `goTo` (also `/#work` on load). Layouts are checked at 390×664, 375×667,
  768×1024, 1024×768, 1280×720 and 1600×900; below that (320–360px phones, landscape phones, 200% zoom) the
  slide column scrolls. Phones drop project summaries, tags and skill sub-lines (still in the DOM / link
  descriptions); Work is 1 column → 2×2 at `sm` → 4 across at `lg`.
- **Performance.** CSS 34 KB (7.2 KB gzip), no new dependencies, blur only on cards and chrome, grain layer gone.
  Fonts: see Typography.

## Typography

Tokens live in [`src/styles/global.css`](src/styles/global.css) (section *TYPOGRAPHY*). Components use role
utilities only. Tailwind's default `text-*`, `font-weight-*`, `tracking-*` and `leading-*` scales are cleared in
`@theme`, so an off-system class like `text-lg` or `font-semibold` generates no CSS.

**Fonts.** **Inter** (400 / 500 / 700) is for UI and reading text: tall x-height, clear at small sizes, real
tabular figures. **JetBrains Mono** (400 / 500) is only for metadata: labels, tags, post numbers, project titles,
captions, the nav rail. Mono there signals engineering craft and keeps numbers aligned; limiting it to metadata
keeps it from taking over. Both are self-hosted WOFF2, latin subset, in `public/fonts/` (five files, 115 KB, OFL
licences alongside). No 600/800 cuts ship, and `font-synthesis: none` stops the browser from faking them.

**Scale.** Major Third (×1.25) on 1rem. With only three weights, size carries most of the hierarchy, and ×1.25
makes each role clearly different at a glance. Step −2 (10px) is left out on purpose: nothing renders below 12.8px.

| step | −1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| rem | 0.8 | 1 | 1.25 | 1.563 | 1.953 | 2.441 | 3.052 | 3.815 | 4.768 | 5.96 | 7.451 |

**Roles.** Primitive `--step-*` values feed semantic `--text-<role>` tokens, each with its own line height,
tracking and weight.

| Role · utility | Size | Leading | Weight | Tracking | Family | Used for |
|---|---|---|---|---|---|---|
| display · `text-display` | clamp 3.815→7.451rem (61→119px) | 0.95 | 700 | −0.03em | Inter | Hero name; one headline number per slide |
| h1 · `text-h1` | clamp 2.441→4.768rem (39→76px) | 1.1 | 700 | −0.025em | Inter | Slide and contact headlines |
| h2 · `text-h2` | 1.953rem (31px) | 1.25 | 700 | −0.02em | Inter | Section headings; project metric (md+) |
| h3 · `text-h3` | 1.25rem (20px) | 1.25 | 500 | −0.01em | Inter; Mono for project titles | Card titles |
| stat · `text-stat` | clamp 1.953→3.815rem (31→61px) | 1 | 700 | −0.02em | Inter + `tabular-nums` | Stat numbers (counters don't jitter) |
| body-lg · `text-body-lg` | 1.25rem | 1.5 | 400 | −0.015em | Inter | Hero summary and role line, lead copy (md+) |
| body · `text-body` | 1rem | 1.5 | 400 | −0.01em | Inter | Default text; buttons |
| body-sm · `text-body-sm` | 0.8rem | 1.5 | 400 | 0 | Inter | Secondary copy: project summaries, bylines, credentials |
| label · `text-label` | 0.8rem | 1.25 | 500 | +0.05em | Mono, `uppercase` | Eyebrows, project kind, CTA labels, nav rail, post numbers |
| caption · `text-caption` | 0.8rem | 1.5 | 400 | 0 | Mono | Stat captions, footer meta, dates |

Leading tokens: tight 1.1, snug 1.25, normal 1.5, relaxed 1.75. Display uses 0.95 because it is all caps with no
descenders; 1.1 would open a gap between the two lines of the name. Tracking follows Inter's dynamic-metrics
curve (tighter as size grows); uppercase mono labels open up by 0.05em.

**Recipes.**
- Label: `<Eyebrow>` (`font-mono text-label uppercase text-muted`). Tag: `<Tag>` (`font-mono text-label leading-tight
  tracking-normal`; tech names are proper nouns and keep their case). See [Components](#components).
- Paragraph: `text-body` (or `md:text-body-lg`) with `max-w-measure`, including the hero and project summaries.
  `--container-measure` is `50ch` ≈ 65 characters: CSS `ch` is the width of "0" (0.63em in Inter) while the
  average glyph is 0.48em, so a literal `65ch` would be ~85 characters per line.
- Only display, h1 and stat are fluid, and every `clamp()` keeps a rem term so zoom and the user's default font
  size still scale it. In tight layouts, switch roles at a breakpoint (`text-body md:text-h3`); don't invent sizes.
- Headings get `text-wrap: balance`, paragraphs `text-wrap: pretty`. Write apostrophes as ’, not '.

**Performance and CLS.** `font-display: swap` plus metric-matched fallbacks: *Inter Fallback* (local Arial /
Liberation Sans / Arimo) and *JetBrains Mono Fallback* (Courier New / Liberation Mono / Cousine). Their
`size-adjust` and ascent/descent/line-gap overrides were computed from the shipped WOFF2s with fontkit
(letter-frequency-weighted widths), so fallback text wraps and sits on the same lines. `index.html` preloads the
two hero files: Inter 700 (the name, the LCP element) and Inter 400 (the summary). Measured with Playwright, font
downloads held back 1.2s: hero CLS 0.000 on phone (both themes) and laptop, against 0.0003 with unadjusted Arial;
text boxes move at most 1.7px on swap, against 6.7px without overrides.

**Accessibility.** Minimum rendered size 12.8px; reading text at 1.5 line height within the measure; all caps only
for short labels, never sentences. The hero surname was hollow outline text; it is now solid `text-muted`. A 2.5px
stroke has no fill to test for contrast, the WebGL sky and flamingo show through the letters, and the counters
close up at 61px. Solid muted keeps the two-tone name with measurable contrast.
