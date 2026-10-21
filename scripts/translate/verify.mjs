#!/usr/bin/env node
// Step 6 of docs/translation-plan.md: glossary adherence check for one translated file.
// Usage: node scripts/translate/verify.mjs <extract-json> <tr|ckb> <translated-json> [--all]
// Exit 1 on any miss. Misses are listed per line id.
import fs from 'node:fs';
import { loadExtract, checkLang, loadGlossary, buildMatchers, scanGlossary, stripGloss, normCkb, normTr, isProse, isNoGloss } from './lib.mjs';

const args = process.argv.slice(2);
const all = args.includes('--all');
const [file, langArg, tfile] = args.filter((a) => !a.startsWith('--'));
if (!file || !langArg || !tfile) { console.error('usage: verify.mjs <extract-json> <tr|ckb> <translated-json> [--all]'); process.exit(2); }
const lang = checkLang(langArg);
const { rel, items } = loadExtract(file);
const trMap = new Map(JSON.parse(fs.readFileSync(tfile, 'utf8')).map((t) => [t.id, t.text]));

const norm = lang === 'ckb' ? normCkb : normTr;
const hits = scanGlossary(items, buildMatchers(loadGlossary(lang)));

// Find rendering in normalised translation; returns end index of the match or -1.
function find(rendering, policy, hay) {
  const r = norm(stripGloss(rendering)).trim();
  if (!r) return -1;
  if (policy === 'keep' || lang === 'ckb') {
    const i = hay.indexOf(r);
    return i < 0 ? -1 : i + r.length;
  }
  // tr: consecutive tokens, each token must start with the rendering word's stem
  const stem = (w) => (w.length >= 5 ? w.slice(0, -1) : w);
  const stems = r.replace(/'/g, '').split(/[^\p{L}\p{N}]+/u).filter(Boolean).map(stem);
  const toks = [...hay.matchAll(/[\p{L}\p{N}]+(?:'[\p{L}\p{N}]+)*/gu)].map((m) => ({ s: m[0].replace(/'/g, ''), end: m.index + m[0].length }));
  for (let i = 0; i + stems.length <= toks.length; i++) {
    if (stems.every((st, k) => toks[i + k].s.startsWith(st))) return toks[i + stems.length - 1].end;
  }
  return -1;
}

const misses = [], fmMisses = [];
let checks = 0;
const ids = items.map((i) => i.id);
for (const [entry, forms] of hits) {
  const fmSeen = new Set(); // first-mention handled per entry
  const acceptable = [...new Set([entry.text, ...[...forms.values()].map((f) => f.text)])];
  for (const [form, { text, ids: fids }] of forms) {
    for (const id of [...fids].sort((a, b) => a - b)) {
      checks++;
      const hay = norm(trMap.get(id) || '');
      const cands = [text, ...acceptable.filter((a) => a !== text)];
      if (!cands.some((c) => find(c, entry.policy, hay) >= 0)) {
        misses.push(`id ${id}: "${form}" => expected ${JSON.stringify(stripGloss(text))}`);
      }
    }
  }
  // first mention: parenthetical right after the first PROSE occurrence of any acceptable rendering
  // (not required when the term never occurs in prose).
  // Titles / meta / headings / list items / short lines (isNoGloss) must not carry the parenthetical.
  if (entry.policy === 'translate+en-first-mention') {
    const after = (id) => {
      const hay = norm(trMap.get(id) || '');
      let best = -1;
      for (const c of acceptable) { const e = find(c, entry.policy, hay); if (e >= 0 && (best < 0 || e < best)) best = e; }
      return best < 0 ? null : { hay, best };
    };
    const glossed = (r) => /^[\p{L}‌]{0,14}\s*[(（]/u.test(r.hay.slice(r.best));
    for (const it of items) {
      if (!isNoGloss(it)) continue;
      const r = after(it.id);
      if (r && glossed(r)) fmMisses.push(`id ${it.id}: no-gloss line (title/meta/heading/short) carries "(English)" gloss for "${entry.en}"`);
    }
    for (const it of items) {
      if (!isProse(it)) continue;
      const r = after(it.id);
      if (!r) continue;
      if (!glossed(r)) fmMisses.push(`id ${it.id}: first prose mention of "${entry.en}" lacks parenthetical (English/gloss)`);
      break;
    }
  }
}

const lim = (a) => (all ? a : a.slice(0, 25));
if (misses.length) { console.log('MISSES'); lim(misses).forEach((m) => console.log('  ' + m)); if (!all && misses.length > 25) console.log(`  ... +${misses.length - 25} more (--all)`); }
if (fmMisses.length) { console.log('FIRST-MENTION'); lim(fmMisses).forEach((m) => console.log('  ' + m)); }
console.log(`${rel} ${lang}: terms=${hits.size} checks=${checks} misses=${misses.length} first-mention=${fmMisses.length}`);
process.exit(misses.length || fmMisses.length ? 1 : 0);
