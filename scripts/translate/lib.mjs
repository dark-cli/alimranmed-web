// Shared extraction logic (used by extract.mjs, rebuild.mjs, verify.mjs).
import yaml from 'js-yaml';

// Keys whose string value is human-readable text.
const TEXT_KEYS = new Set([
  'title', 'description', 'imageAlt', 'photoAlt', 'heading', 'eyebrow', 'body',
  'intro', 'note', 'label', 'value', 'subtitle', 'text', 'attribution',
  'caption', 'alt', 'question', 'answer', 'name', 'leadLabel', 'avatarAlt',
  'linkLabel', 'sublabel', 'specialty',
]);
// String arrays that are text: items (except cards = URL paths), titles, languages.
const TEXT_ARRAYS = new Set(['items', 'titles', 'languages']);

export function split(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  return { fm: yaml.load(m[1]) || {}, body: m[2] };
}

// ── placeholder protection ───────────────────────────────────────────────
export function protect(s) {
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
export const LIST_RE = /^(\s*(?:[-*+]|\d+[.)])\s+)(.*)$/;
// Blocks: [{ blk, list, units: [{key, prefix, raw}] }]; skipped blocks (code, table, hr) have units: [].
export function mdBlocks(str) {
  const blocks = str.split(/\n{2,}/).map((b) => b.replace(/^\n+|\n+$/g, '')).filter((b) => b.trim() !== '');
  return blocks.map((blk, bi) => {
    const lines = blk.split('\n');
    if (/^\s*(```|~~~)/.test(blk) || /^\|/.test(blk) || /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(blk)) return { blk, list: false, units: [] }; // code, table, hr: skip
    if (LIST_RE.test(lines[0])) {
      const items = [];
      for (const l of lines) {
        const m = l.match(LIST_RE);
        if (m) items.push({ prefix: m[1], raw: m[2] });
        else items[items.length - 1].raw += ' ' + l.trim();
      }
      return { blk, list: true, units: items.map((it, ii) => ({ key: `${bi}.${ii}`, prefix: it.prefix, raw: it.raw })) };
    }
    const h = blk.match(/^(#{1,6}\s+)([\s\S]*)$/);
    if (h) return { blk, list: false, units: [{ key: `${bi}`, prefix: h[1], raw: h[2].replace(/\s*\n\s*/g, ' ') }] };
    const q = blk.match(/^(>\s?)/);
    if (q) return { blk, list: false, units: [{ key: `${bi}`, prefix: q[1], raw: lines.map((l) => l.replace(/^>\s?/, '')).join(' ') }] };
    return { blk, list: false, units: [{ key: `${bi}`, prefix: '', raw: lines.map((l) => l.trim()).join(' ') }] };
  });
}
export const mdUnits = (str) => mdBlocks(str).flatMap((b) => b.units);

export const hasLetters = (s) => /\p{L}{2,}/u.test(s.replace(/\{\{\d+\}\}/g, ''));

// Collect raw (pre-placeholder) units: Map path -> {prefix, raw}
export function collect(fm, body) {
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


// ── paths / rel names ────────────────────────────────────────────────────
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const EXTRACT_DIR = path.join(ROOT, '.translation/extract');

/** extract json path -> rel name ("treatments/back-pain"), plus the item list. */
export function loadExtract(file) {
  const abs = path.resolve(file);
  const rel = path.relative(EXTRACT_DIR, abs).replace(/\.json$/, '');
  if (rel.startsWith('..')) throw new Error(`not inside .translation/extract: ${file}`);
  return { abs, rel, items: JSON.parse(fs.readFileSync(abs, 'utf8')) };
}
export const srcFileFor = (rel) => path.join(ROOT, 'src/content', rel === 'index' ? '' : rel, 'en.md');

export function checkLang(lang) {
  if (lang !== 'tr' && lang !== 'ckb') throw new Error(`lang must be tr or ckb, got "${lang}"`);
  return lang;
}

// ── glossary ─────────────────────────────────────────────────────────────
export function loadGlossary(lang) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, `docs/glossary-${lang}.json`), 'utf8'));
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isAcronym = (f) => f.length <= 6 && /^[A-Z0-9][A-Z0-9+\-./]*$/.test(f) && /[A-Z]{2}/.test(f);

function formRegex(form) {
  const words = form.replace(/[’‘]/g, "'").split(/[\s‐-―-]+/).filter(Boolean);
  const last = words.length - 1;
  const parts = words.map((w, i) => {
    let e = esc(w);
    if (i === last && !isAcronym(form) && /[A-Za-z]$/.test(w)) {
      if (/[^aeiou]y$/i.test(w)) e = esc(w.slice(0, -1)) + '(?:y|ies)';
      else if (/(s|x|z|ch|sh)$/i.test(w)) e += '(?:es)?';
      else e += '(?:s)?';
    }
    return e;
  });
  return new RegExp(`(?<![\\p{L}\\p{N}])${parts.join('[\\s\\u2010-\\u2015-]+')}(?![\\p{L}\\p{N}])`, isAcronym(form) ? 'gu' : 'giu');
}

/** All (entry, form) matchers, longest form first. */
export function buildMatchers(glossary) {
  const out = [];
  for (const entry of glossary) {
    const forms = [entry.en, ...(entry.variants || [])];
    for (const form of new Set(forms)) {
      if (!form || form.length < 2) continue;
      const rule = (entry.variant_rules || []).find((r) => r.variant.toLowerCase() === form.toLowerCase());
      out.push({ entry, form, text: rule ? rule.text : entry.text, re: formRegex(form) });
    }
  }
  return out.sort((a, b) => b.form.length - a.form.length);
}

/**
 * Longest-match-first scan over items [{id, text}].
 * Returns Map<entry, Map<form, {text, ids:Set}>>.
 */
export function scanGlossary(items, matchers) {
  const masked = new Map(items.map((i) => [i.id, i.text.replace(/[’‘]/g, "'").replace(/\{\{\d+\}\}/g, (m) => ' '.repeat(m.length))]));
  const hits = new Map();
  for (const m of matchers) {
    for (const [id, t] of masked) {
      m.re.lastIndex = 0;
      let mm, cur = t;
      const spans = [];
      while ((mm = m.re.exec(t))) { spans.push([mm.index, mm[0].length]); if (!mm[0].length) m.re.lastIndex++; }
      if (!spans.length) continue;
      for (const [i, l] of spans) cur = cur.slice(0, i) + ' '.repeat(l) + cur.slice(i + l);
      masked.set(id, cur);
      if (!hits.has(m.entry)) hits.set(m.entry, new Map());
      const fm = hits.get(m.entry);
      if (!fm.has(m.form)) fm.set(m.form, { text: m.text, ids: new Set() });
      fm.get(m.form).ids.add(id);
    }
  }
  return hits;
}

/** Remove parenthetical gloss from a rendering. */
export const stripGloss = (s) => s.replace(/\s*[(（][^)）]*[)）]/g, '').replace(/\s{2,}/g, ' ').trim();
export const hasGloss = (s) => /[(（][^)）]*[)）]/.test(s);

// ── text normalisation for verification ──────────────────────────────────
export function normCkb(s) {
  return s
    .replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/[ةھ]/g, 'ە').replace(/ۀ/g, 'ە')
    .replace(/[ً-ٰٟـ‌‍‎‏]/g, '')
    .replace(/\s+/g, ' ').toLowerCase();
}
export const normTr = (s) => s.replace(/İ/g, 'i').replace(/I/g, 'ı').toLowerCase().replace(/[’‘ʼ`´]/g, "'");

// ── line classification (first-mention placement, citation lines) ────────
const NONPROSE_LEAF = new Set(['title', 'description', 'heading', 'label', 'value', 'alt', 'subtitle', 'eyebrow', 'attribution', 'specialty', 'photoAlt']);
const wc = (s) => s.replace(/\{\{\d+\}\}/g, ' ').split(/\s+/).filter(Boolean).length;
/** title / meta description / SEO strings: path is the top-level `title` or `description`. */
export const isTitleMeta = (it) => it.path === 'title' || it.path === 'description';
/** Section/body prose where the first-mention "(English)" gloss belongs. */
export function isProse(it) {
  if (isTitleMeta(it)) return false;
  const leaf = it.path.split('.').pop();
  if (NONPROSE_LEAF.has(leaf)) return false;
  return wc(it.text) >= 6;
}
/** Source line that is a citation / proper names / acronyms only: nothing to translate into Arabic script. */
export function isNonTranslatable(srcText) {
  const t = srcText.replace(/\{\{\d+\}\}/g, ' ');
  if (/\b(Vol\.|No\.|pp\.|ISSN|ISBN|doi:?|et al\.)/i.test(t)) return true;
  const words = t.match(/[A-Za-z][A-Za-z.'-]*/g) || [];
  // no ordinary lowercase English words (>=4 letters, not capitalised) => names/acronyms only
  return !words.some((w) => /^[a-z]{4,}$/.test(w));
}
