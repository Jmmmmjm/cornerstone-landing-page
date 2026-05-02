const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: './videos/', size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);

  // Focus on the Plan section (Section 4)
  const plans = await page.$$('section:nth-of-type(4) > div > div');
  
  if (plans.length > 0) {
    // Sequence of hovers to test fluidity
    await plans[0].hover();
    await page.waitForTimeout(1000);
    
    await plans[2].hover();
    await page.waitForTimeout(1000);
    
    await plans[4].hover();
    await page.waitForTimeout(1000);
    
    await plans[1].hover();
    await page.waitForTimeout(1000);
  }

  await context.close();
  await browser.close();
  console.log('Interaction recorded to ./videos/');
})();
