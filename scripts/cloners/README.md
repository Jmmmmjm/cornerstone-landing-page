# Site Cloner Instructions

This directory contains scripts for creating high-fidelity replicas of websites for research and development.

## Usage: universal_cloner.js
This script pulls a website's HTML, injects a Vite entry point, and sets up a `<base>` tag for asset loading.

```bash
node scripts/cloners/universal_cloner.js <url> <folder-name>
```

### Script Features:
- **HTML Cleanup:** Fixes Vite parsing errors by moving `<noscript>` tags to the body.
- **Vite Integration:** Injects `<div id="root">` (hidden) and `src/main.tsx` entry point.
- **Asset Resolution:** Adds `<base href="...">` to ensure images/CSS load from the source site.

## Verification Workflow
Always verify clones via HTTP to avoid `file://` protocol restrictions and CORS issues.

1. **Serve the clone:**
   ```bash
   npx -y serve clones/<folder-name> -p 5000
   ```

2. **Verify with Playwright:**
   Capture screenshots of both the original and the clone for comparison:
   - Original: `playwright-cli open <url>` -> `playwright-cli screenshot`
   - Clone: `playwright-cli open http://localhost:5000` -> `playwright-cli screenshot`

## Troubleshooting
- **CORS:** Some external scripts may still block local execution.
- **Webflow Runtime:** Errors like `Webflow.env is not a function` are common and usually don't affect layout.
