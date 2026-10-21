#!/usr/bin/env node
// Send a job/polish prompt to a Gemini model and write the JSON answer.
// Usage: node scripts/translate/gemini-run.mjs --model <model> --in <prompt.md> --out <file.json> [--text]
// Key: GEMINI_API_KEY from the project .env. Output: pretty-printed JSON array (same format as other .translation/out files).
// Token usage per call is appended to .translation/gemini-usage.log (jsonl).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : null; };
const model = opt('model'), inFile = opt('in'), outFile = opt('out');
const asText = args.includes('--text'); // expected output is not JSON
if (!model || !inFile || !outFile) { console.error('usage: gemini-run.mjs --model <model> --in <prompt> --out <file> [--text]'); process.exit(2); }

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const env = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?GEMINI_API_KEY\s*=\s*(.*)$/);
    if (m) return m[1].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  throw new Error('GEMINI_API_KEY not found in .env');
}
const key = loadKey();
const prompt = fs.readFileSync(inFile, 'utf8');
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: asText ? {} : { responseMimeType: 'application/json' } };

let res, data, lastErr;
for (let attempt = 0; attempt < 6; attempt++) {
  if (attempt) await new Promise((r) => setTimeout(r, Math.min(60000, 2000 * 2 ** attempt)));
  try {
    res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body) });
    const raw = await res.text();
    if (res.status === 429 || res.status >= 500) { lastErr = `HTTP ${res.status} ${raw.slice(0, 200)}`; console.error(`retry ${attempt + 1}: ${lastErr}`); continue; }
    if (!res.ok) { console.error(`HTTP ${res.status} ${raw.slice(0, 500)}`); process.exit(1); }
    data = JSON.parse(raw);
    if (!data.candidates?.[0]?.content?.parts?.length) { lastErr = 'empty candidate ' + raw.slice(0, 300); console.error(`retry ${attempt + 1}: ${lastErr}`); continue; }
    break;
  } catch (e) { lastErr = e.message; console.error(`retry ${attempt + 1}: ${lastErr}`); }
}
if (!data) { console.error('failed: ' + lastErr); process.exit(1); }

const u = data.usageMetadata || {};
fs.appendFileSync(path.join(ROOT, '.translation/gemini-usage.log'), JSON.stringify({ t: new Date().toISOString(), model, in: inFile, out: outFile, prompt: u.promptTokenCount, candidates: u.candidatesTokenCount, thoughts: u.thoughtsTokenCount, total: u.totalTokenCount, finish: data.candidates[0].finishReason }) + '\n');

let text = data.candidates[0].content.parts.filter((p) => !p.thought && typeof p.text === 'string').map((p) => p.text).join('');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
if (asText) { fs.writeFileSync(outFile, text); console.log(`${outFile} text chars=${text.length} tokens=${u.totalTokenCount}`); process.exit(0); }
text = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
let json;
try { json = JSON.parse(text); } catch (e) { fs.writeFileSync(outFile + '.raw', text); console.error(`JSON parse failed (${e.message}); raw saved to ${outFile}.raw`); process.exit(1); }
fs.writeFileSync(outFile, JSON.stringify(json, null, 1) + '\n');
console.log(`${outFile} items=${Array.isArray(json) ? json.length : '?'} tokens=${u.totalTokenCount} finish=${data.candidates[0].finishReason}`);
