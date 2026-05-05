const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ recordVideo: { dir: './videos/' } });
  await page.goto('https://yellowpeach.co.uk/work/', { waitUntil: 'networkidle' });
  
  // scroll down slowly to capture the stacking effect
  await page.evaluate(async () => {
    for (let i = 0; i < 30; i++) {
      window.scrollBy(0, 200);
      await new Promise(r => setTimeout(r, 100));
    }
  });

  const stackInfo = await page.evaluate(() => {
    const stack = document.querySelector('[data-layout="stack"]');
    const wrapper = stack ? stack.querySelector('[data-stack-wrapper]') : null;
    const cards = document.querySelectorAll('article.stack-card');
    
    if (!stack || !cards.length) return 'not found';
    
    return {
      stackStyles: {
        position: window.getComputedStyle(stack).position,
        display: window.getComputedStyle(stack).display
      },
      wrapperStyles: wrapper ? {
        position: window.getComputedStyle(wrapper).position,
      } : null,
      cardStyles: Array.from(cards).slice(0,3).map((c, i) => {
        const computed = window.getComputedStyle(c);
        return {
          index: i,
          position: computed.position,
          top: computed.top,
          transform: computed.transform,
          zIndex: computed.zIndex,
          cssText: c.style.cssText
        }
      })
    };
  });
  
  fs.writeFileSync('stack_info.json', JSON.stringify(stackInfo, null, 2));
  console.log('Saved stack info to stack_info.json');
  await browser.close();
})();
