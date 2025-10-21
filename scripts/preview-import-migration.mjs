import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');
const SRC = path.join(ROOT, 'src');
const LIMIT = parseInt(process.env.LIMIT || '20', 10);

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, fileList);
    else if (/\.(ts|tsx|js|jsx)$/.test(f.name)) fileList.push(p);
  }
  return fileList;
}

function computeRelative(fromFile, aliasTarget) {
  const fromDir = path.dirname(fromFile);
  const rel = path.relative(fromDir, aliasTarget);
  return rel.startsWith('.') ? rel : './' + rel;
}

function runPreview(limit = LIMIT) {
  const files = walk(SRC);
  let count = 0;
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const regex = /from\s+['"]@\/(.*?)['"];?/g;
    let m;
    const proposals = [];
    while ((m = regex.exec(src))) {
      const importPath = m[1];
      const target = path.join(SRC, importPath);
      // try to find file path with extension
      const candidates = [
        `${target}.ts`,
        `${target}.tsx`,
        `${target}.js`,
        `${target}.jsx`,
        path.join(target, 'index.ts'),
        path.join(target, 'index.tsx'),
        path.join(target, 'index.js'),
        path.join(target, 'index.jsx'),
      ];
      const found = candidates.find((c) => fs.existsSync(c));
      if (!found) continue; // skip unresolved
      const rel = computeRelative(file, found).replace(/\\/g, '/');
      proposals.push({ from: `@/${importPath}`, to: rel.replace(/\.(ts|tsx|js|jsx)$/, '') });
    }
    if (proposals.length) {
      console.log(`FILE: ${path.relative(ROOT, file)}`);
      for (const p of proposals) {
        console.log(`  ${p.from}  ->  ${p.to}`);
      }
      console.log('');
      count++;
      if (count >= limit) {
        console.log(`Preview limit of ${limit} files reached.`);
        break;
      }
    }
  }
  if (count === 0) console.log('No @/ imports found in sample.');
}

runPreview();
