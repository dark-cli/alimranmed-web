#!/usr/bin/env node
// Step 8 of docs/translation-plan.md: validate a translated JSON and rebuild the markdown.
// Usage: node scripts/translate/rebuild.mjs <extract-json> <tr|ckb> <translated-json> [--skip-script] [--out <file>]
// Default output: .translation/rebuilt/<rel>/<lang>.md  (never src/content in the pilot)
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { ROOT, loadExtract, srcFileFor, checkLang, split, collect, protect, mdBlocks, hasLetters } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); if (i < 0) return null; args.splice(i, 1); return true; };
const skipScript = flag('--skip-script');
const oi = args.indexOf('--out'); const outArg = oi >= 0 ? args.splice(oi, 2)[1] : null;
const [file, langArg, tfile] = args;
if (!file || !langArg || !tfile) { console.error('usage: rebuild.mjs <extract-json> <tr|ckb> <translated-json> [--skip-script] [--out file]'); process.exit(2); }
const lang = checkLang(langArg);
const { rel, items } = loadExtract(file);

// ── 1. validate ──────────────────────────────────────────────────────────
const errors = [];
let tr;
try { tr = JSON.parse(fs.readFileSync(tfile, 'utf8')); } catch (e) { console.error('cannot parse translated JSON: ' + e.message); process.exit(1); }
if (!Array.isArray(tr)) { console.error('translated JSON must be an array of {id, text}'); process.exit(1); }

const byId = new Map();
for (const t of tr) {
  if (!t || typeof t.id !== 'number' || typeof t.text !== 'string') { errors.push(`malformed entry: ${JSON.stringify(t)?.slice(0, 80)}`); continue; }
  if (byId.has(t.id)) errors.push(`id ${t.id}: duplicate`);
  byId.set(t.id, t.text);
}
const known = new Set(items.map((i) => i.id));
for (const id of byId.keys()) if (!known.has(id)) errors.push(`id ${id}: not in source`);

const AR_RE = /[؀-ۿݐ-ݿ]/;
const AR_LETTER = /[ء-يٮ-ۓۺ-ۿ]/;
const BAD_CKB = /[يكةىھ]/;
const wordsOf = (s) => s.replace(/\{\{\d+\}\}/g, ' ').split(/\s+/).filter(Boolean).length;
for (const it of items) {
  const t = byId.get(it.id);
  if (t === undefined) { errors.push(`id ${it.id}: missing`); continue; }
  if (!t.trim()) { errors.push(`id ${it.id}: empty`); continue; }
  const phs = (s) => (s.match(/\{\{\d+\}\}/g) || []).sort().join(',');
  if (phs(t) !== phs(it.text)) errors.push(`id ${it.id}: placeholders differ (src ${phs(it.text) || '-'} / got ${phs(t) || '-'})`);
  if (/\[\[TERM:/.test(t)) errors.push(`id ${it.id}: unresolved ${t.match(/\[\[TERM:[^\]]*\]\]/)[0]}`);
  if (/\n/.test(t)) errors.push(`id ${it.id}: contains newline`);
  if (!skipScript) {
    if (lang === 'ckb') {
      const bare = t.replace(/\{\{\d+\}\}/g, '');
      if (BAD_CKB.test(bare)) errors.push(`id ${it.id}: Arabic-only letters (ي ك ة ى) in ckb: "${bare.match(/.{0,8}[يكةىھ].{0,8}/)[0]}"`);
      if (!AR_LETTER.test(bare) && wordsOf(it.text) >= 4) errors.push(`id ${it.id}: no Arabic-script text in ckb line`);
    } else if (AR_RE.test(t) && !AR_RE.test(it.text)) errors.push(`id ${it.id}: Arabic-script characters in tr line`);
  }
}
if (errors.length) {
  console.error(`${rel} ${lang}: ${errors.length} validation error(s)`);
  errors.slice(0, 40).forEach((e) => console.error('  ' + e));
  process.exit(1);
}

// ── 2. rebuild ───────────────────────────────────────────────────────────
const srcPath = srcFileFor(rel);
const raw = fs.readFileSync(srcPath, 'utf8');
const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
if (!m) throw new Error('source has no frontmatter: ' + srcPath);
const fm = yaml.load(m[1]) || {};
let body = m[2];

const restore = (it) => byId.get(it.id).trim().replace(/\{\{(\d+)\}\}/g, (_, n) => it.placeholders[+n]).trim();
// path -> text for each item
const flat = new Map();   // plain yaml-path -> {text}
const md = new Map();     // yaml-path|'body' -> Map(key -> {prefix?, text})
for (const it of items) {
  const text = restore(it);
  const mb = it.path.match(/^body:(.+)$/);
  const mf = it.path.match(/^(.+?)#(.+)$/);
  if (mb) { if (!md.has('body')) md.set('body', new Map()); md.get('body').set(mb[1], text); }
  else if (mf) { if (!md.has(mf[1])) md.set(mf[1], new Map()); md.get(mf[1]).set(mf[2], text); }
  else flat.set(it.path, text);
}

function rebuildMd(str, map, where) {
  const out = mdBlocks(str).map((b) => {
    if (!b.units.length) return b.blk;
    if (!b.units.some((u) => map.has(u.key))) return b.blk;
    const lines = b.units.map((u) => (map.has(u.key) ? u.prefix + map.get(u.key) : u.prefix + u.raw));
    return b.list ? lines.join('\n') : lines[0];
  });
  return out.join('\n\n');
}
function setPath(root, p, fn) {
  const keys = p.split('.');
  let cur = root;
  for (const k of keys.slice(0, -1)) { cur = cur?.[k]; if (cur == null) throw new Error(`bad path ${p}`); }
  const last = keys[keys.length - 1];
  if (typeof cur[last] !== 'string') throw new Error(`path ${p} is not a string in source`);
  cur[last] = fn(cur[last]);
}
for (const [p, text] of flat) setPath(fm, p, () => text);
for (const [p, map] of md) {
  if (p === 'body') body = rebuildMd(body, map) + (body.endsWith('\n') ? '\n' : '');
  else setPath(fm, p, (s) => {
    const r = rebuildMd(s, map);
    // keep the string "markdown-shaped" (contains a newline) so it re-extracts under the same <path>#<n> keys
    return r + (s.endsWith('\n') || !r.includes('\n') ? '\n' : '');
  });
}

// locale field: mirror en/ar convention (ar.md carries `locale: ar` in most files)
const arPath = srcPath.replace(/en\.md$/, 'ar.md');
const arHasLocale = fs.existsSync(arPath) && /^locale:/m.test(fs.readFileSync(arPath, 'utf8').split(/\n---/)[0]);
if ('locale' in fm || arHasLocale) fm.locale = lang;

const fmText = yaml.dump(fm, { lineWidth: 120, noRefs: true, quotingType: '"' });
const outText = `---\n${fmText}---\n${body}`;

// ── 3. round-trip checks ─────────────────────────────────────────────────
const re = split(outText);
if (typeof re.fm !== 'object' || !Object.keys(re.fm).length) throw new Error('rebuilt frontmatter does not parse');
const again = collect(re.fm, re.body).map((u) => ({ ...u, ...protect(u.raw) })).filter((u) => hasLetters(u.text));
const pathsA = items.map((i) => i.path), pathsB = again.map((u) => u.path);
if (pathsA.length !== pathsB.length || pathsA.some((p, i) => p !== pathsB[i])) {
  const sa = new Set(pathsA), sb = new Set(pathsB);
  console.error(`${rel} ${lang}: round-trip path mismatch`);
  console.error('  missing:', pathsA.filter((p) => !sb.has(p)).slice(0, 10).join(', '));
  console.error('  extra:  ', pathsB.filter((p) => !sa.has(p)).slice(0, 10).join(', '));
  process.exit(1);
}
// placeholders restored identically
for (let i = 0; i < items.length; i++) {
  const a = (items[i].placeholders || []).join('\u0001'), b = again[i].ph.join('\u0001');
  if (a !== b) { console.error(`${rel} ${lang}: placeholder originals changed at ${items[i].path}`); process.exit(1); }
}

const out = outArg ? path.resolve(outArg) : path.join(ROOT, '.translation/rebuilt', rel, `${lang}.md`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, outText);
console.log(`${rel} ${lang}: OK ${items.length} lines -> ${path.relative(ROOT, out)}`);
