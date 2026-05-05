import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 5000 });
    await page.screenshot({ path: 'verify_3000.png', fullPage: true });
    console.log('Screenshot saved to verify_3000.png');
  } catch (e) {
    console.log('Failed to connect to 3000');
  }
  await browser.close();
})();
