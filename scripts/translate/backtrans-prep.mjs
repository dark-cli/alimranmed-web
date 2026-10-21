// Select glossary entries for blind back-translation (low/medium confidence +
// most frequent) and write inputs that contain no English.
import fs from "node:fs";

const TOP_FREQ = 300;
const terms = JSON.parse(fs.readFileSync(".translation/terms.json", "utf8"));
const freq = new Map(terms.map((t) => [t.en, t.freq]));

for (const lang of ["tr", "ckb"]) {
  const gloss = JSON.parse(fs.readFileSync(`docs/glossary-${lang}.json`, "utf8"));
  const top = new Set(
    [...gloss].sort((a, b) => (freq.get(b.en) ?? 0) - (freq.get(a.en) ?? 0)).slice(0, TOP_FREQ).map((e) => e.en),
  );
  const picked = gloss.filter((e) => e.policy !== "keep" && (top.has(e.en) || e.confidence === "low" || e.confidence === "medium"));
  const blind = picked.map((e, i) => ({ id: i + 1, category: e.category, text: e.text }));
  const key = picked.map((e, i) => ({ id: i + 1, en: e.en }));
  fs.writeFileSync(`.translation/backtrans/input-${lang}.json`, JSON.stringify(blind, null, 1));
  fs.writeFileSync(`.translation/backtrans/key-${lang}.json`, JSON.stringify(key, null, 1));
  console.log(lang, picked.length);
}
