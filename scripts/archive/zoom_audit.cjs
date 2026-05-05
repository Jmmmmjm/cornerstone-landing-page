const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(4000);

  // Find the Architectural Tiers section
  const section = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('section')).find(s => s.innerText.toUpperCase().includes('ARCHITECTURAL TIERS'));
  });

  if (section) {
    // Hover over the Keystone card (usually the 3rd card, index 2)
    const container = await page.$('section:has-text("Architectural Tiers") div.flex-1.flex');
    const cards = await container.$$(':scope > div');
    
    if (cards.length >= 3) {
        await cards[2].hover();
        await page.waitForTimeout(1000);
        
        // Target the icon specifically
        const icon = await cards[2].$('svg');
        if (icon) {
            await icon.screenshot({ path: 'keystone_zoom_audit.png' });
            console.log('Keystone zoom audit saved.');
        }
    }
  }

  await browser.close();
})();
