const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: './videos/', size: { width: 1920, height: 1080 } },
    viewport: { width: 1920, height: 1080 }
  });
  
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(5000);

  const cardCount = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section')).find(s => s.innerText.toUpperCase().includes('ARCHITECTURAL TIERS'));
    if (!section) return 0;
    const flexContainer = section.querySelector('div.flex-1.flex');
    return flexContainer ? flexContainer.children.length : 0;
  });

  for (let i = 0; i < cardCount; i++) {
    const cardHandle = await page.evaluateHandle((idx) => {
        const section = Array.from(document.querySelectorAll('section')).find(s => s.innerText.toUpperCase().includes('ARCHITECTURAL TIERS'));
        const container = section.querySelector('div.flex-1.flex');
        return container.children[idx];
    }, i);

    if (cardHandle) {
        console.log(`Hovering card ${i}...`);
        await cardHandle.asElement().hover();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `audit_hover_${i}.png` });
    }
  }

  await context.tracing.stop({ path: 'trace_audit_v3.zip' });
  await context.close();
  await browser.close();
})();
