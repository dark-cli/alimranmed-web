// Merge translator chunks + lead-terminologist fixes into docs/glossary-{tr,ckb}.json
// and write the native-speaker review sheets docs/glossary-review-{tr,ckb}.csv.
// Usage: node scripts/translate/merge-glossary.mjs [--verbose]
// Inputs : .translation/glossary-parts/chunk-*.json, .translation/terms.json,
//          scripts/translate/glossary-fixes.json
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const PARTS = path.join(ROOT, '.translation/glossary-parts');
const TERMS = JSON.parse(fs.readFileSync(path.join(ROOT, '.translation/terms.json'), 'utf8'));
const FIX = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/translate/glossary-fixes.json'), 'utf8'));
const verbose = process.argv.includes('--verbose');
const CATS = ['medical', 'procedure', 'drug', 'anatomy', 'site'];

// ---- load parts
const parts = new Map();
for (const f of fs.readdirSync(PARTS).filter((f) => /^chunk-\d+\.json$/.test(f)).sort()) {
  for (const e of JSON.parse(fs.readFileSync(path.join(PARTS, f), 'utf8'))) {
    if (parts.has(e.en)) throw new Error(`duplicate entry in parts: ${e.en}`);
    parts.set(e.en, structuredClone(e));
  }
}
const orig = new Map([...parts].map(([k, v]) => [k, structuredClone(v)]));
for (const a of FIX.add || []) {
  if (parts.has(a.en)) throw new Error(`add: already present: ${a.en}`);
  parts.set(a.en, structuredClone(a));
}

// ---- Sorani orthography: Arabic-only letters -> Kurdish, strip harakat
const toSorani = (s) => s
  .replace(/ي/g, 'ی').replace(/ى/g, 'ی').replace(/ك/g, 'ک').replace(/ة/g, 'ە').replace(/ۀ/g, 'ە')
  .replace(/[ً-ْٰ]/g, '');

// ---- Turkish sentence case: lowercase first letter unless proper noun / acronym / brand
const trProper = new Set(FIX.trProperNouns || []);
function trCase(text, e) {
  if (!text || e.category === 'site' || e.tr_policy === 'keep') return text;
  if (!/^[a-z]/.test(e.en)) return text; // English itself capitalised (eponym/brand)
  const first = text.split(/[\s\-/(]/)[0];
  if (trProper.has(first) || /^[A-ZÇĞİÖŞÜ0-9]{2,}/.test(first) || !/^[A-ZÇĞİÖŞÜ]/.test(first)) return text;
  return text[0].toLocaleLowerCase('tr') + text.slice(1);
}

const rx = (src) => new RegExp(src, 'gu');
const replaces = { tr: (FIX.replace?.tr || []).map(([a, b]) => [rx(a), b]), ckb: (FIX.replace?.ckb || []).map(([a, b]) => [rx(a), b]) };
const applyText = (lang, s, e) => {
  if (s == null) return s;
  let out = lang === 'ckb' ? toSorani(s) : s;
  for (const [re, to] of replaces[lang]) out = out.replace(re, to);
  if (lang === 'tr') out = trCase(out, e);
  return out;
};

// ---- apply fixes to every entry
const stripGloss = new Set(FIX.keepStripGloss || []);
for (const e of parts.values()) {
  const ov = FIX.override?.[e.en] || {};
  for (const lang of ['tr', 'ckb']) {
    e[lang] = applyText(lang, e[lang], e);
    for (const r of e.variant_rules || []) r[lang] = applyText(lang, r[lang], e);
    if (ov[lang] != null) e[lang] = ov[lang];
    if (ov[`${lang}_policy`]) e[`${lang}_policy`] = ov[`${lang}_policy`];
    // keep = identical to English everywhere; a gloss means it is not a pure keep
    if (e[`${lang}_policy`] === 'keep' && /^[a-z]/.test(e.en) && e[lang].toLowerCase() === e.en.toLowerCase()) e[lang] = e.en;
    if (e[`${lang}_policy`] === 'keep' && e[lang].toLowerCase() !== e.en.toLowerCase()) {
      if (stripGloss.has(e.en)) e[lang] = e.en;
      else e[`${lang}_policy`] = e[lang].toLowerCase().includes(e.en.toLowerCase()) ? 'translate' : 'adapt-spelling';
    }
  }
  if (e.tr_policy === 'keep' && e.ckb_policy === 'keep' && e.tr !== e.ckb) e.ckb = e.tr;
  if (ov.note) e.note = ov.note;
  if (ov.confidence) e.confidence = ov.confidence;
}

// ---- build outputs, keyed on terms.json (+ manual adds)
const termByEn = new Map(TERMS.map((t) => [t.en, t]));
const changed = { tr: 0, ckb: 0, entries: 0, substantiveEntries: 0, policy: 0, droppedVariantRules: 0 };
const out = { tr: [], ckb: [] };
const manualAdds = (FIX.add || []).filter((a) => !termByEn.has(a.en));
const allEn = [...TERMS.map((t) => t.en), ...manualAdds.map((a) => a.en)];
for (const en of allEn) {
  const e = parts.get(en);
  if (!e) throw new Error(`no glossary entry for term: ${en}`);
  const t = termByEn.get(en);
  const variants = t ? t.variants : (e.variants || []);
  const varSet = new Set(variants.map((v) => v.toLowerCase()));
  const o = orig.get(en);
  if (o) {
    let any = false;
    for (const lang of ['tr', 'ckb']) {
      if (o[lang] !== e[lang]) { changed[lang]++; any = true; if (o[lang]?.toLocaleLowerCase('tr') !== e[lang]?.toLocaleLowerCase('tr')) changed[`${lang}Substantive`] = (changed[`${lang}Substantive`] || 0) + 1; if (verbose) console.log(`~ ${lang} ${en}: ${o[lang]} -> ${e[lang]}`); }
      if (o[`${lang}_policy`] !== e[`${lang}_policy`]) changed.policy++;
    }
    if (any) changed.entries++;
    if (['tr', 'ckb'].some((l) => o[l]?.toLocaleLowerCase('tr') !== e[l]?.toLocaleLowerCase('tr'))) changed.substantiveEntries++;
  }
  for (const lang of ['tr', 'ckb']) {
    const rules = (e.variant_rules || []).filter((r) => {
      const ok = varSet.has(String(r.variant).toLowerCase()) && r[lang] && r[lang] !== e[lang];
      if (!ok && lang === 'tr' && !varSet.has(String(r.variant).toLowerCase())) changed.droppedVariantRules++;
      return ok;
    }).map((r) => ({ variant: r.variant, text: r[lang] }));
    const row = {
      en,
      category: t ? t.category : e.category,
      text: e[lang],
      policy: e[`${lang}_policy`],
      variants,
    };
    if (rules.length) row.variant_rules = rules;
    if (e.confidence) row.confidence = e.confidence;
    if (e.note) row.note = e.note;
    out[lang].push(row);
  }
}
const sortFn = (a, b) => CATS.indexOf(a.category) - CATS.indexOf(b.category) || a.en.localeCompare(b.en, 'en', { sensitivity: 'base' }) || a.en.localeCompare(b.en);
for (const lang of ['tr', 'ckb']) {
  out[lang].sort(sortFn);
  fs.writeFileSync(path.join(ROOT, `docs/glossary-${lang}.json`), JSON.stringify(out[lang], null, 2) + '\n');
}

// ---- review sheets: medium/low confidence + every entry with freq >= 10, by freq desc
const csv = (v) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const sheetCounts = {};
for (const lang of ['tr', 'ckb']) {
  const rows = out[lang].map((r) => {
    const t = termByEn.get(r.en);
    return { ...r, freq: t ? t.freq : 0, sample_en: t?.samples?.[0]?.en || '' };
  }).filter((r) => r.confidence === 'medium' || r.confidence === 'low' || r.freq >= 10)
    .sort((a, b) => b.freq - a.freq || a.en.localeCompare(b.en));
  const head = 'en,category,freq,rendering,policy,confidence,note,sample_en';
  const body = rows.map((r) => [r.en, r.category, r.freq, r.text, r.policy, r.confidence, r.note, r.sample_en].map(csv).join(','));
  fs.writeFileSync(path.join(ROOT, `docs/glossary-review-${lang}.csv`), '﻿' + [head, ...body].join('\n') + '\n');
  sheetCounts[lang] = rows.length;
}

console.log(JSON.stringify({ entries: { tr: out.tr.length, ckb: out.ckb.length }, added: (FIX.add || []).length, changed, reviewRows: sheetCounts }));
