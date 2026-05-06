const { chromium } = require('playwright');
const path = require('path');

async function recordComparison() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  // Record Original
  console.log('Recording original...');
  const page1 = await context.newPage();
  await page1.goto('https://www.creativewebmanual.com/', { waitUntil: 'networkidle' });
  await page1.video(); // Playwright records automatically if configured in context
  
  // Custom recording logic using playwright-cli's video-start if preferred, 
  // but here we'll just take high-quality screenshots or use the built-in video feature.
  // Since I don't have direct access to the video files easily via this tool without specific paths,
  // I will use playwright-cli to handle the actual recording command.
  await browser.close();
}
