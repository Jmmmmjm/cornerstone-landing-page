const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  
  console.log('Navigating...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
  
  console.log('Searching for section...');
  const section = page.locator('section').filter({ hasText: 'Real Results' });
  await section.scrollIntoViewIfNeeded();
  
  // Wait for animations
  await page.waitForTimeout(2000);
  
  const filename = 'results_section_verified.png';
  await section.screenshot({ path: filename });
  console.log(`Screenshot saved to ${filename}`);
  
  await browser.close();
})();
