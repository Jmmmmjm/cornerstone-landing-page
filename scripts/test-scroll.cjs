const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  
  await page.goto('http://localhost:3003');
  console.log('Waiting for #portfolio...');
  await page.waitForSelector('#portfolio', { timeout: 10000 });
  await page.waitForTimeout(2000); // let any layout settle
  
  const portfolio = await page.$('#portfolio');
  const box = await portfolio.boundingBox();

  // Scroll to a point where both title and images are visible (e.g. 40% through)
  // Our new animation range is 0.25 to 0.6. So 0.425 should show both overlapping
  const scrollY_overlap = box.y + (box.height * 0.425); 
  await page.evaluate((y) => window.scrollTo(0, y), scrollY_overlap);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'portfolio-overlap.png' });
  console.log('Screenshot saved to portfolio-overlap.png');

  await browser.close();
})();
