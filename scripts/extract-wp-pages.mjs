/**
 * Reads a WordPress SQL dump and extracts published pages + custom post types.
 * Outputs TSV: post_type \t post_name \t post_title \t post_parent_id
 */
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const [, , sqlFile, prefix] = process.argv;
if (!sqlFile || !prefix) { console.error('Usage: extract-wp-pages.mjs <dump.sql> <prefix_>'); process.exit(1); }

const TABLE = `\`${prefix}posts\``;
const SKIP = new Set(['revision','attachment','nav_menu_item','custom_css','customize_changeset',
  'oembed_cache','wp_block','wp_navigation','flamingo_inbound','flamingo_contact',
  'amp_validated_url','nf_sub','scheduled-action','monsterinsights_note']);

function parseRow(s) {
  const vals = []; let i = 0;
  while (i < s.length) {
    while (i < s.length && (s[i]===' '||s[i]==='\t')) i++;
    if (i >= s.length) break;
    if (s[i]==="'") {
      i++; let buf='';
      while (i < s.length) {
        if (s[i]==='\\') { i++; const c=s[i]; buf+=(c==='n'?'\n':c==='r'?'\r':c==='t'?'\t':c); i++; }
        else if (s[i]==="'") { i++; break; }
        else buf+=s[i++];
      }
      vals.push(buf);
    } else if (s.slice(i,i+4)==='NULL') { vals.push(null); i+=4; }
    else { let st=i; while(i<s.length&&s[i]!==',')i++; vals.push(s.slice(st,i).trim()); }
    while (i < s.length && (s[i]===','||s[i]===' ')) i++;
  }
  return vals;
}

const COL = { title:5, status:7, name:11, parent:17, type:20 };
const rl = createInterface({ input: createReadStream(sqlFile), crlfDelay: Infinity });
process.stdout.write('post_type\tpost_name\tpost_title\tpost_parent_id\n');
for await (const line of rl) {
  if (!line.startsWith(`INSERT INTO ${TABLE}`)) continue;
  const vStart = line.indexOf('VALUES (') + 8; if (vStart < 8) continue;
  const vals = parseRow(line.slice(vStart, line.lastIndexOf(')')));
  const status = vals[COL.status], type = vals[COL.type];
  if (status !== 'publish' || SKIP.has(type)) continue;
  const name = vals[COL.name]??'', title = vals[COL.title]??'', parent = vals[COL.parent]??'0';
  process.stdout.write(`${type}\t${name}\t${title}\t${parent}\n`);
}
