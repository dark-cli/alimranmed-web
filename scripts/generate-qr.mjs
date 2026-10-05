/**
 * Generates QR codes for the Google Preferred Sources follow pages.
 * Outputs SVG + PNG (1024×1024) into /qr/ at the repo root.
 *
 * Usage:
 *   node scripts/generate-qr.mjs
 *
 * Requires:
 *   npm install --save-dev qrcode
 *   (sharp is already a devDependency and handles SVG→PNG rasterisation)
 */

import QRCode from "qrcode";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "qr");
mkdirSync(outDir, { recursive: true });

const codes = [
  { url: "https://alimran.clinic/ar/follow?ref=qr", name: "follow-ar" },
  { url: "https://alimran.clinic/en/follow?ref=qr", name: "follow-en" },
];

const QR_OPTIONS = {
  errorCorrectionLevel: "M",
  margin: 4,
  color: { dark: "#101c22", light: "#ffffff" },
};

for (const { url, name } of codes) {
  // SVG
  const svg = await QRCode.toString(url, { ...QR_OPTIONS, type: "svg" });
  const svgPath = join(outDir, `${name}.svg`);
  writeFileSync(svgPath, svg, "utf8");
  console.log(`  SVG → ${svgPath}`);

  // PNG — rasterise the SVG at 1024×1024 via sharp (no extra native deps)
  const pngPath = join(outDir, `${name}.png`);
  await sharp(Buffer.from(svg))
    .resize(1024, 1024, { fit: "contain", background: "#ffffff" })
    .png()
    .toFile(pngPath);
  console.log(`  PNG → ${pngPath}`);
}

console.log("\nDone. Four files written to /qr/");
