const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // Scroll to the Architectural Tiers section
  const section = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('section')).find(s => s.innerText.includes('Architectural Tiers'));
  });

  if (section) {
    // Hover over the Cornerstone card (usually the 4th card, index 3)
    const cards = await page.$$('section:has-text("Architectural Tiers") > div > div');
    if (cards.length >= 4) {
        await cards[3].hover();
        await page.waitForTimeout(1000); // Wait for expansion
        
        // Take a screenshot of just the cornerstone card content
        await cards[3].screenshot({ path: 'cornerstone_audit.png' });
        console.log('Cornerstone audit screenshot saved.');
    }
  }

  await browser.close();
})();
