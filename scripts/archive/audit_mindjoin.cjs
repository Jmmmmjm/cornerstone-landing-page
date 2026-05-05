const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://mindjoin.netlify.app/');
  await page.waitForTimeout(5000);

  // Take full page screenshots to see what we're looking at
  await page.screenshot({ path: 'mindjoin_full_site.png', fullPage: true });

  const results = await page.evaluate(() => {
    // Find all sections that might contain the converging lines
    const sections = Array.from(document.querySelectorAll('section, div')).filter(el => el.offsetHeight > 400);
    
    return sections.map(s => {
        const hasSvg = s.querySelector('svg') !== null;
        const text = s.innerText.substring(0, 100);
        return {
            className: s.className,
            hasSvg,
            textSnippet: text
        };
    });
  });

  console.log('Site Sections:', results);

  // Look for the specific SVG with those paths provided in the user prompt
  const pathsFound = await page.evaluate(() => {
    const paths = Array.from(document.querySelectorAll('path'));
    return paths.map(p => p.getAttribute('d')).filter(d => d && d.includes('M1619.74'));
  });
  console.log('Specific Paths Found:', pathsFound.length);

  await browser.close();
})();
