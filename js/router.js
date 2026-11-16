// Minimal hash router: #/ and #/<section>. Works on GitHub Pages without config.
// Views are { render(el, params) → cleanup? }.

const routes = new Map();
let fallback = null;
let current = { cleanup: null, path: null };
const listeners = new Set();

export function addRoute(path, view) { routes.set(path, view); }
export function setFallback(view) { fallback = view; }
export const onRoute = (fn) => listeners.add(fn);
export const currentPath = () => current.path;

export function parseHash() {
  const h = location.hash;
  if (!h || h === "#" || h === "#/") return "/";
  if (!h.startsWith("#/")) return null; // in-page anchors (e.g. #main) are not routes
  return "/" + h.slice(2).split(/[?#]/)[0].replace(/\/+$/, "");
}

export function render(container, { force = false } = {}) {
  const path = parseHash();
  if (path === null) return;
  if (!force && path === current.path) return;
  if (typeof current.cleanup === "function") current.cleanup();
  const view = routes.get(path) || fallback;
  container.replaceChildren();
  const pathChanged = path !== current.path;
  current = { path, cleanup: view.render(container, { path }) };
  listeners.forEach((fn) => fn(path));
  if (pathChanged && !force) window.scrollTo({ top: 0 });
}

export function startRouter(container) {
  window.addEventListener("hashchange", () => render(container));
  render(container);
}

export const navigate = (path) => { location.hash = "#" + path; };
