const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const replacements = [
  { regex: /(?<!dark:)hover:bg-\[\#F8F9FA\]/g, replacement: 'hover:bg-slate-900 dark:hover:bg-[#F8F9FA]' },
  { regex: /(?<!dark:)hover:text-\[\#0A192F\]/g, replacement: 'hover:text-white dark:hover:text-[#0A192F]' },
  { regex: /(?<!dark:)text-\[\#0A192F\]/g, replacement: 'text-white dark:text-[#0A192F]' },
  { regex: /(?<!dark:)bg-\[\#F8F9FA\]/g, replacement: 'bg-slate-900 dark:bg-[#F8F9FA]' },
  { regex: /(?<!dark:)fill="\#0A192F"/g, replacement: 'fill="white" className="dark:fill-[#0A192F]"' },
  { regex: /(?<!dark:)from-\[\#0A192F\]\/90/g, replacement: 'from-white/90 dark:from-[#0A192F]/90' },
  { regex: /(?<!dark:)via-\[\#0A192F\]\/20/g, replacement: 'via-white/20 dark:via-[#0A192F]/20' }
];

let changedFiles = 0;

walk('src').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log(`Fixed stragglers in ${file}`);
  }
});
console.log(`Total: ${changedFiles}`);
