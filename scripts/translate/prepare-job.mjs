#!/usr/bin/env node
// Step 5 of docs/translation-plan.md: build a self-contained translator prompt for one file.
// Usage: node scripts/translate/prepare-job.mjs <extract-json> <tr|ckb>
// Output: .translation/jobs/<lang>/<rel>.md   (prints "<rel> <lang> matched=N chars=N")
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadExtract, checkLang, loadGlossary, buildMatchers, scanGlossary, stripGloss, hasGloss } from './lib.mjs';

const [file, langArg] = process.argv.slice(2);
if (!file || !langArg) { console.error('usage: prepare-job.mjs <extract-json> <tr|ckb>'); process.exit(2); }
const lang = checkLang(langArg);
const { rel, items } = loadExtract(file);

const LANG = {
  tr: 'Turkish (Latin script) for patients in Turkey',
  ckb: 'Sorani Central Kurdish in Arabic script (standard KRG orthography: ک ی ە, never ك ي ة; use ڕ ڵ ۆ ێ ڤ) for patients in Iraqi Kurdistan',
};

const glossary = loadGlossary(lang);
const hits = scanGlossary(items, buildMatchers(glossary));

const q = (s) => JSON.stringify(s);
const lines = [];
for (const [entry, forms] of [...hits].sort((a, b) => a[0].en.localeCompare(b[0].en))) {
  // group forms by rendering text
  const byText = new Map();
  for (const [form, { text }] of forms) {
    if (!byText.has(text)) byText.set(text, []);
    byText.get(text).push(form);
  }
  for (const [text, fs_] of byText) {
    const src = fs_.map(q).join(' / ');
    let rule;
    if (entry.policy === 'keep') rule = `KEEP verbatim: ${q(text)}`;
    else {
      const gloss = hasGloss(text);
      const later = stripGloss(text);
      if (gloss && entry.policy === 'translate+en-first-mention') rule = `first mention: ${q(text)}; later: ${q(later)}`;
      else if (gloss) rule = `first mention: ${q(text)}; later: ${q(later)}`;
      else if (entry.policy === 'translate+en-first-mention') rule = `${q(text)}  [first mention: add the English term in parentheses]`;
      else rule = q(text);
    }
    const other = lang === 'tr' ? /^(ckb|ku|ar)\b/i : /^(tr|turkish)\b/i;
    const note = entry.note && !other.test(entry.note) && !/reviewer|patients say/i.test(entry.note) ? `  -- ${entry.note.slice(0, 110)}` : '';
    lines.push(`- ${src} => ${rule}${note}`);
  }
}

const prompt = `# Translation job: ${rel} -> ${lang}

You are a professional medical translator. Translate the numbered English lines below into ${LANG[lang]}.
Register: clear, warm, patient-friendly medical writing; natural for a clinic website, not word-for-word.

## Rules
- Keep every \`{{n}}\` placeholder exactly as written (same number, same count). Do not translate, reorder-away or drop them.
- Translate every line; keep each line's id. Do not add, omit, merge, split or explain anything. Lines are independent but belong to one document: stay consistent.
- Keep numbers, units, drug and brand names, URLs and e-mail addresses as in the source (apply a glossary entry when one exists).
- Output ONLY a JSON array \`[{"id": 1, "text": "..."}, ...]\` with one object per input line, no commentary, no code fence.
- If you meet a medical term you cannot render with confidence and it is not in the glossary, write \`[[TERM:english term]]\` in its place instead of guessing.

## Glossary (${hits.size} terms occur in this document)
Apply each rendering with correct grammar (case suffixes, plurals, ezafe, definiteness and word order are fine to adapt). Entries are matched case-insensitively and plural-tolerant.
- "KEEP verbatim": write the text exactly as given.
- "[first mention: add the English term in parentheses]": the FIRST time the term appears in this document write the rendering followed by the English term in parentheses, e.g. X (English term). Every later mention: the rendering alone.
- "first mention: A; later: B" (the rendering carries its own parenthetical gloss): use A the first time, B afterwards; add no further English parenthesis.
- Where a specific surface form is listed on its own line, that line overrides the base term for that form.
${lines.length ? lines.join('\n') : '(no glossary terms in this document)'}

## Lines to translate (${items.length})
${items.map((i) => `${i.id}: ${i.text}`).join('\n')}
`;

const out = path.join(ROOT, '.translation/jobs', lang, rel + '.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, prompt);
console.log(`${rel} ${lang} matched=${hits.size} chars=${prompt.length}`);
