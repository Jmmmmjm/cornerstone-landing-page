const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://theunknown.tv/en');
  await page.waitForTimeout(4000);

  // Focus on the "What we do" section
  const container = await page.$('div.flex:has(> div:nth-child(3))');
  if (container) {
    const cards = await container.$$(':scope > div');
    
    // 1. Hover over the first card to expand it
    await cards[0].hover();
    await page.waitForTimeout(1000);
    
    // 2. Move mouse to the second card (triggering the first to minimize)
    // We capture several frames during this transition
    await cards[1].hover();
    
    // Capture mid-minimizing state
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'theunknown_minimizing_1.png' });
    
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'theunknown_minimizing_2.png' });
    
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'theunknown_minimizing_final.png' });
  }

  await browser.close();
})();
