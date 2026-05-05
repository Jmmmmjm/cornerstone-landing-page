const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  const result = await page.evaluate(() => {
    const sections = document.querySelectorAll('section');
    for (const section of sections) {
      if (section.querySelector('.dock')) continue;
      const allEls = section.querySelectorAll('.absolute.pointer-events-none');
      for (const el of allEls) {
        const classList = el.className.split(' ').filter(c => c.trim());
        const hasAbsolute = classList.includes('absolute');
        const hasPointerEventsNone = classList.includes('pointer-events-none');
        if (hasAbsolute && hasPointerEventsNone) {
          const rect = el.getBoundingClientRect();
          return {
            styleLeft: el.style.left,
            styleTop: el.style.top,
            rectLeft: rect.left,
            rectTop: rect.top,
            rectWidth: rect.width,
            rectHeight: rect.height,
            className: el.className,
            parentSection: section.className
          };
        }
      }
    }
    return null;
  });
  
  const viewport = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight
  }));
  
  await page.screenshot({ path: 'screenshot.png' });
  
  console.log('Element:', JSON.stringify(result, null, 2));
  console.log('Viewport:', JSON.stringify(viewport, null, 2));
  
  await browser.close();
})();
