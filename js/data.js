// Card + meaning data. Loaded once, then read synchronously.
import { getLang, t, cardName } from "./i18n.js";

let cards = [];
let byId = new Map();
let meanings = { cards: {}, suits: {} };

export async function initData() {
  const [c, m] = await Promise.all([
    fetch("data/cards.json").then((r) => r.json()),
    fetch("data/meanings.json").then((r) => r.json()),
  ]);
  cards = c.cards;
  byId = new Map(cards.map((card) => [card.id, card]));
  meanings = m;
}

export const allCards = () => cards;
export const getCard = (id) => byId.get(id);

/** "major" | "wands" | "cups" | "swords" | "pentacles" */
export function cardsIn(section) {
  return section === "major"
    ? cards.filter((c) => c.arcana === "major")
    : cards.filter((c) => c.suit === section);
}

export const sectionOf = (card) => (card.arcana === "major" ? "major" : card.suit);

/**
 * Meaning for the current language:
 * { up, rev, upText, revText, question, placeholder }.
 * A card missing from meanings.json gets a clearly marked placeholder.
 */
export function meaningFor(card) {
  const own = meanings.cards?.[card.id];
  if (own) {
    const m = own[getLang()] || own.en;
    return { ...m, placeholder: meanings.status === "placeholder" };
  }
  return {
    up: [], rev: [],
    upText: t("placeholderText", { name: cardName(card) }), revText: "", question: "",
    placeholder: true,
  };
}

/** Video sources for a card, or null. Files are optional; the modal falls back. */
export function videoSources(card) {
  if (!card.video) return null;
  const base = `assets/videos/${card.id}`;
  return [
    { src: `${base}.webm`, type: "video/webm" },
    { src: `${base}.mp4`, type: "video/mp4" },
  ];
}
