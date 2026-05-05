const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const iPhone12 = devices['iPhone 12'];
  const videoDir = path.join(process.cwd(), 'playwright-results', 'videos');
  
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const context = await browser.newContext({
    ...iPhone12,
    recordVideo: { 
      dir: videoDir
      // Removing explicit size to prevent letterboxing/padding
    }
  });
  
  const page = await context.newPage();
  
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root, html, body { 
        background-color: #0A192F !important; 
        margin: 0 !important; 
        padding: 0 !important;
      }
      .fixed.inset-0 {
        height: 100vh !important;
        width: 100vw !important;
      }
      /* Hide scrollbar which might cause offset */
      ::-webkit-scrollbar { display: none !important; }
    `;
    document.head.appendChild(style);
  });

  console.log('Navigating to http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    console.error('Failed to load page:', e.message);
    await browser.close();
    process.exit(1);
  }

  console.log('Recording started...');
  await page.waitForTimeout(4000); 
  
  await page.evaluate(async () => {
    const scrollHeight = document.body.scrollHeight;
    const duration = 18000; 
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
  
  const videoPath = await page.video().path();
  console.log(`Video recorded to: ${videoPath}`);
  
  await context.close();
  await browser.close();
  
  fs.writeFileSync('last_video_path_v3.txt', videoPath);
})();
