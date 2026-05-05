const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://theunknown.tv/en', { waitUntil: 'networkidle' });
    
    const footerAnalysis = await page.evaluate(() => {
      // Find the element containing "THE UNKNOWN" at the bottom
      const all = Array.from(document.querySelectorAll('*'));
      const target = all.find(el => 
        (el.tagName === 'DIV' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'SVG') && 
        el.textContent.includes('THE UNKNOWN') && 
        el.offsetWidth > window.innerWidth * 0.5
      );

      if (!target) return { error: 'Target not found' };

      const styles = window.getComputedStyle(target);
      const parentStyles = window.getComputedStyle(target.parentElement);
      
      return {
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        htmlSnippet: target.outerHTML.substring(0, 500),
        styles: {
          mixBlendMode: styles.mixBlendMode,
          background: styles.background,
          backgroundClip: styles.backgroundClip,
          webkitBackgroundClip: styles.webkitBackgroundClip,
          color: styles.color,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          webkitTextFillColor: styles.webkitTextFillColor,
          backgroundImage: styles.backgroundImage,
          maskImage: styles.maskImage,
          webkitMaskImage: styles.webkitMaskImage
        },
        parentStyles: {
          mixBlendMode: parentStyles.mixBlendMode,
          background: parentStyles.background
        }
      };
    });

    console.log(JSON.stringify(footerAnalysis, null, 2));
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
