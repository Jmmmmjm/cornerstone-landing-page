const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ recordVideo: { dir: './videos/' } });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://www.mason-wong.com/home', { waitUntil: 'networkidle' });
  
  // Find "Featured Projects" or similar section
  const data = await page.evaluate(async () => {
    // Scroll down to find the projects section
    const items = Array.from(document.querySelectorAll('a')).filter(a => a.href.includes('/work/'));
    
    // Smooth scroll through them
    for (let i = 0; i < 5; i++) {
        window.scrollBy(0, 400);
        await new Promise(r => setTimeout(r, 200));
    }

    const projectSection = document.querySelector('section') || document.body; // Fallback
    
    return {
        url: window.location.href,
        html: projectSection ? projectSection.innerHTML.substring(0, 5000) : 'not found'
    };
  });

  fs.writeFileSync('mason_wong_data.json', JSON.stringify(data, null, 2));
  console.log('Mason Wong analysis complete');
  await browser.close();
})();
