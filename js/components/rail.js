// Left rail: collapsed to symbols, expands on hover or when pinned.
// On phones (<720px) it becomes a drawer opened from the header ☰ button.
import { SECTIONS, SITE } from "../config.js";
import { t } from "../i18n.js";
import { sectionIcon, icon } from "./icons.js";
import { currentPath } from "../router.js";

const phoneMQ = matchMedia("(max-width: 719.98px)");
let rail, scrim;

export function initRail() {
  rail = document.getElementById("rail");
  scrim = document.getElementById("rail-scrim");
  if (localStorage.getItem(SITE.storageKeys.rail) === "1") document.body.classList.add("rail-pinned");

  rail.addEventListener("click", (e) => {
    if (e.target.closest(".rail-pin")) togglePinned(e.detail === 0); // detail 0 = keyboard
    else if (e.target.closest("a")) closeDrawer();
  });
  scrim.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && rail.classList.contains("open")) { closeDrawer(); document.getElementById("menu-btn")?.focus(); } });
  phoneMQ.addEventListener("change", () => closeDrawer());
  renderRail();
}

export function renderRail() {
  const pinned = document.body.classList.contains("rail-pinned");
  rail.setAttribute("aria-label", t("menu"));
  rail.innerHTML = `
    <button class="rail-pin" type="button" aria-pressed="${pinned}" aria-label="${pinned ? t("unpinRail") : t("pinRail")}" title="${pinned ? t("unpinRail") : t("pinRail")}">${icon("pin")}</button>
    <ul class="rail-list">
      ${SECTIONS.map((s) => `
        <li><a class="rail-link" href="#/${s.id}" data-section="${s.id}">
          <span class="rail-ico">${sectionIcon(s)}</span>
          <span class="rail-text">
            <span class="rail-label">${t(`sections.${s.id}`)}</span>
            ${s.element ? `<span class="rail-sub">${t(`elements.${s.element}`)}</span>` : ""}
          </span>
        </a></li>`).join("")}
    </ul>`;
  markCurrent(currentPath());
}

export function markCurrent(path) {
  if (!rail) return;
  const id = (path || "/").slice(1);
  rail.querySelectorAll(".rail-link").forEach((a) => {
    if (a.dataset.section === id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function togglePinned(fromKeyboard) {
  const pinned = document.body.classList.toggle("rail-pinned");
  localStorage.setItem(SITE.storageKeys.rail, pinned ? "1" : "0");
  renderRail();
  if (fromKeyboard) {
    // Keep keyboard focus on the button (it was re-rendered).
    rail.querySelector(".rail-pin").focus();
  } else if (!pinned) {
    // Unpinned with the mouse still over the rail: collapse now instead of
    // waiting for the pointer to leave.
    rail.classList.add("hold-closed");
    rail.addEventListener("pointerleave", () => rail.classList.remove("hold-closed"), { once: true });
  }
}

export function openDrawer() {
  rail.classList.add("open");
  scrim.hidden = false;
  document.getElementById("menu-btn")?.setAttribute("aria-expanded", "true");
  rail.querySelector("a")?.focus();
}

export function closeDrawer() {
  if (!rail.classList.contains("open")) return;
  rail.classList.remove("open");
  scrim.hidden = true;
  document.getElementById("menu-btn")?.setAttribute("aria-expanded", "false");
}

export const toggleDrawer = () => (rail.classList.contains("open") ? closeDrawer() : openDrawer());
