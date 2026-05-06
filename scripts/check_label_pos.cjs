const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  
  const filePath = 'file://' + path.resolve('clones/coinsetters-io/index.html');
  await page.goto(filePath);
  
  const servicesLabel = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('.paragraph18')).find(e => e.innerText.includes('We are setting'));
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { text: el.innerText, left: rect.left, top: rect.top, width: rect.width };
  });

  const numbersLabel = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('.paragraph18')).find(e => e.innerText.includes('Numbers that matter'));
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { text: el.innerText, left: rect.left, top: rect.top, width: rect.width };
  });

  console.log('Services Label:', servicesLabel);
  console.log('Numbers Label:', numbersLabel);
  
  await browser.close();
})();
