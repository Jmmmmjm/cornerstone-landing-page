const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const videoDir = path.join(process.cwd(), 'playwright-results', 'videos');
  
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { 
      dir: videoDir,
      size: { width: 1280, height: 720 }
    }
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to http://localhost:3001...');
  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    console.error('Failed to load page:', e.message);
    await browser.close();
    process.exit(1);
  }

  console.log('Recording started...');
  await page.waitForTimeout(4000); 
  
  await page.evaluate(async () => {
    const scrollHeight = document.body.scrollHeight;
    const duration = 20000; 
    const start = performance.now();
    
    return new Promise(resolve => {
      function step(now) {
        const progress = (now - start) / duration;
        const y = Math.min(progress * scrollHeight, scrollHeight);
        window.scrollTo({ top: y, behavior: 'auto' });
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  });

  await page.waitForTimeout(2000);
  
  await context.close();
  await browser.close();

  const videoPath = await page.video().path();
  const destPath = path.join(videoDir, 'baseline.webm');
  if (fs.existsSync(videoPath)) {
    fs.copyFileSync(videoPath, destPath);
    fs.unlinkSync(videoPath);
    console.log(`Video recorded to: ${destPath}`);
  } else {
    console.error('Video file not found');
  }
})();
