const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(4000);

  const stats = await page.evaluate(async () => {
    // Find the horizontal accordion container
    const flexContainers = Array.from(document.querySelectorAll('div.flex')).filter(f => f.children.length >= 4 && f.offsetHeight > 400);
    if (flexContainers.length === 0) return { error: 'No container found' };
    
    const card = flexContainers[0].children[2]; // Target Keystone
    const samples = [];
    
    // Simulate real hover by moving mouse to the center of the element
    const rect = card.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // We'll use a custom property to trigger the hover state in the component if needed, 
    // but here we just dispatch events.
    card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    for (let i = 0; i < 60; i++) {
        const currentRect = card.getBoundingClientRect();
        const text = card.querySelector('h3');
        const textStyle = text ? window.getComputedStyle(text) : {};
        
        samples.push({
            frame: i,
            width: currentRect.width,
            textOpacity: parseFloat(textStyle.opacity || 0),
            fontSize: textStyle.fontSize || '0px'
        });
        await new Promise(r => requestAnimationFrame(r));
    }
    return samples;
  });

  if (stats.error) {
      console.log('Error:', stats.error);
  } else {
      console.log('--- ANIMATION TELEMETRY ---');
      stats.slice(0, 20).forEach(s => {
        console.log(`Frame ${s.frame}: Width=${s.width.toFixed(1)}px | Opacity=${s.textOpacity.toFixed(2)} | Font=${s.fontSize}`);
      });

      // Analyze smoothness
      let stutterCount = 0;
      for(let i=1; i<stats.length; i++) {
          const delta = stats[i].width - stats[i-1].width;
          // In an expansion, delta should be positive or zero (at rest)
          if(delta < -0.5 && i < 40) stutterCount++; 
      }
      console.log(`Smoothness Audit: ${stutterCount} stutter events detected.`);
  }

  await browser.close();
})();
