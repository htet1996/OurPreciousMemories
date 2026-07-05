// Generates a rose-gold QR (SVG + PNG) with a 💗 heart badge in the center,
// pointing straight at the deployed site. Run: node scripts/make-qr.mjs
import QRCode from "qrcode";
import sharp from "sharp";
import { writeFileSync } from "fs";

const URL = "https://our-precious-memories.vercel.app/";
const DESK = "C:/Users/Nexushub/Desktop";
const DARK = "#4A0E2E"; // deep dark-rose modules (high contrast = reliable scan)
const LIGHT = "#FFFFFF"; // background
const HEART = "#FF4D8D"; // pink heart

// High error correction (H = ~30%) so a center logo can't break scanning.
const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
const N = qr.modules.size;
const bits = qr.modules.data;

const MARGIN = 3; // quiet zone in modules
const SCALE = 40; // px per module
const px = (N + MARGIN * 2) * SCALE;

let rects = "";
for (let r = 0; r < N; r++) {
  for (let c = 0; c < N; c++) {
    if (bits[r * N + c]) {
      const x = (c + MARGIN) * SCALE;
      const y = (r + MARGIN) * SCALE;
      rects += `<rect x="${x}" y="${y}" width="${SCALE}" height="${SCALE}"/>`;
    }
  }
}

// Center heart badge (~24% of width — safe under H error correction).
const cx = px / 2;
const cy = px / 2;
const badgeR = px * 0.13;
const heartVB = 24;
const heartScale = (badgeR * 1.55) / heartVB;
const hx = cx - (heartVB * heartScale) / 2;
const hy = cy - (heartVB * heartScale) / 2;
const heartPath =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">
  <rect width="${px}" height="${px}" fill="${LIGHT}"/>
  <g fill="${DARK}">${rects}</g>
  <circle cx="${cx}" cy="${cy}" r="${badgeR}" fill="${LIGHT}"/>
  <circle cx="${cx}" cy="${cy}" r="${badgeR}" fill="none" stroke="${DARK}" stroke-width="${SCALE * 0.25}" opacity="0.35"/>
  <g transform="translate(${hx},${hy}) scale(${heartScale})"><path d="${heartPath}" fill="${HEART}"/></g>
</svg>`;

writeFileSync(`${DESK}/OurPreciousMemories-QR.svg`, svg);
await sharp(Buffer.from(svg)).resize(1400, 1400).png().toFile(
  `${DESK}/OurPreciousMemories-QR.png`
);

console.log(`QR built (${N}x${N} modules). Files written to Desktop.`);
