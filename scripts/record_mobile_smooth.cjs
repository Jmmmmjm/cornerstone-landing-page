const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

(async () => {
  const browser = await chromium.launch({
    args: ['--disable-setuid-sandbox', '--no-sandbox']
  });
  const iPhone12 = devices['iPhone 12'];
  const videoDir = path.join(process.cwd(), 'playwright-results', 'videos');
  const auditDir = path.join(process.cwd(), 'playwright-results', 'mobile-audit');
  
  if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
  if (!fs.existsSync(auditDir)) fs.mkdirSync(auditDir, { recursive: true });

  const context = await browser.newContext({
    ...iPhone12,
    deviceScaleFactor: 2, // 2 is enough for good quality without bloating size
    recordVideo: { 
      dir: videoDir,
      size: { width: 390, height: 844 }
    }
  });
  
  const page = await context.newPage();
  
  // Inject some CSS to ensure things look good and no scrollbars interfere
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      ::-webkit-scrollbar { display: none !important; }
      * { scroll-behavior: auto !important; }
    `;
    document.head.appendChild(style);
  });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for intro to finish (based on App.tsx, it might take a few seconds)
  console.log('Waiting for intro...');
  await page.waitForTimeout(5000); 

  console.log('Recording scroll...');
  
  // Custom smooth scroll logic that also takes audit screenshots
  const scrollSteps = 15;
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 844;
  
  for (let i = 0; i <= scrollSteps; i++) {
    const y = (i / scrollSteps) * (totalHeight - viewportHeight);
    await page.evaluate((yPos) => {
      window.scrollTo(0, yPos);
    }, y);
    
    // Take an audit screenshot at each major step to analyze layout
    if (i % 3 === 0) {
      await page.screenshot({ path: path.join(auditDir, `step_${i}.png`) });
    }
    
    await page.waitForTimeout(1000); // 1s pause at each step for clarity in recording
  }

  await page.waitForTimeout(2000);
  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  // Convert to MP4 using ffmpeg
  const mp4Path = path.join(videoDir, 'mobile_smooth_recording.mp4');
  console.log(`Converting ${videoPath} to ${mp4Path}...`);
  try {
    execSync(`ffmpeg -y -i "${videoPath}" -c:v libx264 -crf 23 -pix_fmt yuv420p "${mp4Path}"`);
    console.log('Conversion successful.');
    fs.unlinkSync(videoPath); // Remove the webm
  } catch (err) {
    console.error('FFmpeg conversion failed:', err.message);
  }

  console.log(`Done! Audit screenshots are in ${auditDir}`);
})();
