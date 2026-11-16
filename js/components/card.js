// Framed card (section pages, later spreads). Returns a <button>.
import { FRAME_SVG, elementGlyph } from "./frame.js";
import { cardName, getLang, t } from "../i18n.js";

/** Shrink long titles so they stay inside the banner. */
function titleScale(name, lang) {
  if (lang !== "en") return name.length > 5 ? 0.85 : 1;
  const n = name.length;
  return n > 18 ? 0.72 : n > 16 ? 0.78 : n > 12 ? 0.9 : 1;
}

export function framedCard(card, { onOpen, eager = false } = {}) {
  const lang = getLang();
  const name = cardName(card);
  const el = document.createElement("button");
  el.type = "button";
  el.className = "fcard";
  el.dataset.id = card.id;
  el.setAttribute("aria-label", t("open", { name }));
  el.innerHTML = `
    <span class="fcard-face">
      <span class="fcard-art"><img src="${card.thumb}" alt="" width="412" height="668" decoding="async" ${eager ? "" : 'loading="lazy"'}></span>
      ${FRAME_SVG}
      <span class="fcard-num"></span>
      <span class="fcard-title"></span>
    </span>`;
  const title = el.querySelector(".fcard-title");
  title.textContent = lang === "en" ? name.toUpperCase() : name;
  title.style.setProperty("--ts", titleScale(name, lang));
  const num = card.arcana === "major" ? card.numeral : "";
  el.querySelector(".fcard-num").textContent = num;
  // Majors show their numeral in the top medallion; Minors show their element.
  const crescent = el.querySelector(".crescent");
  if (num) crescent.style.display = "none";
  else if (card.element) crescent.outerHTML = elementGlyph(card.element);
  if (onOpen) el.addEventListener("click", () => onOpen(card, el));
  return el;
}
