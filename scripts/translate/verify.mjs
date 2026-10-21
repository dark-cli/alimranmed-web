#!/usr/bin/env node
// Step 6 of docs/translation-plan.md: glossary adherence check for one translated file.
// Usage: node scripts/translate/verify.mjs <extract-json> <tr|ckb> <translated-json> [--all]
// Exit 1 on any miss. Misses are listed per line id.
import fs from 'node:fs';
import { loadExtract, checkLang, loadGlossary, buildMatchers, scanGlossary, stripGloss, normCkb, normTr, isProse, isNoGloss } from './lib.mjs';

const args = process.argv.slice(2);
const all = args.includes('--all');
const si = args.indexOf('--suggest'); const suggestFile = si >= 0 ? args.splice(si, 2)[1] : null; // write machine-applicable fixes (json)
const edits = [];
const [file, langArg, tfile] = args.filter((a) => !a.startsWith('--'));
if (!file || !langArg || !tfile) { console.error('usage: verify.mjs <extract-json> <tr|ckb> <translated-json> [--all]'); process.exit(2); }
const lang = checkLang(langArg);
const { rel, items } = loadExtract(file);
const trMap = new Map(JSON.parse(fs.readFileSync(tfile, 'utf8')).map((t) => [t.id, t.text]));

const norm = lang === 'ckb' ? normCkb : normTr;
const hits = scanGlossary(items, buildMatchers(loadGlossary(lang)));

// ── Turkish stem-tolerant matching ───────────────────────────────────────
// Both sides are folded (lowercase, I/İ handled, dotless i -> i) and tokenised. A rendering word matches a
// hay token if the token starts with one of the word's stem variants (vowel drop beyin->beyn, softening
// felç->felc, plural removal) and the remainder is a plausible Turkish suffix chain. So "bağ" matches
// "bağı"/"bağlar" but not "bağışıklık"; term must still be present as whole word(s) in consecutive order.
const fold = (s) => normTr(s).replace(/ı/g, 'i');
const V = 'aeiouöü';
const SUFFIX = new RegExp('^(?:' + [
  'l[ae]r', 'n?[iuü]n', 's[iuü]', 'n[iuü]', 'y[iuü]', '[iuü]', 'y?[ae]', 'n[ae]', '[dt][ae]n?', '[dt][iuü]r?', 'nd[ae]n?',
  'l[iuü]', 'l[iuü]k', 's[iuü]z', 'sel', 'sal', 'c[iuü]', 'ç[iuü]', 'ki', 'ndeki', '[iuü]m', '[iuü]z', 'm[ae]', 'm[ae]k', 'm[ae]s[iuü]',
  'y[ae]n', '[iuü]r', '[ae]r', 'ik', 'uk', 'ük', 'k', 'm', 'n', 's', 'y', 'dir', 'tir', 'dur', 'tur', 'mi[sş]', 'ş', 'ce', 'ca', 'çe', 'ça',
  'l[ae]', 'yle', 'yla', 'ile', 'imiz', 'iniz', 'ler', 'lar',
].join('|') + ')*$');
function stems(w) {
  const out = new Set([w]);
  const base = [w];
  if (w.length > 5 && /l[ae]r$/.test(w)) { base.push(w.slice(0, -3)); }
  if (w.length > 5 && /m[ae][kğ]$/.test(w)) base.push(w.slice(0, -3));
  // rendering already carries a compound/possessive vowel (enjeksiyonu): accept the bare root too (enjeksiyonları)
  // rendering is itself an inflected form with a softened consonant (yırtığı -> yırtık, felci -> felç, kanadı -> kanat)
  for (const b of [...base]) {
    const m = b.match(/^(.*)(ğ|c|b|d|ng)([iuü])$/);
    if (m && b.length >= 4) base.push(m[1] + ({ ğ: 'k', c: 'ç', b: 'p', d: 't', ng: 'nk' }[m[2]]));
  }
  for (const b of [...base]) {
    if (b.length >= 4 && /[^aeıioöuü][iuü]$/.test(b)) base.push(b.slice(0, -1));
    if (b.length >= 6 && /s[iuü]$/.test(b)) base.push(b.slice(0, -2)); // ağrısı -> ağrı
  }
  for (const b of base) {
    out.add(b);
    const soft = b.replace(/nk$/, 'ng').replace(/[pçtk]$/, (c) => ({ p: 'b', ç: 'c', t: 'd', k: 'ğ' }[c]));
    out.add(soft);
    for (const x of [b, soft]) {
      const m = x.match(new RegExp(`^(.*[^${V}])([iuü])([^${V}]|ğ)$`));
      if (m && x.length >= 4) out.add(m[1] + m[3]);
    }
  }
  return [...out];
}
const tokenMatches = (word, tok) => stems(word).some((st) => tok.startsWith(st) && SUFFIX.test(tok.slice(st.length)));
const trTokens = (s) => [...s.matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)].map((m) => ({ s: m[0].replace(/['’]/g, ''), end: m.index + m[0].length }));

// Find rendering in the translation; returns end index of the match or -1.
function find(rendering, policy, hay) {
  const r = norm(stripGloss(rendering)).trim();
  if (!r) return -1;
  if (lang === 'ckb') {
    const i = hay.indexOf(r);
    return i < 0 ? -1 : i + r.length;
  }
  const words = trTokens(fold(r)).map((t) => t.s);
  if (!words.length) return -1;
  const toks = trTokens(fold(hay));
  for (let i = 0; i + words.length <= toks.length; i++) {
    if (words.every((w, k) => tokenMatches(w, toks[i + k].s))) return toks[i + words.length - 1].end;
  }
  // same words in a different order ("bombeleşmiş disk" for "disk bombeleşmesi"): every word present, all within a 6-token window
  if (words.length >= 2) {
    for (let i = 0; i < toks.length; i++) {
      const win = toks.slice(i, i + words.length + 3);
      if (words.every((w) => win.some((t) => tokenMatches(w, t.s)))) return Math.max(...words.map((w) => win.filter((t) => tokenMatches(w, t.s)).pop().end));
    }
  }
  return -1;
}
// fold() keeps string length except İ->i (same length), so indices in folded hay map 1:1 to hay.

const misses = [], fmMisses = [], reviewed = [];
// human-reviewed misses (synonyms / different constructions, see verify-reviewed-tr.json) are reported, not failed
const REVIEWED = (() => { try { return lang === 'tr' ? JSON.parse(fs.readFileSync(new URL('./verify-reviewed-tr.json', import.meta.url), 'utf8'))[rel] || {} : {}; } catch { return {}; } })();
let checks = 0;
const ids = items.map((i) => i.id);
for (const [entry, forms] of hits) {
  const fmSeen = new Set(); // first-mention handled per entry
  // renderings that apply in this article: only those of the forms actually found (a variant-rule form must not
  // drag in the base rendering, e.g. vulvar vs inner-ear "vestibule")
  const acceptable = [...new Set([...forms.values()].map((f) => f.text))];
  for (const [form, { text, ids: fids }] of forms) {
    for (const id of [...fids].sort((a, b) => a - b)) {
      checks++;
      const hay = norm(trMap.get(id) || '');
      const cands = [text, ...[entry.text, ...acceptable].filter((a) => a !== text)];
      if (!cands.some((c) => find(c, entry.policy, hay) >= 0)) {
        if ((REVIEWED[id] || []).includes(form)) reviewed.push(`id ${id}: "${form}"`);
        else misses.push(`id ${id}: "${form}" => expected ${JSON.stringify(stripGloss(text))}`);
      }
    }
  }
  // first mention: parenthetical right after the first PROSE occurrence of any acceptable rendering
  // (not required when the term never occurs in prose).
  // Titles / meta / headings / list items / short lines (isNoGloss) must not carry the parenthetical.
  // a variant rule with gloss "" (explicitly none) does not inherit the entry gloss
  const forGloss = [...forms.values()].filter((f) => f.gloss);
  if (entry.policy === 'translate+en-first-mention' || (forGloss.length && entry.policy !== 'keep')) {
    const after = (id, accept = acceptable) => {
      const hay = norm(trMap.get(id) || '');
      // ignore matches inside parentheses (they are glosses of other terms, e.g. "artrit (eklem iltihabı)")
      const open = hay.replace(/[(（][^)）]*[)）]/g, (m) => ' '.repeat(m.length));
      let best = -1;
      for (const c of accept) { const e = find(c, entry.policy, open); if (e >= 0 && (best < 0 || e < best)) best = e; }
      return best < 0 ? null : { hay, best };
    };
    // parenthetical right after the matched rendering; ignored when the English source line already has that parenthetical
    const parenAfter = (r) => { const m = r.hay.slice(r.best).match(/^\s*[(（]([^)）]*)[)）]/u); return m ? m[1].trim() : null; };
    const srcParens = (id) => [...(items.find((i) => i.id === id)?.text || '').matchAll(/[(（]([^)）]*)[)）]/g)].map((m) => normTr(m[1].trim()));
    // any parenthetical on the line that carries the English term or the gloss counts as the first-mention gloss
    const wants = [entry.en, ...forGloss.map((f) => f.gloss)].map((x) => normTr(x).trim()).filter(Boolean);
    const glossAnywhere = (hay) => [...hay.matchAll(/[(（]([^)）]*)[)）]/g)].some((m) => wants.some((w) => m[1].includes(w) || (m[1].length > 2 && w.includes(m[1].trim()))));
    const glossed = (r) => parenAfter(r) !== null || glossAnywhere(r.hay);
    const nParen = (s) => (s.match(/[(（]/g) || []).length;
    // unwanted: a parenthetical right after the term that is neither in the source nor covered by the source's own parentheticals
    const unwanted = (r, id) => { const p = parenAfter(r); return p !== null && !srcParens(id).includes(p) && nParen(r.hay) > nParen(items.find((i) => i.id === id)?.text || ''); };
    const hitIds = new Set([...forms.values()].flatMap((f) => [...f.ids]));
    for (const it of items) {
      if (!hitIds.has(it.id) || !isNoGloss(it)) continue;
      const r = after(it.id);
      if (r && unwanted(r, it.id)) edits.push({ id: it.id, kind: 'remove-paren', start: r.best, end: r.best + r.hay.slice(r.best).match(/^\s*[(（][^)）]*[)）]/u)[0].length, term: entry.en });
      if (r && unwanted(r, it.id)) fmMisses.push(`id ${it.id}: no-gloss line (title/meta/heading/short) carries "(English)" gloss for "${entry.en}"`);
    }
    for (const it of items) {
      if (!hitIds.has(it.id) || !isProse(it)) continue;
      // only the forms found on THIS line decide whether a gloss is due (a variant whose gloss repeats its rendering needs none)
      const lineForms = [...forms.values()].filter((f) => f.ids.has(it.id));
      const lineGloss = lineForms.find((f) => f.gloss);
      const r = after(it.id, [...new Set(lineForms.map((f) => f.text))]);
      if (!r) continue;
      if (entry.policy !== 'translate+en-first-mention' && !lineGloss) break;
      if (!glossed(r)) {
        const g = lineGloss?.gloss, en = entry.policy === 'translate+en-first-mention';
        edits.push({ id: it.id, kind: 'insert-gloss', start: r.best, end: r.best, insert: ` (${g && en ? `${g} / ${entry.en}` : g || entry.en})`, term: entry.en });
      }
      if (!glossed(r)) fmMisses.push(`id ${it.id}: first prose mention of "${entry.en}" lacks parenthetical (English/gloss)`);
      break;
    }
  }
}

if (suggestFile) fs.writeFileSync(suggestFile, JSON.stringify(edits));
const lim = (a) => (all ? a : a.slice(0, 25));
if (misses.length) { console.log('MISSES'); lim(misses).forEach((m) => console.log('  ' + m)); if (!all && misses.length > 25) console.log(`  ... +${misses.length - 25} more (--all)`); }
if (fmMisses.length) { console.log('FIRST-MENTION'); lim(fmMisses).forEach((m) => console.log('  ' + m)); }
console.log(`${rel} ${lang}: terms=${hits.size} checks=${checks} misses=${misses.length} first-mention=${fmMisses.length} reviewed-ok=${reviewed.length}`);
process.exit(misses.length || fmMisses.length ? 1 : 0);
