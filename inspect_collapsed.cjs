const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://theunknown.tv/en');
  await page.waitForTimeout(5000);

  const cardDetails = await page.evaluate(() => {
    // Find the horizontal accordion by looking for the flex container with many cards
    const containers = Array.from(document.querySelectorAll('div.flex')).filter(f => f.children.length >= 4 && f.offsetHeight > 400);
    if (containers.length === 0) return 'No container found';
    
    const container = containers[0];
    const cards = Array.from(container.children);
    
    return cards.map(c => {
        // Find visible text elements
        const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT, null, false);
        const texts = [];
        let node;
        while(node = walker.nextNode()) {
            if (node.parentElement && window.getComputedStyle(node.parentElement).opacity !== '0') {
                const t = node.textContent.trim();
                if (t) texts.push(t);
            }
        }
        
        return {
            width: c.offsetWidth,
            height: c.offsetHeight,
            texts: texts,
            className: c.className
        };
    });
  });

  console.log('Card Audit:', JSON.stringify(cardDetails, null, 2));
  await browser.close();
})();
