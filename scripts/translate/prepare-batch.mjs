#!/usr/bin/env node
// Generate translation jobs for every extract file in a list (one path per line, '#' comments ok).
// Usage: node scripts/translate/prepare-batch.mjs <list-file> <tr|ckb>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, checkLang } from './lib.mjs';

const [list, langArg] = process.argv.slice(2);
if (!list || !langArg) { console.error('usage: prepare-batch.mjs <list-file> <tr|ckb>'); process.exit(2); }
const lang = checkLang(langArg);
const files = fs.readFileSync(list, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const script = path.join(ROOT, 'scripts/translate/prepare-job.mjs');
let fail = 0;
for (const f of files) {
  try { process.stdout.write(execFileSync('node', [script, path.resolve(ROOT, f), lang], { encoding: 'utf8' })); }
  catch (e) { fail++; console.error(`FAILED ${f}: ${e.message.split('\n')[0]}`); }
}
console.log(`${files.length - fail}/${files.length} jobs written`);
process.exit(fail ? 1 : 0);
