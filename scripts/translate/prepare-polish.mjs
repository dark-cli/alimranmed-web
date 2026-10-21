#!/usr/bin/env node
// Polish pass: build a self-contained native-fluency editor prompt for one translated file.
// Usage: node scripts/translate/prepare-polish.mjs <extract-json> <tr|ckb> <draft-json>
// Output: .translation/polish-jobs/<lang>/<rel>.md
// The editor's output ([{id,text}] plus optional meaning_fix) feeds rebuild.mjs/verify.mjs unchanged.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadExtract, checkLang, LANG, glossarySection, noGlossIds, compactIds, NOGLOSS_MAX_CHARS, CKB_RULES } from './lib.mjs';

const [file, langArg, draftFile] = process.argv.slice(2);
if (!file || !langArg || !draftFile) { console.error('usage: prepare-polish.mjs <extract-json> <tr|ckb> <draft-json>'); process.exit(2); }
const lang = checkLang(langArg);
const { rel, items } = loadExtract(file);
const draft = new Map(JSON.parse(fs.readFileSync(draftFile, 'utf8')).map((t) => [t.id, t.text]));
const missing = items.filter((i) => !draft.has(i.id)).map((i) => i.id);
if (missing.length) { console.error(`draft is missing ids: ${missing.join(', ')}`); process.exit(1); }

const gloss = glossarySection(items, lang);
const native = lang === 'ckb' ? 'Sorani Kurdish' : 'Turkish';
const orth = lang === 'ckb' ? ' Use standard KRG orthography (ک ی ە, never ك ي ة; ڕ ڵ ۆ ێ ڤ) and everyday Kurdistan-clinic wording rather than calques from English or Arabic.' : '';

const prompt = `# Polish job: ${rel} -> ${lang}

You are a native ${native} medical writer and editor. Below are English source lines and a draft translation into ${LANG[lang]}.
Rewrite each draft line so it reads like text originally written by a native ${native} medical writer for patients: natural word order, idiomatic phrasing, correct grammar and orthography, warm and clear register.${orth}

## Rules
- Do NOT change meaning, add or remove content, merge or split lines. The English source is the authority: if the draft mistranslates it (wrong fact, reversed meaning, wrong body part or drug, omission, addition), fix it.
- Keep every \`{{n}}\` placeholder exactly as written (same number, same count). Keep numbers, units, drug and brand names, URLs and e-mail addresses.
- Do not deviate from the glossary renderings and policies below (grammatical inflection is fine). Where the draft already follows the glossary, keep that term.
- No-gloss lines (ids ${compactIds(noGlossIds(items))}: titles, meta, headings, labels, tags, list items and short lines under ${NOGLOSS_MAX_CHARS} characters) must have NO "(English)" parenthetical. The first-mention gloss belongs on the first occurrence in a prose paragraph only; never add glosses elsewhere.
- Lines that are citations or proper names only: leave unchanged.
- If a draft line is already good, return it unchanged.
- Output ONLY a JSON array \`[{"id": 1, "text": "..."}, ...]\` with one object per line, every id present, no commentary, no code fence.
- For a line you changed for MEANING reasons (not just style), add a field: \`{"id": 7, "text": "...", "meaning_fix": "short note on what was wrong"}\`. Omit the field otherwise.
${lang === 'ckb' ? '\n' + CKB_RULES.replace('## Sorani rules', '## Sorani rules (fix the draft where it breaks them)') : ''}
${gloss.text}
## Lines (${items.length}): id, English source, draft
${items.map((i) => `### ${i.id}\nEN: ${i.text}\nDRAFT: ${draft.get(i.id)}`).join('\n\n')}
`;

const out = path.join(ROOT, '.translation/polish-jobs', lang, rel + '.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, prompt);
console.log(`${rel} ${lang} polish matched=${gloss.count} chars=${prompt.length}`);
