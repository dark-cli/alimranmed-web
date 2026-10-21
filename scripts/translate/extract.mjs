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
import yaml from 'js-yaml';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'src/content');
const OUT = path.join(ROOT, '.translation');

// Keys whose string value is human-readable text.
const TEXT_KEYS = new Set([
  'title', 'description', 'imageAlt', 'photoAlt', 'heading', 'eyebrow', 'body',
  'intro', 'note', 'label', 'value', 'subtitle', 'text', 'attribution',
  'caption', 'alt', 'question', 'answer', 'name', 'leadLabel', 'avatarAlt',
  'linkLabel', 'sublabel', 'specialty',
]);
// String arrays that are text: items (except cards = URL paths), titles, languages.
const TEXT_ARRAYS = new Set(['items', 'titles', 'languages']);

function walkFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(p));
    else if (e.name === 'en.md') out.push(p);
  }
  return out.sort();
}

function split(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  return { fm: yaml.load(m[1]) || {}, body: m[2] };
}

// ── placeholder protection ───────────────────────────────────────────────
function protect(s) {
  const ph = [];
  const keep = (orig) => { ph.push(orig); return `{{${ph.length - 1}}}`; };
  let t = s;
  t = t.replace(/(!?\[[^\]]*\]\()([^)\s]+(?:\s+"[^"]*")?)(\))/g, (_, a, url, c) => a + keep(url) + c);
  t = t.replace(/<https?:\/\/[^>\s]+>/g, keep);
  t = t.replace(/<\/?[a-zA-Z][^>]*>/g, keep);
  t = t.replace(/`[^`]+`/g, keep);
  t = t.replace(/https?:\/\/[^\s)<>\]]+/g, keep);
  t = t.replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, keep);
  return { text: t, ph };
}

// ── markdown block splitting ─────────────────────────────────────────────
const LIST_RE = /^(\s*(?:[-*+]|\d+[.)])\s+)(.*)$/;
function mdUnits(str) {
  const units = []; // {key, prefix, raw}
  const blocks = str.split(/\n{2,}/).map((b) => b.replace(/^\n+|\n+$/g, '')).filter((b) => b.trim() !== '');
  blocks.forEach((blk, bi) => {
    const lines = blk.split('\n');
    if (/^\s*(```|~~~)/.test(blk) || /^\|/.test(blk) || /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(blk)) return; // code, table, hr: skip
    if (LIST_RE.test(lines[0])) {
      const items = [];
      for (const l of lines) {
        const m = l.match(LIST_RE);
        if (m) items.push({ prefix: m[1], raw: m[2] });
        else items[items.length - 1].raw += ' ' + l.trim();
      }
      items.forEach((it, ii) => units.push({ key: `${bi}.${ii}`, prefix: it.prefix, raw: it.raw }));
      return;
    }
    const h = blk.match(/^(#{1,6}\s+)([\s\S]*)$/);
    if (h) return units.push({ key: `${bi}`, prefix: h[1], raw: h[2].replace(/\s*\n\s*/g, ' ') });
    const q = blk.match(/^(>\s?)/);
    if (q) return units.push({ key: `${bi}`, prefix: q[1], raw: lines.map((l) => l.replace(/^>\s?/, '')).join(' ') });
    units.push({ key: `${bi}`, prefix: '', raw: lines.map((l) => l.trim()).join(' ') });
  });
  return units;
}

const hasLetters = (s) => /\p{L}{2,}/u.test(s.replace(/\{\{\d+\}\}/g, ''));

// Collect raw (pre-placeholder) units: Map path -> {prefix, raw}
function collect(fm, body) {
  const out = [];
  const add = (p, str) => {
    if (typeof str !== 'string' || !str.trim()) return;
    if (str.includes('\n')) {
      for (const u of mdUnits(str)) out.push({ path: `${p}#${u.key}`, prefix: u.prefix, raw: u.raw });
    } else out.push({ path: p, prefix: '', raw: str.trim() });
  };
  const visit = (node, p, parentType) => {
    if (Array.isArray(node)) { node.forEach((x, i) => visit(x, `${p}.${i}`, parentType)); return; }
    if (!node || typeof node !== 'object') return;
    const type = node.type;
    for (const [k, v] of Object.entries(node)) {
      const kp = p ? `${p}.${k}` : k;
      if (typeof v === 'string') {
        if (!TEXT_KEYS.has(k)) continue;
        if (k === 'name' && type === 'doctor-credit') continue; // person's name
        if (k === 'title' && type === 'doctor-credit') { add(kp, v); continue; }
        if (k === 'value' && !/\p{L}{2,}/u.test(v)) continue; // "5,000+", "30–50%"
        add(kp, v);
      } else if (Array.isArray(v)) {
        if (v.length && v.every((x) => typeof x === 'string')) {
          if (!TEXT_ARRAYS.has(k)) continue;
          if (k === 'items' && type === 'cards') continue; // URL paths
          v.forEach((s, i) => add(`${kp}.${i}`, s));
        } else visit(v, kp, type);
      } else if (v && typeof v === 'object') visit(v, kp, type);
    }
  };
  visit(fm, '', null);
  if (body && body.trim()) {
    for (const u of mdUnits(body)) out.push({ path: `body:${u.key}`, prefix: u.prefix, raw: u.raw });
  }
  return out;
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
