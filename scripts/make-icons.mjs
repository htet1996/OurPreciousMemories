// Generates PWA app icons (gradient + white heart) into public/icons/.
// Run: node scripts/make-icons.mjs
import sharp from "sharp";
import { mkdirSync } from "fs";

const OUT = "public/icons";
mkdirSync(OUT, { recursive: true });

const HEART =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

// Heart scaled to ~52% of the icon — inside the maskable safe zone.
const icon = (size) => {
  const s = size / 24 * 0.52;
  const cx = size / 2;
  const cy = size * 0.53;
  const hx = cx - (24 * s) / 2;
  const hy = cy - (24 * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FF9EC0"/>
        <stop offset="0.55" stop-color="#FF69B4"/>
        <stop offset="1" stop-color="#C98FD6"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#g)"/>
    <circle cx="${size * 0.26}" cy="${size * 0.24}" r="${size * 0.02}" fill="#ffffff" opacity="0.8"/>
    <circle cx="${size * 0.76}" cy="${size * 0.30}" r="${size * 0.015}" fill="#ffffff" opacity="0.7"/>
    <circle cx="${size * 0.7}" cy="${size * 0.75}" r="${size * 0.018}" fill="#ffffff" opacity="0.6"/>
    <g transform="translate(${hx},${hy}) scale(${s})"><path d="${HEART}" fill="#ffffff"/></g>
  </svg>`;
};

const jobs = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
];

for (const j of jobs) {
  await sharp(Buffer.from(icon(j.size))).png().toFile(`${OUT}/${j.name}`);
  console.log("wrote", `${OUT}/${j.name}`);
}
console.log("done");
