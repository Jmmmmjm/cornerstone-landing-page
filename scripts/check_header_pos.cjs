const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const filePath = 'file://' + path.resolve('clones/coinsetters-io/index.html');
  await page.goto(filePath);
  
  const servicesHeader = await page.evaluate(() => {
    const el = document.querySelector('.services .h3.center.long');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { 
        text: el.innerText,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        fontSize: window.getComputedStyle(el).fontSize,
        textAlign: window.getComputedStyle(el).textAlign
    };
  });

  const numbersHeader = await page.evaluate(() => {
    const el = document.querySelector('.numbers .h3.center.long');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { 
        text: el.innerText,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        fontSize: window.getComputedStyle(el).fontSize,
        textAlign: window.getComputedStyle(el).textAlign
    };
  });

  console.log('Services Header:', servicesHeader);
  console.log('Numbers Header:', numbersHeader);
  
  await browser.close();
})();
