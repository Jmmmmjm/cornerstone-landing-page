const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: './videos/', size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);

  // Find the Architectural Tiers section
  const section = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('section')).find(s => s.innerText.toUpperCase().includes('ARCHITECTURAL TIERS'));
  });

  if (section) {
    const container = await page.$('section:has-text("ARCHITECTURAL TIERS") div.flex-1.flex');
    const cards = await container.$$(':scope > div');
    
    console.log(`Recording interactions for ${cards.length} tiers...`);

    // Perform a smooth hover sequence across all tiers
    for (let i = 0; i < cards.length; i++) {
        await cards[i].hover();
        await page.waitForTimeout(1200); // Wait to see full animation and bounce
    }

    // Return to first tier
    await cards[0].hover();
    await page.waitForTimeout(1000);
  }

  await context.close();
  await browser.close();
  console.log('Interaction recording complete. Checking videos/ folder.');
})();
