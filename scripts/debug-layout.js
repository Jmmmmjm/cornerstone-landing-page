import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('http://localhost:3000');
await page.waitForTimeout(3000);

// 1. Query element with style containing "position: fixed" and "width: 700px"
const fixed700 = await page.evaluate(() => {
  const allElements = document.querySelectorAll('*');
  for (const el of allElements) {
    const style = window.getComputedStyle(el);
    if (style.position === 'fixed' && style.width === '700px') {
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        class: el.className,
        id: el.id,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
        },
        computedStyle: {
          position: style.position,
          left: style.left,
          top: style.top,
          width: style.width,
          height: style.height,
        },
      };
    }
  }
  return null;
});

console.log('=== Element with position: fixed and width: 700px ===');
if (fixed700) {
  console.log('Tag:', fixed700.tag);
  console.log('Class:', fixed700.class);
  console.log('ID:', fixed700.id);
  console.log('getBoundingClientRect():', JSON.stringify(fixed700.rect, null, 2));
  console.log('Computed style:', JSON.stringify(fixed700.computedStyle, null, 2));
} else {
  console.log('NOT FOUND');
}

// 2. Query all elements with class containing "absolute" that are direct children of section and have width 700px or marginLeft -350px
const absoluteChildren = await page.evaluate(() => {
  const sections = document.querySelectorAll('section');
  const results = [];

  for (const section of sections) {
    const children = Array.from(section.children);
    for (const child of children) {
      const cls = child.className || '';
      if (!cls.includes('absolute')) continue;

      const style = window.getComputedStyle(child);
      const rect = child.getBoundingClientRect();
      const matchesWidth = style.width === '700px';
      const matchesMarginLeft = style.marginLeft === '-350px';

      if (matchesWidth || matchesMarginLeft) {
        results.push({
          tag: child.tagName,
          class: cls,
          id: child.id,
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
          },
          computedStyle: {
            position: style.position,
            left: style.left,
            top: style.top,
            width: style.width,
            marginLeft: style.marginLeft,
            height: style.height,
          },
          matchesWidth,
          matchesMarginLeft,
        });
      }
    }
  }

  return results;
});

console.log('\n=== Elements with class containing "absolute" that are direct children of <section> with width 700px or marginLeft -350px ===');
if (absoluteChildren.length > 0) {
  for (const el of absoluteChildren) {
    console.log('\n---');
    console.log('Tag:', el.tag);
    console.log('Class:', el.class);
    console.log('ID:', el.id);
    console.log('Matches width 700px:', el.matchesWidth);
    console.log('Matches marginLeft -350px:', el.matchesMarginLeft);
    console.log('getBoundingClientRect():', JSON.stringify(el.rect, null, 2));
    console.log('Computed style:', JSON.stringify(el.computedStyle, null, 2));
  }
} else {
  console.log('NOT FOUND');
}

// Bonus: also show all absolute children of sections regardless of size
const allAbsoluteChildren = await page.evaluate(() => {
  const sections = document.querySelectorAll('section');
  const results = [];

  for (const section of sections) {
    const children = Array.from(section.children);
    for (const child of children) {
      const cls = child.className || '';
      if (!cls.includes('absolute')) continue;

      const style = window.getComputedStyle(child);
      const rect = child.getBoundingClientRect();
      results.push({
        tag: child.tagName,
        class: cls,
        id: child.id,
        width: style.width,
        marginLeft: style.marginLeft,
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      });
    }
  }

  return results;
});

console.log('\n=== All direct children of <section> with class containing "absolute" ===');
if (allAbsoluteChildren.length > 0) {
  for (const el of allAbsoluteChildren) {
    console.log(`- ${el.tag} class="${el.class}" id="${el.id}" width=${el.width} marginLeft=${el.marginLeft} rect=(${el.rect.left}, ${el.rect.top})`);
  }
} else {
  console.log('NOT FOUND');
}

await browser.close();
