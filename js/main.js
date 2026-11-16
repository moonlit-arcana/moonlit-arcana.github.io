// Entry point: load strings + data, draw chrome, start routing.
import { SECTIONS } from "./config.js";
import { initI18n, onLangChange, translateStatic, siteName, t } from "./i18n.js";
import { initData } from "./data.js";
import { addRoute, setFallback, startRouter, render, onRoute, currentPath } from "./router.js";
import { initRail, renderRail, markCurrent, closeDrawer } from "./components/rail.js";
import { renderHeader, renderFooter } from "./components/chrome.js";
import { initAmbience } from "./ambience.js";
import { homeView } from "./views/home.js";
import { galleryView } from "./views/gallery.js";

const main = document.getElementById("main");

function updateTitle(path) {
  const id = (path || "/").slice(1);
  document.title = SECTIONS.some((s) => s.id === id) ? `${t(`sections.${id}`)} · ${siteName()}` : siteName();
}

async function boot() {
  await Promise.all([initI18n(), initData()]);
  translateStatic();
  initRail();
  renderHeader();
  renderFooter();
  initAmbience();

  addRoute("/", homeView);
  SECTIONS.forEach((s) => addRoute(`/${s.id}`, galleryView(s.id)));
  setFallback(homeView);

  onRoute((path) => {
    closeDrawer();
    markCurrent(path);
    updateTitle(path);
    document.body.dataset.route = path === "/" ? "home" : path.slice(1);
  });

  onLangChange(() => {
    translateStatic();
    renderHeader();
    renderRail();
    renderFooter();
    render(main, { force: true });
    updateTitle(currentPath());
  });

  startRouter(main);
}

boot().catch((err) => {
  console.error(err);
  main.innerHTML = `<p class="boot-error">Could not load the site data. If you opened index.html directly, run a local server instead (see CLAUDE.md).</p>`;
});
