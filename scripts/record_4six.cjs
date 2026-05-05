const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--disable-frame-rate-limit',
      '--disable-gpu-vsync',
      '--font-render-hinting=none',
      '--force-color-profile=srgb',
      '--disable-font-subpixel-positioning',
      '--num-raster-threads=4',
      '--enable-zero-copy',
    ]
  });
  
  const videoDir = path.join(process.cwd(), 'playwright-results', 'videos');
  
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { 
      dir: videoDir,
      size: { width: 1920, height: 1080 },
      fps: 60
    }
  });
  
  const page = await context.newPage();
  
  const url = 'https://4six-creative.vercel.app/';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle' });

  console.log('Waiting for initial animations to settle (10s)...');
  await page.waitForTimeout(10000);

  console.log('Starting extremely slow smooth scroll (90s) for maximum data points...');
  
  await page.evaluate(async () => {
    const scrollHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    const totalScroll = scrollHeight - viewportHeight;
    const duration = 90000;
    const start = performance.now();
    
    return new Promise(resolve => {
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
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
  await page.waitForTimeout(5000);
  
  const video = page.video();
  const videoPath = await video.path();
  console.log(`Video recorded (webm): ${videoPath}`);
  
  await context.close();
  await browser.close();

  const mp4Path = path.join(process.cwd(), 'playwright-results', 'mp4', '4six_recording_smooth_60fps_interpolated.mp4');
  const mp4Dir = path.dirname(mp4Path);
  if (!fs.existsSync(mp4Dir)) {
    fs.mkdirSync(mp4Dir, { recursive: true });
  }

  console.log(`Converting to high-quality interpolated mp4 at 60fps: ${mp4Path}...`);
  try {
    // minterpolate filter to generate 60fps from 25fps source using motion estimation
    // This is computationally expensive but provides the smoothest result when source FPS is low.
    // mi_mode=mci: motion compensated interpolation
    // mc_mode=aobmc: overlapped block motion compensation
    console.log('Running interpolation (this may take a few minutes)...');
    execSync(`ffmpeg -i "${videoPath}" -filter:v "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p "${mp4Path}" -y`);
    console.log(`Conversion successful: ${mp4Path}`);
  } catch (error) {
    console.error('Interpolation failed, falling back to simple 60fps conversion:', error.message);
    execSync(`ffmpeg -i "${videoPath}" -r 60 -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p "${mp4Path}" -y`);
  }
})();
