# Playwright Results Organization

To maintain a clean workspace, all automated testing artifacts (screenshots, videos, and traces) should follow this structure and set of conventions.

## 📂 Directory Structure

- `screenshots/`: Active or recent screenshots from audit and verification scripts.
- `mp4/`: Recent screen recordings and animation exports.
- `cli-data/`: JSON/YML snapshots of page data or component states.
- `traces/`: Playwright execution traces for debugging.
- `archive/`: 
  - `screenshots/`: Historical screenshots and old verifications.
  - `mp4/`: Past recordings no longer needed for active development.

## 🏷️ Naming Conventions

Always use descriptive names with optional timestamps. Avoid generic names like `screenshot.png`.

**Pattern:** `[context]-[description]-[version/timestamp].[ext]`

- **Audit:** `audit-hero-alignment-v1.png`
- **Fix Verification:** `fix-footer-spacing-2024-05-06.png`
- **Performance:** `perf-animation-smooth-60fps.mp4`

## 🧹 Cleanup Workflow

1. **Before starting a new major task:** Move current files in the root of `screenshots/` and `mp4/` to their respective `archive/` folders.
2. **Script Updates:** Ensure any new Playwright scripts point to these specific directories rather than the project root.
   - Example in Playwright: `await page.screenshot({ path: 'playwright-results/screenshots/my-file.png' });`

## 🚀 Automation
If a folder gets too cluttered, use the following command to archive everything:
```powershell
Move-Item playwright-results/screenshots/*.png playwright-results/archive/screenshots/
Move-Item playwright-results/mp4/*.mp4 playwright-results/archive/mp4/
```
