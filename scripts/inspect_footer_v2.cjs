const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://theunknown.tv/en', { waitUntil: 'networkidle' });
    
    const result = await page.evaluate(() => {
      // Find the last section or footer
      const sections = Array.from(document.querySelectorAll('section, footer, div'));
      const footerArea = sections.reverse().find(el => el.innerText && el.innerText.includes('NAVIGATION'));
      
      if (!footerArea) return { error: 'Footer area not found' };

      // Look for the big logo/text element in the footer or its siblings
      let current = footerArea;
      let found = null;
      
      // Look for SVGs or large divs in the footer and its siblings
      const search = (root) => {
        const children = Array.from(root.querySelectorAll('svg, div.uppercase, div[class*="text"]'));
        return children.find(el => el.offsetWidth > window.innerWidth * 0.5);
      };

      found = search(footerArea) || search(footerArea.parentElement);

      if (!found) {
          // fallback: look for the last SVG in the body
          const svgs = Array.from(document.querySelectorAll('svg'));
          found = svgs[svgs.length - 1];
      }

      if (!found) return { error: 'Element not found even in fallback' };

      const style = window.getComputedStyle(found);
      return {
        tagName: found.tagName,
        className: found.className,
        htmlSnippet: found.outerHTML.substring(0, 1000),
        styles: {
            mixBlendMode: style.mixBlendMode,
            fill: style.fill,
            stroke: style.stroke,
            background: style.background,
            mask: style.mask || style.webkitMask
        }
      };
    });

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
