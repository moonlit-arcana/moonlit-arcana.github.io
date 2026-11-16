// Header and footer.
import { SITE } from "../config.js";
import { t, getLang, setLang, siteName } from "../i18n.js";
import { icon } from "./icons.js";
import { toggleDrawer } from "./rail.js";

const LANG_LABELS = { en: "EN", "zh-Hant": "繁中" };

function langSwitch(extraClass = "") {
  const cur = getLang();
  return `<div class="lang-switch ${extraClass}" role="group" aria-label="${t("langLabel")}">
    ${SITE.langs.map((l) => `<button type="button" data-lang="${l}" lang="${l}" aria-pressed="${l === cur}">${LANG_LABELS[l]}</button>`).join('<span aria-hidden="true">/</span>')}
  </div>`;
}

function bindLang(root) {
  root.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
}

export function renderHeader() {
  const el = document.getElementById("site-header");
  const expanded = document.getElementById("rail")?.classList.contains("open") ?? false;
  el.innerHTML = `
    <button class="menu-btn" id="menu-btn" type="button" aria-controls="rail" aria-expanded="${expanded}" aria-label="${t("menu")}">${icon("menu")}</button>
    <a class="brand" href="#/">
      <span class="brand-moon" aria-hidden="true"></span>
      <span class="brand-name">${siteName()}</span>
    </a>
    ${langSwitch()}`;
  el.querySelector("#menu-btn").addEventListener("click", toggleDrawer);
  bindLang(el);
}

export function renderFooter() {
  const el = document.getElementById("site-footer");
  el.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-name">${siteName()}</span>
        <span class="footer-tag">${t("tagline")}</span>
      </div>
      <div class="footer-meta">
        <p>${t("credit")}</p>
        <p>${t("disclaimer")}</p>
      </div>
      ${langSwitch("footer-lang")}
    </div>`;
  bindLang(el);
}
