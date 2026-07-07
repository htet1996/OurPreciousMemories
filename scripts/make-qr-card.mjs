// Builds a printable/shareable PINK CARD: QR (with heart) + name, greeting,
// "Scan me", the URL, and a short instruction — all in one image.
// Outputs PNG + SVG to the Desktop. Run: node scripts/make-qr-card.mjs
import QRCode from "qrcode";
import sharp from "sharp";
import { writeFileSync } from "fs";

const URL = "https://our-precious-memories.vercel.app/";
const URL_TEXT = "our-precious-memories.vercel.app";
const NAME = "Thinzar Linn";
const GREETING = "Happy 27th Birthday!";
const DESK = "C:/Users/Nexushub/Desktop";

const DARK = "#4A0E2E"; // QR modules (high contrast)
const ROSE = "#B76E79";
const HEART = "#FF4D8D";

// --- QR modules ---
const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
const N = qr.modules.size;
const bits = qr.modules.data;

// --- Card canvas ---
const W = 1080;
const H = 1500;

// White QR panel
const panel = { x: 190, y: 380, w: 700, h: 700, r: 48 };
const qrSize = 560;
const qx = panel.x + (panel.w - qrSize) / 2;
const qy = panel.y + (panel.h - qrSize) / 2;
const scale = qrSize / N;

let rects = "";
for (let r = 0; r < N; r++) {
  for (let c = 0; c < N; c++) {
    if (bits[r * N + c]) {
      rects += `<rect x="${(qx + c * scale).toFixed(2)}" y="${(qy + r * scale).toFixed(
        2
      )}" width="${scale.toFixed(2)}" height="${scale.toFixed(2)}"/>`;
    }
  }
}

// Center heart badge
const cx = qx + qrSize / 2;
const cy = qy + qrSize / 2;
const badgeR = qrSize * 0.12;
const heartPath =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
const hs = (badgeR * 1.5) / 24;
const badge = `
  <circle cx="${cx}" cy="${cy}" r="${badgeR}" fill="#ffffff"/>
  <circle cx="${cx}" cy="${cy}" r="${badgeR}" fill="none" stroke="${DARK}" stroke-width="${scale * 0.22}" opacity="0.3"/>
  <g transform="translate(${cx - (24 * hs) / 2},${cy - (24 * hs) / 2}) scale(${hs})"><path d="${heartPath}" fill="${HEART}"/></g>`;

// Little heart next to "Scan me"
const smallHeart = (x, y, size, color) => {
  const s = size / 24;
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="${heartPath}" fill="${color}"/></g>`;
};

const bodyFont = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const headFont = "Georgia, 'Times New Roman', serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe3ec"/>
      <stop offset="0.5" stop-color="#f6e6ff"/>
      <stop offset="1" stop-color="#fff6fb"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#b76e79" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- decorative blush circles -->
  <circle cx="120" cy="120" r="90" fill="#ffffff" opacity="0.25"/>
  <circle cx="980" cy="200" r="60" fill="#ff9ec0" opacity="0.20"/>
  <circle cx="150" cy="1360" r="70" fill="#dda0dd" opacity="0.18"/>
  <circle cx="960" cy="1380" r="100" fill="#ffffff" opacity="0.22"/>
  ${smallHeart(890, 300, 46, "#ff9ec0")}
  ${smallHeart(150, 1180, 40, "#dda0dd")}

  <!-- header -->
  <text x="${W / 2}" y="150" text-anchor="middle" font-family="${bodyFont}" font-size="30" letter-spacing="10" fill="${ROSE}">FOR ${NAME.toUpperCase()}</text>
  <text x="${W / 2}" y="255" text-anchor="middle" font-family="${headFont}" font-style="italic" font-size="70" fill="${ROSE}">${GREETING}</text>
  <text x="${W / 2}" y="320" text-anchor="middle" font-family="${bodyFont}" font-size="30" fill="#4a0e2e" opacity="0.7">A little garden of our memories</text>

  <!-- QR panel -->
  <rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" rx="${panel.r}" fill="#ffffff" filter="url(#soft)"/>
  <g fill="${DARK}">${rects}</g>
  ${badge}

  <!-- scan me -->
  <g>
    <text x="${W / 2}" y="1200" text-anchor="middle" font-family="${headFont}" font-style="italic" font-size="54" fill="${DARK}">Scan me</text>
    ${smallHeart(W / 2 + 118, 1163, 46, HEART)}
  </g>

  <!-- instruction + url -->
  <text x="${W / 2}" y="1265" text-anchor="middle" font-family="${bodyFont}" font-size="30" fill="#4a0e2e" opacity="0.7">Open your phone camera and point it here</text>
  <text x="${W / 2}" y="1340" text-anchor="middle" font-family="${bodyFont}" font-size="32" font-weight="600" fill="${ROSE}">${URL_TEXT}</text>
</svg>`;

writeFileSync(`${DESK}/OurPreciousMemories-Card.svg`, svg);
await sharp(Buffer.from(svg)).png().toFile(`${DESK}/OurPreciousMemories-Card.png`);
console.log(`Card built (${N}x${N} QR). PNG + SVG written to Desktop.`);
