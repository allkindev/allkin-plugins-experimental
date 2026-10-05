"use strict";
/* ============================================================================
   Notes plugin.
   ----------------------------------------------------------------------------
   A notepad in a tab of Allkin (kind "notes"): folders on the left, the notes
   of the folder shown in the middle, the note being written on the right.

   A note is a Markdown file, a folder is a folder: everything lives in the
   plugin's folder of the shared folder (share/notes/), so the agents read and
   write the same notes. Beside them:
     · Trash/       the bin of the notepad: deleting moves there, restoring
                    moves back; what is erased from it goes to the bin of the
                    shared folder;
     · _files/      the images and files dropped in the notes;
     · .notes.json  what a file cannot say: the pinned notes, and where each
                    element of the bin comes from.

   The document itself is written in the Markdown editor (capability
   "markdown-editor", plugin `markdown-editor`, required by the manifest):
   nothing here edits text.

   For the other plugins:
     Allkin.capability("notes").open()
     Allkin.capability("notes").create({ title, content, folder }) -> path
   ========================================================================== */
(() => {
const Allkin = window.Allkin;
const core = Allkin.core;
const { el, share } = core;
const t = Allkin.t;
const tn = Allkin.tn;

const KIND = "notes";
/** The plugin's folder in the shared folder. */
const ROOT = share.pluginFolder("notes");
const TRASH = "Trash";
const FILES = "_files";
const META = ".notes.json";
/** The views that are not a folder. A folder is its path, "" being the root. */
const ALL = "*all";
const PINNED = "*pinned";
const BIN = "*trash";
const STORE_KEY = "allkin.plugin.notes";
const SAVE_DELAY = 700;
const MAX_DEPTH = 8;
const NOTE_TYPE = "application/x-allkin-note";
const FOLDER_TYPE = "application/x-allkin-note-folder";
const toast = (message, kind = "ok") => core.toast?.(message, kind);
const isPhone = () => window.matchMedia("(max-width: 720px)").matches;

/* ---- Icons: Phosphor, light (and duotone for the tab) -------------------- */

// Generated from @phosphor-icons/core (MIT): light weight, and duotone for the tab.
const ICONS = {
  "notebook:light": [{"d":"M182,112a6,6,0,0,1-6,6H112a6,6,0,0,1,0-12h64A6,6,0,0,1,182,112Zm-6,26H112a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm46-90V208a14,14,0,0,1-14,14H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34H208A14,14,0,0,1,222,48ZM48,210H74V46H48a2,2,0,0,0-2,2V208A2,2,0,0,0,48,210ZM210,48a2,2,0,0,0-2-2H86V210H208a2,2,0,0,0,2-2Z"}],
  "note:light": [{"d":"M90,96a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H96A6,6,0,0,1,90,96Zm6,38h64a6,6,0,0,0,0-12H96a6,6,0,0,0,0,12Zm32,20H96a6,6,0,0,0,0,12h32a6,6,0,0,0,0-12ZM222,48V156.69a13.94,13.94,0,0,1-4.1,9.9L166.59,217.9a13.94,13.94,0,0,1-9.9,4.1H48a14,14,0,0,1-14-14V48A14,14,0,0,1,48,34H208A14,14,0,0,1,222,48ZM48,210H154V160a6,6,0,0,1,6-6h50V48a2,2,0,0,0-2-2H48a2,2,0,0,0-2,2V208A2,2,0,0,0,48,210Zm153.52-44H166v35.52Z"}],
  "note-blank:light": [{"d":"M208,34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H156.69a13.94,13.94,0,0,0,9.9-4.1l51.31-51.31a13.94,13.94,0,0,0,4.1-9.9V48A14,14,0,0,0,208,34ZM46,208V48a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2V154H160a6,6,0,0,0-6,6v50H48A2,2,0,0,1,46,208Zm120-6.49V166h35.52Z"}],
  "push-pin:light": [{"d":"M233.91,82.79,173.22,22.1a14,14,0,0,0-19.81,0L98.93,76.77c-9.52-3.25-34-8.34-59.71,12.41A14,14,0,0,0,38.1,110l49.71,49.71-44.05,44a6,6,0,1,0,8.48,8.48l44.05-44.05L146,217.89a14,14,0,0,0,9.9,4.11q.49,0,1,0a14,14,0,0,0,10.19-5.54c19.72-26.21,17.15-47.23,12.46-59.3l54.37-54.55A14,14,0,0,0,233.91,82.79ZM225.42,94.1h0l-57.27,57.46a6,6,0,0,0-1.11,6.92c9.94,19.88-1.71,40.32-9.54,50.72a2,2,0,0,1-3,.2L46.58,101.51a2,2,0,0,1,.18-3c12.5-10.09,24.5-12.76,33.7-12.76a42.13,42.13,0,0,1,17.25,3.41A6,6,0,0,0,104.64,88L161.9,30.59a2,2,0,0,1,2.83,0l60.69,60.68A2,2,0,0,1,225.42,94.1Z"}],
  "push-pin-slash:light": [{"d":"M52.44,36A6,6,0,0,0,43.56,44L71.27,74.51C61.78,76,50.6,80,39.22,89.18A14,14,0,0,0,38.1,110l49.71,49.71-44.05,44a6,6,0,1,0,8.48,8.48l44.05-44.05L146,217.89a14,14,0,0,0,9.9,4.11q.49,0,1,0a14,14,0,0,0,10.19-5.54,85.51,85.51,0,0,0,12.44-22.84l24,26.45a6,6,0,1,0,8.87-8.08ZM157.49,209.21a2,2,0,0,1-3,.2L46.58,101.51a2,2,0,0,1,.18-3c13.18-10.64,25.84-12.9,34.79-12.7L170,183.11C167.83,193.74,162.11,203.07,157.49,209.21Zm76.42-106.62-44.65,44.78a6,6,0,1,1-8.5-8.47l44.65-44.79a2,2,0,0,0,0-2.84L164.73,30.59a2,2,0,0,0-2.83,0L120.68,71.94a6,6,0,0,1-8.5-8.47l41.23-41.36a14,14,0,0,1,19.81,0l60.69,60.69A14,14,0,0,1,233.91,102.59Z"}],
  "trash:light": [{"d":"M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z"}],
  "folder:light": [{"d":"M216,74H130.49l-27.9-27.9a13.94,13.94,0,0,0-9.9-4.1H40A14,14,0,0,0,26,56V200.62A13.39,13.39,0,0,0,39.38,214H216.89A13.12,13.12,0,0,0,230,200.89V88A14,14,0,0,0,216,74ZM40,54H92.69a2,2,0,0,1,1.41.59L113.51,74H38V56A2,2,0,0,1,40,54ZM218,200.89a1.11,1.11,0,0,1-1.11,1.11H39.38A1.4,1.4,0,0,1,38,200.62V86H216a2,2,0,0,1,2,2Z"}],
  "folder-open:light": [{"d":"M243.36,111.81A14,14,0,0,0,232,106H214V88a14,14,0,0,0-14-14H130L101.74,52.8a14.06,14.06,0,0,0-8.4-2.8H40A14,14,0,0,0,26,64V208a6,6,0,0,0,6,6H211.1a6,6,0,0,0,5.69-4.1l28.49-85.47A14,14,0,0,0,243.36,111.81ZM40,62H93.34a2,2,0,0,1,1.2.4L124.4,84.8A6,6,0,0,0,128,86h72a2,2,0,0,1,2,2v18H69.77a14,14,0,0,0-13.28,9.57L38,171V64A2,2,0,0,1,40,62Zm193.9,58.63L206.78,202H40.33l27.54-82.63a2,2,0,0,1,1.9-1.37H232a2,2,0,0,1,1.9,2.63Z"}],
  "folder-plus:light": [{"d":"M216,74H130.49l-27.9-27.9a13.94,13.94,0,0,0-9.9-4.1H40A14,14,0,0,0,26,56V200.62A13.39,13.39,0,0,0,39.38,214H216.89A13.12,13.12,0,0,0,230,200.89V88A14,14,0,0,0,216,74ZM40,54H92.69a2,2,0,0,1,1.41.59L113.51,74H38V56A2,2,0,0,1,40,54ZM218,200.89a1.11,1.11,0,0,1-1.11,1.11H39.38A1.4,1.4,0,0,1,38,200.62V86H216a2,2,0,0,1,2,2ZM158,144a6,6,0,0,1-6,6H134v18a6,6,0,0,1-12,0V150H104a6,6,0,0,1,0-12h18V120a6,6,0,0,1,12,0v18h18A6,6,0,0,1,158,144Z"}],
  "plus:light": [{"d":"M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z"}],
  "dots-three:light": [{"d":"M138,128a10,10,0,1,1-10-10A10,10,0,0,1,138,128ZM60,118a10,10,0,1,0,10,10A10,10,0,0,0,60,118Zm136,0a10,10,0,1,0,10,10A10,10,0,0,0,196,118Z"}],
  "magnifying-glass:light": [{"d":"M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z"}],
  "caret-right:light": [{"d":"M180.24,132.24l-80,80a6,6,0,0,1-8.48-8.48L167.51,128,91.76,52.24a6,6,0,0,1,8.48-8.48l80,80A6,6,0,0,1,180.24,132.24Z"}],
  "caret-left:light": [{"d":"M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"}],
  "arrow-counter-clockwise:light": [{"d":"M222,128a94,94,0,0,1-92.74,94H128a93.43,93.43,0,0,1-64.5-25.65,6,6,0,1,1,8.24-8.72A82,82,0,1,0,70,70l-.19.19L39.44,98H72a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V56a6,6,0,0,1,12,0V90.34L61.63,61.4A94,94,0,0,1,222,128Z"}],
  "copy-simple:light": [{"d":"M184,66H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H184a6,6,0,0,0,6-6V72A6,6,0,0,0,184,66Zm-6,144H46V78H178ZM222,40V184a6,6,0,0,1-12,0V46H72a6,6,0,0,1,0-12H216A6,6,0,0,1,222,40Z"}],
  "download-simple:light": [{"d":"M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0Zm-98.24,4.24a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,129.51V32a6,6,0,0,0-12,0v97.51L92.24,99.76a6,6,0,0,0-8.48,8.48Z"}],
  "pencil-simple:light": [{"d":"M225.9,74.78,181.21,30.09a14,14,0,0,0-19.8,0L38.1,153.41a13.94,13.94,0,0,0-4.1,9.9V208a14,14,0,0,0,14,14H92.69a13.94,13.94,0,0,0,9.9-4.1L225.9,94.58a14,14,0,0,0,0-19.8ZM94.1,209.41a2,2,0,0,1-1.41.59H48a2,2,0,0,1-2-2V163.31a2,2,0,0,1,.59-1.41L136,72.48,183.51,120ZM217.41,86.1,192,111.51,144.49,64,169.9,38.58a2,2,0,0,1,2.83,0l44.68,44.69a2,2,0,0,1,0,2.83Z"}],
  "arrow-elbow-down-right:light": [{"d":"M220.24,180.24l-48,48a6,6,0,0,1-8.48-8.48L201.51,182H72a6,6,0,0,1-6-6V32a6,6,0,0,1,12,0V170H201.51l-37.75-37.76a6,6,0,1,1,8.48-8.48l48,48A6,6,0,0,1,220.24,180.24Z"}],
  "clipboard-text:light": [{"d":"M166,152a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,152Zm-6-38H96a6,6,0,0,0,0,12h64a6,6,0,0,0,0-12Zm54-66V216a14,14,0,0,1-14,14H56a14,14,0,0,1-14-14V48A14,14,0,0,1,56,34H93.17a45.91,45.91,0,0,1,69.66,0H200A14,14,0,0,1,214,48ZM94,64v2h68V64a34,34,0,0,0-68,0ZM202,48a2,2,0,0,0-2-2H170.33A45.77,45.77,0,0,1,174,64v8a6,6,0,0,1-6,6H88a6,6,0,0,1-6-6V64a45.77,45.77,0,0,1,3.67-18H56a2,2,0,0,0-2,2V216a2,2,0,0,0,2,2H200a2,2,0,0,0,2-2Z"}],
  "warning:light": [{"d":"M235.07,189.09,147.61,37.22h0a22.75,22.75,0,0,0-39.22,0L20.93,189.09a21.53,21.53,0,0,0,0,21.72A22.35,22.35,0,0,0,40.55,222h174.9a22.35,22.35,0,0,0,19.6-11.19A21.53,21.53,0,0,0,235.07,189.09ZM224.66,204.8a10.46,10.46,0,0,1-9.21,5.2H40.55a10.46,10.46,0,0,1-9.21-5.2,9.51,9.51,0,0,1,0-9.72L118.79,43.21a10.75,10.75,0,0,1,18.42,0l87.46,151.87A9.51,9.51,0,0,1,224.66,204.8ZM122,144V104a6,6,0,0,1,12,0v40a6,6,0,0,1-12,0Zm16,36a10,10,0,1,1-10-10A10,10,0,0,1,138,180Z"}],
  "notebook:duotone": [{"d":"M80,40V216H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8Z","o":"0.2"},{"d":"M184,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h64A8,8,0,0,1,184,112Zm-8,24H112a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm48-88V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H72V48H48Zm160,0V48H88V208H208Z"}],
};

function iconSvg(name) {
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g transform="scale(0.09375)" fill="currentColor" stroke="none">${(ICONS[`${name}:light`] ?? [])
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

const TAB_ICON = dualIcon("notebook", "#f59e0b");

function fillIcons(root) {
  for (const node of root.querySelectorAll("[data-nt-icon], [data-nt-label]")) {
    const label = node.dataset.ntLabel;
    node.innerHTML = (node.dataset.ntIcon ? iconSvg(node.dataset.ntIcon) : "") + (label ? `<span>${core.escapeHtml(t(label))}</span>` : "");
  }
}

/** An element, its class and its text. */
function h(tag, className = "", text = null) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== null) node.textContent = text;
  return node;
}

function iconNode(name, className = "nt-icon") {
  const node = h("span", className);
  node.setAttribute("aria-hidden", "true");
  node.innerHTML = iconSvg(name);
  return node;
}

/* ---- Paths --------------------------------------------------------------- */

/** A path of the notepad, as the shared folder knows it. */
const full = (path) => (path ? `${ROOT}/${path}` : ROOT);
const joinPath = (folder, name) => (folder ? `${folder}/${name}` : name);
const parentOf = (path) => (path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "");
const baseOf = (path) => path.slice(path.lastIndexOf("/") + 1);
const titleOf = (path) => baseOf(path).replace(/\.md$/i, "");
const isInside = (path, folder) => path === folder || path.startsWith(`${folder}/`);
/** `path` once `from` has become `to` (a rename, a move). */
const rebase = (path, from, to) => (path === from ? to : path.startsWith(`${from}/`) ? to + path.slice(from.length) : path);

/** A name the user typed, made fit for a file or a folder; "" when nothing is left. */
function cleanName(value) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[\\/\0-\x1f]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[.\s_]+/, "")
    .trim()
    .slice(0, 100)
    .trim();
}

/* ---- State --------------------------------------------------------------- */

/** path → { path, name, folders: [path], notes: [path] } ; "" is the root. */
let folders = new Map([["", { path: "", name: "", folders: [], notes: [] }]]);
/** path → { path, title, folder, size, createdAt, modifiedAt } */
let notes = new Map();
/** The bin: [{ name, type, modifiedAt }] */
let trash = [];
/** .notes.json */
let meta = { pinned: [], trash: {} };
/** path → { modifiedAt, text }: the texts already read, for excerpts and search. */
const contents = new Map();
/** The note open: { path, content, saved, modifiedAt, timer, chain } */
let current = null;
let editor = null;
let query = "";
let scanning = null;
let openSeq = 0;

const prefs = (() => {
  try {
    return { view: ALL, note: null, sort: "modified", collapsed: [], ...JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}") };
  } catch {
    return { view: ALL, note: null, sort: "modified", collapsed: [] };
  }
})();
function savePrefs() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(prefs));
  } catch {
    // No storage: the notepad opens on "All notes" next time, nothing else.
  }
}

const isPinned = (path) => meta.pinned.includes(path);
const isFolderView = (view = prefs.view) => view !== ALL && view !== PINNED && view !== BIN;

/* ---- Reading the notepad ------------------------------------------------- */

async function readMeta() {
  try {
    const raw = JSON.parse(await share.read(full(META)));
    return {
      pinned: Array.isArray(raw?.pinned) ? raw.pinned.filter((p) => typeof p === "string") : [],
      trash: raw?.trash && typeof raw.trash === "object" && !Array.isArray(raw.trash) ? raw.trash : {},
    };
  } catch {
    return { pinned: [], trash: {} };
  }
}

let metaChain = Promise.resolve();
/** Writes .notes.json, one write after the other. */
function saveMeta() {
  const text = `${JSON.stringify({ version: 1, pinned: meta.pinned, trash: meta.trash }, null, 2)}\n`;
  metaChain = metaChain.then(() => share.write(full(META), text)).catch((err) => toast(t("plugin.notes.error", { message: err.message }), "ko"));
  return metaChain;
}

/** Reads folders, notes, bin and .notes.json again. Calls made meanwhile share the same reading. */
function scan() {
  scanning ??= (async () => {
    // A write of .notes.json under way lands before it is read again.
    await metaChain;
    const nextFolders = new Map();
    const nextNotes = new Map();
    // What the root holds says whether there is a bin and a .notes.json to read.
    let hasTrash = false;
    let hasMeta = false;
    const walk = async (path, depth) => {
      let entries;
      try {
        entries = await share.list(full(path));
      } catch (err) {
        if (path) return;
        // First opening: the folder of the notepad does not exist yet.
        try {
          await share.mkdir(ROOT);
          entries = [];
        } catch {
          throw err;
        }
      }
      const folder = { path, name: baseOf(path), folders: [], notes: [] };
      nextFolders.set(path, folder);
      for (const entry of entries) {
        if (!path && entry.name === META) hasMeta = true;
        if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
        const child = joinPath(path, entry.name);
        if (entry.type === "dir") {
          if (!path && entry.name === TRASH) hasTrash = true;
          else folder.folders.push(child);
        } else if (/\.md$/i.test(entry.name)) {
          folder.notes.push(child);
          nextNotes.set(child, { path: child, title: titleOf(child), folder: path, size: entry.size, createdAt: entry.createdAt, modifiedAt: entry.modifiedAt });
        }
      }
      if (depth < MAX_DEPTH) await Promise.all(folder.folders.map((sub) => walk(sub, depth + 1)));
      else folder.folders = [];
    };
    await walk("", 0);
    const [nextTrash, nextMeta] = await Promise.all([
      hasTrash ? share.list(full(TRASH)).catch(() => []) : [],
      hasMeta ? readMeta() : { pinned: [], trash: {} },
    ]);
    folders = nextFolders;
    notes = nextNotes;
    trash = nextTrash.filter((entry) => !entry.name.startsWith("."));
    meta = nextMeta;
    for (const path of contents.keys()) if (!notes.has(path)) contents.delete(path);
  })().finally(() => {
    scanning = null;
  });
  return scanning;
}

/** The text of a note, read once per version of the file. */
async function textOf(path) {
  const note = notes.get(path);
  if (!note) return "";
  if (current?.path === path) return current.content;
  const known = contents.get(path);
  if (known && known.modifiedAt === note.modifiedAt) return known.text;
  const text = await share.read(full(path));
  contents.set(path, { modifiedAt: note.modifiedAt, text });
  return text;
}

/** Runs `job` over `items`, a few at a time. */
async function pooled(items, job, size = 5) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.min(size, queue.length) }, async () => {
      while (queue.length) await job(queue.shift()).catch(() => {});
    }),
  );
}

/** Markdown read as plain text: what an excerpt or a search looks at. */
function plainText(markdown) {
  return String(markdown ?? "")
    .replace(/```[^\n]*\n?/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}|>+|[-*+]|\d+[.)])\s+/gm, "")
    .replace(/^\s*\[[ xX]\]\s+/gm, "")
    .replace(/[*_~`|]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptOf(text, needle = "") {
  const plain = plainText(text);
  if (needle) {
    const at = plain.toLowerCase().indexOf(needle);
    if (at > 40) return `…${plain.slice(at - 40, at + 100)}`;
  }
  return plain.slice(0, 140);
}

/* ---- Saving the note open ------------------------------------------------ */

function setState(key) {
  const node = el("nt-state");
  node.textContent = key ? t(`plugin.notes.state.${key}`) : "";
  node.classList.toggle("is-error", key === "error");
}

function scheduleSave() {
  const note = current;
  if (!note) return;
  setState("editing");
  clearTimeout(note.timer);
  note.timer = setTimeout(() => void save(note), SAVE_DELAY);
  renderFoot();
}

/** Writes the note if it changed. One write at a time per note: a rename or a
 *  move joins the same chain, so that a text never lands at a path just left. */
function save(note = current) {
  if (!note) return Promise.resolve();
  clearTimeout(note.timer);
  note.timer = null;
  note.chain = note.chain.then(async () => {
    if (note.content === note.saved) return;
    const text = note.content;
    if (current === note) setState("saving");
    try {
      const result = await share.write(full(note.path), text);
      note.saved = text;
      note.modifiedAt = result?.modifiedAt ?? new Date().toISOString();
      const listed = notes.get(note.path);
      if (listed) {
        listed.modifiedAt = note.modifiedAt;
        listed.size = text.length;
      }
      contents.set(note.path, { modifiedAt: note.modifiedAt, text });
      if (current === note) {
        setState(note.content === text ? "saved" : "editing");
        refreshRow(note.path);
        renderFoot();
      }
    } catch (err) {
      if (current === note) setState("error");
      toast(t("plugin.notes.save.failed", { message: err.message }), "ko");
    }
  });
  return note.chain;
}

/** Everything typed is on disk when this resolves. */
const flush = () => save(current);

/* ---- The Markdown editor ------------------------------------------------- */

const RASTER = /\.(png|jpe?g|gif|webp|avif|bmp|ico)$/i;

function safeFileName(name) {
  const dot = name.lastIndexOf(".");
  const clean = (part) => part.normalize("NFC").replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/^[-.]+|[-.]+$/g, "");
  const base = clean(dot > 0 ? name.slice(0, dot) : name) || "file";
  const ext = dot > 0 ? clean(name.slice(dot + 1)).toLowerCase() : "";
  return ext ? `${base}.${ext}` : base;
}

/** Where the editor stores what is dropped in a note, and where it reads it
 *  from. One folder for the whole notepad (_files/), and addresses written
 *  from the root of the notepad: a note keeps its images when it moves. */
const editorFiles = {
  async upload(file) {
    const name = `${Date.now().toString(36)}-${safeFileName(file.name)}`;
    const form = new FormData();
    form.append("path", `${ROOT}/${FILES}/${name}`);
    form.append("file", file, name);
    const res = await fetch(`/api/agents/${encodeURIComponent(share.scope)}/data/upload`, { method: "POST", body: form, credentials: "same-origin" });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok || !payload.path) throw new Error(payload.error || t("plugin.notes.upload.failed", { status: res.status }));
    return { src: String(payload.path).slice(ROOT.length + 1), name: file.name };
  },
  resolve(src, usage) {
    let path = String(src ?? "").trim();
    try {
      path = decodeURIComponent(path);
    } catch {
      // Badly encoded: taken as it is.
    }
    path = path.replace(/^\.\//, "");
    if (!path || path.startsWith("/") || path.split("/").some((part) => part === ".." || part === "." || part === "")) return null;
    // Written by this notepad: from its root. Anything else (a note written by
    // an agent, by hand): next to the note.
    const target = path.startsWith(`${FILES}/`) ? path : joinPath(current ? parentOf(current.path) : "", path);
    const inline = usage === "image" || RASTER.test(path) || /\.pdf$/i.test(path);
    return share.url(full(target), !inline);
  },
};

/** The editor, created at the first note opened: the capability is resolved
 *  when used, never at load. False when the Markdown editor is not there. */
function mountEditor() {
  if (editor) return true;
  const markdown = Allkin.capability("markdown-editor");
  if (!markdown) return false;
  editor = markdown.create({
    host: el("nt-doc"),
    toolbar: el("nt-toolbar"),
    spellcheck: true,
    files: editorFiles,
    doc: {
      getContent: () => current?.content ?? "",
      setContent: (next) => {
        if (!current || next === current.content) return;
        current.content = next;
        scheduleSave();
      },
      isActive: () => Boolean(current) && core.activeTab()?.kind === KIND,
    },
  });
  return true;
}

/* ---- The note open -------------------------------------------------------- */

function showNote() {
  const open = Boolean(current);
  el("nt-note-empty").classList.toggle("hidden", open);
  el("nt-note-body").classList.toggle("hidden", !open);
  el("nt-note-menu").disabled = !open;
  if (open) el("nt-title").value = titleOf(current.path);
  for (const row of el("nt-list").querySelectorAll(".nt-item")) row.classList.toggle("is-current", open && row.dataset.path === current.path);
  renderFoot();
  renderWhere();
}

function renderFoot() {
  const foot = el("nt-foot");
  if (!current) return foot.replaceChildren();
  const plain = plainText(current.content);
  const words = plain ? plain.split(" ").length : 0;
  foot.textContent = [tn("plugin.notes.words", words), tn("plugin.notes.characters", plain.length), t("plugin.notes.modified", { date: core.formatDateTime(current.modifiedAt) })].join(" · ");
}

async function openNote(path, { focus = null } = {}) {
  if (current?.path !== path) {
    const seq = ++openSeq;
    await flush();
    const note = notes.get(path);
    if (!note || seq !== openSeq) return;
    let text;
    try {
      text = await share.read(full(path));
    } catch (err) {
      toast(t("plugin.notes.error", { message: err.message }), "ko");
      return;
    }
    if (seq !== openSeq) return;
    contents.set(path, { modifiedAt: note.modifiedAt, text });
    current = { path, content: text, saved: text, modifiedAt: note.modifiedAt, timer: null, chain: Promise.resolve() };
    prefs.note = path;
    savePrefs();
    setState("");
    showNote();
    if (!mountEditor()) return;
    editor.render();
    el("nt-doc").scrollTop = 0;
  }
  setPane("note");
  if (focus === "title") {
    el("nt-title").focus();
    el("nt-title").select();
  } else if (focus === "text") editor?.focus("end");
}

/** Closes the note open (it left: deleted, moved to the bin). */
function closeNote() {
  if (!current) return;
  clearTimeout(current.timer);
  current = null;
  openSeq++;
  prefs.note = null;
  savePrefs();
  setState("");
  showNote();
  editor?.render();
  if (el("nt-view").dataset.pane === "note") setPane("list");
}

/* ---- Panes (phone) -------------------------------------------------------- */

function setPane(pane) {
  el("nt-view").dataset.pane = pane;
  renderWhere();
}

function viewName(view = prefs.view) {
  if (view === ALL) return t("plugin.notes.view.all");
  if (view === PINNED) return t("plugin.notes.view.pinned");
  if (view === BIN) return t("plugin.notes.view.trash");
  return view.split("/").join(" / ");
}

/** What the page bar says: the folder shown, or the one of the note on a phone. */
function renderWhere() {
  const onNote = el("nt-view").dataset.pane === "note" && current && isPhone();
  el("nt-where").textContent = onNote ? parentOf(current.path).split("/").join(" / ") || t("plugin.notes.view.all") : query ? t("plugin.notes.search.results") : viewName();
}

/* ---- Folders pane --------------------------------------------------------- */

function countIn(path) {
  const folder = folders.get(path);
  return folder ? folder.notes.length + folder.folders.reduce((sum, sub) => sum + countIn(sub), 0) : 0;
}

function folderRow({ view, icon, label, count, depth = 0, caret = null }) {
  const row = h("div", "nt-frow");
  row.dataset.view = view;
  row.style.setProperty("--nt-depth", String(depth));
  row.classList.toggle("is-current", !query && prefs.view === view);
  if (caret) {
    const toggle = h("button", `nt-caret${caret.open ? " is-open" : ""}`);
    toggle.type = "button";
    toggle.innerHTML = iconSvg("caret-right");
    toggle.setAttribute("aria-label", t(caret.open ? "plugin.notes.folder.collapse" : "plugin.notes.folder.expand"));
    toggle.addEventListener("click", () => {
      prefs.collapsed = caret.open ? [...prefs.collapsed, view] : prefs.collapsed.filter((p) => p !== view);
      savePrefs();
      renderFolders();
    });
    row.appendChild(toggle);
  } else row.appendChild(h("span", "nt-caret-gap"));
  const button = h("button", "nt-fbtn");
  button.type = "button";
  button.append(iconNode(icon), h("span", "nt-fname", label));
  if (count) button.appendChild(h("span", "nt-fcount", String(count)));
  button.addEventListener("click", () => selectView(view));
  row.appendChild(button);
  return row;
}

function renderFolders() {
  const nav = el("nt-folders");
  const rows = [];
  const all = folderRow({ view: ALL, icon: "notebook", label: t("plugin.notes.view.all"), count: notes.size });
  // Dropping on "All notes" puts back at the root of the notepad.
  bindDrop(all, "");
  rows.push(all);
  const pinned = meta.pinned.filter((p) => notes.has(p)).length;
  if (pinned) rows.push(folderRow({ view: PINNED, icon: "push-pin", label: t("plugin.notes.view.pinned"), count: pinned }));

  const addTree = (path, depth) => {
    const folder = folders.get(path);
    if (!folder) return;
    const open = !prefs.collapsed.includes(path);
    const current = !query && prefs.view === path;
    const row = folderRow({
      view: path,
      icon: current ? "folder-open" : "folder",
      label: folder.name,
      count: countIn(path),
      depth,
      caret: folder.folders.length ? { open } : null,
    });
    row.draggable = true;
    row.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData(FOLDER_TYPE, path);
      e.dataTransfer.effectAllowed = "move";
    });
    bindDrop(row, path);
    row.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      openMenu(folderMenu(path), { x: e.clientX, y: e.clientY });
    });
    core.bindLongPress?.(row, (touch) => openMenu(folderMenu(path), { x: touch.clientX, y: touch.clientY }));
    rows.push(row);
    if (open) for (const sub of folder.folders) addTree(sub, depth + 1);
  };
  const root = folders.get("");
  if (root?.folders.length) rows.push(h("p", "nt-fsep", t("plugin.notes.folders.label")));
  for (const sub of root?.folders ?? []) addTree(sub, 0);

  const bin = folderRow({ view: BIN, icon: "trash", label: t("plugin.notes.view.trash"), count: trash.length });
  bin.classList.add("nt-frow-bin");
  rows.push(bin);
  nav.replaceChildren(...rows);
}

function selectView(view) {
  if (query) {
    query = "";
    el("nt-search").value = "";
  }
  prefs.view = view;
  savePrefs();
  renderFolders();
  renderList();
  setPane("list");
}

/* ---- Drag and drop: a note or a folder onto a folder ----------------------- */

function bindDrop(row, folder) {
  const accepts = (e) => e.dataTransfer.types.includes(NOTE_TYPE) || e.dataTransfer.types.includes(FOLDER_TYPE);
  row.addEventListener("dragover", (e) => {
    if (!accepts(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    row.classList.add("is-drop");
  });
  row.addEventListener("dragleave", () => row.classList.remove("is-drop"));
  row.addEventListener("drop", (e) => {
    row.classList.remove("is-drop");
    const note = e.dataTransfer.getData(NOTE_TYPE);
    const moved = e.dataTransfer.getData(FOLDER_TYPE);
    if (!note && !moved) return;
    e.preventDefault();
    void moveTo(note || moved, folder, note ? "note" : "folder");
  });
}

/* ---- Notes list ----------------------------------------------------------- */

const SORTS = {
  modified: (a, b) => b.modifiedAt.localeCompare(a.modifiedAt),
  created: (a, b) => b.createdAt.localeCompare(a.createdAt),
  title: (a, b) => a.title.localeCompare(b.title, Allkin.i18n.locale, { numeric: true, sensitivity: "base" }),
};

/** The notes the list shows, in order: pinned first, then the sort chosen. */
function shownNotes() {
  let list;
  const needle = query.toLowerCase();
  if (needle) {
    list = [...notes.values()].filter((n) => n.title.toLowerCase().includes(needle) || plainText(contents.get(n.path)?.text).toLowerCase().includes(needle));
  } else if (prefs.view === ALL) list = [...notes.values()];
  else if (prefs.view === PINNED) list = meta.pinned.map((p) => notes.get(p)).filter(Boolean);
  else list = (folders.get(prefs.view)?.notes ?? []).map((p) => notes.get(p)).filter(Boolean);
  const order = SORTS[prefs.sort] ?? SORTS.modified;
  return list.sort((a, b) => Number(isPinned(b.path)) - Number(isPinned(a.path)) || order(a, b));
}

function noteRow(note) {
  const row = h("div", "nt-item");
  row.setAttribute("role", "listitem");
  row.tabIndex = 0;
  row.dataset.path = note.path;
  row.draggable = true;
  row.classList.toggle("is-current", current?.path === note.path);
  const head = h("div", "nt-item-head");
  if (isPinned(note.path)) head.appendChild(iconNode("push-pin", "nt-item-pin"));
  head.appendChild(h("span", "nt-item-title", note.title));
  const sub = h("div", "nt-item-sub");
  sub.append(h("span", "nt-item-date", core.formatRelativeTime?.(note.modifiedAt) ?? core.formatDateTime(note.modifiedAt)), h("span", "nt-item-text"));
  row.append(head, sub);
  // Where it is, when the list mixes folders.
  if ((query || !isFolderView()) && note.folder) {
    const where = h("div", "nt-item-where");
    where.append(iconNode("folder"), h("span", "", note.folder.split("/").join(" / ")));
    row.appendChild(where);
  }
  row.addEventListener("click", () => void openNote(note.path));
  row.addEventListener("keydown", (e) => {
    if (e.key === "Enter") void openNote(note.path, { focus: "text" });
    else if (e.key === "Delete") void trashNote(note.path);
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      (e.key === "ArrowDown" ? row.nextElementSibling : row.previousElementSibling)?.focus();
    }
  });
  row.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    openMenu(noteMenu(note.path), { x: e.clientX, y: e.clientY });
  });
  core.bindLongPress?.(row, (touch) => openMenu(noteMenu(note.path), { x: touch.clientX, y: touch.clientY }));
  row.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData(NOTE_TYPE, note.path);
    e.dataTransfer.effectAllowed = "move";
  });
  return row;
}

/** The date and the excerpt of a row, again: the note was just saved. */
function refreshRow(path) {
  const row = [...el("nt-list").querySelectorAll(".nt-item")].find((r) => r.dataset.path === path);
  const note = notes.get(path);
  if (!row || !note) return;
  row.querySelector(".nt-item-date").textContent = core.formatRelativeTime?.(note.modifiedAt) ?? core.formatDateTime(note.modifiedAt);
  row.querySelector(".nt-item-text").textContent = excerptOf(contents.get(path)?.text, query.toLowerCase());
}

function trashRow(entry) {
  const row = h("div", "nt-item nt-item-trash");
  row.setAttribute("role", "listitem");
  const info = meta.trash[entry.name];
  const head = h("div", "nt-item-head");
  head.append(iconNode(entry.type === "dir" ? "folder" : "note"), h("span", "nt-item-title", entry.type === "dir" ? entry.name : titleOf(entry.name)));
  const sub = h("div", "nt-item-sub");
  sub.appendChild(h("span", "nt-item-date", t("plugin.notes.trash.deleted", { date: core.formatDateTime(info?.at ?? entry.modifiedAt) })));
  if (info?.from) sub.appendChild(h("span", "nt-item-text", info.from.split("/").join(" / ")));
  const actions = h("div", "nt-item-actions");
  const restore = h("button", "nt-item-btn");
  restore.type = "button";
  restore.innerHTML = `${iconSvg("arrow-counter-clockwise")}<span>${core.escapeHtml(t("plugin.notes.trash.restore"))}</span>`;
  restore.addEventListener("click", () => void restoreEntry(entry));
  const erase = h("button", "nt-item-btn is-danger");
  erase.type = "button";
  erase.innerHTML = `${iconSvg("trash")}<span>${core.escapeHtml(t("plugin.notes.trash.erase"))}</span>`;
  erase.addEventListener("click", () => void eraseEntry(entry));
  actions.append(restore, erase);
  row.append(head, sub, actions);
  return row;
}

function emptyRow(key) {
  return h("p", "nt-list-empty", t(key));
}

function renderList() {
  const list = el("nt-list");
  const inBin = !query && prefs.view === BIN;
  el("nt-sort").classList.toggle("hidden", inBin);
  el("nt-empty-trash").classList.toggle("hidden", !inBin || trash.length === 0);
  el("nt-sort").value = prefs.sort;
  renderWhere();
  if (inBin) {
    el("nt-count").textContent = tn("plugin.notes.trash.count", trash.length);
    list.replaceChildren(...(trash.length ? trash.map(trashRow) : [emptyRow("plugin.notes.trash.none")]));
    return;
  }
  const shown = shownNotes();
  el("nt-count").textContent = tn("plugin.notes.count", shown.length);
  list.replaceChildren(...(shown.length ? shown.map(noteRow) : [emptyRow(query ? "plugin.notes.search.none" : "plugin.notes.list.none")]));
  // Excerpts arrive as the texts are read.
  const needle = query.toLowerCase();
  void pooled(shown, async (note) => {
    await textOf(note.path);
    if (needle === query.toLowerCase()) refreshRow(note.path);
  });
}

/* ---- Search ---------------------------------------------------------------- */

let searchTimer = null;
function onSearch(value) {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    query = value.trim();
    renderFolders();
    // Titles answer at once; the texts once they are all read.
    renderList();
    if (!query) return;
    const asked = query;
    await pooled([...notes.keys()], (path) => textOf(path));
    if (asked === query) renderList();
  }, 200);
}

/* ---- Menus ------------------------------------------------------------------ */

function closeMenu() {
  el("nt-menu").classList.add("hidden");
}

/** A menu at a point of the screen, or under a button. */
function openMenu(items, { x, y, anchor } = {}) {
  core.closeTabContextMenu?.();
  window.getSelection?.()?.removeAllRanges?.();
  const menu = el("nt-menu");
  menu.replaceChildren(
    ...items.filter(Boolean).map((item) => {
      if (item === "-") return h("div", "nt-menu-sep");
      const button = h("button", `nt-menu-item${item.danger ? " is-danger" : ""}`);
      button.type = "button";
      button.setAttribute("role", "menuitem");
      button.innerHTML = `${iconSvg(item.icon)}<span>${core.escapeHtml(item.label)}</span>`;
      button.addEventListener("click", () => {
        closeMenu();
        void item.run();
      });
      return button;
    }),
  );
  menu.classList.remove("hidden");
  const box = menu.getBoundingClientRect();
  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    x = rect.right - box.width;
    y = rect.bottom + 4;
  }
  menu.style.left = `${Math.max(8, Math.min(x, window.innerWidth - box.width - 8))}px`;
  menu.style.top = `${Math.max(8, Math.min(y, window.innerHeight - box.height - 8))}px`;
  menu.querySelector("button")?.focus({ preventScroll: true });
}

function noteMenu(path) {
  const pinned = isPinned(path);
  return [
    { icon: pinned ? "push-pin-slash" : "push-pin", label: t(pinned ? "plugin.notes.note.unpin" : "plugin.notes.note.pin"), run: () => togglePin(path) },
    { icon: "pencil-simple", label: t("plugin.notes.rename"), run: () => openNote(path, { focus: "title" }) },
    { icon: "copy-simple", label: t("plugin.notes.note.duplicate"), run: () => duplicateNote(path) },
    { icon: "arrow-elbow-down-right", label: t("plugin.notes.move"), run: () => pickFolder(path, "note") },
    "-",
    { icon: "clipboard-text", label: t("plugin.notes.note.copyText"), run: () => copyText(path) },
    { icon: "download-simple", label: t("plugin.notes.note.download"), run: () => download(path) },
    "-",
    { icon: "trash", label: t("plugin.notes.delete"), danger: true, run: () => trashNote(path) },
  ];
}

function folderMenu(path) {
  return [
    { icon: "plus", label: t("plugin.notes.note.newHere"), run: () => createNote({ folder: path }) },
    { icon: "folder-plus", label: t("plugin.notes.folder.newSub"), run: () => createFolder(path) },
    "-",
    { icon: "pencil-simple", label: t("plugin.notes.rename"), run: () => renameFolder(path) },
    { icon: "arrow-elbow-down-right", label: t("plugin.notes.move"), run: () => pickFolder(path, "folder") },
    "-",
    { icon: "trash", label: t("plugin.notes.delete"), danger: true, run: () => trashFolder(path) },
  ];
}

/* ---- "Move to…" -------------------------------------------------------------- */

function pickFolder(path, kind) {
  const dialog = el("nt-picker");
  el("nt-picker-title").textContent = t("plugin.notes.move.title", { name: kind === "note" ? titleOf(path) : baseOf(path) });
  const rows = [];
  const add = (folder, depth) => {
    // A folder goes neither into itself nor into what it holds.
    if (kind === "folder" && isInside(folder, path)) return;
    const button = h("button", "nt-picker-row");
    button.type = "button";
    button.style.setProperty("--nt-depth", String(depth));
    button.append(iconNode(folder ? "folder" : "notebook"), h("span", "", folder ? baseOf(folder) : t("plugin.notes.root")));
    button.disabled = folder === parentOf(path);
    button.addEventListener("click", () => {
      dialog.close();
      void moveTo(path, folder, kind);
    });
    rows.push(button);
    for (const sub of folders.get(folder)?.folders ?? []) add(sub, depth + 1);
  };
  add("", 0);
  el("nt-picker-list").replaceChildren(...rows);
  dialog.showModal();
}

/* ---- Actions ------------------------------------------------------------------ */

/** Re-reads the notepad and draws it again. */
async function refresh() {
  try {
    await scan();
  } catch (err) {
    toast(t("plugin.notes.error", { message: err.message }), "ko");
  }
  if (isFolderView() && !folders.has(prefs.view)) prefs.view = ALL;
  if (prefs.view === PINNED && !meta.pinned.some((p) => notes.has(p))) prefs.view = ALL;
  renderFolders();
  renderList();
  await syncCurrent();
}

/** The note open against what is on disk: an agent may have rewritten it, or removed it. */
async function syncCurrent() {
  const note = current;
  if (!note) return;
  const listed = notes.get(note.path);
  const dirty = note.content !== note.saved;
  if (!listed) {
    // Gone. What is being typed is kept: saving writes the file again.
    if (!dirty) closeNote();
    return;
  }
  if (dirty || listed.modifiedAt === note.modifiedAt) return;
  try {
    const text = await share.read(full(note.path));
    if (current !== note || note.content !== note.saved) return;
    note.content = note.saved = text;
    note.modifiedAt = listed.modifiedAt;
    contents.set(note.path, { modifiedAt: listed.modifiedAt, text });
    editor?.reload();
    renderFoot();
  } catch {
    // Unreadable right now: the next visit tries again.
  }
}

/** A name free in `folder`: "Title", "Title 2", "Title 3"… */
function freeName(folder, base, ext = "") {
  const node = folders.get(folder);
  const taken = new Set([...(node?.notes ?? []), ...(node?.folders ?? [])].map((p) => baseOf(p).toLowerCase()));
  if (!folder) taken.add(TRASH.toLowerCase());
  let name = `${base}${ext}`;
  for (let n = 2; taken.has(name.toLowerCase()); n++) name = `${base} ${n}${ext}`;
  return name;
}

async function attempt(job) {
  try {
    return await job();
  } catch (err) {
    toast(t("plugin.notes.error", { message: err.message }), "ko");
    await refresh();
    return undefined;
  }
}

async function createNote({ folder = isFolderView() ? prefs.view : "", title = "", content = "", focus = "title" } = {}) {
  if (!folders.has(folder)) folder = "";
  const path = joinPath(folder, freeName(folder, cleanName(title) || t("plugin.notes.note.untitled"), ".md"));
  return attempt(async () => {
    await share.write(full(path), content);
    if (query || (prefs.view !== ALL && prefs.view !== folder)) {
      query = "";
      el("nt-search").value = "";
      prefs.view = folder || ALL;
    }
    prefs.collapsed = prefs.collapsed.filter((p) => !isInside(folder, p));
    await refresh();
    await openNote(path, { focus });
    return path;
  });
}

async function createFolder(parent = isFolderView() ? prefs.view : "") {
  const typed = await core.prompt({
    title: parent ? t("plugin.notes.folder.newIn", { name: baseOf(parent) }) : t("plugin.notes.folder.newTitle"),
    okLabel: t("plugin.notes.create"),
    input: { placeholder: t("plugin.notes.folder.placeholder"), maxLength: 100 },
  });
  const name = cleanName(typed);
  if (!name) return;
  if (freeName(parent, name) !== name) return toast(t("plugin.notes.exists", { name }), "ko");
  const path = joinPath(parent, name);
  await attempt(async () => {
    await share.mkdir(full(path));
    prefs.collapsed = prefs.collapsed.filter((p) => p !== parent);
    prefs.view = path;
    savePrefs();
    await refresh();
  });
}

/** Everything that names `from` now names `to`: the pins, the note open, the view, the folded folders. */
function follow(from, to) {
  meta.pinned = meta.pinned.map((p) => rebase(p, from, to));
  prefs.collapsed = prefs.collapsed.map((p) => rebase(p, from, to));
  if (isFolderView()) prefs.view = rebase(prefs.view, from, to);
  if (prefs.note) prefs.note = rebase(prefs.note, from, to);
  if (current) current.path = rebase(current.path, from, to);
  for (const [path, known] of [...contents]) {
    const next = rebase(path, from, to);
    if (next === path) continue;
    contents.delete(path);
    contents.set(next, known);
  }
  savePrefs();
}

/** Moves a note or a folder inside the notepad; what is typed is written first, at the old path. */
async function relocate(from, to) {
  const note = current && isInside(current.path, from) ? current : null;
  const move = async () => {
    await share.move(full(from), full(to));
    const pinned = meta.pinned.some((p) => isInside(p, from));
    follow(from, to);
    if (pinned) await saveMeta();
  };
  if (note) {
    await save(note);
    // On the note's own chain: a save asked meanwhile waits for the new path.
    note.chain = note.chain.then(move);
    await note.chain.catch((err) => {
      note.chain = Promise.resolve();
      throw err;
    });
  } else await move();
}

async function moveTo(path, folder, kind) {
  if (parentOf(path) === folder || !folders.has(folder)) return;
  if (kind === "folder" && isInside(folder, path)) return;
  const name = baseOf(path);
  if (freeName(folder, name) !== name) return toast(t("plugin.notes.exists", { name: kind === "note" ? titleOf(name) : name }), "ko");
  await attempt(async () => {
    await relocate(path, joinPath(folder, name));
    await refresh();
    showNote();
    toast(t("plugin.notes.moved", { name: kind === "note" ? titleOf(name) : name, folder: folder ? baseOf(folder) : t("plugin.notes.root") }));
  });
}

/** The title typed above the note becomes the name of its file. */
async function renameCurrent() {
  const note = current;
  if (!note) return;
  const input = el("nt-title");
  const before = titleOf(note.path);
  const wanted = cleanName(input.value);
  if (!wanted || wanted === before) {
    input.value = before;
    return;
  }
  const folder = parentOf(note.path);
  // Another case of the same name is the same file to some file systems: the name itself is not "taken".
  if (wanted.toLowerCase() !== before.toLowerCase() && freeName(folder, wanted, ".md") !== `${wanted}.md`) {
    input.value = before;
    return toast(t("plugin.notes.exists", { name: wanted }), "ko");
  }
  await attempt(async () => {
    await relocate(note.path, joinPath(folder, `${wanted}.md`));
    await refresh();
    showNote();
  });
  if (current === note) input.value = titleOf(note.path);
}

async function renameFolder(path) {
  const before = baseOf(path);
  const typed = await core.prompt({
    title: t("plugin.notes.folder.renameTitle", { name: before }),
    okLabel: t("plugin.notes.rename"),
    input: { value: before, maxLength: 100 },
  });
  const name = cleanName(typed);
  if (!name || name === before) return;
  const parent = parentOf(path);
  if (name.toLowerCase() !== before.toLowerCase() && freeName(parent, name) !== name) return toast(t("plugin.notes.exists", { name }), "ko");
  await attempt(async () => {
    await relocate(path, joinPath(parent, name));
    await refresh();
    showNote();
  });
}

async function togglePin(path) {
  meta.pinned = isPinned(path) ? meta.pinned.filter((p) => p !== path) : [...meta.pinned.filter((p) => notes.has(p)), path];
  if (prefs.view === PINNED && !meta.pinned.length) prefs.view = ALL;
  renderFolders();
  renderList();
  await saveMeta();
}

async function duplicateNote(path) {
  await attempt(async () => {
    const text = await textOf(path);
    const folder = parentOf(path);
    const copy = joinPath(folder, freeName(folder, titleOf(path), ".md"));
    await share.write(full(copy), text);
    await refresh();
    await openNote(copy, { focus: "title" });
  });
}

async function copyText(path) {
  try {
    await navigator.clipboard.writeText(await textOf(path));
    toast(t("plugin.notes.note.copied"));
  } catch {
    toast(t("plugin.notes.note.copyFailed"), "ko");
  }
}

async function download(path) {
  if (current?.path === path) await flush();
  const link = document.createElement("a");
  link.href = share.url(full(path), true);
  link.download = baseOf(path);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* ---- The bin -------------------------------------------------------------------- */

/** To the bin of the notepad, remembering where it was. */
async function toTrash(path) {
  const base = baseOf(path);
  const dot = /\.md$/i.test(base) ? base.lastIndexOf(".") : base.length;
  const taken = new Set(trash.map((entry) => entry.name.toLowerCase()));
  let name = base;
  for (let n = 2; taken.has(name.toLowerCase()); n++) name = `${base.slice(0, dot)} (${n})${base.slice(dot)}`;
  if (current && isInside(current.path, path)) {
    await flush();
    closeNote();
  }
  await share.move(full(path), full(joinPath(TRASH, name)));
  meta.trash[name] = { from: parentOf(path), at: new Date().toISOString() };
  meta.pinned = meta.pinned.filter((p) => !isInside(p, path));
  await saveMeta();
}

async function trashNote(path) {
  await attempt(async () => {
    await toTrash(path);
    await refresh();
    toast(t("plugin.notes.trash.moved", { name: titleOf(path) }));
  });
}

async function trashFolder(path) {
  const count = countIn(path);
  const ok = await core.confirm({
    title: t("plugin.notes.folder.deleteTitle", { name: baseOf(path) }),
    text: count ? tn("plugin.notes.folder.deleteText", count) : t("plugin.notes.folder.deleteEmpty"),
    okLabel: t("plugin.notes.delete"),
    danger: true,
  });
  if (!ok) return;
  await attempt(async () => {
    await toTrash(path);
    await refresh();
    toast(t("plugin.notes.trash.moved", { name: baseOf(path) }));
  });
}

async function restoreEntry(entry) {
  await attempt(async () => {
    const from = meta.trash[entry.name]?.from ?? "";
    const folder = folders.has(from) ? from : "";
    const isNote = entry.type !== "dir";
    // Its name of before the bin: "Title (2).md" was "Title.md".
    const original = entry.name.replace(/ \(\d+\)(?=(\.md)?$)/i, "");
    const name = isNote ? freeName(folder, titleOf(original), ".md") : freeName(folder, original);
    await share.move(full(joinPath(TRASH, entry.name)), full(joinPath(folder, name)));
    delete meta.trash[entry.name];
    await saveMeta();
    await refresh();
    toast(t("plugin.notes.trash.restored", { name: isNote ? titleOf(name) : name, folder: folder ? baseOf(folder) : t("plugin.notes.root") }));
  });
}

async function eraseEntry(entry) {
  const name = entry.type === "dir" ? entry.name : titleOf(entry.name);
  const ok = await core.confirm({
    title: t("plugin.notes.trash.eraseTitle", { name }),
    text: t("plugin.notes.trash.eraseText"),
    okLabel: t("plugin.notes.trash.erase"),
    danger: true,
  });
  if (!ok) return;
  await attempt(async () => {
    await share.remove(full(joinPath(TRASH, entry.name)));
    delete meta.trash[entry.name];
    await saveMeta();
    await refresh();
  });
}

async function emptyTrash() {
  if (!trash.length) return;
  const ok = await core.confirm({
    title: t("plugin.notes.trash.emptyTitle"),
    text: `${tn("plugin.notes.trash.emptyText", trash.length)} ${t("plugin.notes.trash.eraseText")}`,
    okLabel: t("plugin.notes.trash.empty"),
    danger: true,
  });
  if (!ok) return;
  await attempt(async () => {
    for (const entry of trash) await share.remove(full(joinPath(TRASH, entry.name)));
    meta.trash = {};
    await saveMeta();
    await refresh();
    toast(t("plugin.notes.trash.emptied"));
  });
}

/* ---- Tab ------------------------------------------------------------------------- */

let started = false;

async function activate() {
  const ready = Boolean(Allkin.capability("markdown-editor"));
  el("nt-missing").classList.toggle("hidden", ready);
  if (!ready) return;
  await refresh();
  if (started) return;
  started = true;
  // Back on the note left last time — on a phone the list comes first.
  if (!isPhone() && prefs.note && notes.has(prefs.note)) await openNote(prefs.note);
  else showNote();
  if (isPhone()) setPane("list");
}

function open() {
  core.openTab(null, KIND);
}

Allkin.registerTabKind(KIND, {
  panels: ["nt-view"],
  icon: TAB_ICON,
  label: () => t("plugin.notes.app.name"),
  meta: t("plugin.notes.app.meta"),
  tooltip: () => t("plugin.notes.app.tooltip"),
  activate: () => void activate(),
  leave: () => {
    closeMenu();
    void flush();
  },
  beforeClose: () => void flush(),
});

Allkin.provide("notes", {
  open,
  /** Writes a note and shows it; resolves with its path in the notepad. */
  create: async ({ title = "", content = "", folder = "" } = {}) => {
    open();
    await scan();
    return createNote({ folder, title, content: String(content ?? ""), focus: "text" });
  },
});

Allkin.registerApp({
  key: "notes",
  get name() {
    return t("plugin.notes.app.name");
  },
  get meta() {
    return t("plugin.notes.app.meta");
  },
  icon: TAB_ICON,
  open,
});

/* ---- Wiring ---------------------------------------------------------------------- */

fillIcons(el("nt-view"));
core.fillPageIcons?.(el("nt-view"));

el("nt-new-note").addEventListener("click", () => void createNote());
el("nt-new-folder").addEventListener("click", () => void createFolder());
el("nt-note-menu").addEventListener("click", (e) => current && openMenu(noteMenu(current.path), { anchor: e.currentTarget }));
el("nt-empty-trash").addEventListener("click", () => void emptyTrash());
el("nt-search").addEventListener("input", (e) => onSearch(e.target.value));
el("nt-sort").addEventListener("change", (e) => {
  prefs.sort = e.target.value;
  savePrefs();
  renderList();
});
el("nt-back").addEventListener("click", () => {
  if (el("nt-view").dataset.pane === "note") void flush();
  setPane(el("nt-view").dataset.pane === "note" ? "list" : "folders");
});

el("nt-title").addEventListener("change", () => void renameCurrent());
el("nt-title").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    editor?.focus("start");
  } else if (e.key === "Escape" && current) {
    e.target.value = titleOf(current.path);
    e.target.blur();
  }
});

// Ctrl/⌘ + S writes at once: the note saves itself, the habit stays.
el("nt-view").addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    void flush();
  }
});

el("nt-missing-open").addEventListener("click", async () => {
  try {
    await core.openPluginPage("markdown-editor");
  } catch (err) {
    toast(t("plugin.notes.error", { message: err.message }), "ko");
  }
});

el("nt-picker-cancel").addEventListener("click", () => el("nt-picker").close());
el("nt-picker").addEventListener("click", (e) => {
  // A click on the backdrop closes.
  if (e.target === e.currentTarget) e.currentTarget.close();
});

document.addEventListener("mousedown", (e) => {
  if (!e.target.closest?.("#nt-menu")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
window.addEventListener("resize", closeMenu);
window.addEventListener("blur", closeMenu);

// Nothing typed is lost when the page goes away.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) void flush();
});
window.addEventListener("pagehide", () => void flush());
})();
