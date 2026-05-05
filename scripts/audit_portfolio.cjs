const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  
  // Scroll to portfolio section
  // Portfolio section has h-[300vh] and is likely lower down.
  // We'll search for the text "OUTPUT" to find it.
  const outputHandle = await page.waitForSelector('text=O'); // Try to find one of the letters
  await outputHandle.scrollIntoViewIfNeeded();
  
  // Wait a bit for animations to settle
  await new Promise(r => setTimeout(r, 1000));
  
  await page.screenshot({ path: 'portfolio_audit_fix.png', fullPage: false });
  await browser.close();
  console.log('Screenshot saved to portfolio_audit_fix.png');
})();
