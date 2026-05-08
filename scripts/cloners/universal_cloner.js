import fs from 'fs';
import path from 'path';

const url = process.argv[2];
const name = process.argv[3];

if (!url || !name) {
  console.log('Usage: node scripts/cloners/universal_cloner.js <url> <name>');
  process.exit(1);
}

async function cloneSite() {
  try {
    const origin = new URL(url).origin;
    console.log(`Cloning ${url} as "${name}"...`);
    const response = await fetch(url);
    let html = await response.text();
    
    // 1. Fix Vite parsing errors (disallowed-content-in-noscript-in-head)
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      let headContent = headMatch[1];
      const noscriptRegex = /<noscript>([\s\S]*?)<\/noscript>/gi;
      const noscripts = [];
      headContent = headContent.replace(noscriptRegex, (match) => {
        noscripts.push(match);
        return '';
      });
      html = html.replace(headMatch[0], `<head>${headContent}</head>`);
      html = html.replace(/<body[^>]*>/i, (match) => match + '\n    ' + noscripts.join('\n    '));
    }

    // 2. Fix CORS for scripts by proxying them through a local fetch if needed,
    // or simply ensuring they are loaded as normal scripts if possible.
    // Modern sites use type="module" which is strict about CORS.
    // We can try to strip type="module" or use a proxy approach.
    // For now, let's try to convert relative scripts to absolute ones first.
    // The <base> tag usually handles this, but CORS is the real enemy.
    
    // 3. Inject Vite root div
    html = html.replace(/<body[^>]*>/i, (match) => match + '\n    <div id="root" style="display:none;"></div>');

    // 4. Inject Vite entry point
    const viteScript = `
    <script type="module">
      const script = document.createElement('script');
      script.type = 'module';
      script.src = window.location.origin + '/src/main.tsx';
      document.body.appendChild(script);
    </script>`;
    
    const lastBodyCloseTag = html.toLowerCase().lastIndexOf('</body>');
    if (lastBodyCloseTag !== -1) {
      html = html.slice(0, lastBodyCloseTag) + viteScript + html.slice(lastBodyCloseTag);
    } else {
      html += viteScript;
    }

    // 5. Add base tag
    const baseTag = `\n    <base href="${url}">`;
    html = html.replace('<head>', '<head>' + baseTag);
    
    const cloneDir = path.join('clones', name);
    if (!fs.existsSync(cloneDir)) {
      fs.mkdirSync(cloneDir, { recursive: true });
    }
    
    const outputPath = path.join(cloneDir, 'index.html');
    fs.writeFileSync(outputPath, html);
    
    console.log(`Successfully saved replica to ${outputPath}`);
  } catch (error) {
    console.error('Error cloning site:', error);
    process.exit(1);
  }
}

cloneSite();
