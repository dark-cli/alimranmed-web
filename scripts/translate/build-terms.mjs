// Merge scanner output into .translation/terms.json and glossary chunks.
// Usage: node scripts/translate/build-terms.mjs [--dump]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const SCAN = path.join(ROOT, '.translation/scan-results');
const OUT = path.join(ROOT, '.translation/terms.json');
const CHUNK_DIR = path.join(ROOT, '.translation/glossary-chunks');
const OVERRIDES = path.join(ROOT, 'scripts/translate/term-overrides.json');
const CHUNK_SIZE = 250;
const CATS = ['medical', 'procedure', 'drug', 'anatomy', 'site'];

const ov = fs.existsSync(OVERRIDES)
  ? JSON.parse(fs.readFileSync(OVERRIDES, 'utf8'))
  : {};
const drop = new Set((ov.drop || []).map((s) => keyOf(s)));
const aliases = new Map(Object.entries(ov.merge || {}).map(([k, v]) => [keyOf(k), keyOf(v)]));
const aliasTarget = new Map(Object.entries(ov.merge || {}).map(([, v]) => [keyOf(v), v]));
const catFix = new Map(Object.entries(ov.category || {}).map(([k, v]) => [keyOf(k), v]));
const related = ov.related || [];
const canonicalOverride = new Map(Object.entries(ov.canonical || {}).map(([k, v]) => [keyOf(k), v]));
const keepSite = new Set((ov.keepSite || []).map((s) => keyOf(s)));
// exact-case surface forms that must not collapse into a fuzzy-key neighbour (CRP vs CRPS)
const split = new Map(Object.entries(ov.split || {}));

function singular(w) {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 4 && /(ches|shes|sses|xes)$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s') && !/(ss|us|is|ics)$/.test(w)) return w.slice(0, -1);
  return w;
}
function keyOf(t) {
  let s = String(t).toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    // British -> American spelling so variants collapse
    .replace(/haem/g, 'hem').replace(/aem/g, 'em').replace(/ischaem/g, 'ischem')
    .replace(/oedema|oidema/g, 'edema').replace(/(\w)oed/g, '$1ed').replace(/tumour/g, 'tumor')
    .replace(/apnoea/g, 'apnea').replace(/rhoea/g, 'rhea').replace(/aesth/g, 'esth')
    .replace(/paed/g, 'ped').replace(/orthopaed/g, 'orthoped').replace(/manoeuvre/g, 'maneuver')
    .replace(/isation/g, 'ization').replace(/sensitis/g, 'sensitiz').replace(/(catheter|mobil|desensit)is/g, '$1iz')
    .replace(/revascularis/g, 'revasculariz').replace(/cauteris/g, 'cauteriz').replace(/behaviour/g, 'behavior')
    .replace(/\bdisks?\b/g, 'disc').replace(/counselling/g, 'counseling').replace(/vertebrae/g, 'vertebra')
    .replace(/fibre/g, 'fiber').replace(/parasthesia|paraesthesia/g, 'paresthesia')
    .replace(/[’`]/g, "'").replace(/'s\b/g, '')
    .replace(/[^\p{L}\p{N}\s/+-]/gu, ' ')
    .replace(/[-]/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/^(the|a|an) /, '');
  return s.split(' ').map(singular).join(' ');
}
function clean(t) {
  return String(t).replace(/[’`]/g, "'").replace(/^[\s"'(\[.,;:!?-]+|[\s"')\].,;:!?-]+$/g, '').replace(/\s+/g, ' ');
}

// ---- load
const rows = [];
for (const f of fs.readdirSync(SCAN).filter((f) => /^batch-\d+\.jsonl$/.test(f)).sort()) {
  for (const line of fs.readFileSync(path.join(SCAN, f), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { rows.push(JSON.parse(line)); } catch { /* skip */ }
  }
}
const rawLines = rows.length;

// ---- group
const groups = new Map();
for (const r of rows) {
  const surface = clean(r.term || '');
  if (!surface) continue;
  let k = split.has(surface) ? 'split:' + split.get(surface) : keyOf(surface);
  if (!k) continue;
  k = aliases.get(k) || k;
  let g = groups.get(k);
  if (!g) groups.set(k, (g = { key: k, forms: new Map(), cats: new Map(), files: new Set(), samples: [] }));
  g.forms.set(surface, (g.forms.get(surface) || 0) + 1);
  g.cats.set(r.category, (g.cats.get(r.category) || 0) + 1);
  g.files.add(r.file);
  g.samples.push({ en: r.sample_en || '', ar: r.sample_ar || '' });
}
const mergedBeforeDrop = groups.size;

const isAcr = (s) => /[A-Z]/.test(s.slice(1));
function pickCanonical(g) {
  if (g.key.startsWith('split:')) return g.key.slice(6);
  if (canonicalOverride.has(g.key)) return canonicalOverride.get(g.key);
  if (aliasTarget.has(g.key)) return aliasTarget.get(g.key);
  const forms = [...g.forms].sort((a, b) => b[1] - a[1]);
  const acr = forms.find(([s]) => isAcr(s));
  if (acr) return acr[0];
  const best = forms[0][0];
  // prefer lowercase for generic terms, keep capitalised if every form is capitalised (brand/proper)
  const allCap = forms.every(([s]) => /^[A-Z]/.test(s));
  return allCap ? best : best.toLowerCase();
}

let dropped = 0;
const terms = [];
for (const g of groups.values()) {
  const en = pickCanonical(g);
  let category = catFix.get(g.key) || (g.key.startsWith('split:') && catFix.get(keyOf(en))) ||
    [...g.cats].sort((a, b) => b[1] - a[1])[0][0];
  if (drop.has(g.key)) { dropped++; continue; }
  if (category === 'site' && g.files.size < 2 && !keepSite.has(g.key)) { dropped++; continue; }
  const variants = [...g.forms.keys()].filter((s) => s.toLowerCase() !== en.toLowerCase()).sort();
  const withAr = g.samples.filter((s) => s.ar && s.en);
  const pool = withAr.length ? withAr : g.samples.filter((s) => s.en);
  const seen = new Set(), samples = [];
  for (const s of pool.sort((a, b) => a.en.length - b.en.length)) {
    if (seen.has(s.en)) continue;
    seen.add(s.en);
    samples.push({ en: s.en, ar: s.ar || '' });
    if (samples.length === 2) break;
  }
  terms.push({ en, category, variants, freq: g.files.size, files: [...g.files].sort(), samples, _key: g.key });
}

// related links
const byKey = new Map(terms.map((t) => [t._key, t]));
for (const [a, b] of related) {
  const ta = byKey.get(keyOf(a)), tb = byKey.get(keyOf(b));
  if (!ta || !tb) continue;
  (ta.related ||= []).includes(tb.en) || ta.related.push(tb.en);
  (tb.related ||= []).includes(ta.en) || tb.related.push(ta.en);
}
terms.forEach((t) => delete t._key);

terms.sort((a, b) =>
  CATS.indexOf(a.category) - CATS.indexOf(b.category) ||
  b.freq - a.freq || a.en.localeCompare(b.en));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(terms, null, 2) + '\n');

// ---- chunks: by category, alphabetical, ~CHUNK_SIZE; split points avoid breaking a shared first word
fs.rmSync(CHUNK_DIR, { recursive: true, force: true });
fs.mkdirSync(CHUNK_DIR, { recursive: true });
const firstWord = (s) => s.toLowerCase().split(/[\s-]/)[0];
const lastWord = (s) => { const w = s.toLowerCase().split(/[\s-]/); return w[w.length - 1]; };
const ordered = [];
for (const c of CATS) {
  const list = terms.filter((t) => t.category === c)
    .sort((a, b) => (lastWord(a.en) === lastWord(b.en) ? 0 : 0) || a.en.toLowerCase().localeCompare(b.en.toLowerCase()));
  ordered.push(...list);
}
const chunks = [];
let cur = [];
const flush = () => { if (cur.length) { chunks.push(cur); cur = []; } };
for (let i = 0; i < ordered.length; i++) {
  const t = ordered[i];
  const prev = cur[cur.length - 1];
  if (prev && prev.category !== t.category && cur.length > CHUNK_SIZE * 0.4) flush();
  else if (cur.length >= CHUNK_SIZE && prev) {
    // extend up to +40% to finish a first-word cluster, else break
    const same = prev.category === t.category && firstWord(prev.en) === firstWord(t.en);
    if (!same || cur.length >= CHUNK_SIZE * 1.4) flush();
  }
  cur.push(t);
}
flush();
chunks.forEach((c, i) => fs.writeFileSync(path.join(CHUNK_DIR, `chunk-${i + 1}.json`), JSON.stringify(c, null, 2) + '\n'));

const per = {};
terms.forEach((t) => (per[t.category] = (per[t.category] || 0) + 1));
console.log(JSON.stringify({ rawLines, mergedBeforeDrop, dropped, entries: terms.length, per, chunks: chunks.length, chunkSizes: chunks.map((c) => c.length) }));
if (process.argv.includes('--dump')) {
  for (const t of terms) console.log(`${t.category[0]}\t${t.freq}\t${t.en}${t.variants.length ? '  <' + t.variants.slice(0, 3).join('|') : ''}`);
}
