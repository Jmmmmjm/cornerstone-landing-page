const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: './videos/', size: { width: 1920, height: 1080 } }
  });
  const page = await context.newPage();
  
  console.log('Navigating to Mason Wong...');
  await page.goto('https://www.mason-wong.com/home', { waitUntil: 'networkidle' });

  // 1. Identify the project section
  const sectionData = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const projectSection = sections.find(s => s.innerText.toLowerCase().includes('featured projects')) || sections[2];
    
    if (!projectSection) return { error: 'Section not found' };

    const cards = Array.from(projectSection.querySelectorAll('a[href*="/work/"]')).map(a => {
        const rect = a.getBoundingClientRect();
        const computed = window.getComputedStyle(a);
        const img = a.querySelector('img');
        const imgComputed = img ? window.getComputedStyle(img) : {};
        
        return {
            tagName: a.tagName,
            className: a.className,
            rect: { top: rect.top, height: rect.height },
            styles: {
                display: computed.display,
                flexDirection: computed.flexDirection,
                gap: computed.gap,
                padding: computed.padding,
                borderBottom: computed.borderBottom
            },
            innerHtml: a.innerHTML.substring(0, 1000)
        };
    });

    return {
        sectionClass: projectSection.className,
        cards
    };
  });

  // 2. Slow Scroll Recording
  console.log('Starting slow scroll recording...');
  await page.evaluate(async () => {
    const distance = document.body.scrollHeight;
    const step = 2;
    for (let i = 0; i < distance; i += step) {
      window.scrollTo(0, i);
      await new Promise(r => setTimeout(r, 10)); // Slow scroll for video clarity
    }
  });

  // 3. Hover Interaction Capture
  console.log('Capturing hover states...');
  await page.evaluate(async () => {
    const firstProject = document.querySelector('a[href*="/work/"]');
    if (firstProject) {
        firstProject.scrollIntoView({ block: 'center' });
        await new Promise(r => setTimeout(r, 500));
    }
  });
  
  await page.hover('a[href*="/work/"]');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'mason_hover_state.png' });

  fs.writeFileSync('mason_deep_analysis.json', JSON.stringify(sectionData, null, 2));
  console.log('Deep analysis complete.');
  
  await browser.close();
})();
