#!/usr/bin/env node
// Step 5 of docs/translation-plan.md: build a self-contained translator prompt for one file.
// Usage: node scripts/translate/prepare-job.mjs <extract-json> <tr|ckb>
// Output: .translation/jobs/<lang>/<rel>.md   (prints "<rel> <lang> matched=N chars=N")
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadExtract, checkLang, LANG, glossarySection } from './lib.mjs';

const [file, langArg] = process.argv.slice(2);
if (!file || !langArg) { console.error('usage: prepare-job.mjs <extract-json> <tr|ckb>'); process.exit(2); }
const lang = checkLang(langArg);
const { rel, items } = loadExtract(file);

const gloss = glossarySection(items, lang);

const prompt = `# Translation job: ${rel} -> ${lang}

You are a professional medical translator. Translate the numbered English lines below into ${LANG[lang]}.
Register: clear, warm, patient-friendly medical writing; natural for a clinic website, not word-for-word.

## Rules
- Keep every \`{{n}}\` placeholder exactly as written (same number, same count). Do not translate, reorder-away or drop them.
- Translate every line; keep each line's id. Do not add, omit, merge, split or explain anything. Lines are independent but belong to one document: stay consistent.
- Lines that are citations, references, or proper names only: copy them unchanged. Never add content.
- Keep numbers, units, drug and brand names, URLs and e-mail addresses as in the source (apply a glossary entry when one exists).
- Output ONLY a JSON array \`[{"id": 1, "text": "..."}, ...]\` with one object per input line, no commentary, no code fence.
- If you meet a medical term you cannot render with confidence and it is not in the glossary, write \`[[TERM:english term]]\` in its place instead of guessing.

${gloss.text}
## Lines to translate (${items.length})
${items.map((i) => `${i.id}: ${i.text}`).join('\n')}
`;

const out = path.join(ROOT, '.translation/jobs', lang, rel + '.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, prompt);
console.log(`${rel} ${lang} matched=${gloss.count} chars=${prompt.length}`);
