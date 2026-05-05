const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: './videos/', size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  
  await page.goto('https://mindjoin.netlify.app/');
  await page.waitForTimeout(2000);

  // Scroll through the line animation section
  console.log('Scrolling reference site...');
  
  // Custom scroll sequence to trigger the line drawing
  for (let i = 0; i < 15; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(400);
  }

  await context.close();
  await browser.close();
  console.log('Reference recording complete.');
})();
