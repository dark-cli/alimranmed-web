// Consistency checks for the TR / CKB glossary.
// Usage:
//   node scripts/translate/check-glossary.mjs           # checks docs/glossary-{tr,ckb}.json
//   node scripts/translate/check-glossary.mjs --parts   # checks raw translator output (.translation/glossary-parts)
// Exit code 1 if any hard error (coverage, script letters, keep-policy, head-word rule violations).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const FIXES = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/translate/glossary-fixes.json'), 'utf8'));
const TERMS = JSON.parse(fs.readFileSync(path.join(ROOT, '.translation/terms.json'), 'utf8'));
const usePartsMode = process.argv.includes('--parts');
const quiet = process.argv.includes('--quiet');

// ---- load as unified rows {en, category, tr, trPolicy, ckb, ckbPolicy}
function loadRows() {
  if (usePartsMode) {
    const dir = path.join(ROOT, '.translation/glossary-parts');
    return fs.readdirSync(dir).filter((f) => /^chunk-\d+\.json$/.test(f)).flatMap((f) =>
      JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).map((e) => ({
        en: e.en, category: e.category, tr: e.tr, trPolicy: e.tr_policy, ckb: e.ckb, ckbPolicy: e.ckb_policy, src: f,
      })));
  }
  const tr = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/glossary-tr.json'), 'utf8'));
  const ckb = new Map(JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/glossary-ckb.json'), 'utf8')).map((e) => [e.en, e]));
  return tr.map((e) => ({ en: e.en, category: e.category, tr: e.text, trPolicy: e.policy, trGloss: e.gloss, ckb: ckb.get(e.en)?.text, ckbPolicy: ckb.get(e.en)?.policy, ckbGloss: ckb.get(e.en)?.gloss }));
}
const rows = loadRows();
const errors = [];
const warns = [];
const err = (k, m) => errors.push(`[${k}] ${m}`);
const warn = (k, m) => warns.push(`[${k}] ${m}`);

// ---- 1. coverage: every terms.json en exactly once
const counts = new Map();
rows.forEach((r) => counts.set(r.en, (counts.get(r.en) || 0) + 1));
for (const t of TERMS) {
  const n = counts.get(t.en) || 0;
  if (n !== 1) err('coverage', `${t.en}: ${n} entries`);
}
if (!usePartsMode) {
  const ckbList = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/glossary-ckb.json'), 'utf8'));
  if (ckbList.length !== rows.length) err('coverage', `tr has ${rows.length} entries, ckb has ${ckbList.length}`);
}

// ---- 2. Sorani script: no Arabic-only letters or harakat
const ARABIC_ONLY = /[يكةىۀً-ْٰ]/;
for (const r of rows) {
  if (!r.ckb) { err('missing', `${r.en}: no ckb text`); continue; }
  if (ARABIC_ONLY.test(r.ckb)) err('script', `${r.en}: ${r.ckb}`);
  if (!r.tr) err('missing', `${r.en}: no tr text`);
}

// ---- 2b. no built-in parenthetical gloss in text (it lives in `gloss`), unless the English term has parentheses
if (!usePartsMode) {
  for (const lang of ['tr', 'ckb']) {
    for (const e of JSON.parse(fs.readFileSync(path.join(ROOT, `docs/glossary-${lang}.json`), 'utf8'))) {
      if (/[()（）]/.test(e.en)) continue;
      for (const [w, t, src] of [['text', e.text, e.en], ...(e.variant_rules || []).map((r) => [`variant ${r.variant}`, r.text, r.variant])]) {
        if (/[()（）]/.test(t || '') && !/[()（）]/.test(src)) err('paren', `${lang} ${e.en} (${w}): ${t}`);
      }
      {
        // tr: gloss identical to the rendering or the English term; ckb: gloss identical to / contained in its own rendering
        const low = (a) => String(a).trim().toLocaleLowerCase('tr');
        const same = lang === 'tr'
          ? (g, text, en) => low(g) === low(text) || low(g) === low(en)
          : (g, text) => low(text).includes(low(g)); // ckb: an English gloss (MRI) is intended
        if (e.gloss && same(e.gloss, e.text, e.en)) err('gloss-same', `${lang} ${e.en}: gloss "${e.gloss}" repeats the rendering/English term`);
        for (const r of e.variant_rules || []) if (r.gloss && same(r.gloss, r.text, r.variant)) err('gloss-same', `${lang} ${e.en} variant ${r.variant}: gloss "${r.gloss}" repeats the rendering/English term`);
      }
      if (e.gloss != null && (!e.gloss.trim() || /[()]/.test(e.gloss))) err('paren', `${lang} ${e.en}: bad gloss "${e.gloss}"`);
    }
  }
}

// ---- 2c. ckb: a gloss that is another entry's rendering ("adhesive capsulitis (شانی بەستوو)" = frozen shoulder)
// doubles up when the source pairs both terms ("frozen shoulder (adhesive capsulitis)")
if (!usePartsMode) {
  const ckbList = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/glossary-ckb.json'), 'utf8'));
  const owner = new Map(ckbList.map((e) => [e.text.trim(), e.en]));
  // only a risk when the source writes one term with the other in parentheses: "frozen shoulder (adhesive capsulitis)"
  const exDir = path.join(ROOT, '.translation/extract');
  const walk = (d) => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((f) => (f.isDirectory() ? walk(path.join(d, f.name)) : f.name.endsWith('.json') ? [path.join(d, f.name)] : [])) : []);
  const lines = walk(exDir).flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')).map((i) => i.text.toLowerCase()));
  for (const e of ckbList) {
    const o = e.gloss && /[؀-ۿ]/.test(e.gloss) && owner.get(e.gloss.trim());
    if (!o || o === e.en) continue;
    const q = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pair = (x, y) => new RegExp(`(^|[^a-z])${q(x)}[*_\\s]*\\((?:[^)]*?[^a-z])?${q(y)}([^a-z]|$)`, 'i');
    const [a, b] = [e.en.toLowerCase(), o.toLowerCase()];
    if (lines.some((l) => pair(a, b).test(l) || pair(b, a).test(l))) warn('gloss-other', `ckb ${e.en}: gloss "${e.gloss}" is the rendering of "${o}", and the source writes "X (Y)" with both terms (risk of double rendering)`);
  }
}

// ---- 3. keep policy: text must equal en (identical in both languages)
for (const r of rows) {
  for (const [lang, text, pol] of [['tr', r.tr, r.trPolicy], ['ckb', r.ckb, r.ckbPolicy]]) {
    if (pol === 'keep' && text && text.toLowerCase() !== r.en.toLowerCase()) err('keep', `${lang} ${r.en} -> ${text}`);
  }
  if (r.trPolicy === 'keep' && r.ckbPolicy === 'keep' && r.tr !== r.ckb) err('keep', `tr/ckb differ for ${r.en}: ${r.tr} / ${r.ckb}`);
}

// ---- 3b. a kept brand/acronym must appear verbatim in every entry that contains it
const kept = rows.filter((r) => r.trPolicy === 'keep' && r.ckbPolicy === 'keep' && /[A-Za-z]/.test(r.en) && r.en.length >= 3);
for (const k of kept) {
  const re = new RegExp(`(^|[^A-Za-z])${k.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-z]|$)`);
  for (const r of rows) {
    if (r === k || !re.test(r.en)) continue;
    for (const lang of ['tr', 'ckb']) {
      if (!(r[lang] || '').toLowerCase().includes(k.tr.toLowerCase())) warn('brand', `${lang} "${r.en}" -> ${r[lang]} lacks kept "${k.tr}"`);
    }
  }
}

// ---- 4. head-word rules (site-wide decisions): en matches -> rendering must match
for (const rule of FIXES.rules) {
  const enRe = new RegExp(rule.en, 'i');
  const except = new Set(rule.except || []);
  for (const lang of ['tr', 'ckb']) {
    if (!rule[lang]) continue;
    const want = new RegExp(rule[lang], 'i');
    const forbid = rule[`${lang}Forbid`] ? new RegExp(rule[`${lang}Forbid`], 'i') : null;
    for (const r of rows) {
      if (!enRe.test(r.en) || except.has(r.en)) continue;
      const text = [r[lang] || '', r[`${lang}Gloss`] || ''].join(' ').trim(); // rendering + its gloss
      if (!want.test(text)) err('rule', `${rule.id} ${lang}: "${r.en}" -> ${text}  (want /${rule[lang]}/)`);
      else if (forbid && forbid.test(text)) err('rule', `${rule.id} ${lang}: "${r.en}" -> ${text}  (forbidden /${rule[`${lang}Forbid`]}/)`);
    }
  }
}

// ---- 5. spelling-variant clusters: same word, different vowel spelling (سەندرۆم/سیندرۆم, ورووژاندن/وروژاندن)
const CKB_SUFFIX = /(ییەکانی|ییەکان|یەکانی|یەکان|ەکانی|ەکان|ەکەی|ەکە|ەوە|یی|ی|ە)$/u;
const TR_SUFFIX = /(lerinin|larının|leri|ları|ler|lar|nin|nın|sı|si|su|sü|ı|i|u|ü)$/u;
const ckbBase = (w) => (w.length > 4 ? w.replace(CKB_SUFFIX, '') : w).replace(/(?<=..)[ەیێ]+$/u, '');
const trBase = (w) => (w.length > 5 ? w.replace(TR_SUFFIX, '') : w).toLocaleLowerCase('tr').replace(/(?<=...)[aeıiouöü]+$/u, '');
// skeleton: drop short-vowel letters, collapse long vowels, fold ڕ/ڵ
const ckbSkeleton = (b) => b.replace(/وو/g, 'و').replace(/[ەێیا]/gu, '').replace(/ڕ/g, 'ر').replace(/ڵ/g, 'ل');
// tr: fold diacritics only (detrüsör/detrusor, genikuler/genikülat->genikül)
const trSkeleton = (b) => b.replace(/ı/g, 'i').normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z]/g, '');
function clusters(lang, base, skel, minLen) {
  const map = new Map();
  for (const r of rows) {
    for (const w of (r[lang] || '').split(/[\s()\/،,.\-–:]+/u)) {
      if (w.length < minLen || /[A-Za-z0-9]/.test(lang === 'ckb' ? w : w.replace(/[^0-9]/g, ''))) continue;
      const b = base(w), k = skel(b);
      if (k.length < 3) continue;
      let m = map.get(k);
      if (!m) map.set(k, (m = new Map()));
      m.set(b, (m.get(b) || 0) + 1);
    }
  }
  return [...map.values()].filter((m) => m.size > 1).map((m) => [...m].sort((a, b) => b[1] - a[1]));
}
const allowed = new Set(FIXES.allowedVariantClusters || []);
for (const [lang, base, skel, min] of [['ckb', ckbBase, ckbSkeleton, 4], ['tr', trBase, trSkeleton, 5]]) {
  for (const forms of clusters(lang, base, skel, min)) {
    if (allowed.has(forms.map((f) => f[0]).sort().join('|'))) continue;
    warn(`spelling-${lang}`, forms.map(([w, n]) => `${w}×${n}`).join('  '));
  }
}

// ---- 6. tr sentence case: leading capital only for proper nouns / acronyms
for (const r of rows) {
  if (!r.tr || r.category === 'site') continue;
  if (/^[A-ZÇĞİÖŞÜ]/.test(r.tr) && /^[a-z]/.test(r.en) && !/^[A-ZÇĞİÖŞÜ0-9]{2,}/.test(r.tr) && r.trPolicy !== 'keep' && !(FIXES.trProperNouns || []).includes(r.tr.split(/[\s\-/(]/)[0])) warn('tr-case', `${r.en} -> ${r.tr}`);
}

const head = (a, n) => (quiet ? a.slice(0, n) : a);
console.log(`mode=${usePartsMode ? 'parts' : 'docs'} rows=${rows.length} errors=${errors.length} warnings=${warns.length}`);
const byKind = (a) => a.reduce((m, s) => { const k = s.slice(1, s.indexOf(']')); m[k] = (m[k] || 0) + 1; return m; }, {});
console.log('errors by kind', JSON.stringify(byKind(errors)), 'warnings by kind', JSON.stringify(byKind(warns)));
head(errors, 40).forEach((e) => console.log('E', e));
head(warns, 40).forEach((w) => console.log('W', w));
process.exit(errors.length ? 1 : 0);
