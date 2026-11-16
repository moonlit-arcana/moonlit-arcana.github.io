// Small inline SVG symbols (stroke = currentColor).
const wrap = (body) =>
  `<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const ICONS = {
  // Major Arcana: crescent with a small star
  major: wrap(`<path d="M15.5 4.2A8 8 0 1 0 19.8 15 6.4 6.4 0 0 1 15.5 4.2Z"/><path d="M18.5 3.5v3M17 5h3" stroke-width="1.3"/>`),
  // Suit emblems
  // wand: a bound staff with one sprouting leaf and a flame at the tip (Fire)
  wands: wrap(`<path d="M5.6 20 15.4 7.2" stroke-width="1.9"/><path d="M6.7 16.3l2.2 1.7M7.4 15.3l2.3 1.7" stroke-width="1.2"/><path d="M11.5 12.3c-1.6 0-2.6-1.2-2.6-2.6 1.5 0 2.6 1 2.6 2.6Z" stroke-width="1.2"/><path d="M15.6 7.1c-1.2-1.1-1.1-2.9.3-4.3.2 1 .8 1.3 1.3 1.6.9-.9.8-1.9.6-2.6 1.6 1.2 2.1 3.3 1 4.8-.8 1.1-2.2 1.2-3.2.5Z" stroke-width="1.3"/>`),
  cups: wrap(`<path d="M6 4.5h12c0 4.7-2.6 7.8-6 7.8S6 9.2 6 4.5Z"/><path d="M6.6 7.3h10.8" stroke-width="1.1"/><path d="M12 12.3v5.2"/><path d="M8 19.8c.6-1.5 2.1-2.3 4-2.3s3.4.8 4 2.3Z"/>`),
  swords: wrap(`<path d="M12 2.8l1.7 2.6v9.2h-3.4V5.4Z"/><path d="M12 6v7.6" stroke-width="1"/><path d="M7.2 14.6h9.6"/><path d="M12 14.6v4.2"/><circle cx="12" cy="20.2" r="1.3"/>`),
  pentacles: wrap(`<circle cx="12" cy="12" r="8.6"/><path d="M12 5 16.1 17.7 5.3 9.8h13.4L7.9 17.7Z" stroke-width="1.3"/>`),
  // Alchemical element triangles
  fire: wrap(`<path d="M12 4 20.5 19h-17Z"/>`),
  water: wrap(`<path d="M12 20 3.5 5h17Z"/>`),
  air: wrap(`<path d="M12 4 20.5 19h-17Z"/><path d="M6.6 13.5h10.8"/>`),
  earth: wrap(`<path d="M12 20 3.5 5h17Z"/><path d="M6.6 10.5h10.8"/>`),
  menu: wrap(`<path d="M4 7h16M4 12h16M4 17h16"/>`),
  close: wrap(`<path d="M6 6l12 12M18 6 6 18"/>`),
  pin: wrap(`<path d="M9 6l6 6-6 6"/>`),
  prev: wrap(`<path d="M15 5l-7 7 7 7"/>`),
  next: wrap(`<path d="M9 5l7 7-7 7"/>`),
};

export const icon = (name) => ICONS[name] || "";
export const sectionIcon = (section) => icon(section.id);
