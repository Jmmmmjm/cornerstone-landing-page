import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'manual_verify.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to manual_verify.png');
})();
