// Site-wide settings. The site name is not final: change it here only.
export const SITE = {
  name: { en: "Moonlit Arcana", "zh-Hant": "月下秘儀" },
  langs: ["en", "zh-Hant"],
  defaultLang: "en",
  storageKeys: { lang: "ma.lang", rail: "ma.railPinned" },
};

// Sections, in rail / home order. `element` keys into i18n `elements`.
export const SECTIONS = [
  { id: "major", element: null },
  { id: "wands", element: "fire" },
  { id: "cups", element: "water" },
  { id: "swords", element: "air" },
  { id: "pentacles", element: "earth" },
];
