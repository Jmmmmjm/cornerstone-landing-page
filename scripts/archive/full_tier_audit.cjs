const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(4000);

  // Use a more robust way to find the cards
  const cards = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section')).find(s => s.innerText.toUpperCase().includes('ARCHITECTURAL TIERS'));
    if (!section) return [];
    
    // The cards are in the second direct div child of the section
    const container = section.querySelectorAll('div.flex-1.flex')[0];
    if (!container) return [];
    
    return Array.from(container.children).map((c, i) => ({
      index: i,
      id: c.getAttribute('key') || `card-${i}`
    }));
  });

  console.log(`Found ${cards.length} cards.`);

  for (let i = 0; i < cards.length; i++) {
    // We need to re-find the element in the loop because hover might trigger re-renders
    const cardHandle = await page.evaluateHandle((idx) => {
        const section = Array.from(document.querySelectorAll('section')).find(s => s.innerText.toUpperCase().includes('ARCHITECTURAL TIERS'));
        const container = section.querySelectorAll('div.flex-1.flex')[0];
        return container.children[idx];
    }, i);

    if (cardHandle) {
        await cardHandle.asElement().hover();
        await page.waitForTimeout(1000);
        await cardHandle.asElement().screenshot({ path: `tier_icon_audit_${i}.png` });
        console.log(`Saved screenshot for tier ${i}`);
    }
  }

  await browser.close();
})();
