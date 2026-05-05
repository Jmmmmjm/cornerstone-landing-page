const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const replacements = [
  { regex: /(?<!dark:)bg-\[\#0A192F\]/g, replacement: 'bg-white dark:bg-[#0A192F]' },
  { regex: /(?<!dark:)bg-\[\#112240\]/g, replacement: 'bg-slate-50 dark:bg-[#112240]' },
  { regex: /(?<!dark:)text-\[\#F8F9FA\]/g, replacement: 'text-slate-900 dark:text-[#F8F9FA]' },
  { regex: /(?<!dark:)text-\[\#8892B0\]/g, replacement: 'text-slate-600 dark:text-[#8892B0]' },
  { regex: /(?<!dark:)text-\[\#64FFDA\]/g, replacement: 'text-teal-600 dark:text-[#64FFDA]' },
  { regex: /(?<!dark:)border-\[\#8892B0\]/g, replacement: 'border-slate-300 dark:border-[#8892B0]' },
  { regex: /(?<!dark:)border-\[\#64FFDA\]/g, replacement: 'border-teal-500 dark:border-[#64FFDA]' },
  { regex: /(?<!dark:)bg-\[\#64FFDA\]/g, replacement: 'bg-teal-500 dark:bg-[#64FFDA]' },
  { regex: /(?<!dark:)fill-\[\#F8F9FA\]/g, replacement: 'fill-slate-900 dark:fill-[#F8F9FA]' },
  { regex: /(?<!dark:)fill-\[\#64FFDA\]/g, replacement: 'fill-teal-500 dark:fill-[#64FFDA]' },
  { regex: /(?<!dark:)stroke-\[\#64FFDA\]/g, replacement: 'stroke-teal-500 dark:stroke-[#64FFDA]' },
  { regex: /(?<!dark:)stroke-\[\#8892B0\]/g, replacement: 'stroke-slate-300 dark:stroke-[#8892B0]' },
  { regex: /(?<!dark:)stroke-\[\#F8F9FA\]/g, replacement: 'stroke-slate-900 dark:stroke-[#F8F9FA]' }
];

const files = walk('src');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Total files updated: ${changedFiles}`);
