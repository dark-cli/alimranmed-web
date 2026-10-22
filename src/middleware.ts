import { defineMiddleware } from "astro:middleware";

// Sorani (/ku/) pages show Eastern Arabic-Indic digits. Translated text already
// uses them; this catches numbers that bypass translation (stat values, section
// numbers, phone numbers, years, counts). Only visible text is touched: tags,
// attributes, <script>/<style>, and any word containing Latin letters
// (L4/5, FGFR3, English citations) are left as-is.
const EASTERN = "٠١٢٣٤٥٦٧٨٩";
const SKIP_RE = /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]*>|&#?\w+;)/gi;

function convertText(text: string): string {
  return text.replace(/[^\s]+/g, (word) =>
    /[A-Za-z]/.test(word) || !/[0-9]/.test(word)
      ? word
      : word.replace(/(\d),(?=\d{3})/g, "$1٬").replace(/[0-9]/g, (d) => EASTERN[Number(d)]),
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const path = context.url.pathname;
  if (!(path === "/ku" || path.startsWith("/ku/"))) return response;
  if (!response.headers.get("content-type")?.includes("text/html")) return response;

  const html = await response.text();
  const body = html.split(SKIP_RE).map((part, i) => (i % 2 ? part : convertText(part))).join("");
  return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
});
