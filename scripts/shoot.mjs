import { chromium } from '@playwright/test';

const url = process.env.SHOOT_URL ?? 'http://localhost:3400/book';
const outDir = process.env.SHOOT_OUT ?? '/tmp/shots';
const slug = process.env.SHOOT_SLUG ?? 'book';

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const path = `${outDir}/${slug}-${vp.name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log('saved', path);
  await page.close();
}
await browser.close();
