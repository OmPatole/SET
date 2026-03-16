import fs from 'fs';
import path from 'path';

function walkPath(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      files = files.concat(walkPath(filePath));
    } else if (filePath.endsWith('.jsx')) {
      files.push(filePath);
    }
  }
  return files;
}

const targetDir = path.resolve('src');
console.log('Targeting:', targetDir);
const files = walkPath(targetDir);
let changedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('max-w-7xl')) {
    content = content.replace(/max-w-7xl/g, 'max-w-[1600px]');
    fs.writeFileSync(file, content);
    console.log(`Replaced in ${file}`);
    changedCount++;
  }
}
console.log('Done, changed ' + changedCount + ' files.');
