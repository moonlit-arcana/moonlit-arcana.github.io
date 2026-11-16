// Language state + string lookup. Strings live in data/i18n/<lang>.json.
import { SITE } from "./config.js";

const dicts = {};
let lang = SITE.defaultLang;
const listeners = new Set();

function pickInitialLang() {
  const saved = localStorage.getItem(SITE.storageKeys.lang);
  if (SITE.langs.includes(saved)) return saved;
  const nav = (navigator.language || "").toLowerCase();
  return /^zh-(tw|hk|mo|hant)/.test(nav) ? "zh-Hant" : SITE.defaultLang;
}

export async function initI18n() {
  await Promise.all(SITE.langs.map(async (l) => {
    const res = await fetch(`data/i18n/${l}.json`);
    dicts[l] = await res.json();
  }));
  applyLang(pickInitialLang());
}

export const getLang = () => lang;

export function setLang(next) {
  if (!SITE.langs.includes(next) || next === lang) return;
  applyLang(next);
  localStorage.setItem(SITE.storageKeys.lang, next);
  listeners.forEach((fn) => fn(lang));
}

export const onLangChange = (fn) => listeners.add(fn);

function applyLang(next) {
  lang = next;
  document.documentElement.lang = next;
  document.documentElement.dataset.lang = next;
}

/** t("sections.major"), t("open", { name: "The Moon" }) */
export function t(key, vars) {
  const raw = key.split(".").reduce((o, k) => (o == null ? o : o[k]), dicts[lang])
    ?? key.split(".").reduce((o, k) => (o == null ? o : o[k]), dicts.en)
    ?? key;
  if (!vars || typeof raw !== "string") return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

export const siteName = () => SITE.name[lang] || SITE.name.en;

/** Localised card name. English comes from cards.json; Chinese is composed. */
export function cardName(card) {
  if (lang === "en") return card.name;
  const names = dicts[lang]?.cardNames;
  if (!names) return card.name;
  if (card.arcana === "major") return names.majors[card.number] ?? card.name;
  return `${t(`sections.${card.suit}`)}${names.ranks[card.number] ?? card.number}`;
}

/** Fill [data-i18n] elements under root (static markup in index.html). */
export function translateStatic(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
}
