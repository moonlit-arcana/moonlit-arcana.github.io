// Code-drawn bone frame (approved version from reference/frame-lab.html).
// Drawn in an 825×1425 box; colours come from CSS vars --mat --fl --fh.
// The markup is identical for every card, so it is built once and reused.

function corner(x, y, sx, sy) {
  return `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">
    <circle r="30" fill="var(--mat)" stroke="var(--fh)" stroke-width="3"/>
    <circle r="17" fill="none" stroke="var(--fl)" stroke-width="1.5"/>
    <circle r="6" fill="var(--fh)"/>
    <path d="M30 4C70 0 104 26 96 60C90 84 62 88 56 68C52 54 66 46 74 56" fill="none" stroke="var(--fl)" stroke-width="4" stroke-linecap="round"/>
    <path d="M4 30C0 70 26 104 60 96C84 90 88 62 68 56C54 52 46 66 56 74" fill="none" stroke="var(--fl)" stroke-width="4" stroke-linecap="round"/>
    <circle cx="120" cy="16" r="3" fill="var(--fh)"/><circle cx="16" cy="120" r="3" fill="var(--fh)"/>
  </g>`;
}

function beads(right) {
  let out = "";
  for (let i = 0; i < 13; i++) {
    const y = 380 + i * 62, x = right ? 785 : 40;
    out += i % 3 === 1
      ? `<path d="M${x} ${y - 9}L${x + 7} ${y}L${x} ${y + 9}L${x - 7} ${y}Z" fill="var(--fh)"/>`
      : `<circle cx="${x}" cy="${y}" r="3.2" fill="var(--fl)"/>`;
  }
  return out;
}

// Alchemical element glyphs for the top medallion of Minor Arcana cards,
// centred on the medallion at (412.5, 48). Keyed by cards.json `element`.
const TRI_UP = "M412.5 35.5 426 58.5H399Z";
const TRI_DOWN = "M412.5 60.5 426 37.5H399Z";
const ELEMENT_GLYPHS = {
  Fire: `<path d="${TRI_UP}"/>`,
  Water: `<path d="${TRI_DOWN}"/>`,
  Air: `<path d="${TRI_UP}"/><path d="M396 50.5h33"/>`,
  Earth: `<path d="${TRI_DOWN}"/><path d="M396 45.5h33"/>`,
};

// Pictorial glyphs (chosen 2026-11-09, the default): flame, water drop, wind, leaf.
const PICTURE_GLYPHS = {
  Fire: `<path d="M412.5 34c4 5 9 9 9 15.5 0 5.5-4 9.5-9 9.5s-9-4-9-9.5c0-4 2.5-6.5 4.5-9 .3 3 1.5 4.6 3 5.4-.8-4.2.3-8.4 1.5-11.9Z"/><path d="M412.5 59c-2.6 0-4.3-2-4.3-4.4 0-2.6 2-4.4 4.3-7.3 2.3 2.9 4.3 4.7 4.3 7.3 0 2.4-1.7 4.4-4.3 4.4Z"/>`,
  Water: `<path d="M412.5 34.5c-3 5-9 11-9 16.5a9 9 0 0 0 18 0c0-5.5-6-11.5-9-16.5Z"/><path d="M407.6 51.5a5 5 0 0 0 3.6 5"/>`,
  Air: `<path d="M398 42.5h16a4.2 4.2 0 1 0-4.2-4.2"/><path d="M396 49h26a4.5 4.5 0 1 1-4.5 4.5"/><path d="M400 55.5h11"/>`,
  Earth: `<path d="M402 59c0-12 7-21 20-24 1 12-6 21-20 24Z"/><path d="M402 59 417 41"/><path d="M408.3 51.4h5M408.3 51.4v-5M412.6 46.3h4.2M412.6 46.3v-4.2"/>`,
};

export function elementGlyph(element, style = "pictorial") {
  const g = (style === "pictorial" ? PICTURE_GLYPHS : ELEMENT_GLYPHS)[element];
  const w = style === "pictorial" ? 2.6 : 3;
  return g ? `<g class="emblem" fill="none" stroke="var(--fh)" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round">${g}</g>` : "";
}

const WIN ="M66 1240V150Q66 100 412.5 76Q759 100 759 150V1240Z";

export const FRAME_SVG = `<svg class="frame" viewBox="0 0 825 1425" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <path fill-rule="evenodd" fill="var(--mat)" d="M0 0H825V1425H0Z ${WIN}"/>
  <rect x="10" y="10" width="805" height="1405" rx="22" fill="none" stroke="var(--fl)" stroke-width="7"/>
  <rect x="26" y="26" width="773" height="1373" rx="12" fill="none" stroke="var(--fl)" stroke-opacity=".6" stroke-width="1.5"/>
  <path d="${WIN}" fill="none" stroke="var(--fh)" stroke-width="4"/>
  <path d="M82 1240V156Q82 114 412.5 92Q743 114 743 156V1240" fill="none" stroke="var(--fl)" stroke-opacity=".7" stroke-width="1.5"/>
  ${beads(false)}${beads(true)}
  ${corner(40, 40, .62, .62)}${corner(785, 40, -.62, .62)}
  <path d="M300 36Q356 24 378 44M525 36Q469 24 447 44" fill="none" stroke="var(--fl)" stroke-width="2.5"/>
  <circle cx="412.5" cy="48" r="34" fill="var(--mat)" stroke="var(--fh)" stroke-width="3"/>
  <circle cx="412.5" cy="48" r="26" fill="none" stroke="var(--fl)" stroke-width="1.2"/>
  <g class="crescent"><circle cx="412.5" cy="48" r="14" fill="var(--fh)"/><circle cx="419.5" cy="43" r="12.5" fill="var(--mat)"/></g>
  <path d="M118 1265H40L68 1300L40 1335H118Z M707 1265H785L757 1300L785 1335H707Z" fill="var(--mat)" stroke="var(--fl)" stroke-width="2.5"/>
  <path d="M100 1240H725L748 1300L725 1360H100L77 1300Z" fill="var(--mat)" stroke="var(--fh)" stroke-width="3.5"/>
  <path d="M114 1252H711L730 1300L711 1348H114L95 1300Z" fill="none" stroke="var(--fl)" stroke-width="1.2"/>
  <path d="M60 1385Q140 1372 210 1385M615 1385Q685 1372 765 1385" fill="none" stroke="var(--fl)" stroke-width="2"/>
  <circle cx="412.5" cy="1388" r="6" fill="var(--fh)"/>
</svg>`;
