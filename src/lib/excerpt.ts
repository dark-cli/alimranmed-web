/**
 * Plain-text summary of a markdown body, for use as a meta description when
 * an entry has no `description` in its frontmatter. Strips images, links,
 * YouTube/"watch" lines, headings and emphasis, then cuts at a word boundary.
 */
export function excerpt(markdown: string | undefined, max = 155): string {
  if (!markdown) return "";
  const text = markdown
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/^.*(youtube\.com|youtu\.be).*$/gim, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>|]+/g, " ")
    .replace(/&nbsp;|&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.،:;-]+$/, "") + "…";
}
