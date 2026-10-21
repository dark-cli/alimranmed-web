#!/usr/bin/env node
// Run verify and/or rebuild over all 275 tr articles.
// Usage: node scripts/translate/run-all.mjs [verify|rebuild|both] [--lang tr] [--quiet]
// Translation source: .translation/out/sonnet/<lang>/<rel>.json for pilot articles, else .translation/out/<lang>/<rel>.json
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const mode = args.find((a) => ['verify', 'rebuild', 'both'].includes(a)) || 'both';
const li = args.indexOf('--lang'); const lang = li >= 0 ? args[li + 1] : 'tr';
const T = path.join(ROOT, '.translation');
const all = fs.readFileSync(path.join(T, 'all.txt'), 'utf8').split('\n').filter(Boolean);
const pilot = new Set(fs.readFileSync(path.join(T, 'pilot.txt'), 'utf8').split('\n').filter(Boolean));
const run = (script, a) => new Promise((res) => {
  const p = spawn('node', [path.join(ROOT, 'scripts/translate/' + script), ...a]); let out = '';
  p.stdout.on('data', (d) => (out += d)); p.stderr.on('data', (d) => (out += d));
  p.on('close', (code) => res({ code, out }));
});
const jobs = all.map((e) => {
  const rel = e.replace(/^.*?extract\//, '').replace(/\.json$/, '');
  const ex = path.join(T, 'extract', rel + '.json');
  const tr = path.join(T, 'out', ...(pilot.has(e) ? ['sonnet'] : []), lang, rel + '.json');
  return { rel, ex, tr };
});
const results = new Array(jobs.length);
let next = 0;
const CONC = 6;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (next < jobs.length) {
    const i = next++; const { rel, ex, tr } = jobs[i];
    const r = {};
    if (mode !== 'rebuild') r.v = await run(process.env.VF || 'verify.mjs', [ex, lang, tr, '--all']);
    if (mode !== 'verify') r.r = await run('rebuild.mjs', [ex, lang, tr, '--out', path.join(T, 'rebuilt')]);
    results[i] = r;
  }
}));
let vOk = 0, vBad = 0, rOk = 0, rBad = 0;
jobs.forEach(({ rel }, i) => {
  const r = results[i];
  if (r.v) { if (r.v.code === 0) vOk++; else { vBad++; console.log(`--- ${rel}\n${r.v.out}`); } }
  if (r.r) { if (r.r.code === 0) rOk++; else { rBad++; console.log(`REBUILD FAIL ${rel}\n${r.r.out}`); } }
});
console.log(`verify ok=${vOk} bad=${vBad}; rebuild ok=${rOk} bad=${rBad}`);
