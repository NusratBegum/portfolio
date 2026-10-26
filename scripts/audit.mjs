/* UI-UX audit: drives the real built site in Chromium via Playwright.
   - desktop: scrolls scene-by-scene INCLUDING mid-scroll states (11 stops)
   - mobile: real device emulation (iPhone-class viewport), all 6 slides
   - screenshots everything in light + dark
   - axe-core WCAG 2 A/AA checks per slide state, console error collection
   Usage: node scripts/audit.mjs <url> <outDir> */

import { chromium, devices } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:8745/';
const out = process.argv[3] ?? 'audit-out';
mkdirSync(out, { recursive: true });

const SLIDES = ['intro', 'impact', 'skills', 'work', 'writing', 'contact'];
const report = { desktop: {}, mobile: {}, consoleErrors: [] };
// PW_CHROMIUM: use a preinstalled Chromium (e.g. CI or containers) instead of Playwright's download
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });

async function makePage(theme, contextOpts) {
  const ctx = await browser.newContext(contextOpts);
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') report.consoleErrors.push(`${m.text().slice(0, 200)}`);
  });
  page.on('pageerror', (e) => report.consoleErrors.push(`PAGEERROR ${String(e).slice(0, 200)}`));
  await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(2500);
  return { ctx, page };
}

const scrollLen = (page) =>
  page.evaluate(() => document.querySelector('.js-track').scrollWidth - innerWidth);

/* ---------- desktop: scene-by-scene + between scenes ---------- */
for (const theme of ['light', 'dark']) {
  const { ctx, page } = await makePage(theme, { viewport: { width: 1440, height: 900 } });
  const len = await scrollLen(page);
  const results = [];

  for (let step = 0; step <= 10; step++) {
    const p = step / 10;
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'smooth' }), p * len);
    await page.waitForTimeout(1800);
    const name = step % 2 === 0 ? SLIDES[step / 2] : `between-${SLIDES[(step - 1) / 2]}-${SLIDES[(step + 1) / 2]}`;
    await page.screenshot({ path: join(out, `desk-${theme}-${String(step).padStart(2, '0')}-${name}.png`) });

    if (step % 2 === 0) {
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).exclude('canvas').analyze();
      results.push({
        state: name,
        violations: axe.violations.map((v) => `${v.id}(${v.impact}×${v.nodes.length})`),
      });
    }
  }
  report.desktop[theme] = results;
  await ctx.close();
}

/* ---------- mobile: iPhone-class emulation ---------- */
for (const theme of ['light', 'dark']) {
  const { ctx, page } = await makePage(theme, {
    ...devices['iPhone 13'],
  });
  const len = await scrollLen(page);
  const results = [];
  for (let i = 0; i < SLIDES.length; i++) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'smooth' }), (i / 5) * len);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: join(out, `mob-${theme}-${i}-${SLIDES[i]}.png`) });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).exclude('canvas').analyze();
    results.push({
      state: SLIDES[i],
      violations: axe.violations.map((v) => `${v.id}(${v.impact}×${v.nodes.length})`),
    });
  }
  report.mobile[theme] = results;
  await ctx.close();
}

await browser.close();
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 2));

for (const device of ['desktop', 'mobile']) {
  for (const [theme, states] of Object.entries(report[device])) {
    const bad = states.filter((s) => s.violations.length);
    console.log(`${device}/${theme}: ${bad.length === 0 ? 'all clean' : bad.map((s) => `${s.state}: ${s.violations.join(',')}`).join(' | ')}`);
  }
}
console.log('console errors:', report.consoleErrors.length ? [...new Set(report.consoleErrors)] : 'none');
