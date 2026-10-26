# Nusrat Begum — Portfolio

React + Three.js flamingo portfolio. Scroll flies a camera through a clean sky world of six stations; a textured, photoreal flamingo with spring physics leads the way across an oat daylight sky — or a starlit Apple-midnight one with a crisp moon.

## Stack

- **React 18 + Vite 5 + TypeScript**
- **@react-three/fiber + drei** — declarative Three.js scenes
- **GSAP ScrollTrigger** — pinned horizontal scroll, reveals, counters
- **Tailwind CSS v4** — utility styling over a token system

## Structure

```
src/
  App.tsx                 — scroll orchestration (GSAP), layout, theme state
  data/content.ts         — all copy in one place
  store/journey.ts        — shared scroll-progress store (DOM ↔ WebGL bridge)
  styles/global.css       — design tokens (light/dark), fluid type scale, primitives
  components/             — Nav, Rail, slides/ (Hero, Impact, Skills, Work, Writing, Contact)
  three/
    Sky.tsx               — Canvas, camera dolly, lights, per-theme atmosphere
    Bird.tsx              — spline flight path, damped-spring physics; textured hero flamingo
                            + low-poly wing-beat companions; landed bird at contact
    Clouds.tsx            — parallax clouds, camera-locked sun/moon, night starfield
  assets/models/          — flamingo-real.glb (user's Meshy AI model, optimized 10 MB → 0.8 MB
                            via gltf-transform: weld/simplify/quantize + 1024px WebP textures)
  assets/flat/            — flat flamingo poses (extracted from user's Freepik set,
                            white keyed to alpha) — Writing covers + Impact cell art
  assets/flamingo-logo.svg — brand mark (nav, rail marker, favicon)
```

## Design system

Two themes, token-switched on `html.dark` (persisted, defaults to OS preference):

| Token | Light (Oat) | Dark (Apple midnight) |
|---|---|---|
| `--bg` | `#e8e1d4` | `#0c0c0e` |
| `--ink` | `#1d1d1f` | `#f5f5f7` |
| `--muted` | `#5d594f` | `#a1a1a6` |
| `--accent` | `#b04e2e` | `#e0704a` |

Typography: Apple system sans stack; fluid `clamp()` type scale (`--text-hero` … `--text-label`), mobile-first breakpoints throughout.

## The 3D world

- The camera dollies along +X as you scroll (`journey.p → camera.x`), pointer adds parallax; portrait screens pull the camera back.
- One flamingo carries the whole journey. The model has no skeleton, so it is **skinned on the GPU**: a vertex-shader hinge beats the wings around the shoulder line and swings the legs from the hip (`onBeforeCompile` in Bird.tsx). Wingbeat blends flap bursts with glides, beats harder while darting, and the body rides each downstroke.
- Flight physics: a **critically-damped spring** chases a point ahead on a Catmull-Rom spline — real inertia. Attitude is aircraft-style and stable under scroll reversal: heading turns along the shortest arc at a capped rate (the bird arcs around, never snaps), bank follows turn rate (coordinated turn), pitch follows the climb angle of the actual velocity. A flamingo can't hover, so at every station the bird glides a slow flat ellipse around its clear zone — always moving, mostly in profile. Legs trail straight back in cruise (rear-biased in the vertex shader) with a light sway. A camera-side fill light keeps the bird readable at night.
- **The story**: the journey is a day in the flamingo's life. She takes off at sunrise beside the name, flies off across the sea between scenes (far-z keypoints, fog swallows her, then she sweeps back in), skims the water on a shrimp run before the Work section, and makes the long haul home at dusk. The sun/moon traces the same arc — rising ahead of her, overhead at midday, warm at the horizons, setting behind her as she heads home. PATH keypoints are x-uniform: even indices are the six station dwell points, odd indices the story transits.
- The scene is deliberately uncluttered: bird, clouds, sun or moon, stars. Flight keypoints sit in per-slide clear zones so the bird never covers copy; narrow or short viewports (phones, tablets, rotated phones) blend the bird into an open sky band above the content, sized from the camera frustum.
- Clouds drift at two parallax depths; the sun/moon is parallax-locked to the camera. All motion respects `prefers-reduced-motion`.

## Develop / build

```bash
npm install
npm run dev            # local dev server
npm run build          # production build → dist/
npm run build:single   # self-contained single-file build → dist-single/
```

## Deploy to GitHub Pages

1. Push to GitHub. 2. Build: `npm run build`. 3. Publish `dist/` (e.g. `gh-pages` branch or Pages → GitHub Actions with the Vite preset). `base: './'` is already set.

## Tuning the flight

- Flight path keypoints: `PATH` in [src/three/Bird.tsx](src/three/Bird.tsx)
- Spring feel: `Spring3(omega, zeta)` constructors — higher ω = snappier, lower ζ = bouncier
- Vignettes: [src/three/Stations.tsx](src/three/Stations.tsx)

## UI-UX audit

`scripts/audit.mjs` drives the built site in real Chromium (Playwright): scrolls every slide in
both themes, screenshots each state, and runs axe-core WCAG 2 A/AA checks (color contrast included).

```bash
npm run build && npx vite preview --port 8745 &
node scripts/audit.mjs http://localhost:8745/ audit-out
```

`scripts/motion-check.mjs` adds a deeper pass: continuous-scroll motion frames (spring physics,
banking, wingbeat), theme-toggle round-trip, rail navigation, and hover states.
`scripts/repro-reverse.mjs` traces bird heading/bank while scrolling forward, backward and
jiggling — guards against scrub-reversal spins. `scripts/viewports.mjs` screenshots every slide
across phone / phone-landscape / tablet portrait / tablet landscape / small laptop.

Current status: all desktop scene + mid-scroll states and mobile slide states clean in both themes,
zero console errors. **Lighthouse: 100 performance · 100 accessibility · 100 best-practices · 100 SEO**
(3D scene idle-deferred and code-split; JSON-LD Person schema, OG/Twitter meta, robots.txt).
Note: run Lighthouse with `--chrome-flags="--headless=new --disable-gpu"` (PageSpeed-Insights-like).
With a GPU enabled, the decorative full-viewport WebGL canvas itself is counted as the "largest
paint" when the flamingo model arrives, which misreports LCP — the hero text actually paints at 1.4s.
