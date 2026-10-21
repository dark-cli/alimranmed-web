// Join the blind back-translation results with the English key and the current
// glossary, for adjudication of meaning mismatches.
// Usage: node scripts/translate/backtrans-compare.mjs
// Inputs : .translation/backtrans/{input,key,back}-{lang}.json, docs/glossary-{lang}.json
// Output : .translation/backtrans/compare-{lang}.json
//   {id, en, category, shown, current, back, natural, comment?, policy, confidence,
//    exact (back == en after normalising), changed (glossary text differs from what was shown)}
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const DIR = path.join(ROOT, '.translation/backtrans');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const norm = (s) => String(s || '').toLowerCase().replace(/[()\-–,.'’/]/g, ' ').replace(/\b(the|a|an|of)\b/g, ' ')
  .replace(/s\b/g, '').replace(/\s+/g, ' ').trim();

for (const lang of ['tr', 'ckb']) {
  const input = new Map(read(path.join(DIR, `input-${lang}.json`)).map((r) => [r.id, r]));
  const back = new Map(read(path.join(DIR, `back-${lang}.json`)).map((r) => [r.id, r]));
  const gloss = new Map(read(path.join(ROOT, `docs/glossary-${lang}.json`)).map((e) => [e.en, e]));
  const rows = read(path.join(DIR, `key-${lang}.json`)).map(({ id, en }) => {
    const i = input.get(id), b = back.get(id) || {}, g = gloss.get(en) || {};
    const row = { id, en, category: i?.category, shown: i?.text, current: g.text, back: b.back, natural: b.natural };
    if (b.comment) row.comment = b.comment;
    Object.assign(row, { policy: g.policy, confidence: g.confidence, exact: norm(b.back) === norm(en), changed: g.text !== i?.text });
    return row;
  });
  fs.writeFileSync(path.join(DIR, `compare-${lang}.json`), JSON.stringify(rows, null, 1) + '\n');
  const c = (f) => rows.filter(f).length;
  console.log(lang, JSON.stringify({ rows: rows.length, notYes: c((r) => r.natural !== 'yes'), inexact: c((r) => !r.exact), changed: c((r) => r.changed), missingBack: c((r) => !r.back) }));
}
