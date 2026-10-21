#!/usr/bin/env node
// Step 1 of docs/translation-plan.md: extract translatable strings from every
// en.md into .translation/extract/<rel>.json, plus 4 term-scan batch lists.
//
// Item shape: { id, path, text, prefix?, placeholders?, ar? }
//   path   YAML key path, e.g. "sections.3.items.0.value", "title", "titles.1".
//          Strings containing newlines are markdown: split on blank lines into
//          blocks, addressed "<path>#<block>" (list items: "<path>#<block>.<item>").
//          The markdown body after the frontmatter uses "body:<block>[.<item>]".
//   prefix markdown prefix kept outside `text` ("## ", "- ", "1. ", "> ").
//   placeholders  originals for {{n}} tokens (link URLs, HTML tags, code, bare URLs).
// Rebuild contract: re-split the en source the same way, replace each unit's
// text (after restoring placeholders) and re-join blocks with a blank line.
import fs from 'node:fs';
import path from 'node:path';
import { split, protect, collect, hasLetters } from './lib.mjs';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'src/content');
const OUT = path.join(ROOT, '.translation');

function walkFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(p));
    else if (e.name === 'en.md') out.push(p);
  }
  return out.sort();
}

function structureOk(fmA, fmB, p) {
  // sections.N.* matches only when block type at N agrees.
  const m = p.match(/^sections\.(\d+)\./);
  if (!m) return true;
  const a = fmA.sections?.[m[1]], b = fmB.sections?.[m[1]];
  return !!a && !!b && a.type === b.type;
}

const files = walkFiles(CONTENT);
fs.rmSync(path.join(OUT, 'extract'), { recursive: true, force: true });
fs.rmSync(path.join(OUT, 'scan-batches'), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'extract'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'scan-batches'), { recursive: true });

let nStr = 0, nAr = 0, nFiles = 0, noAr = 0;
const sizes = [];
for (const f of files) {
  const rel = path.relative(CONTENT, f).replace(/(^|\/)en\.md$/, '');
  const relName = rel === '' ? 'index' : rel;
  const en = split(fs.readFileSync(f, 'utf8'));
  const enUnits = collect(en.fm, en.body);

  const arPath = f.replace(/en\.md$/, 'ar.md');
  let arMap = null, ar = null;
  if (fs.existsSync(arPath)) {
    ar = split(fs.readFileSync(arPath, 'utf8'));
    arMap = new Map(collect(ar.fm, ar.body).map((u) => [u.path, u]));
  } else noAr++;

  // Markdown field/block-count agreement: only trust "<field>#n" if both have same unit count.
  const countBy = (units) => { const c = {}; for (const u of units) { const k = u.path.split(/#|:/)[0] + (u.path.startsWith('body:') ? ':' : ''); c[k] = (c[k] || 0) + 1; } return c; };
  const enCounts = countBy(enUnits);
  const arCounts = ar ? countBy([...arMap.values()]) : {};

  const items = [];
  let id = 0, chars = 0;
  for (const u of enUnits) {
    const { text, ph } = protect(u.raw);
    if (!hasLetters(text)) continue;
    const item = { id: ++id, path: u.path };
    if (u.prefix) item.prefix = u.prefix;
    item.text = text;
    if (ph.length) item.placeholders = ph;
    const base = u.path.split(/#|:/)[0] + (u.path.startsWith('body:') ? ':' : '');
    const a = arMap?.get(u.path);
    if (a && structureOk(en.fm, ar.fm, u.path) && enCounts[base] === arCounts[base]) {
      item.ar = protect(a.raw).text;
      nAr++;
    }
    items.push(item);
    chars += text.length;
  }
  const outFile = path.join(OUT, 'extract', relName + '.json');
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(items, null, 2) + '\n');
  sizes.push({ file: path.relative(ROOT, outFile), chars });
  nStr += items.length; nFiles++;
}

// Balanced batches by text volume (greedy, largest first).
const batches = Array.from({ length: 4 }, () => ({ files: [], chars: 0 }));
for (const s of [...sizes].sort((a, b) => b.chars - a.chars)) {
  const b = batches.reduce((m, x) => (x.chars < m.chars ? x : m));
  b.files.push(s.file); b.chars += s.chars;
}
batches.forEach((b, i) => fs.writeFileSync(path.join(OUT, 'scan-batches', `batch-${i + 1}.txt`), b.files.sort().join('\n') + '\n'));

console.log(`files: ${nFiles} (no ar.md: ${noAr})`);
console.log(`strings: ${nStr}, with ar: ${nAr} (${((100 * nAr) / nStr).toFixed(1)}%)`);
batches.forEach((b, i) => console.log(`batch-${i + 1}: ${b.files.length} files, ${b.chars} chars`));
