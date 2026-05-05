import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://yellowpeach.co.uk/work/', { waitUntil: 'networkidle' });
  
  const data = await page.evaluate(() => {
    // Find the container holding the articles
    const firstArticle = document.querySelector('article');
    const container = firstArticle ? firstArticle.parentElement : null;
    
    if (!container) return { error: 'No article found' };
    
    const items = Array.from(document.querySelectorAll('article')).slice(0, 2).map(article => {
      // Get computed styles of the article
      const computed = window.getComputedStyle(article);
      
      // Extract structure
      const innerHTML = article.innerHTML;
      
      return {
        className: article.className,
        width: article.offsetWidth,
        height: article.offsetHeight,
        padding: computed.padding,
        borderRadius: computed.borderRadius,
        html: innerHTML
      }
    });
    
    const containerComputed = window.getComputedStyle(container);
    return {
      container: {
        className: container.className,
        display: containerComputed.display,
        gridTemplateColumns: containerComputed.gridTemplateColumns,
        gap: containerComputed.gap,
        padding: containerComputed.padding
      },
      items
    };
  });
  
  fs.writeFileSync('yp_data.json', JSON.stringify(data, null, 2));
  console.log('Saved to yp_data.json');
  await browser.close();
})();
