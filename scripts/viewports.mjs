/* Small/mid screen evidence: capture each slide across phone/tablet viewports.
   Usage: node scripts/viewports.mjs [url] [outDir] */

import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'vp-out';
mkdirSync(out, { recursive: true });

const targets = [
  { name: 'phone', ...devices['iPhone 13'] },
  { name: 'phone-land', ...devices['iPhone 13 landscape'] },
  { name: 'tab-port', viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
  { name: 'tab-land', viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
  { name: 'laptop-sm', viewport: { width: 1280, height: 720 } },
];

const browser = await chromium.launch();
for (const { name, ...opts } of targets) {
  for (const theme of name === 'phone' ? ['light', 'dark'] : ['light']) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('canvas');
    await page.waitForTimeout(2400);
    const len = await page.evaluate(() => document.querySelector('.js-track').scrollWidth - innerWidth);
    for (let i = 0; i < 6; i++) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'auto' }), (i / 5) * len);
      await page.waitForTimeout(1300);
      await page.screenshot({ path: join(out, `${name}-${theme}-s${i}.png`) });
    }
    await ctx.close();
  }
}
await browser.close();
console.log('done');
