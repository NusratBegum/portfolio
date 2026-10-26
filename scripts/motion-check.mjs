/* Deep motion & interaction check:
   - continuous scroll capture (bird physics/banking visible frame to frame)
   - theme toggle interaction, rail navigation, card hover states
   Usage: node scripts/motion-check.mjs <url> <outDir> */

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'motion-out';
mkdirSync(out, { recursive: true });

// PW_CHROMIUM: use a preinstalled Chromium (e.g. CI or containers) instead of Playwright's download
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });

for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(2600);

  const len = await page.evaluate(() => document.querySelector('.js-track').scrollWidth - innerWidth);

  /* continuous flight: 12 waypoints, capture mid-motion (600ms after each hop) */
  for (let i = 0; i <= 12; i++) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'smooth' }), (i / 12) * len);
    await page.waitForTimeout(650); // mid-flight — springs still moving
    await page.screenshot({ path: join(out, `fly-${theme}-${String(i).padStart(2, '0')}.png`) });
  }
  await ctx.close();
}

/* interactions — light theme */
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.addInitScript(() => localStorage.setItem('theme', 'light'));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);

/* theme toggle round-trip */
await page.click('button[aria-label*="dark mode"]');
await page.waitForTimeout(1200);
const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
await page.screenshot({ path: join(out, 'ix-toggle-dark.png') });
await page.click('button[aria-label*="light mode"]');
await page.waitForTimeout(1200);
const isLight = await page.evaluate(() => !document.documentElement.classList.contains('dark'));

/* rail navigation to Work */
await page.click('.js-track ~ * >> nothing', { timeout: 1 }).catch(() => {});
await page.getByRole('button', { name: 'Work' }).click();
await page.waitForTimeout(3200);
const pAfterRail = await page.evaluate(() => (window).__journey.p);
await page.screenshot({ path: join(out, 'ix-rail-work.png') });

/* hover a work card */
const card = page.locator('a.glass.group').nth(4);
await card.hover();
await page.waitForTimeout(700);
await page.screenshot({ path: join(out, 'ix-hover-card.png') });

/* custom cursor exists on fine pointer */
const cursorOk = await page.evaluate(() => !!document.querySelector('.pointer-events-none.fixed.z-\\[100\\]'));

console.log(JSON.stringify({
  toggleToDark: isDark,
  toggleBackToLight: isLight,
  railWorkProgress: Number(pAfterRail.toFixed(3)),
  customCursorMounted: cursorOk,
}, null, 1));

await ctx.close();
await browser.close();
