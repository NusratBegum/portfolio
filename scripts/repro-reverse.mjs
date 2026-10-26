/* Phase-1 repro: scroll forward, then backward, sampling bird heading/velocity.
   Weirdness = heading jumps (>90°/sample) or spins while scrubbing back.
   Usage: node scripts/repro-reverse.mjs [url] [outDir] */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'repro-out';
mkdirSync(out, { recursive: true });

// PW_CHROMIUM: use a preinstalled Chromium (e.g. CI or containers) instead of Playwright's download
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript(() => localStorage.setItem('theme', 'light'));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('canvas');
await page.waitForTimeout(2600);

const len = await page.evaluate(() => document.querySelector('.js-track').scrollWidth - innerWidth);

const samples = [];
let shot = 0;
async function sampleFor(ms, tag) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await page.evaluate(() => window.__bird ?? null);
    if (s) samples.push({ tag, t: Date.now() - t0, ...s });
    await page.waitForTimeout(50);
  }
  await page.screenshot({ path: join(out, `rev-${String(shot++).padStart(2, '0')}-${tag}.png`) });
}

/* forward to 45% */
await page.evaluate((top) => window.scrollTo({ top, behavior: 'smooth' }), 0.45 * len);
await sampleFor(1400, 'fwd');
/* immediately backward to 15% — the reported weirdness */
await page.evaluate((top) => window.scrollTo({ top, behavior: 'smooth' }), 0.15 * len);
await sampleFor(1400, 'back');
/* jiggle: fwd/back quickly like a user rubber-banding the wheel */
for (let i = 0; i < 4; i++) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'auto' }), (0.15 + (i % 2 ? 0.1 : 0)) * len);
  await sampleFor(320, `jig${i}`);
}
/* settle */
await sampleFor(1200, 'settle');

writeFileSync(join(out, 'trace.json'), JSON.stringify(samples, null, 1));

/* analysis: max per-sample heading delta (wrapped to shortest arc), ranges */
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
let maxD = 0, maxDat = null;
for (let i = 1; i < samples.length; i++) {
  const d = Math.abs(wrap(samples[i].heading - samples[i - 1].heading));
  if (d > maxD) { maxD = d; maxDat = samples[i]; }
}
const hs = samples.map((s) => s.heading);
const banks = samples.map((s) => s.bank);
console.log(JSON.stringify({
  samples: samples.length,
  maxHeadingDeltaDeg: +(maxD * 180 / Math.PI).toFixed(1),
  at: maxDat && { tag: maxDat.tag, p: +maxDat.p.toFixed(3), th: +(maxDat.th * 180 / Math.PI).toFixed(1) },
  headingRangeDeg: [+(Math.min(...hs) * 180 / Math.PI).toFixed(1), +(Math.max(...hs) * 180 / Math.PI).toFixed(1)],
  bankRange: [+Math.min(...banks).toFixed(2), +Math.max(...banks).toFixed(2)],
}, null, 1));

await browser.close();
