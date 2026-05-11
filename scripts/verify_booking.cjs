const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Starting booking flow verification...');
  const browser = await chromium.launch({ headless: true });
  
  // Create context with video recording
  const context = await browser.newContext({
    recordVideo: {
      dir: 'playwright-results/videos/',
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Scroll to Section 6 where the booking button is
    console.log('Scrolling to Section 6...');
    const bookingButton = page.locator('#cta-book-discovery-call');
    await page.evaluate(() => {
      const el = document.querySelector('#cta-book-discovery-call');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(2000); // Wait for scroll animation to settle
    
    // Take a screenshot before clicking
    await page.screenshot({ path: 'playwright-results/screenshots/before_booking_click.png' });
    
    console.log('Clicking "Book your Discovery Call" button...');
    await bookingButton.click({ force: true });
    
    // Wait for the modal to appear
    console.log('Waiting for modal to appear...');
    const modalOverlay = page.locator('.fixed.inset-0.z-\\[10000\\]');
    await modalOverlay.waitFor({ state: 'visible', timeout: 5000 });
    
    // Check if the iframe is present
    const iframe = page.locator('iframe[title="Book a Discovery Call with Cornerstone"]');
    await iframe.waitFor({ state: 'visible', timeout: 5000 });
    
    // Take a screenshot of the open modal
    await page.screenshot({ path: 'playwright-results/screenshots/booking_modal_open.png' });
    
    console.log('Verifying iframe source...');
    const src = await iframe.getAttribute('src');
    if (src && src.includes('calendar.google.com')) {
      console.log('Success: Iframe source is correct.');
    } else {
      console.error('Failure: Iframe source is incorrect or missing:', src);
    }
    
    // Test closing the modal via the 'X' button
    console.log('Testing close button...');
    const closeButton = page.locator('button:has(svg.lucide-x)'); // Use the Lucide X icon as a locator
    await closeButton.click({ force: true });
    
    // Wait for modal to be removed from DOM
    await modalOverlay.waitFor({ state: 'hidden', timeout: 5000 });
    console.log('Success: Modal closed correctly.');
    
    // Take a final screenshot
    await page.screenshot({ path: 'playwright-results/screenshots/after_booking_close.png' });
    
  } catch (error) {
    console.error('Verification failed:', error);
    await page.screenshot({ path: 'playwright-results/screenshots/booking_error.png' });
  } finally {
    const videoPath = await page.video().path();
    console.log('Verification finished. Video recorded at:', videoPath);
    await browser.close();
  }
})();
