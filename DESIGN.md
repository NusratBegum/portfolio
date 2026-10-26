## Typography

Tokens live in [`src/styles/global.css`](src/styles/global.css) (section *TYPOGRAPHY*). Components use role
utilities only. Tailwind's default `text-*`, `font-weight-*`, `tracking-*` and `leading-*` scales are cleared in
`@theme`, so an off-system class like `text-lg` or `font-semibold` generates no CSS.

**Fonts.** **Inter** (400 / 500 / 700) is for UI and reading text: tall x-height, clear at small sizes, real
tabular figures. **JetBrains Mono** (400 / 500) is only for metadata: labels, tags, project numbers and titles,
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
| body · `text-body` | 1rem | 1.5 | 400 | −0.01em | Inter | Default text; `.btn-md` |
| body-sm · `text-body-sm` | 0.8rem | 1.5 | 400 | 0 | Inter | Secondary copy, credentials; `.btn-sm` |
| label · `text-label` | 0.8rem | 1.25 | 500 | +0.05em | Mono, `uppercase` | Eyebrows, meta, CTA links, nav rail, project numbers |
| caption · `text-caption` | 0.8rem | 1.5 | 400 | 0 | Mono | Stat captions, footer meta, dates |

Leading tokens: tight 1.1, snug 1.25, normal 1.5, relaxed 1.75. Display uses 0.95 because it is all caps with no
descenders; 1.1 would open a gap between the two lines of the name. Tracking follows Inter's dynamic-metrics
curve (tighter as size grows); uppercase mono labels open up by 0.05em.

**Recipes.**
- Label: `font-mono text-label uppercase text-muted`. Tag: `font-mono text-label leading-tight tracking-normal`
  (tech names are proper nouns and keep their case).
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
