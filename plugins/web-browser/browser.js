"use strict";
/* ============================================================================
   Web browser plugin.
   ----------------------------------------------------------------------------
   A website in a tab of Allkin (kind "web-browser", byPath: the path is the
   address). Each open site has a frame of its own, kept while its tab lives,
   so that coming back to it finds the page as it was left.

   Many sites refuse to be shown inside another site (X-Frame-Options, CSP
   frame-ancestors) and the browser hides that refusal behind a blank frame:
   the service of the plugin reads the headers (server.mjs, /check) and the tab
   says so, with a button to open the site in the browser instead.

   Every link to another site clicked in Allkin opens here; Ctrl/⌘ + click, a
   middle click or Shift + click keep the browser's own behaviour.
   ========================================================================== */
(() => {
const Allkin = window.Allkin;
const core = Allkin.core;
const { el, openTab, activeTab } = core;
const t = Allkin.t;

const KIND = "web-browser";
const CHECK_URL = "/plugins/web-browser/web/check";
/** Frames kept alive at most; the oldest is dropped and reloads on return. */
const MAX_FRAMES = 8;
const toast = (message, kind = "ok") => core.toast?.(message, kind);

/* ---- Icons: Phosphor, light (and duotone for the tab) -------------------- */

// Generated from @phosphor-icons/core (MIT): light weight, and duotone for the tab.
const ICONS = {
  "globe:light": [{"d": "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm81.57,64H169.19a132.58,132.58,0,0,0-25.73-50.67A90.29,90.29,0,0,1,209.57,90ZM218,128a89.7,89.7,0,0,1-3.83,26H171.81a155.43,155.43,0,0,0,0-52h42.36A89.7,89.7,0,0,1,218,128Zm-90,87.83a110,110,0,0,1-15.19-19.45A124.24,124.24,0,0,1,99.35,166h57.3a124.24,124.24,0,0,1-13.46,30.38A110,110,0,0,1,128,215.83ZM96.45,154a139.18,139.18,0,0,1,0-52h63.1a139.18,139.18,0,0,1,0,52ZM38,128a89.7,89.7,0,0,1,3.83-26H84.19a155.43,155.43,0,0,0,0,52H41.83A89.7,89.7,0,0,1,38,128Zm90-87.83a110,110,0,0,1,15.19,19.45A124.24,124.24,0,0,1,156.65,90H99.35a124.24,124.24,0,0,1,13.46-30.38A110,110,0,0,1,128,40.17Zm-15.46-.84A132.58,132.58,0,0,0,86.81,90H46.43A90.29,90.29,0,0,1,112.54,39.33ZM46.43,166H86.81a132.58,132.58,0,0,0,25.73,50.67A90.29,90.29,0,0,1,46.43,166Zm97,50.67A132.58,132.58,0,0,0,169.19,166h40.38A90.29,90.29,0,0,1,143.46,216.67Z"}],
  "arrow-clockwise:light": [{"d": "M238,56v48a6,6,0,0,1-6,6H184a6,6,0,0,1,0-12h32.55l-30.38-27.8c-.06-.06-.12-.13-.19-.19a82,82,0,1,0-1.7,117.65,6,6,0,0,1,8.24,8.73A93.46,93.46,0,0,1,128,222h-1.28A94,94,0,1,1,194.37,61.4L226,90.35V56a6,6,0,1,1,12,0Z"}],
  "link:light": [{"d": "M238,88.18a52.42,52.42,0,0,1-15.4,35.66l-34.75,34.75A52.28,52.28,0,0,1,150.62,174h-.05A52.63,52.63,0,0,1,98,119.9a6,6,0,0,1,6-5.84h.17a6,6,0,0,1,5.83,6.16A40.62,40.62,0,0,0,150.58,162h0a40.4,40.4,0,0,0,28.73-11.9l34.75-34.74A40.63,40.63,0,0,0,156.63,57.9l-11,11a6,6,0,0,1-8.49-8.49l11-11a52.62,52.62,0,0,1,74.43,0A52.83,52.83,0,0,1,238,88.18Zm-127.62,98.9-11,11A40.36,40.36,0,0,1,70.6,210h0a40.63,40.63,0,0,1-28.7-69.36L76.62,105.9A40.63,40.63,0,0,1,146,135.77a6,6,0,0,0,5.83,6.16H152a6,6,0,0,0,6-5.84A52.63,52.63,0,0,0,68.14,97.42L33.38,132.16A52.63,52.63,0,0,0,70.56,222h0a52.26,52.26,0,0,0,37.22-15.42l11-11a6,6,0,1,0-8.49-8.48Z"}],
  "arrow-square-out:light": [{"d": "M222,104a6,6,0,0,1-12,0V54.49l-69.75,69.75a6,6,0,0,1-8.48-8.48L201.51,46H152a6,6,0,0,1,0-12h64a6,6,0,0,1,6,6Zm-38,26a6,6,0,0,0-6,6v72a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V80a2,2,0,0,1,2-2h72a6,6,0,0,0,0-12H48A14,14,0,0,0,34,80V208a14,14,0,0,0,14,14H176a14,14,0,0,0,14-14V136A6,6,0,0,0,184,130Z"}],
  "warning:light": [{"d": "M235.07,189.09,147.61,37.22h0a22.75,22.75,0,0,0-39.22,0L20.93,189.09a21.53,21.53,0,0,0,0,21.72A22.35,22.35,0,0,0,40.55,222h174.9a22.35,22.35,0,0,0,19.6-11.19A21.53,21.53,0,0,0,235.07,189.09ZM224.66,204.8a10.46,10.46,0,0,1-9.21,5.2H40.55a10.46,10.46,0,0,1-9.21-5.2,9.51,9.51,0,0,1,0-9.72L118.79,43.21a10.75,10.75,0,0,1,18.42,0l87.46,151.87A9.51,9.51,0,0,1,224.66,204.8ZM122,144V104a6,6,0,0,1,12,0v40a6,6,0,0,1-12,0Zm16,36a10,10,0,1,1-10-10A10,10,0,0,1,138,180Z"}],
  "lock-simple:light": [{"d": "M208,82H174V56a46,46,0,0,0-92,0V82H48A14,14,0,0,0,34,96V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V96A14,14,0,0,0,208,82ZM94,56a34,34,0,0,1,68,0V82H94ZM210,208a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V96a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Z"}],
  "lock-simple-open:light": [{"d": "M208,82H94V56a34,34,0,0,1,34-34c16.3,0,31,11.69,34.12,27.19a6,6,0,0,0,11.76-2.38C169.55,25.48,150.26,10,128,10A46.06,46.06,0,0,0,82,56V82H48A14,14,0,0,0,34,96V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V96A14,14,0,0,0,208,82Zm2,126a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V96a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Z"}],
  "globe:duotone": [{"d": "M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z", "o": "0.2"}, {"d": "M128,24h0A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm88,104a87.61,87.61,0,0,1-3.33,24H174.16a157.44,157.44,0,0,0,0-48h38.51A87.61,87.61,0,0,1,216,128ZM102,168H154a115.11,115.11,0,0,1-26,45A115.27,115.27,0,0,1,102,168Zm-3.9-16a140.84,140.84,0,0,1,0-48h59.88a140.84,140.84,0,0,1,0,48ZM40,128a87.61,87.61,0,0,1,3.33-24H81.84a157.44,157.44,0,0,0,0,48H43.33A87.61,87.61,0,0,1,40,128ZM154,88H102a115.11,115.11,0,0,1,26-45A115.27,115.27,0,0,1,154,88Zm52.33,0H170.71a135.28,135.28,0,0,0-22.3-45.6A88.29,88.29,0,0,1,206.37,88ZM107.59,42.4A135.28,135.28,0,0,0,85.29,88H49.63A88.29,88.29,0,0,1,107.59,42.4ZM49.63,168H85.29a135.28,135.28,0,0,0,22.3,45.6A88.29,88.29,0,0,1,49.63,168Zm98.78,45.6a135.28,135.28,0,0,0,22.3-45.6h35.66A88.29,88.29,0,0,1,148.41,213.6Z"}],
};

function iconSvg(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><g transform="scale(0.09375)" fill="currentColor" stroke="none">${(ICONS[`${name}:light`] ?? [])
    .map((p) => `<path d="${p.d}"/>`)
    .join("")}</g></svg>`;
}

function dualIcon(name, color) {
  const group = (weight, cls) =>
    `<g class="${cls}" transform="scale(0.09375)" fill="${color}" stroke="none">${(ICONS[`${name}:${weight}`] ?? [])
      .map((p) => `<path d="${p.d}"${p.o ? ` opacity="${p.o}"` : ""}/>`)
      .join("")}</g>`;
  return `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">${group("light", "ph-light")}${group("duotone", "ph-duo")}</svg>`;
}

const TAB_ICON = dualIcon("globe", "#0ea5e9");

function fillButtons(root) {
  for (const node of root.querySelectorAll("[data-wb-icon], [data-wb-label]")) {
    const label = node.dataset.wbLabel;
    node.innerHTML = (node.dataset.wbIcon ? iconSvg(node.dataset.wbIcon) : "") + (label ? `<span>${core.escapeHtml(t(label))}</span>` : "");
    if (label && !node.title && node.tagName === "BUTTON") node.title = t(label);
  }
}

/* ---- Addresses ----------------------------------------------------------- */

/** What was typed, as an address: a URL, a domain, or else a search. */
function toAddress(text) {
  const value = String(text ?? "").trim();
  if (!value) return null;
  try {
    if (/^https?:\/\//i.test(value)) return new URL(value).href;
    if (/^(localhost|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/|$)/i.test(value)) return new URL(`http://${value}`).href;
    if (!/\s/.test(value) && /^[^/\s]+\.[a-z]{2,}(:\d+)?(\/.*)?$/i.test(value)) return new URL(`https://${value}`).href;
  } catch {
    // Not an address: a search.
  }
  return `https://duckduckgo.com/?q=${encodeURIComponent(value)}`;
}

function hostOf(address) {
  try {
    return new URL(address).hostname.replace(/^www\./, "");
  } catch {
    return address;
  }
}

/** Opens an address in a tab of Allkin. */
function open(address) {
  const href = toAddress(address);
  if (!href) return;
  openTab(null, KIND, { path: href, name: hostOf(href) });
}

/* ---- Frames -------------------------------------------------------------- */

/** path → { frame, verdict, usedAt, forced } */
const pages = new Map();
let current = null;

function makeFrame(address) {
  const frame = document.createElement("iframe");
  frame.className = "wb-frame";
  frame.title = hostOf(address);
  frame.referrerPolicy = "no-referrer";
  // The site keeps its own origin (not Allkin's): scripts, forms and its
  // own windows work; it cannot reach the page of Allkin.
  frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-presentation");
  frame.setAttribute("allow", "fullscreen; clipboard-write; autoplay");
  frame.src = address;
  el("wb-stage").appendChild(frame);
  return frame;
}

/** Drops the frames used least recently past MAX_FRAMES. */
function trimFrames() {
  const alive = [...pages.entries()].filter(([, p]) => p.frame).sort((a, b) => a[1].usedAt - b[1].usedAt);
  while (alive.length > MAX_FRAMES) {
    const [path, page] = alive.shift();
    if (path === current) continue;
    page.frame.remove();
    page.frame = null;
  }
}

async function checkFraming(path, page) {
  try {
    const res = await fetch(`${CHECK_URL}?url=${encodeURIComponent(path)}&origin=${encodeURIComponent(location.origin)}`, { credentials: "same-origin" });
    if (!res.ok) throw new Error(String(res.status));
    page.verdict = await res.json();
  } catch {
    // Service not running: nothing is known, the frame shows what it can.
    page.verdict = { frameable: null, reason: "no-service" };
  }
  if (current === path) renderNotice(path, page);
}

function renderNotice(path, page) {
  const blocked = page.verdict?.frameable === false && !page.forced;
  el("wb-notice").classList.toggle("hidden", !blocked);
  if (!blocked) return;
  el("wb-notice-title").textContent = t("plugin.web-browser.blocked.title", { host: hostOf(path) });
  el("wb-notice-text").textContent = t("plugin.web-browser.blocked.text");
}

function show(path) {
  current = path;
  let page = pages.get(path);
  if (!page) {
    page = { frame: null, verdict: null, usedAt: 0, forced: false };
    pages.set(path, page);
    void checkFraming(path, page);
  }
  page.usedAt = Date.now();
  if (!page.frame) page.frame = makeFrame(path);
  for (const [other, p] of pages) p.frame?.classList.toggle("hidden", other !== path);
  trimFrames();
  renderNotice(path, page);
  const input = el("wb-address");
  if (document.activeElement !== input) input.value = path;
  const secure = path.startsWith("https:");
  const lock = el("wb-lock");
  lock.innerHTML = iconSvg(secure ? "lock-simple" : "lock-simple-open");
  lock.classList.toggle("is-plain", !secure);
  lock.title = t(secure ? "plugin.web-browser.secure" : "plugin.web-browser.plain");
}

/* ---- Tab ----------------------------------------------------------------- */

Allkin.registerTabKind(KIND, {
  panels: ["wb-view"],
  icon: TAB_ICON,
  byPath: true,
  label: (tab) => tab.name || hostOf(tab.path),
  meta: t("plugin.web-browser.tab.meta"),
  tooltip: (tab) => tab.path,
  activate: (tab) => show(tab.path),
  leave: () => {
    current = null;
  },
  beforeClose: (tab) => {
    const page = pages.get(tab.path);
    page?.frame?.remove();
    pages.delete(tab.path);
  },
});

Allkin.provide("web-browser", { open });

Allkin.registerApp({
  key: "web-browser",
  get name() {
    return t("plugin.web-browser.app.name");
  },
  get meta() {
    return t("plugin.web-browser.app.meta");
  },
  icon: TAB_ICON,
  open: async () => {
    const value = await core.prompt({
      title: t("plugin.web-browser.open.title"),
      okLabel: t("plugin.web-browser.open.ok"),
      input: { placeholder: t("plugin.web-browser.address.placeholder"), maxLength: 2000 },
    });
    if (value) open(value);
  },
});

/* ---- Wiring -------------------------------------------------------------- */

fillButtons(el("wb-view"));

el("wb-address-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const href = toAddress(el("wb-address").value);
  if (!href) return;
  el("wb-address").blur();
  if (href === current) show(href);
  else open(href);
});
el("wb-address").addEventListener("focus", (e) => e.target.select());
el("wb-address").addEventListener("keydown", (e) => {
  if (e.key === "Escape" && current) {
    e.target.value = current;
    e.target.blur();
  }
});

el("wb-reload").addEventListener("click", () => {
  const page = current && pages.get(current);
  if (!page?.frame) return;
  // A cross-origin frame cannot be told to reload: its address is set again.
  page.frame.src = "about:blank";
  requestAnimationFrame(() => (page.frame.src = current));
});
el("wb-copy").addEventListener("click", async () => {
  if (!current) return;
  try {
    await navigator.clipboard.writeText(current);
    toast(t("plugin.web-browser.copied"));
  } catch {
    toast(t("plugin.web-browser.copyFailed"), "ko");
  }
});
const openOutside = () => current && window.open(current, "_blank", "noopener,noreferrer");
el("wb-external").addEventListener("click", openOutside);
el("wb-notice-open").addEventListener("click", openOutside);
el("wb-notice-force").addEventListener("click", () => {
  const page = current && pages.get(current);
  if (!page) return;
  page.forced = true;
  renderNotice(current, page);
});

/* Every link to another site opens here, the browser's own gestures aside:
   Ctrl/⌘ + click, Shift + click, a middle click, a download. A link of
   Allkin itself is left alone. */
document.addEventListener(
  "click",
  (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest?.("a[href]");
    if (!link || link.hasAttribute("download") || link.closest("#wb-view")) return;
    let url;
    try {
      url = new URL(link.href, location.href);
    } catch {
      return;
    }
    if ((url.protocol !== "http:" && url.protocol !== "https:") || url.origin === location.origin) return;
    e.preventDefault();
    e.stopPropagation();
    open(url.href);
  },
  true,
);
})();
