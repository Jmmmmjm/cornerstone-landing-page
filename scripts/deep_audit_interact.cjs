const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(4000);

  const audit = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('section')).find(s => s.innerText.toUpperCase().includes('ARCHITECTURAL TIERS'));
    if (!section) return { error: 'Section not found' };
    
    const flexContainer = section.querySelector('div.flex-1.flex');
    const cards = Array.from(flexContainer.children);
    
    return cards.map((c, i) => {
        const rect = c.getBoundingClientRect();
        // Check if there are any 0-height or 0-width elements inside
        const hiddenElements = Array.from(c.querySelectorAll('*')).filter(el => el.offsetHeight === 0 && el.offsetWidth === 0).length;
        
        return {
            index: i,
            width: rect.width,
            height: rect.height,
            isClickable: window.getComputedStyle(c).cursor === 'pointer',
            hiddenElCount: hiddenElements
        };
    });
  });

  console.log('Interaction Audit:', audit);
  
  if (!audit.error) {
      // Test mobile break points
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      const mobileCheck = await page.evaluate(() => {
        const section = Array.from(document.querySelectorAll('section')).find(s => s.innerText.toUpperCase().includes('ARCHITECTURAL TIERS'));
        const container = section.querySelector('div.flex-1.flex');
        return {
            direction: window.getComputedStyle(container).flexDirection,
            width: container.offsetWidth,
            windowWidth: window.innerWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
        };
      });
      console.log('Mobile Integrity Check:', mobileCheck);
  }

  await browser.close();
})();
