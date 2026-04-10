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
  { regex: /text-slate-900/g, replacement: 'text-[#0A192F]' },
  { regex: /bg-slate-900/g, replacement: 'bg-[#0A192F]' },
  { regex: /text-slate-600/g, replacement: 'text-[#0A192F]/70' }, // Use navy with opacity for muted text
  { regex: /border-slate-900/g, replacement: 'border-[#0A192F]' },
  { regex: /hover:bg-slate-700/g, replacement: 'hover:bg-[#0A192F]/80' }
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
    console.log(`Refined navy colors in ${file}`);
  }
});
console.log(`Total: ${changedFiles}`);
