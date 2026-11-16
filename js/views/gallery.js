// Section page: short intro, then a grid of framed cards. Click opens the pop-up.
import { SECTIONS } from "../config.js";
import { cardsIn } from "../data.js";
import { t } from "../i18n.js";
import { sectionIcon } from "../components/icons.js";
import { framedCard } from "../components/card.js";
import { openCard } from "../components/modal.js";

export function galleryView(sectionId) {
  const section = SECTIONS.find((s) => s.id === sectionId);
  return {
    render(main) {
      const cards = cardsIn(sectionId);
      const wrap = document.createElement("section");
      wrap.className = `gallery gallery-${sectionId}`;
      const kicker = section.element ? t(`elements.${section.element}`) : t("cardCount", { n: cards.length });
      wrap.innerHTML = `
        <header class="gallery-intro">
          <span class="gallery-ico">${sectionIcon(section)}</span>
          <div>
            <p class="gallery-kicker">${section.element ? `${kicker} · ${t("cardCount", { n: cards.length })}` : kicker}</p>
            <h1 class="gallery-title">${t(`sections.${sectionId}`)}</h1>
            <p class="gallery-lede">${t(`intros.${sectionId}`)}</p>
          </div>
        </header>
        <ul class="card-grid" role="list"></ul>`;
      const grid = wrap.querySelector(".card-grid");
      cards.forEach((card, i) => {
        const li = document.createElement("li");
        li.style.setProperty("--i", i);
        li.appendChild(framedCard(card, { eager: i < 6, onOpen: (c) => openCard(c, cards) }));
        grid.appendChild(li);
      });
      main.appendChild(wrap);
    },
  };
}
