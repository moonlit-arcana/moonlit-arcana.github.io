// Card pop-up: native <dialog>, art left / text right, prev/next arrows.
// Major Arcana play assets/videos/<id>.(webm|mp4) if present, otherwise a
// stand-in motion effect (slow zoom, light sweep, motes).
import { cardName, t, onLangChange } from "../i18n.js";
import { meaningFor, videoSources } from "../data.js";
import { icon } from "./icons.js";

const reducedMQ = matchMedia("(prefers-reduced-motion: reduce)");
const videoOk = new Map(); // card.id → false once we know there is no file

let dlg, els, list = [], index = 0;
let motes = null, motesGen = 0;

function build() {
  dlg = document.getElementById("viewer");
  dlg.setAttribute("aria-labelledby", "v-title");
  dlg.innerHTML = `
    <div class="viewer">
      <div class="v-media" id="v-media">
        <div class="v-art" id="v-art"></div>
        <canvas class="v-motes" id="v-motes" aria-hidden="true"></canvas>
        <button class="v-nav v-prev" type="button" id="v-prev">${icon("prev")}</button>
        <button class="v-nav v-next" type="button" id="v-next">${icon("next")}</button>
      </div>
      <div class="v-info">
        <div class="v-kicker" id="v-kicker"></div>
        <h2 class="v-title" id="v-title"></h2>
        <div class="v-arcana" id="v-arcana"></div>
        <section class="v-kw"><h3 id="v-up-h"></h3><div class="chips" id="v-up"></div><p class="v-reading" id="v-up-text"></p></section>
        <section class="v-kw rev"><h3 id="v-rev-h"></h3><div class="chips" id="v-rev"></div><p class="v-reading" id="v-rev-text"></p></section>
        <blockquote class="v-question" id="v-q"><span class="v-q-label" id="v-q-label"></span><span id="v-q-text"></span></blockquote>
        <p class="v-note" id="v-note"></p>
        <p class="v-pos" id="v-pos" aria-live="polite"></p>
      </div>
      <button class="v-close" type="button" id="v-close">${icon("close")}</button>
    </div>`;
  const $ = (id) => dlg.querySelector("#" + id);
  els = {
    media: $("v-media"), art: $("v-art"), canvas: $("v-motes"),
    prev: $("v-prev"), next: $("v-next"), close: $("v-close"),
    kicker: $("v-kicker"), title: $("v-title"), arcana: $("v-arcana"),
    upH: $("v-up-h"), up: $("v-up"), upText: $("v-up-text"),
    revH: $("v-rev-h"), rev: $("v-rev"), revText: $("v-rev-text"),
    q: $("v-q"), qLabel: $("v-q-label"), qText: $("v-q-text"),
    note: $("v-note"), pos: $("v-pos"),
  };

  els.close.addEventListener("click", () => dlg.close());
  els.prev.addEventListener("click", () => step(-1));
  els.next.addEventListener("click", () => step(1));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  });
  dlg.addEventListener("close", stopMedia);

  // Swipe on the art (touch)
  let sx = null, sy = null;
  els.media.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") { sx = e.clientX; sy = e.clientY; } });
  els.media.addEventListener("pointerup", (e) => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  });

  onLangChange(() => { if (dlg.open) renderInfo(); });
}

/** Open `card`; arrows move through `cards` (defaults to just this card). */
export function openCard(card, cards = [card]) {
  if (!dlg) build();
  list = cards;
  index = Math.max(0, list.findIndex((c) => c.id === card.id));
  show();
  if (!dlg.open) dlg.showModal();
  startMotesIfLiving();
}

function step(d) {
  if (list.length < 2) return;
  index = (index + d + list.length) % list.length;
  show();
  startMotesIfLiving();
}

function show() {
  const card = list[index];
  renderMedia(card);
  renderInfo();
  const many = list.length > 1;
  els.prev.hidden = els.next.hidden = !many;
  dlg.querySelector(".v-info").scrollTop = 0;
  dlg.scrollTop = 0;
}

function renderInfo() {
  const card = list[index];
  const name = cardName(card);
  const major = card.arcana === "major";
  els.kicker.textContent = major
    ? t("arcanum", { n: card.numeral })
    : `${t(`sections.${card.suit}`)} · ${t(`elements.${card.element.toLowerCase()}`)}`;
  els.title.textContent = name;
  els.arcana.textContent = major ? t("majorArcana") : `${t("minorArcana")} · ${t(`sections.${card.suit}`)}`;
  const m = meaningFor(card);
  els.upH.textContent = t("upright");
  els.revH.textContent = t("reversed");
  const chips = (arr) => arr.map((k) => `<span class="chip">${escapeHTML(k)}</span>`).join("");
  els.up.innerHTML = chips(m.up);
  els.rev.innerHTML = chips(m.rev);
  els.upText.textContent = m.upText || "";
  els.revText.textContent = m.revText || "";
  els.qLabel.textContent = t("reflect");
  els.qText.textContent = m.question || "";
  els.q.hidden = !m.question;
  els.note.textContent = m.placeholder ? t("placeholderNote") : "";
  els.note.hidden = !m.placeholder;
  els.pos.textContent = list.length > 1 ? t("position", { i: index + 1, n: list.length }) : "";
  els.prev.setAttribute("aria-label", t("prev"));
  els.next.setAttribute("aria-label", t("next"));
  els.close.setAttribute("aria-label", t("close"));
}

function renderMedia(card) {
  stopMedia();
  const reduced = reducedMQ.matches;
  const img = new Image();
  img.className = "v-still";
  img.alt = cardName(card);
  img.decoding = "async";
  img.src = card.image;
  els.art.replaceChildren(img);
  els.media.classList.remove("has-video");
  const major = card.arcana === "major";
  els.media.classList.toggle("living", major && !reduced);

  const sources = videoSources(card);
  if (!major || !sources || reduced || videoOk.get(card.id) === false) return;

  const v = document.createElement("video");
  Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, preload: "auto" });
  v.className = "v-video";
  v.setAttribute("aria-hidden", "true");
  sources.forEach(({ src, type }, i) => {
    const s = document.createElement("source");
    s.src = src; s.type = type;
    // An error on the last <source> means no playable file exists.
    if (i === sources.length - 1) s.addEventListener("error", () => { videoOk.set(card.id, false); v.remove(); });
    v.appendChild(s);
  });
  v.addEventListener("playing", () => {
    if (list[index]?.id !== card.id) return;
    videoOk.set(card.id, true);
    els.media.classList.add("has-video");
    els.media.classList.remove("living");
    stopMotes();
  }, { once: true });
  els.art.appendChild(v);
}

function stopMedia() {
  stopMotes();
  els?.art.querySelectorAll("video").forEach((v) => v.pause());
}

/* ---------- stand-in motes ---------- */
function startMotesIfLiving() {
  stopMotes();
  if (!els.media.classList.contains("living")) return;
  const token = ++motesGen;
  requestAnimationFrame(() => {
    if (token !== motesGen) return;
    const cv = els.canvas, ctx = cv.getContext("2d");
    const r = els.media.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2), w = r.width, h = r.height;
    if (!w || !h) return;
    cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const mk = (fresh) => ({ x: Math.random() * w, y: fresh ? Math.random() * h : h + 8, r: .8 + Math.random() * 1.8,
      vx: (Math.random() - .5) * .12, vy: -.1 - Math.random() * .25, life: 0, max: 400 + Math.random() * 400, ph: Math.random() * 6.28 });
    const ps = Array.from({ length: 34 }, () => mk(true));
    const state = { raf: 0, ctx, w, h };
    const tick = () => {
      ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = "lighter";
      ps.forEach((p, i) => {
        p.life++; p.ph += .03; p.x += p.vx + Math.sin(p.ph) * .15; p.y += p.vy;
        const a = Math.sin(Math.PI * Math.min(p.life / p.max, 1)) * .75;
        const c = i % 3 === 0 ? "255,215,150" : "170,235,210";
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.283); ctx.fill();
        if (p.life > p.max || p.y < -8) ps[i] = mk(false);
      });
      ctx.globalCompositeOperation = "source-over";
      state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
    motes = state;
  });
}

function stopMotes() {
  motesGen++;
  if (!motes) return;
  cancelAnimationFrame(motes.raf);
  motes.ctx.clearRect(0, 0, motes.w, motes.h);
  motes = null;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
