#!/usr/bin/env node
// Independent patient-safety check of finished translations with a Gemini model.
// Per file, sends the English lines + translated lines and asks ONLY for critical/major meaning errors
// (could mislead a patient about diagnosis, treatment, dose, risk, timeline). Answer: JSON [{id, severity, issue}].
// Usage: node scripts/translate/gemini-check.mjs [--lang ckb] [--model gemini-pro-latest] [-j 4] [--force] [rel ...]
//   no rel = every file in .translation/extract. Results: .translation/gemini-check/<lang>/<rel>.json
//   (existing results are skipped unless --force). Summary of all flags: .translation/gemini-check/<lang>.flags.json
// Key: GEMINI_API_KEY from the environment / project .env. Token usage appended to .translation/gemini-usage.log.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, EXTRACT_DIR, loadGeminiKey } from './lib.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.findIndex((a) => a === '--' + n || a === '-' + n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const lang = opt('lang', 'ckb');
const model = opt('model', 'gemini-pro-latest');
const conc = Number(opt('j', 4));
const force = args.includes('--force');
const rels0 = args.filter((a) => !a.startsWith('--'));
const LANGNAME = { ckb: 'Sorani Central Kurdish (Arabic script)', tr: 'Turkish' }[lang];
if (!LANGNAME) { console.error('lang must be ckb or tr'); process.exit(2); }
const OUT = path.join(ROOT, '.translation/gemini-check', lang);
const key = loadGeminiKey();
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.json') ? [path.join(d, e.name)] : []));
const rels = rels0.length ? rels0 : walk(EXTRACT_DIR).map((f) => path.relative(EXTRACT_DIR, f).replace(/\.json$/, '')).sort();

function prompt(rel, en, tr) {
  const lines = en.map((it) => `[${it.id}]\nEN: ${it.text}\n${lang.toUpperCase()}: ${tr.get(it.id) ?? '(missing)'}`).join('\n\n');
  return `You are a bilingual medical reviewer (English / ${LANGNAME}) doing a final patient-safety check of a medical clinic website page ("${rel}").
Each numbered line has the English source and its ${LANGNAME} translation. Placeholders like {{0}} stand for links/URLs and are not errors.

Report ONLY real meaning errors in the translation, at two levels:
- "critical": could mislead a patient about a diagnosis, treatment, procedure, drug or dose, risk/safety/side effect, contraindication, or timeline/number (e.g. negation flipped, wrong body part or side, wrong number/unit/duration, a risk stated as safe, a symptom/condition replaced by a different one).
- "major": a clear meaning error that changes what the sentence says (wrong term, omitted or added clause/condition, wrong subject), but is less likely to cause harm.

Do NOT report: style, word choice, fluency, register, spelling, punctuation, digit style (Eastern vs Western digits are equivalent), transliteration choices, kept English acronyms/brands, glosses in parentheses that explain a term, or problems that already exist in the English source (if the English is garbled, only flag when the translation says something clearly different from any plausible reading). When unsure, do not report.

Answer with a JSON array (empty [] if nothing): [{"id": <line id>, "severity": "critical"|"major", "issue": "<one short English sentence: what the translation says vs what the English says>"}]

${lines}
`;
}

const schema = { type: 'ARRAY', items: { type: 'OBJECT', properties: { id: { type: 'INTEGER' }, severity: { type: 'STRING', enum: ['critical', 'major'] }, issue: { type: 'STRING' } }, required: ['id', 'severity', 'issue'] } };

async function call(text, tag) {
  const body = { contents: [{ role: 'user', parts: [{ text }] }], generationConfig: { responseMimeType: 'application/json', responseSchema: schema } };
  let lastErr;
  for (let attempt = 0; attempt < 8; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, Math.min(90000, 3000 * 2 ** attempt) * (0.75 + Math.random() / 2)));
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body) });
      const raw = await res.text();
      if (res.status === 429 || res.status >= 500) { lastErr = `HTTP ${res.status} ${raw.slice(0, 150)}`; console.error(`${tag} retry ${attempt + 1}: ${lastErr}`); continue; }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${raw.slice(0, 300)}`);
      const data = JSON.parse(raw);
      const parts = data.candidates?.[0]?.content?.parts;
      if (!parts?.length) { lastErr = 'empty candidate ' + raw.slice(0, 200); console.error(`${tag} retry ${attempt + 1}: ${lastErr}`); continue; }
      const u = data.usageMetadata || {};
      fs.appendFileSync(path.join(ROOT, '.translation/gemini-usage.log'), JSON.stringify({ t: new Date().toISOString(), model, in: `gemini-check:${lang}:${tag}`, prompt: u.promptTokenCount, candidates: u.candidatesTokenCount, thoughts: u.thoughtsTokenCount, total: u.totalTokenCount, finish: data.candidates[0].finishReason }) + '\n');
      const out = parts.filter((p) => !p.thought && typeof p.text === 'string').map((p) => p.text).join('').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      try { return JSON.parse(out); } catch (e) { lastErr = `bad JSON (${e.message})`; console.error(`${tag} retry ${attempt + 1}: ${lastErr}`); continue; }
    } catch (e) { lastErr = e.message; if (/HTTP 4\d\d/.test(e.message)) break; console.error(`${tag} retry ${attempt + 1}: ${lastErr}`); }
  }
  throw new Error(lastErr);
}

async function checkOne(rel) {
  const outFile = path.join(OUT, rel + '.json');
  if (!force && fs.existsSync(outFile)) return 'skip';
  const en = JSON.parse(fs.readFileSync(path.join(EXTRACT_DIR, rel + '.json'), 'utf8'));
  const tr = new Map(JSON.parse(fs.readFileSync(path.join(ROOT, '.translation/out', lang, rel + '.json'), 'utf8')).map((t) => [t.id, t.text]));
  const ids = new Set(en.map((i) => i.id));
  const flags = (await call(prompt(rel, en, tr), rel)).filter((f) => ids.has(f.id));
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(flags, null, 1) + '\n');
  return flags.length;
}

let next = 0, done = 0, failed = [];
async function worker() {
  while (next < rels.length) {
    const rel = rels[next++];
    try { const r = await checkOne(rel); done++; if (r !== 'skip') console.log(`[${done}/${rels.length}] ${rel} flags=${r}`); }
    catch (e) { failed.push(rel); console.error(`FAILED ${rel}: ${e.message}`); }
  }
}
await Promise.all(Array.from({ length: Math.min(conc, rels.length) }, worker));

// summary over every result file present
const all = [];
for (const f of fs.existsSync(OUT) ? walk(OUT) : []) {
  const rel = path.relative(OUT, f).replace(/\.json$/, '');
  for (const x of JSON.parse(fs.readFileSync(f, 'utf8'))) all.push({ rel, ...x });
}
fs.writeFileSync(path.join(ROOT, '.translation/gemini-check', `${lang}.flags.json`), JSON.stringify(all, null, 1) + '\n');
console.log(`files=${rels.length} failed=${failed.length} flags=${all.length} (critical=${all.filter((x) => x.severity === 'critical').length})${failed.length ? ' FAILED: ' + failed.join(' ') : ''}`);
process.exit(failed.length ? 1 : 0);
