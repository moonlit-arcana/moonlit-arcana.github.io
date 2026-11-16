// Home: five zones (Major centre, suits at the corners). Each zone slowly
// crossfades through its cards. One zone changes at a time; hover/focus pauses it.
import { SECTIONS } from "../config.js";
import { cardsIn } from "../data.js";
import { t, siteName } from "../i18n.js";

const TURN_MS = 1500;          // one zone changes every TURN_MS…
const ORDER = ["wands", "major", "cups", "pentacles", "swords"]; // …so each zone every ~7.5 s

const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

export const homeView = {
  render(main) {
    const zones = new Map();
    const wrap = document.createElement("section");
    wrap.className = "home";
    wrap.innerHTML = `<h1 class="visually-hidden">${siteName()}</h1><div class="home-stage"></div>`;
    const stage = wrap.querySelector(".home-stage");

    for (const s of SECTIONS) {
      const deck = shuffle(cardsIn(s.id));
      const big = s.id === "major";
      const label = t(`sections.${s.id}`);
      const caption = s.element ? `${label} <span class="zone-dot">·</span> <span class="zone-el">${t(`elements.${s.element}`)}</span>` : label;
      const a = document.createElement("a");
      a.className = `zone zone-${s.id}`;
      a.href = `#/${s.id}`;
      a.setAttribute("aria-label", s.element ? `${label} · ${t(`elements.${s.element}`)}` : label);
      a.innerHTML = `
        <span class="zone-cap" aria-hidden="true">${caption}</span>
        <span class="zone-art"><span class="zone-card">
          <img class="zone-layer is-on" alt="" decoding="async" ${big ? 'fetchpriority="high"' : ""}>
          <img class="zone-layer" alt="" decoding="async">
        </span></span>`;
      const src = (c) => (big ? c.image : c.thumb);
      const [first, second] = a.querySelectorAll("img");
      first.src = src(deck[0]);
      const z = { el: a, deck, i: 0, layers: [first, second], on: 0, paused: false, busy: false, src };
      a.addEventListener("pointerenter", () => { z.paused = true; });
      a.addEventListener("pointerleave", () => { z.paused = false; });
      a.addEventListener("focus", () => { z.paused = true; });
      a.addEventListener("blur", () => { z.paused = false; });
      zones.set(s.id, z);
      stage.appendChild(a);
    }
    main.appendChild(wrap);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Preload each zone's next card so the first swap is smooth.
    zones.forEach((z) => { z.layers[1].src = z.src(z.deck[1 % z.deck.length]); });

    let turn = 0;
    const timer = setInterval(() => {
      if (document.hidden) return;
      const z = zones.get(ORDER[turn++ % ORDER.length]);
      if (!z || z.paused || z.busy) return;
      advance(z);
    }, TURN_MS);

    return () => clearInterval(timer);
  },
};

async function advance(z) {
  z.busy = true;
  z.i = (z.i + 1) % z.deck.length;
  const incoming = z.layers[1 - z.on];
  const want = z.src(z.deck[z.i]);
  if (!incoming.src.endsWith(want)) incoming.src = want;
  try { await incoming.decode(); } catch { /* show anyway */ }
  z.layers[z.on].classList.remove("is-on");
  incoming.classList.add("is-on");
  z.on = 1 - z.on;
  // After the fade, queue the following card on the now-hidden layer.
  setTimeout(() => {
    const hidden = z.layers[1 - z.on];
    hidden.src = z.src(z.deck[(z.i + 1) % z.deck.length]);
    z.busy = false;
  }, 2000);
}
