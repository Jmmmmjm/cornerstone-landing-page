const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const videoDir = path.join(process.cwd(), 'playwright-results', 'videos');
  
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { 
      dir: videoDir,
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to https://theunknown.tv/en...');
  // Use a stricter wait condition
  await page.goto('https://theunknown.tv/en', { waitUntil: 'networkidle' });

  console.log('Waiting for initial animations and heavy assets to settle (10s)...');
  await page.waitForTimeout(10000); // Increased wait time to 10 seconds

  // Do a tiny scroll to trigger lazy loading if any
  console.log('Triggering lazy loads...');
  await page.evaluate(() => window.scrollTo(0, 100));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000); // Wait for things to settle back

  console.log('Starting smooth scroll...');
  
  await page.evaluate(async () => {
    const scrollHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    const totalScroll = scrollHeight - viewportHeight;
    const duration = 40000; // 40 seconds for a very smooth, thorough scroll
    const start = performance.now();
    
    return new Promise(resolve => {
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        
        // Linear scroll
        const y = progress * totalScroll;
        window.scrollTo(0, y);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  });

  console.log('Scroll finished, waiting at the bottom...');
  await page.waitForTimeout(4000); // Wait at the bottom for a bit
  
  const video = page.video();
  const videoPath = await video.path();
  console.log(`Video recorded (webm): ${videoPath}`);
  
  await context.close();
  await browser.close();

  const mp4Path = path.join(process.cwd(), 'playwright-results', 'mp4', 'theunknown_recording_v3_smooth.mp4');
  const mp4Dir = path.dirname(mp4Path);
  if (!fs.existsSync(mp4Dir)) {
    fs.mkdirSync(mp4Dir, { recursive: true });
  }

  console.log(`Converting to mp4: ${mp4Path}...`);
  try {
    execSync(`ffmpeg -i "${videoPath}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${mp4Path}" -y`);
    console.log(`Conversion successful: ${mp4Path}`);
  } catch (error) {
    console.error('Conversion failed:', error.message);
  }
})();
