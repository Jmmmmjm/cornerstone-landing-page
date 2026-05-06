// Step 1: Fetch the HTML content
fetch('https://www.coinsetters.io')
  .then(response => response.text())
  .then(htmlContent => {
    const fs = require('fs');
    
    // Step 2: Inject the React mount point and Vite script tags before the closing </body> tag
    // This allows the AI Studio preview to continue working properly
    const viteScript = `
      <div id="root" style="display:none;"></div>
      <script type="module" src="/src/main.tsx"></script>
      </body>
    `;
    
    const newIndexHtml = htmlContent.replace('</body>', viteScript);
    
    // Step 3: Write it to the index.html file
    fs.writeFileSync('index.html', newIndexHtml);
    console.log('Successfully saved to index.html');
  });