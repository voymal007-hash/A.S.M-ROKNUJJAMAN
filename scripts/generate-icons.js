import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create crisp SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <linearGradient id="sun" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <linearGradient id="furrows" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>
  </defs>
  <!-- Background with rounded squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  
  <!-- Subtle circular sun / token -->
  <circle cx="360" cy="150" r="48" fill="url(#sun)" opacity="0.9"/>

  <!-- Land Hill 1 -->
  <path d="M40 370 Q 180 240, 360 330 T 472 380 L 472 472 L 40 472 Z" fill="#14532d" opacity="0.5"/>
  
  <!-- Land Hill 2 (Main Field) -->
  <path d="M40 410 Q 220 280, 472 390 L 472 472 L 40 472 Z" fill="url(#furrows)"/>

  <!-- Field Plow Lines / Terraces -->
  <path d="M120 410 Q 250 340, 420 410" stroke="#86efac" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M80 440 Q 240 370, 450 440" stroke="#86efac" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.8"/>

  <!-- Center Badge / Ledger Book & Rupee/Dollar Coin symbol -->
  <g transform="translate(140, 110)">
    <rect x="0" y="0" width="160" height="210" rx="18" fill="#ffffff" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.25))"/>
    <rect x="18" y="24" width="70" height="12" rx="6" fill="#15803d"/>
    <rect x="18" y="48" width="124" height="8" rx="4" fill="#cbd5e1"/>
    <rect x="18" y="66" width="100" height="8" rx="4" fill="#cbd5e1"/>
    <rect x="18" y="84" width="124" height="8" rx="4" fill="#cbd5e1"/>
    <rect x="18" y="102" width="80" height="8" rx="4" fill="#cbd5e1"/>

    <!-- Paid Stamp Badge -->
    <rect x="24" y="128" width="112" height="42" rx="10" fill="#ecfdf5" stroke="#059669" stroke-width="3"/>
    <text x="80" y="155" fill="#047857" font-size="20" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle" letter-spacing="1">PAID ✓</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);

// Helper to write valid PNG file using pure Node.js buffer and zlib
function createPng(width, height, isMaskable = false) {
  // CRC32 table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crcVal = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crcVal, 8 + len);
    return buf;
  }

  // Draw raster image: green theme with gradient and ledger symbol
  const rawData = Buffer.alloc(height * (1 + width * 4));
  let pos = 0;

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.45;

  for (let y = 0; y < height; y++) {
    rawData[pos++] = 0; // filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background color (emerald green gradient)
      const grad = y / height;
      let r = Math.round(21 * (1 - grad) + 4 * grad);
      let g = Math.round(128 * (1 - grad) + 120 * grad);
      let b = Math.round(61 * (1 - grad) + 87 * grad);
      let a = 255;

      if (!isMaskable) {
        // Squircle corner check for regular icon
        const cornerR = width * 0.22;
        const inCornerX = x < cornerR ? cornerR - x : (x > width - cornerR ? x - (width - cornerR) : 0);
        const inCornerY = y < cornerR ? cornerR - y : (y > height - cornerR ? y - (height - cornerR) : 0);
        if (inCornerX > 0 && inCornerY > 0) {
          const cornerDist = Math.sqrt(inCornerX * inCornerX + inCornerY * inCornerY);
          if (cornerDist > cornerR) {
            a = 0;
          }
        }
      }

      // Draw central document card
      const cardW = width * 0.44;
      const cardH = height * 0.52;
      const cardX = cx - cardW / 2;
      const cardY = cy - cardH / 2;

      if (a > 0 && x >= cardX && x <= cardX + cardW && y >= cardY && y <= cardY + cardH) {
        // White card background
        r = 255; g = 255; b = 255;

        // Card header stripe
        if (y <= cardY + cardH * 0.2) {
          r = 16; g = 185; b = 129; // Emerald banner
        } else if (y >= cardY + cardH * 0.65 && y <= cardY + cardH * 0.85 && x >= cardX + cardW * 0.15 && x <= cardX + cardW * 0.85) {
          // PAID green badge
          r = 5; g = 150; b = 105;
        } else if (x >= cardX + cardW * 0.15 && x <= cardX + cardW * 0.85 && (Math.floor((y - cardY) / (cardH * 0.08)) % 2 === 0)) {
          // Horizontal ledger row lines
          r = 203; g = 213; b = 225;
        }
      }

      rawData[pos++] = r;
      rawData[pos++] = g;
      rawData[pos++] = b;
      rawData[pos++] = a;
    }
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth 8
  ihdrData.writeUInt8(6, 9); // color type 6: RGBA
  ihdrData.writeUInt8(0, 10); // comp 0
  ihdrData.writeUInt8(0, 11); // filter 0
  ihdrData.writeUInt8(0, 12); // interlace 0
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));

console.log('Icons generated successfully in public/');
