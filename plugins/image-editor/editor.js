"use strict";
/* ============================================================================
   Image editor plugin.
   ----------------------------------------------------------------------------
   One tab per image (kind "image-editor", byPath): an image of an agent's
   data/ or of the shared folder, opened from the file explorer — or a
   picture taken from the device or pasted, which lives in the page until it
   is saved.

   A document is two layers:
     · the raster (`base`), a canvas never modified in place: crop, resize,
       rotate, flip and pixelate each make a new one, so the history can keep
       references instead of copies;
     · the annotations (`shapes`), vector objects drawn over it — arrow, line,
       rectangle, ellipse, pen, marker, text, numbered badge — which stay
       selectable, movable and deletable until the image is saved.
   An operation that changes the geometry (crop, resize, rotate, flip) first
   flattens the annotations into the raster: they follow the pixels.

   Saving writes the image back in its own format; the previous version goes
   to the bin of its folder (Trash/), never erased. Export chooses format,
   quality (the compression) and largest side, then downloads or saves a copy.
   ========================================================================== */
(() => {
const Allkin = window.Allkin;
const core = Allkin.core;
const { el, openTab, activeTab, renderTabBar } = core;
const t = Allkin.t;

const KIND = "image-editor";
const PLUGIN_ID = "image-editor";
const toast = (message, kind = "ok") => core.toast?.(message, kind);

/* ---- Icons: Phosphor, light (and duotone for the tab) -------------------- */

// Generated from @phosphor-icons/core (MIT): light weight, and duotone for the tab.
const ICONS = {
  "arrow-arc-left:light": [{"d": "M230,184a6,6,0,0,1-12,0A90,90,0,0,0,64.36,120.36L38.55,146H88a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V88a6,6,0,0,1,12,0v49.58l25.89-25.72A102,102,0,0,1,230,184Z"}],
  "arrow-arc-right:light": [{"d": "M238,88v64a6,6,0,0,1-6,6H168a6,6,0,0,1,0-12h49.45l-25.8-25.63A90,90,0,0,0,38,184a6,6,0,0,1-12,0,102,102,0,0,1,174.12-72.12L226,137.58V88a6,6,0,0,1,12,0Z"}],
  "arrow-clockwise:light": [{"d": "M238,56v48a6,6,0,0,1-6,6H184a6,6,0,0,1,0-12h32.55l-30.38-27.8c-.06-.06-.12-.13-.19-.19a82,82,0,1,0-1.7,117.65,6,6,0,0,1,8.24,8.73A93.46,93.46,0,0,1,128,222h-1.28A94,94,0,1,1,194.37,61.4L226,90.35V56a6,6,0,1,1,12,0Z"}],
  "arrow-counter-clockwise:light": [{"d": "M222,128a94,94,0,0,1-92.74,94H128a93.43,93.43,0,0,1-64.5-25.65,6,6,0,1,1,8.24-8.72A82,82,0,1,0,70,70l-.19.19L39.44,98H72a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V56a6,6,0,0,1,12,0V90.34L61.63,61.4A94,94,0,0,1,222,128Z"}],
  "arrow-up-right:light": [{"d": "M198,64V168a6,6,0,0,1-12,0V78.48L68.24,196.24a6,6,0,0,1-8.48-8.48L177.52,70H88a6,6,0,0,1,0-12H192A6,6,0,0,1,198,64Z"}],
  "check:light": [{"d": "M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z"}],
  "checkerboard:light": [{"d": "M208,34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34Zm-13.52,88L134,61.52V46h15.52L210,106.48V122ZM134,78.48,177.52,122H134ZM210,48V89.52L166.48,46H208A2,2,0,0,1,210,48ZM48,46h74v76H46V48A2,2,0,0,1,48,46Zm58.48,164L46,149.52V134H61.52L122,194.48V210ZM122,177.52,78.48,134H122ZM46,208V166.48L89.52,210H48A2,2,0,0,1,46,208Zm162,2H134V192h0V134h76v74A2,2,0,0,1,208,210Z"}],
  "clipboard:light": [{"d": "M200,34H162.83a45.91,45.91,0,0,0-69.66,0H56A14,14,0,0,0,42,48V216a14,14,0,0,0,14,14H200a14,14,0,0,0,14-14V48A14,14,0,0,0,200,34Zm-72-4a34,34,0,0,1,34,34v2H94V64A34,34,0,0,1,128,30Zm74,186a2,2,0,0,1-2,2H56a2,2,0,0,1-2-2V48a2,2,0,0,1,2-2H85.67A45.77,45.77,0,0,0,82,64v8a6,6,0,0,0,6,6h80a6,6,0,0,0,6-6V64a45.77,45.77,0,0,0-3.67-18H200a2,2,0,0,1,2,2Z"}],
  "circle:light": [{"d": "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Z"}],
  "copy:light": [{"d": "M216,34H88a6,6,0,0,0-6,6V82H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H168a6,6,0,0,0,6-6V174h42a6,6,0,0,0,6-6V40A6,6,0,0,0,216,34ZM162,210H46V94H162Zm48-48H174V88a6,6,0,0,0-6-6H94V46H210Z"}],
  "crop:light": [{"d": "M238,192a6,6,0,0,1-6,6H198v34a6,6,0,0,1-12,0V198H64a6,6,0,0,1-6-6V70H24a6,6,0,0,1,0-12H58V24a6,6,0,0,1,12,0V186H232A6,6,0,0,1,238,192ZM96,70h90v90a6,6,0,0,0,12,0V64a6,6,0,0,0-6-6H96a6,6,0,0,0,0,12Z"}],
  "cursor:light": [{"d": "M166.59,134.1a1.91,1.91,0,0,1-.55-1.79,2,2,0,0,1,1.08-1.42l46.25-17.76.24-.1A14,14,0,0,0,212.38,87L52.29,34.7A13.95,13.95,0,0,0,34.7,52.29L87,212.38a13.82,13.82,0,0,0,12.6,9.6c.23,0,.46,0,.69,0A13.84,13.84,0,0,0,113,213.61a2.44,2.44,0,0,0,.1-.24l17.76-46.25a2,2,0,0,1,3.21-.53l51.31,51.31a14,14,0,0,0,19.8,0l12.69-12.69a14,14,0,0,0,0-19.8Zm42.82,62.63-12.68,12.68a2,2,0,0,1-2.83,0L142.59,158.1a14,14,0,0,0-22.74,4.32,2.44,2.44,0,0,0-.1.24L102,208.91a2,2,0,0,1-3.61-.26L46.11,48.57a1.87,1.87,0,0,1,.47-2A1.92,1.92,0,0,1,47.93,46a2.22,2.22,0,0,1,.64.1L208.65,98.38a2,2,0,0,1,.26,3.61l-46.25,17.76-.24.1a14,14,0,0,0-4.32,22.74h0l51.31,51.31A2,2,0,0,1,209.41,196.73Z"}],
  "download-simple:light": [{"d": "M222,144v64a6,6,0,0,1-6,6H40a6,6,0,0,1-6-6V144a6,6,0,0,1,12,0v58H210V144a6,6,0,0,1,12,0Zm-98.24,4.24a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,129.51V32a6,6,0,0,0-12,0v97.51L92.24,99.76a6,6,0,0,0-8.48,8.48Z"}],
  "flip-horizontal:light": [{"d": "M106.78,26.29A13.88,13.88,0,0,0,91.1,34.55s0,.08,0,.12l-64,159.94A14,14,0,0,0,40,214h64a14,14,0,0,0,14-14V40A13.87,13.87,0,0,0,106.78,26.29ZM106,200a2,2,0,0,1-2,2H40a2,2,0,0,1-1.85-2.78l.05-.11,64-159.92A2,2,0,0,1,106,40Zm122.92-5.39-64-159.94s0-.08,0-.12A14,14,0,0,0,138,40V200a14,14,0,0,0,14,14h64a14,14,0,0,0,12.93-19.39Zm-11.26,6.49a1.93,1.93,0,0,1-1.67.9H152a2,2,0,0,1-2-2V40a1.82,1.82,0,0,1,1.6-2,2.62,2.62,0,0,1,.54-.06,1.76,1.76,0,0,1,1.69,1.2l64,159.92.05.11A2,2,0,0,1,217.66,201.1Z"}],
  "flip-vertical:light": [{"d": "M56,118H216a14,14,0,0,0,5.46-26.9l-.11,0-159.95-64A14,14,0,0,0,42,40v64A14,14,0,0,0,56,118ZM54,40a2,2,0,0,1,2-2,2,2,0,0,1,.79.16l.11.05,159.92,64A2,2,0,0,1,216,106H56a2,2,0,0,1-2-2Zm162,98H56a14,14,0,0,0-14,14v64a14,14,0,0,0,19.39,12.92l160-64,.11-.05A14,14,0,0,0,216,138Zm.82,15.83-159.92,64-.11.05A2,2,0,0,1,54,216V152a2,2,0,0,1,2-2H216a2,2,0,0,1,.82,3.83Z"}],
  "floppy-disk:light": [{"d": "M217.9,73.42,182.58,38.1a13.9,13.9,0,0,0-9.89-4.1H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V83.31A13.9,13.9,0,0,0,217.9,73.42ZM170,210H86V152a2,2,0,0,1,2-2h80a2,2,0,0,1,2,2Zm40-2a2,2,0,0,1-2,2H182V152a14,14,0,0,0-14-14H88a14,14,0,0,0-14,14v58H48a2,2,0,0,1-2-2V48a2,2,0,0,1,2-2H172.69a2,2,0,0,1,1.41.58L209.42,81.9a2,2,0,0,1,.58,1.41ZM158,72a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h56A6,6,0,0,1,158,72Z"}],
  "folder-open:light": [{"d": "M243.36,111.81A14,14,0,0,0,232,106H214V88a14,14,0,0,0-14-14H130L101.74,52.8a14.06,14.06,0,0,0-8.4-2.8H40A14,14,0,0,0,26,64V208a6,6,0,0,0,6,6H211.1a6,6,0,0,0,5.69-4.1l28.49-85.47A14,14,0,0,0,243.36,111.81ZM40,62H93.34a2,2,0,0,1,1.2.4L124.4,84.8A6,6,0,0,0,128,86h72a2,2,0,0,1,2,2v18H69.77a14,14,0,0,0-13.28,9.57L38,171V64A2,2,0,0,1,40,62Zm193.9,58.63L206.78,202H40.33l27.54-82.63a2,2,0,0,1,1.9-1.37H232a2,2,0,0,1,1.9,2.63Z"}],
  "highlighter:light": [{"d": "M252.24,107.76a6,6,0,0,0-8.48,0L193.41,158.1a2,2,0,0,1-2.82,0L105.9,73.41a2,2,0,0,1,0-2.82l50.34-50.35a6,6,0,0,0-8.48-8.48L97.41,62.1A14,14,0,0,0,95.7,79.81L73.41,102.1a14,14,0,0,0,0,19.8l6.1,6.1L19.76,187.76a6,6,0,0,0,2.34,9.93l72,24a6,6,0,0,0,6.14-1.45L136,184.49l6.1,6.1a14,14,0,0,0,19.8,0l22.28-22.29a14,14,0,0,0,17.72-1.71l50.34-50.35A6,6,0,0,0,252.24,107.76ZM94.38,209.14,35.11,189.38,88,136.49,127.51,176Zm59-27a2,2,0,0,1-2.82,0l-10.35-10.34h0l-48-48h0L81.9,113.41a2,2,0,0,1,0-2.82L104,88.49,175.51,160Z"}],
  "image:duotone": [{"d": "M224,56V178.06l-39.72-39.72a8,8,0,0,0-11.31,0L147.31,164,97.66,114.34a8,8,0,0,0-11.32,0L32,168.69V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z", "o": "0.2"}, {"d": "M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"}],
  "image-square:light": [{"d": "M208,34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM46,208V48a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2v82.2l-28.1-28.1a14,14,0,0,0-19.8,0L54.2,210H48A2,2,0,0,1,46,208Zm162,2H71.17l99.41-99.41a2,2,0,0,1,2.83,0L210,147.17V208A2,2,0,0,1,208,210ZM96,118A22,22,0,1,0,74,96,22,22,0,0,0,96,118Zm0-32A10,10,0,1,1,86,96,10,10,0,0,1,96,86Z"}],
  "image:light": [{"d": "M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM40,54H216a2,2,0,0,1,2,2V163.57L188.53,134.1a14,14,0,0,0-19.8,0l-21.42,21.42L101.9,110.1a14,14,0,0,0-19.8,0L38,154.2V56A2,2,0,0,1,40,54ZM38,200V171.17l52.58-52.58a2,2,0,0,1,2.84,0L176.83,202H40A2,2,0,0,1,38,200Zm178,2H193.8l-38-38,21.41-21.42a2,2,0,0,1,2.83,0l38,38V200A2,2,0,0,1,216,202ZM146,100a10,10,0,1,1,10,10A10,10,0,0,1,146,100Z"}],
  "line-segment:light": [{"d": "M213.23,42.77A30,30,0,0,0,167,80.54L80.54,167a30.07,30.07,0,0,0-37.77,3.81h0A30,30,0,1,0,89,175.46L175.46,89a30,30,0,0,0,37.77-46.25Zm-136.51,162a18,18,0,1,1,0-25.46A18,18,0,0,1,76.72,204.74Zm128-128a18,18,0,0,1-25.46,0h0a18,18,0,1,1,25.46,0Z"}],
  "magnifying-glass-minus:light": [{"d": "M150,112a6,6,0,0,1-6,6H80a6,6,0,0,1,0-12h64A6,6,0,0,1,150,112Zm78.24,116.24a6,6,0,0,1-8.48,0l-51.38-51.38a86.15,86.15,0,1,1,8.48-8.48l51.38,51.38A6,6,0,0,1,228.24,228.24ZM112,186a74,74,0,1,0-74-74A74.09,74.09,0,0,0,112,186Z"}],
  "magnifying-glass-plus:light": [{"d": "M150,112a6,6,0,0,1-6,6H118v26a6,6,0,0,1-12,0V118H80a6,6,0,0,1,0-12h26V80a6,6,0,0,1,12,0v26h26A6,6,0,0,1,150,112Zm78.24,116.24a6,6,0,0,1-8.48,0l-51.38-51.38a86.15,86.15,0,1,1,8.48-8.48l51.38,51.38A6,6,0,0,1,228.24,228.24ZM112,186a74,74,0,1,0-74-74A74.09,74.09,0,0,0,112,186Z"}],
  "number-circle-one:light": [{"d": "M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218ZM138,80v96a6,6,0,0,1-12,0V91.21L111.33,101a6,6,0,0,1-6.66-10l24-16A6,6,0,0,1,138,80Z"}],
  "pencil-simple:light": [{"d": "M225.9,74.78,181.21,30.09a14,14,0,0,0-19.8,0L38.1,153.41a13.94,13.94,0,0,0-4.1,9.9V208a14,14,0,0,0,14,14H92.69a13.94,13.94,0,0,0,9.9-4.1L225.9,94.58a14,14,0,0,0,0-19.8ZM94.1,209.41a2,2,0,0,1-1.41.59H48a2,2,0,0,1-2-2V163.31a2,2,0,0,1,.59-1.41L136,72.48,183.51,120ZM217.41,86.1,192,111.51,144.49,64,169.9,38.58a2,2,0,0,1,2.83,0l44.68,44.69a2,2,0,0,1,0,2.83Z"}],
  "rectangle:light": [{"d": "M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42Zm2,158a2,2,0,0,1-2,2H40a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H216a2,2,0,0,1,2,2Z"}],
  "resize:light": [{"d": "M136,114H48a6,6,0,0,0-6,6v88a6,6,0,0,0,6,6h88a6,6,0,0,0,6-6V120A6,6,0,0,0,136,114Zm-6,88H54V126h76Zm84-18v16a14,14,0,0,1-14,14H176a6,6,0,0,1,0-12h24a2,2,0,0,0,2-2V184a6,6,0,0,1,12,0Zm0-72v32a6,6,0,0,1-12,0V112a6,6,0,0,1,12,0Zm0-56V72a6,6,0,0,1-12,0V56a2,2,0,0,0-2-2H184a6,6,0,0,1,0-12h16A14,14,0,0,1,214,56Zm-64-8a6,6,0,0,1-6,6H112a6,6,0,0,1,0-12h32A6,6,0,0,1,150,48ZM42,80V56A14,14,0,0,1,56,42H72a6,6,0,0,1,0,12H56a2,2,0,0,0-2,2V80a6,6,0,0,1-12,0Z"}],
  "text-t:light": [{"d": "M206,56V88a6,6,0,0,1-12,0V62H134V194h26a6,6,0,0,1,0,12H96a6,6,0,0,1,0-12h26V62H62V88a6,6,0,0,1-12,0V56a6,6,0,0,1,6-6H200A6,6,0,0,1,206,56Z"}],
  "trash:light": [{"d": "M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z"}],
  "x:light": [{"d": "M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z"}],
};

function iconSvg(name, cls = "") {
  const paths = ICONS[`${name}:light`] ?? [];
  return `<svg${cls ? ` class="${cls}"` : ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><g transform="scale(0.09375)" fill="currentColor" stroke="none">${paths
    .map((p) => `<path d="${p.d}"/>`)
    .join("")}</g></svg>`;
}

/** An icon that can sit on a selected element (the tab, the menu entry):
 *  the light glyph and its duotone, swapped by Allkin's stylesheet. */
function dualIcon(name, color) {
  const group = (weight, cls) =>
    `<g class="${cls}" transform="scale(0.09375)" fill="${color}" stroke="none">${(ICONS[`${name}:${weight}`] ?? [])
      .map((p) => `<path d="${p.d}"${p.o ? ` opacity="${p.o}"` : ""}/>`)
      .join("")}</g>`;
  return `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">${group("light", "ph-light")}${group("duotone", "ph-duo")}</svg>`;
}

const TAB_ICON = dualIcon("image", "#ec4899");

/** Buttons of the markup carry data-ie-icon (and data-ie-label): filled here. */
function fillButtons(root) {
  for (const button of root.querySelectorAll("[data-ie-icon]")) {
    const label = button.dataset.ieLabel;
    button.innerHTML = iconSvg(button.dataset.ieIcon) + (label ? `<span>${core.escapeHtml(t(label))}</span>` : "");
    if (label && !button.title) button.title = t(label);
  }
}

/* ---- Constants ----------------------------------------------------------- */

const SWATCHES = ["#e11d48", "#f97316", "#facc15", "#22c55e", "#0ea5e9", "#6366f1", "#111827", "#ffffff"];
const HISTORY_MAX = 40;
const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "webp", "gif", "bmp", "avif"]);
/** Formats Allkin can write back as they are; anything else is saved as PNG. */
const WRITABLE = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
const EXT_OF = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const DRAW_TOOLS = new Set(["arrow", "line", "rect", "ellipse", "pen", "marker"]);
/** The path of the welcome tab: one per page, no image behind it. */
const HOME_PATH = "home";
/** The paste shortcut as this device writes it: ⌘V on Apple hardware. */
const PASTE_KEY = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent) ? "⌘V" : "Ctrl+V";

const extOf = (name) => (name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "");
const stemOf = (name) => (name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name);
const dirOf = (path) => (path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "");
const joinPath = (dir, name) => (dir ? `${dir}/${name}` : name);

/* ---- Documents ------------------------------------------------------------
   Kept by key (folder + path), not by tab: a tab closed with changes not
   saved keeps them until the page is reloaded, and reopening the image finds
   them again. */

const docs = new Map();
const docKey = (tab) => `${tab.agentId ?? ""}|${tab.path}`;
let localSeq = 0;

/** The settings of the tools, shared by every image. */
const style = {
  color: SWATCHES[0],
  width: null, // per image, from its size, until the user picks one
  size: null,
  fill: false,
  textBg: true,
};
const exportPrefs = { format: null, quality: 0.85, maxSide: 0 };

const ui = {
  tool: "arrow",
  doc: null,
  tab: null,
  /** The shape being drawn, the crop or pixelate rectangle, or a move. */
  drag: null,
};

function newDoc(tab) {
  return {
    agentId: tab.agentId ?? null,
    path: tab.path,
    name: tab.name || tab.path.split("/").pop(),
    base: null,
    shapes: [],
    selected: -1,
    history: [],
    future: [],
    dirty: false,
    zoom: null, // null: fit the stage
    crop: null,
    loading: false,
    error: null,
    byteSize: null,
    local: !tab.agentId,
    home: isHomeTab(tab),
  };
}

const isHomeTab = (tab) => !tab.agentId && tab.path === HOME_PATH;

/* ---- Canvas helpers ------------------------------------------------------ */

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

function canvasFromImage(img) {
  const c = makeCanvas(img.naturalWidth || img.width, img.naturalHeight || img.height);
  c.getContext("2d").drawImage(img, 0, 0);
  return c;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(t("plugin.image-editor.error.unreadable")));
    img.src = src;
  });
}

function toBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error(t("plugin.image-editor.error.encode")))), mime, quality)
  );
}

/** The thickness and text size an image starts with: readable at its scale. */
function defaultsFor(base) {
  const side = Math.min(base.width, base.height);
  return { width: Math.max(2, Math.round(side / 160)), size: Math.max(14, Math.round(side / 22)) };
}

/* ---- Drawing the annotations --------------------------------------------- */

function drawArrow(ctx, s) {
  const { x1, y1, x2, y2, width } = s;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = Math.max(10, width * 4);
  const back = { x: x2 - Math.cos(angle) * head * 0.8, y: y2 - Math.sin(angle) * head * 0.8 };
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(back.x, back.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - Math.cos(angle - Math.PI / 7) * head, y2 - Math.sin(angle - Math.PI / 7) * head);
  ctx.lineTo(x2 - Math.cos(angle + Math.PI / 7) * head, y2 - Math.sin(angle + Math.PI / 7) * head);
  ctx.closePath();
  ctx.fill();
}

function textLines(s) {
  return String(s.text).split("\n");
}

function textBox(ctx, s) {
  ctx.font = `600 ${s.size}px system-ui, sans-serif`;
  const lines = textLines(s);
  const lineH = s.size * 1.25;
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const pad = s.bg ? s.size * 0.3 : 0;
  return { x: s.x - pad, y: s.y - pad, w: w + pad * 2, h: lines.length * lineH + pad * 2, lineH, pad };
}

/** Black or white, whichever reads on `color`. */
function contrastOn(color) {
  const hex = color.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 160 ? "#111827" : "#ffffff";
}

function drawShape(ctx, s) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = s.color;
  ctx.fillStyle = s.color;
  ctx.lineWidth = s.width;
  switch (s.type) {
    case "arrow":
      drawArrow(ctx, s);
      break;
    case "line":
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.stroke();
      break;
    case "rect":
      if (s.fill) ctx.fillRect(s.x, s.y, s.w, s.h);
      else ctx.strokeRect(s.x, s.y, s.w, s.h);
      break;
    case "ellipse":
      ctx.beginPath();
      ctx.ellipse(s.x + s.w / 2, s.y + s.h / 2, Math.abs(s.w / 2), Math.abs(s.h / 2), 0, 0, Math.PI * 2);
      if (s.fill) ctx.fill();
      else ctx.stroke();
      break;
    case "pen":
    case "marker": {
      if (s.type === "marker") {
        ctx.globalAlpha = 0.35;
        ctx.lineCap = "square";
      }
      ctx.beginPath();
      s.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      if (s.points.length === 1) ctx.lineTo(s.points[0][0] + 0.1, s.points[0][1]);
      ctx.stroke();
      break;
    }
    case "text": {
      const box = textBox(ctx, s);
      if (s.bg) {
        ctx.fillStyle = contrastOn(s.color) === "#111827" ? "rgba(17,24,39,0.85)" : "rgba(255,255,255,0.9)";
        ctx.fillRect(box.x, box.y, box.w, box.h);
      }
      ctx.fillStyle = s.color;
      ctx.textBaseline = "top";
      textLines(s).forEach((line, i) => ctx.fillText(line, s.x, s.y + i * box.lineH));
      break;
    }
    case "number": {
      const r = s.size * 0.75;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = contrastOn(s.color);
      ctx.font = `700 ${s.size}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(s.n), s.x, s.y + s.size * 0.05);
      break;
    }
  }
  ctx.restore();
}

/** The rectangle a shape occupies, for selecting and moving it. */
function bounds(s, ctx) {
  const pad = (s.width ?? 0) / 2 + 4;
  switch (s.type) {
    case "arrow":
    case "line":
      return { x: Math.min(s.x1, s.x2) - pad, y: Math.min(s.y1, s.y2) - pad, w: Math.abs(s.x2 - s.x1) + pad * 2, h: Math.abs(s.y2 - s.y1) + pad * 2 };
    case "rect":
    case "ellipse":
      return { x: Math.min(s.x, s.x + s.w) - pad, y: Math.min(s.y, s.y + s.h) - pad, w: Math.abs(s.w) + pad * 2, h: Math.abs(s.h) + pad * 2 };
    case "pen":
    case "marker": {
      const xs = s.points.map((p) => p[0]);
      const ys = s.points.map((p) => p[1]);
      const x = Math.min(...xs) - pad;
      const y = Math.min(...ys) - pad;
      return { x, y, w: Math.max(...xs) - x + pad, h: Math.max(...ys) - y + pad };
    }
    case "text":
      return textBox(ctx, s);
    case "number": {
      const r = s.size * 0.75;
      return { x: s.x - r, y: s.y - r, w: r * 2, h: r * 2 };
    }
  }
  return { x: 0, y: 0, w: 0, h: 0 };
}

/** Distance from a point to a segment: a line is picked near its stroke. */
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = dx * dx + dy * dy;
  const k = len ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len)) : 0;
  return Math.hypot(px - (x1 + k * dx), py - (y1 + k * dy));
}

function hitTest(doc, x, y, ctx) {
  const tolerance = Math.max(8, 10 / scale(doc));
  for (let i = doc.shapes.length - 1; i >= 0; i--) {
    const s = doc.shapes[i];
    if (s.type === "arrow" || s.type === "line") {
      if (distToSegment(x, y, s.x1, s.y1, s.x2, s.y2) <= s.width / 2 + tolerance) return i;
      continue;
    }
    if (s.type === "pen" || s.type === "marker") {
      for (let k = 1; k < s.points.length; k++) {
        const [a, b] = [s.points[k - 1], s.points[k]];
        if (distToSegment(x, y, a[0], a[1], b[0], b[1]) <= s.width / 2 + tolerance) return i;
      }
      continue;
    }
    const b = bounds(s, ctx);
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return i;
  }
  return -1;
}

function moveShape(s, dx, dy) {
  if ("x1" in s) {
    s.x1 += dx;
    s.y1 += dy;
    s.x2 += dx;
    s.y2 += dy;
  } else if (s.points) {
    for (const p of s.points) {
      p[0] += dx;
      p[1] += dy;
    }
  } else {
    s.x += dx;
    s.y += dy;
  }
}

/** The image as it will be saved: the raster with the annotations on it. */
function flatten(doc) {
  const c = makeCanvas(doc.base.width, doc.base.height);
  const ctx = c.getContext("2d");
  ctx.drawImage(doc.base, 0, 0);
  for (const s of doc.shapes) drawShape(ctx, s);
  return c;
}

/* ---- History ------------------------------------------------------------- */

const cloneShapes = (shapes) => JSON.parse(JSON.stringify(shapes));

/** Called BEFORE a change: what to go back to. */
function remember(doc) {
  doc.history.push({ base: doc.base, shapes: cloneShapes(doc.shapes) });
  if (doc.history.length > HISTORY_MAX) doc.history.shift();
  doc.future = [];
  doc.dirty = true;
}

function undo() {
  const doc = ui.doc;
  if (!doc?.history.length) return;
  doc.future.push({ base: doc.base, shapes: cloneShapes(doc.shapes) });
  const prev = doc.history.pop();
  doc.base = prev.base;
  doc.shapes = prev.shapes;
  doc.selected = -1;
  doc.crop = null;
  doc.dirty = true;
  render();
}

function redo() {
  const doc = ui.doc;
  if (!doc?.future.length) return;
  doc.history.push({ base: doc.base, shapes: cloneShapes(doc.shapes) });
  const next = doc.future.pop();
  doc.base = next.base;
  doc.shapes = next.shapes;
  doc.selected = -1;
  doc.dirty = true;
  render();
}

/* ---- Raster operations ---------------------------------------------------- */

/** Applies `make(flat)` → a new raster, the annotations merged first. */
function rasterOp(make) {
  const doc = ui.doc;
  if (!doc?.base) return;
  remember(doc);
  doc.base = make(flatten(doc));
  doc.shapes = [];
  doc.selected = -1;
  doc.crop = null;
  render();
}

function rotate(direction) {
  rasterOp((src) => {
    const c = makeCanvas(src.height, src.width);
    const ctx = c.getContext("2d");
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((direction * Math.PI) / 2);
    ctx.drawImage(src, -src.width / 2, -src.height / 2);
    return c;
  });
}

function flip(horizontal) {
  rasterOp((src) => {
    const c = makeCanvas(src.width, src.height);
    const ctx = c.getContext("2d");
    ctx.translate(horizontal ? c.width : 0, horizontal ? 0 : c.height);
    ctx.scale(horizontal ? -1 : 1, horizontal ? 1 : -1);
    ctx.drawImage(src, 0, 0);
    return c;
  });
}

/** Scaled in halving steps: one large reduction in a single draw is blurry
 *  in some browsers and jagged in others. */
function scaleCanvas(src, w, h) {
  let current = src;
  while (current.width / 2 > w && current.height / 2 > h) {
    const half = makeCanvas(current.width / 2, current.height / 2);
    const ctx = half.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(current, 0, 0, half.width, half.height);
    current = half;
  }
  const c = makeCanvas(w, h);
  const ctx = c.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(current, 0, 0, c.width, c.height);
  return c;
}

function normRect(r) {
  return { x: Math.min(r.x, r.x + r.w), y: Math.min(r.y, r.y + r.h), w: Math.abs(r.w), h: Math.abs(r.h) };
}

function clampRect(r, base) {
  const n = normRect(r);
  const x = Math.max(0, Math.round(n.x));
  const y = Math.max(0, Math.round(n.y));
  return { x, y, w: Math.min(base.width, Math.round(n.x + n.w)) - x, h: Math.min(base.height, Math.round(n.y + n.h)) - y };
}

function applyCrop() {
  const doc = ui.doc;
  if (!doc?.crop) return;
  const r = clampRect(doc.crop, doc.base);
  if (r.w < 2 || r.h < 2) {
    doc.crop = null;
    render();
    return;
  }
  rasterOp((src) => {
    const c = makeCanvas(r.w, r.h);
    c.getContext("2d").drawImage(src, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
    return c;
  });
}

/** Pixelates a region of the raster: what must not be read (a name, a key). */
function pixelate(rect) {
  const doc = ui.doc;
  const r = clampRect(rect, doc.base);
  if (r.w < 2 || r.h < 2) return;
  remember(doc);
  const c = makeCanvas(doc.base.width, doc.base.height);
  const ctx = c.getContext("2d");
  ctx.drawImage(doc.base, 0, 0);
  const block = Math.max(6, Math.round(Math.min(doc.base.width, doc.base.height) / 60));
  const small = makeCanvas(Math.max(1, r.w / block), Math.max(1, r.h / block));
  small.getContext("2d").drawImage(doc.base, r.x, r.y, r.w, r.h, 0, 0, small.width, small.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, small.width, small.height, r.x, r.y, r.w, r.h);
  doc.base = c;
}

/* ---- View ---------------------------------------------------------------- */

const canvas = () => el("ie-canvas");

function fitScale(doc) {
  const stage = el("ie-stage");
  const w = stage.clientWidth - 32;
  const h = stage.clientHeight - 32;
  if (w <= 0 || h <= 0 || !doc.base) return 1;
  return Math.min(1, w / doc.base.width, h / doc.base.height);
}

function scale(doc) {
  return doc.zoom ?? fitScale(doc);
}

function setZoom(value) {
  const doc = ui.doc;
  if (!doc?.base) return;
  doc.zoom = value == null ? null : Math.min(8, Math.max(0.05, value));
  render();
}

function render() {
  const doc = ui.doc;
  const c = canvas();
  el("ie-loading").classList.toggle("hidden", !doc?.loading);
  const home = Boolean(doc?.home);
  el("ie-view").classList.toggle("is-home", home);
  el("ie-home").classList.toggle("hidden", !home);
  if (home) el("ie-home-hint").textContent = t("plugin.image-editor.home.hint", { key: PASTE_KEY });
  const empty = !doc || (!doc.base && !doc.loading && !home);
  el("ie-empty").classList.toggle("hidden", !empty);
  if (empty && doc?.error) el("ie-empty").querySelector("p").textContent = doc.error;
  else el("ie-empty").querySelector("p").textContent = t("plugin.image-editor.empty");
  c.classList.toggle("hidden", !doc?.base);
  renderBar();
  renderOptions();
  if (!doc?.base) return;

  if (c.width !== doc.base.width || c.height !== doc.base.height) {
    c.width = doc.base.width;
    c.height = doc.base.height;
  }
  const s = scale(doc);
  c.style.width = `${Math.round(doc.base.width * s)}px`;
  c.style.height = `${Math.round(doc.base.height * s)}px`;
  el("ie-zoom-fit").textContent = `${Math.round(s * 100)} %`;

  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.drawImage(doc.base, 0, 0);
  for (const shape of doc.shapes) drawShape(ctx, shape);
  if (ui.drag?.shape) drawShape(ctx, ui.drag.shape);

  const px = 1 / s; // one screen pixel, in image pixels
  if (doc.selected >= 0 && doc.shapes[doc.selected]) {
    const b = bounds(doc.shapes[doc.selected], ctx);
    ctx.save();
    ctx.setLineDash([6 * px, 4 * px]);
    ctx.lineWidth = 1.5 * px;
    ctx.strokeStyle = "#0ea5e9";
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.restore();
  }
  const frame = doc.crop ?? (ui.drag?.rect && ui.tool === "pixelate" ? ui.drag.rect : null);
  if (frame) {
    const r = normRect(frame);
    ctx.save();
    if (doc.crop) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.rect(0, 0, c.width, c.height);
      ctx.rect(r.x, r.y, r.w, r.h);
      ctx.fill("evenodd");
    }
    ctx.setLineDash([6 * px, 4 * px]);
    ctx.lineWidth = 1.5 * px;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    ctx.restore();
  }
}

function renderBar() {
  const doc = ui.doc;
  el("ie-view").dataset.tool = ui.tool;
  el("ie-name").textContent = doc?.home ? t("plugin.image-editor.app.name") : doc ? doc.name + (doc.dirty ? " •" : "") : "";
  const meta = [];
  if (doc?.home) meta.push(t("plugin.image-editor.app.meta"));
  if (doc?.base) meta.push(`${doc.base.width} × ${doc.base.height}`);
  if (doc?.byteSize != null && !doc.dirty) meta.push(core.formatSize(doc.byteSize));
  if (doc?.agentId && !doc.local) meta.push(`${core.agentName(doc.agentId)} · ${doc.path}`);
  el("ie-meta").textContent = meta.join(" · ");
  const hasImage = Boolean(doc?.base);
  el("ie-undo").disabled = !doc?.history.length;
  el("ie-redo").disabled = !doc?.future.length;
  for (const id of ["ie-copy", "ie-export", "ie-save"]) el(id).disabled = !hasImage;
  for (const b of el("ie-rail").querySelectorAll("button")) b.disabled = !hasImage;
  for (const b of el("ie-rail").querySelectorAll(".ie-tool")) b.classList.toggle("is-active", b.dataset.tool === ui.tool);
}

function renderOptions() {
  const doc = ui.doc;
  const tool = ui.tool;
  const selected = doc && doc.selected >= 0 ? doc.shapes[doc.selected] : null;
  const shown = selected ? selected.type : tool;
  const has = (field, on) => el(field).classList.toggle("hidden", !on);
  has("ie-width-field", DRAW_TOOLS.has(shown));
  has("ie-size-field", shown === "text" || shown === "number");
  has("ie-fill-field", shown === "rect" || shown === "ellipse");
  has("ie-textbg-field", shown === "text");
  const colourless = !selected && (tool === "crop" || tool === "pixelate" || tool === "select");
  el("ie-swatches").classList.toggle("hidden", colourless);
  el("ie-color").parentElement.classList.toggle("hidden", colourless);
  el("ie-crop-apply").classList.toggle("hidden", !doc?.crop);
  el("ie-crop-cancel").classList.toggle("hidden", !doc?.crop);
  el("ie-delete").classList.toggle("hidden", !selected);

  const current = selected ?? style;
  const color = current.color ?? style.color;
  el("ie-color").value = color;
  for (const sw of el("ie-swatches").children) sw.setAttribute("aria-checked", String(sw.dataset.color === color));
  const width = selected ? (selected.type === "marker" ? selected.width / 4 : selected.width) ?? style.width : style.width ?? 4;
  el("ie-width").value = String(width);
  el("ie-width-out").textContent = String(width);
  const size = selected?.size ?? style.size ?? 32;
  el("ie-size").value = String(size);
  el("ie-size-out").textContent = String(size);
  el("ie-fill").checked = selected ? Boolean(selected.fill) : style.fill;
  el("ie-textbg").checked = selected ? Boolean(selected.bg) : style.textBg;

  const hints = {
    select: "plugin.image-editor.hint.select",
    crop: doc?.crop ? "plugin.image-editor.hint.cropReady" : "plugin.image-editor.hint.crop",
    text: "plugin.image-editor.hint.text",
    number: "plugin.image-editor.hint.number",
    pixelate: "plugin.image-editor.hint.pixelate",
  };
  el("ie-hint").textContent = doc?.base && hints[tool] && !selected ? t(hints[tool]) : "";
}

/** A change of colour, thickness or size applies to the selected annotation
 *  too: pick it, then change it. */
function changeStyle(key, value) {
  style[key] = value;
  const doc = ui.doc;
  const selected = doc && doc.selected >= 0 ? doc.shapes[doc.selected] : null;
  if (selected) {
    const field = key === "textBg" ? "bg" : key;
    if (field in selected || field === "fill" || field === "bg") {
      // A slider sends a value per pixel moved: one step of history for the
      // whole gesture, not one per value.
      const now = Date.now();
      const last = ui.lastStyleEdit;
      if (!last || last.shape !== selected || last.key !== field || now - last.time > 800) remember(doc);
      ui.lastStyleEdit = { shape: selected, key: field, time: now };
      selected[field] = field === "width" && selected.type === "marker" ? value * 4 : value;
    }
  }
  render();
}

function setTool(tool) {
  ui.tool = tool;
  const doc = ui.doc;
  if (doc) {
    if (tool !== "crop") doc.crop = null;
    if (tool !== "select") doc.selected = -1;
  }
  render();
}

/* ---- Pointer ------------------------------------------------------------- */

function imagePoint(e) {
  const c = canvas();
  const r = c.getBoundingClientRect();
  return { x: ((e.clientX - r.left) * c.width) / r.width, y: ((e.clientY - r.top) * c.height) / r.height };
}

function onPointerDown(e) {
  const doc = ui.doc;
  if (!doc?.base || e.button > 0) return;
  const p = imagePoint(e);
  const ctx = canvas().getContext("2d");
  const tool = ui.tool;
  canvas().setPointerCapture(e.pointerId);

  if (tool === "select") {
    const i = hitTest(doc, p.x, p.y, ctx);
    doc.selected = i;
    if (i >= 0) ui.drag = { kind: "move", last: p, moved: false };
    render();
    return;
  }
  if (tool === "crop") {
    ui.drag = { kind: "crop", start: p };
    doc.crop = { x: p.x, y: p.y, w: 0, h: 0 };
    render();
    return;
  }
  if (tool === "pixelate") {
    ui.drag = { kind: "pixelate", start: p, rect: { x: p.x, y: p.y, w: 0, h: 0 } };
    return;
  }
  if (tool === "text") {
    void addText(p);
    return;
  }
  if (tool === "number") {
    const n = doc.shapes.filter((s) => s.type === "number").reduce((max, s) => Math.max(max, s.n), 0) + 1;
    remember(doc);
    doc.shapes.push({ type: "number", x: p.x, y: p.y, n, color: style.color, size: style.size });
    render();
    return;
  }
  const base = { color: style.color, width: tool === "marker" ? style.width * 4 : style.width };
  let shape;
  if (tool === "arrow" || tool === "line") shape = { type: tool, x1: p.x, y1: p.y, x2: p.x, y2: p.y, ...base };
  else if (tool === "rect" || tool === "ellipse") shape = { type: tool, x: p.x, y: p.y, w: 0, h: 0, fill: style.fill, ...base };
  else shape = { type: tool, points: [[p.x, p.y]], ...base };
  ui.drag = { kind: "draw", start: p, shape };
}

function onPointerMove(e) {
  const doc = ui.doc;
  const drag = ui.drag;
  if (!doc || !drag) return;
  const p = imagePoint(e);
  if (drag.kind === "move") {
    const s = doc.shapes[doc.selected];
    if (!s) return;
    if (!drag.moved) {
      remember(doc);
      drag.moved = true;
    }
    moveShape(s, p.x - drag.last.x, p.y - drag.last.y);
    drag.last = p;
  } else if (drag.kind === "crop") {
    doc.crop = { x: drag.start.x, y: drag.start.y, w: p.x - drag.start.x, h: p.y - drag.start.y };
  } else if (drag.kind === "pixelate") {
    drag.rect = { x: drag.start.x, y: drag.start.y, w: p.x - drag.start.x, h: p.y - drag.start.y };
  } else if (drag.kind === "draw") {
    const s = drag.shape;
    if ("x1" in s) {
      s.x2 = p.x;
      s.y2 = p.y;
      // Shift: straight — horizontal, vertical or at 45°.
      if (e.shiftKey) {
        const angle = Math.round(Math.atan2(p.y - s.y1, p.x - s.x1) / (Math.PI / 4)) * (Math.PI / 4);
        const len = Math.hypot(p.x - s.x1, p.y - s.y1);
        s.x2 = s.x1 + Math.cos(angle) * len;
        s.y2 = s.y1 + Math.sin(angle) * len;
      }
    } else if (s.points) {
      s.points.push([p.x, p.y]);
    } else {
      s.w = p.x - s.x;
      s.h = p.y - s.y;
      // Shift: a square, a circle.
      if (e.shiftKey) {
        const side = Math.max(Math.abs(s.w), Math.abs(s.h));
        s.w = Math.sign(s.w || 1) * side;
        s.h = Math.sign(s.h || 1) * side;
      }
    }
  }
  render();
}

function onPointerUp() {
  const doc = ui.doc;
  const drag = ui.drag;
  ui.drag = null;
  if (!doc || !drag) return;
  if (drag.kind === "draw") {
    const s = drag.shape;
    const b = bounds(s, canvas().getContext("2d"));
    const tiny = s.points ? false : b.w < 6 && b.h < 6;
    if (!tiny) {
      if (s.type === "rect" || s.type === "ellipse") Object.assign(s, normRect(s));
      remember(doc);
      doc.shapes.push(s);
    }
  } else if (drag.kind === "crop") {
    const r = normRect(doc.crop);
    if (r.w < 4 || r.h < 4) doc.crop = null;
  } else if (drag.kind === "pixelate") {
    pixelate(drag.rect);
  }
  render();
}

async function addText(p, existing = null) {
  const doc = ui.doc;
  const value = await core.prompt({
    title: t(existing ? "plugin.image-editor.text.editTitle" : "plugin.image-editor.text.title"),
    okLabel: t("common.ok"),
    input: { value: existing?.text ?? "", placeholder: t("plugin.image-editor.text.placeholder"), maxLength: 500 },
  });
  if (!value || ui.doc !== doc) return;
  remember(doc);
  // "\n" typed as such starts a new line: the field has a single line.
  const text = value.replace(/\\n/g, "\n");
  if (existing) existing.text = text;
  else doc.shapes.push({ type: "text", x: p.x, y: p.y, text, color: style.color, size: style.size, bg: style.textBg });
  render();
}

function onDoubleClick(e) {
  const doc = ui.doc;
  if (!doc?.base) return;
  const p = imagePoint(e);
  const i = hitTest(doc, p.x, p.y, canvas().getContext("2d"));
  if (i >= 0 && doc.shapes[i].type === "text") {
    doc.selected = i;
    void addText(p, doc.shapes[i]);
  }
}

function deleteSelected() {
  const doc = ui.doc;
  if (!doc || doc.selected < 0) return;
  remember(doc);
  doc.shapes.splice(doc.selected, 1);
  doc.selected = -1;
  render();
}

/* ---- Loading ------------------------------------------------------------- */

async function loadFromFolder(doc) {
  doc.loading = true;
  doc.error = null;
  render();
  try {
    const url = core.dataFileUrl(doc.agentId, doc.path, false);
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error(t("plugin.image-editor.error.notFound"));
    const blob = await res.blob();
    doc.byteSize = blob.size;
    const objectUrl = URL.createObjectURL(blob);
    try {
      setBase(doc, canvasFromImage(await loadImage(objectUrl)));
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch (err) {
    doc.error = err.message;
  } finally {
    doc.loading = false;
    if (ui.doc === doc) render();
  }
}

function setBase(doc, base) {
  doc.base = base;
  const d = defaultsFor(base);
  if (style.width == null) style.width = d.width;
  if (style.size == null) style.size = d.size;
}

/** A picture from the device, the clipboard or a drop: a tab of its own,
 *  in the page until saved. */
async function openBlob(blob, name) {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const img = await loadImage(objectUrl);
    const path = `local/${Date.now()}-${++localSeq}/${name}`;
    const tab = { agentId: null, path, name };
    const doc = newDoc(tab);
    doc.byteSize = blob.size;
    setBase(doc, canvasFromImage(img));
    docs.set(docKey(tab), doc);
    openTab(null, KIND, { path, name });
  } catch (err) {
    toast(err.message, "ko");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function pickFromDevice() {
  const input = el("ie-file");
  input.value = "";
  input.click();
}

/** The welcome tab: what the Tools list opens. */
function openHome() {
  openTab(null, KIND, { path: HOME_PATH, name: t("plugin.image-editor.app.name") });
}

/** The "Paste the clipboard" button: reads the clipboard through its API —
 *  a permission the browser asks for, and refuses outside HTTPS — and opens
 *  the first image found. The keyboard shortcut stays the sure way. */
async function pasteFromClipboard() {
  if (!navigator.clipboard?.read) {
    toast(t("plugin.image-editor.paste.unsupported", { key: PASTE_KEY }), "ko");
    return;
  }
  let items;
  try {
    items = await navigator.clipboard.read();
  } catch {
    toast(t("plugin.image-editor.paste.failed", { key: PASTE_KEY }), "ko");
    return;
  }
  for (const item of items) {
    const type = item.types.find((x) => x.startsWith("image/"));
    if (!type) continue;
    const blob = await item.getType(type);
    await openBlob(blob, `${t("plugin.image-editor.pasted")}.${EXT_OF[type] ?? "png"}`);
    return;
  }
  toast(t("plugin.image-editor.paste.noImage"), "ko");
}

/* ---- Saving -------------------------------------------------------------- */

async function encode(doc, mime, quality, maxSide = 0) {
  let flat = flatten(doc);
  const side = Math.max(flat.width, flat.height);
  if (maxSide && side > maxSide) {
    const k = maxSide / side;
    flat = scaleCanvas(flat, flat.width * k, flat.height * k);
  }
  // JPEG has no transparency: white, rather than black, under what was clear.
  if (mime === "image/jpeg") {
    const c = makeCanvas(flat.width, flat.height);
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(flat, 0, 0);
    flat = c;
  }
  return toBlob(flat, mime, mime === "image/png" ? undefined : quality);
}

async function upload(agentId, path, blob) {
  const form = new FormData();
  form.append("path", path);
  form.append("file", blob, path.split("/").pop());
  const res = await fetch(`/api/agents/${encodeURIComponent(agentId)}/data/upload`, { method: "POST", body: form, credentials: "same-origin" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || t("common.errorStatus", { status: res.status }));
  return body.path;
}

const dataApi = (agentId, route, options) => core.api(`/api/agents/${encodeURIComponent(agentId)}/data${route}`, options);

/**
 * Writes the image back where it came from. The new version is written next
 * to it first, then the old one goes to the bin of its folder and the new one
 * takes its name: if anything fails midway, both are still there.
 */
async function replaceFile(doc, blob) {
  const dir = dirOf(doc.path);
  const temp = await upload(doc.agentId, joinPath(dir, `${stemOf(doc.name)}.editing-${Date.now()}.${extOf(doc.name)}`), blob);
  await dataApi(doc.agentId, `/file?path=${encodeURIComponent(doc.path)}`, { method: "DELETE" });
  await dataApi(doc.agentId, "/move", { method: "POST", body: JSON.stringify({ from: temp, to: doc.path }) });
}

async function save() {
  const doc = ui.doc;
  if (!doc?.base) return;
  if (doc.local) {
    openExport();
    return;
  }
  const mime = WRITABLE[extOf(doc.name)];
  if (!mime) {
    // A GIF, a BMP…: the browser cannot write them; a PNG copy instead.
    toast(t("plugin.image-editor.save.formatChanged"));
    openExport("png");
    return;
  }
  const button = el("ie-save");
  button.disabled = true;
  try {
    const blob = await encode(doc, mime, exportPrefs.quality);
    await replaceFile(doc, blob);
    doc.dirty = false;
    doc.byteSize = blob.size;
    toast(t("plugin.image-editor.save.done", { name: doc.name }));
  } catch (err) {
    toast(t("plugin.image-editor.save.failed", { message: err.message }), "ko");
  } finally {
    button.disabled = false;
    render();
    renderTabBar();
  }
}

async function copyToClipboard() {
  const doc = ui.doc;
  if (!doc?.base) return;
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") throw new Error(t("plugin.image-editor.copy.unsupported"));
    const blob = await encode(doc, "image/png");
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    toast(t("plugin.image-editor.copy.done"));
  } catch (err) {
    toast(err.message, "ko");
  }
}

/* ---- Export dialog --------------------------------------------------------- */

let estimateTimer = null;

function exportSettings() {
  const format = el("ie-export-format").value;
  return {
    format,
    mime: format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp",
    quality: Number(el("ie-export-quality").value) / 100,
    maxSide: Number(el("ie-export-max").value),
    name: el("ie-export-name").value.trim(),
  };
}

function exportName(settings) {
  const stem = stemOf(settings.name || ui.doc.name) || "image";
  return `${stem.replace(/[\\/]/g, "-")}.${EXT_OF[settings.mime]}`;
}

function updateEstimate() {
  clearTimeout(estimateTimer);
  const s = exportSettings();
  el("ie-export-quality-row").classList.toggle("hidden", s.format === "png");
  el("ie-export-quality-out").textContent = `${Math.round(s.quality * 100)} %`;
  el("ie-export-estimate").textContent = t("plugin.image-editor.exportDialog.estimating");
  estimateTimer = setTimeout(async () => {
    const doc = ui.doc;
    if (!doc?.base) return;
    try {
      const blob = await encode(doc, s.mime, s.quality, s.maxSide);
      const before = doc.byteSize != null ? core.formatSize(doc.byteSize) : null;
      el("ie-export-estimate").textContent = before
        ? t("plugin.image-editor.exportDialog.estimateFrom", { size: core.formatSize(blob.size), before })
        : t("plugin.image-editor.exportDialog.estimate", { size: core.formatSize(blob.size) });
    } catch (err) {
      el("ie-export-estimate").textContent = err.message;
    }
  }, 250);
}

function openExport(forcedFormat) {
  const doc = ui.doc;
  if (!doc?.base) return;
  const ext = extOf(doc.name);
  const format = forcedFormat ?? exportPrefs.format ?? (ext === "jpg" || ext === "jpeg" ? "jpeg" : ext === "webp" ? "webp" : "png");
  el("ie-export-format").value = format;
  el("ie-export-quality").value = String(Math.round(exportPrefs.quality * 100));
  el("ie-export-max").value = String(exportPrefs.maxSide);
  el("ie-export-name").value = doc.local ? stemOf(doc.name) : `${stemOf(doc.name)}-${t("plugin.image-editor.exportDialog.suffix")}`;
  // Where a copy goes: next to the original, or the plugin's folder of the
  // shared folder for a picture that comes from nowhere.
  el("ie-export-save").textContent = doc.local
    ? t("plugin.image-editor.exportDialog.saveShare", { folder: `share/${PLUGIN_ID}` })
    : t("plugin.image-editor.exportDialog.saveCopy");
  el("ie-export-dialog").classList.remove("hidden");
  updateEstimate();
}

function closeExport() {
  clearTimeout(estimateTimer);
  el("ie-export-dialog").classList.add("hidden");
}

function rememberExport(s) {
  exportPrefs.format = s.format;
  exportPrefs.quality = s.quality;
  exportPrefs.maxSide = s.maxSide;
}

async function exportDownload() {
  const doc = ui.doc;
  const s = exportSettings();
  rememberExport(s);
  try {
    const blob = await encode(doc, s.mime, s.quality, s.maxSide);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = exportName(s);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
    closeExport();
  } catch (err) {
    toast(err.message, "ko");
  }
}

async function exportSave() {
  const doc = ui.doc;
  const s = exportSettings();
  rememberExport(s);
  const button = el("ie-export-save");
  button.disabled = true;
  try {
    const blob = await encode(doc, s.mime, s.quality, s.maxSide);
    const scope = doc.local ? core.share?.scope ?? "share" : doc.agentId;
    const dir = doc.local ? PLUGIN_ID : dirOf(doc.path);
    const written = await upload(scope, joinPath(dir, exportName(s)), blob);
    closeExport();
    const where = doc.local ? `share/${written}` : written;
    toast(t("plugin.image-editor.exportDialog.saved", { path: where }));
    // A picture of the device now has a home: the tab follows it there.
    if (doc.local) {
      doc.dirty = false;
      renderTabBar();
    }
  } catch (err) {
    toast(t("plugin.image-editor.save.failed", { message: err.message }), "ko");
  } finally {
    button.disabled = false;
    render();
  }
}

/* ---- Resize dialog --------------------------------------------------------- */

function openResize() {
  const doc = ui.doc;
  if (!doc?.base) return;
  const { width, height } = doc.base;
  el("ie-resize-current").textContent = t("plugin.image-editor.resize.current", { width, height });
  el("ie-resize-w").value = String(width);
  el("ie-resize-h").value = String(height);
  el("ie-resize-p").value = "100";
  const presets = el("ie-resize-presets");
  presets.replaceChildren();
  for (const percent of [75, 50, 33, 25]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ie-small";
    b.textContent = `${percent} %`;
    b.addEventListener("click", () => {
      el("ie-resize-p").value = String(percent);
      syncResize("p");
    });
    presets.appendChild(b);
  }
  el("ie-resize-dialog").classList.remove("hidden");
  el("ie-resize-w").select();
}

function syncResize(from) {
  const doc = ui.doc;
  const { width, height } = doc.base;
  const keep = el("ie-resize-ratio").checked;
  const w = el("ie-resize-w");
  const h = el("ie-resize-h");
  const p = el("ie-resize-p");
  if (from === "p") {
    const k = Number(p.value) / 100;
    if (k > 0) {
      w.value = String(Math.max(1, Math.round(width * k)));
      h.value = String(Math.max(1, Math.round(height * k)));
    }
  } else if (keep) {
    if (from === "w") h.value = String(Math.max(1, Math.round((Number(w.value) * height) / width)));
    else w.value = String(Math.max(1, Math.round((Number(h.value) * width) / height)));
    p.value = String(Math.round((Number(w.value) / width) * 100));
  }
}

function applyResize(e) {
  e.preventDefault();
  const w = Math.round(Number(el("ie-resize-w").value));
  const h = Math.round(Number(el("ie-resize-h").value));
  if (!(w >= 1 && h >= 1 && w <= 20000 && h <= 20000)) {
    toast(t("plugin.image-editor.resize.invalid"), "ko");
    return;
  }
  el("ie-resize-dialog").classList.add("hidden");
  if (w === ui.doc.base.width && h === ui.doc.base.height) return;
  rasterOp((src) => scaleCanvas(src, w, h));
}

/* ---- Tab ----------------------------------------------------------------- */

function activate(tab) {
  ui.tab = tab;
  let doc = docs.get(docKey(tab));
  if (!doc) {
    doc = newDoc(tab);
    docs.set(docKey(tab), doc);
    if (!doc.local) void loadFromFolder(doc);
  }
  ui.doc = doc;
  render();
}

function leave() {
  closeExport();
  el("ie-resize-dialog").classList.add("hidden");
}

function beforeClose(tab) {
  const doc = docs.get(docKey(tab));
  if (doc?.dirty) toast(t("plugin.image-editor.closedDirty", { name: doc.name }));
  else docs.delete(docKey(tab));
  if (ui.tab === tab) {
    ui.tab = null;
    ui.doc = null;
  }
}

const isImageName = (name) => IMAGE_EXT.has(extOf(name || ""));

/** Opens an image of a folder: an agent's data/, or the shared folder. */
function openFile(agentId, path, name) {
  openTab(agentId, KIND, { path, name: name || path.split("/").pop() });
}

Allkin.registerTabKind(KIND, {
  panels: ["ie-view"],
  icon: TAB_ICON,
  byPath: true,
  label: (tab) => {
    if (isHomeTab(tab)) return t("plugin.image-editor.app.name");
    const doc = docs.get(docKey(tab));
    return (tab.name || tab.path.split("/").pop()) + (doc?.dirty ? " •" : "");
  },
  meta: t("plugin.image-editor.tab.meta"),
  tooltip: (tab) => (tab.agentId ? `${core.agentName(tab.agentId)} · ${tab.path}` : tab.name),
  scroller: () => el("ie-stage"),
  activate,
  leave,
  beforeClose,
});

Allkin.provide("image-editor", { openFile, canEdit: isImageName, openBlob });

Allkin.registerApp({
  key: "image-editor",
  get name() {
    return t("plugin.image-editor.app.name");
  },
  get meta() {
    return t("plugin.image-editor.app.meta");
  },
  icon: TAB_ICON,
  open: openHome,
});

/* ---- Wiring -------------------------------------------------------------- */

const view = el("ie-view");
fillButtons(view);
fillButtons(el("ie-resize-dialog"));
fillButtons(el("ie-export-dialog"));

for (const color of SWATCHES) {
  const sw = document.createElement("button");
  sw.type = "button";
  sw.className = "ie-swatch";
  sw.dataset.color = color;
  sw.style.setProperty("--ie-swatch", color);
  sw.setAttribute("role", "radio");
  sw.setAttribute("aria-label", color);
  sw.addEventListener("click", () => changeStyle("color", color));
  el("ie-swatches").appendChild(sw);
}

for (const b of el("ie-rail").querySelectorAll(".ie-tool")) b.addEventListener("click", () => setTool(b.dataset.tool));
el("ie-rotate-left").addEventListener("click", () => rotate(-1));
el("ie-rotate-right").addEventListener("click", () => rotate(1));
el("ie-flip-h").addEventListener("click", () => flip(true));
el("ie-flip-v").addEventListener("click", () => flip(false));
el("ie-resize").addEventListener("click", openResize);

el("ie-color").addEventListener("input", (e) => changeStyle("color", e.target.value));
el("ie-width").addEventListener("input", (e) => changeStyle("width", Number(e.target.value)));
el("ie-size").addEventListener("input", (e) => changeStyle("size", Number(e.target.value)));
el("ie-fill").addEventListener("change", (e) => changeStyle("fill", e.target.checked));
el("ie-textbg").addEventListener("change", (e) => changeStyle("textBg", e.target.checked));

el("ie-crop-apply").addEventListener("click", applyCrop);
el("ie-crop-cancel").addEventListener("click", () => {
  if (ui.doc) ui.doc.crop = null;
  render();
});
el("ie-delete").addEventListener("click", deleteSelected);
el("ie-zoom-in").addEventListener("click", () => ui.doc && setZoom(scale(ui.doc) * 1.25));
el("ie-zoom-out").addEventListener("click", () => ui.doc && setZoom(scale(ui.doc) / 1.25));
el("ie-zoom-fit").addEventListener("click", () => setZoom(ui.doc?.zoom == null ? 1 : null));

el("ie-undo").addEventListener("click", undo);
el("ie-redo").addEventListener("click", redo);
el("ie-open").addEventListener("click", pickFromDevice);
el("ie-empty-open").addEventListener("click", pickFromDevice);
el("ie-home-open").addEventListener("click", pickFromDevice);
el("ie-home-paste").addEventListener("click", () => void pasteFromClipboard());
el("ie-copy").addEventListener("click", () => void copyToClipboard());
el("ie-export").addEventListener("click", () => openExport());
el("ie-save").addEventListener("click", () => void save());

el("ie-file").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (file) void openBlob(file, file.name);
});

const c = canvas();
c.addEventListener("pointerdown", onPointerDown);
c.addEventListener("pointermove", onPointerMove);
c.addEventListener("pointerup", onPointerUp);
c.addEventListener("pointercancel", onPointerUp);
c.addEventListener("dblclick", onDoubleClick);

// Ctrl + wheel zooms; the wheel alone scrolls the stage.
el("ie-stage").addEventListener(
  "wheel",
  (e) => {
    if (!(e.ctrlKey || e.metaKey) || !ui.doc?.base) return;
    e.preventDefault();
    setZoom(scale(ui.doc) * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
  },
  { passive: false }
);

// A file dropped on the editor opens in a tab of its own; the welcome
// page's zone lights up while a file hovers over the editor.
const dropping = (on) => el("ie-drop").classList.toggle("is-dropping", on);
view.addEventListener("dragover", (e) => {
  if (![...(e.dataTransfer?.items ?? [])].some((i) => i.kind === "file")) return;
  e.preventDefault();
  dropping(true);
});
view.addEventListener("dragleave", (e) => {
  if (!view.contains(e.relatedTarget)) dropping(false);
});
view.addEventListener("drop", (e) => {
  dropping(false);
  const file = [...(e.dataTransfer?.files ?? [])].find((f) => f.type.startsWith("image/"));
  if (!file) return;
  e.preventDefault();
  void openBlob(file, file.name);
});

const editorShown = () => activeTab()?.kind === KIND && !view.classList.contains("hidden");

// Pasting a picture while the editor is shown opens it.
document.addEventListener("paste", (e) => {
  if (!editorShown()) return;
  const target = e.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
  const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith("image/"));
  const file = item?.getAsFile();
  if (!file) return;
  e.preventDefault();
  void openBlob(file, `${t("plugin.image-editor.pasted")}.png`);
});

document.addEventListener("keydown", (e) => {
  if (!editorShown()) return;
  const target = e.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
  if (!el("ie-export-dialog").classList.contains("hidden") || !el("ie-resize-dialog").classList.contains("hidden")) {
    if (e.key === "Escape") {
      closeExport();
      el("ie-resize-dialog").classList.add("hidden");
    }
    return;
  }
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === "z") {
    e.preventDefault();
    if (e.shiftKey) redo();
    else undo();
  } else if (mod && e.key.toLowerCase() === "y") {
    e.preventDefault();
    redo();
  } else if (mod && e.key.toLowerCase() === "s") {
    e.preventDefault();
    void save();
  } else if ((e.key === "Delete" || e.key === "Backspace") && ui.doc?.selected >= 0) {
    e.preventDefault();
    deleteSelected();
  } else if (e.key === "Enter" && ui.doc?.crop) {
    applyCrop();
  } else if (e.key === "Escape") {
    if (ui.doc?.crop) ui.doc.crop = null;
    else if (ui.doc) ui.doc.selected = -1;
    render();
  }
});

// Fit follows the size of the window.
new ResizeObserver(() => {
  if (editorShown() && ui.doc?.zoom == null) render();
}).observe(el("ie-stage"));

// Leaving the page with an image not saved: the browser asks.
window.addEventListener("beforeunload", (e) => {
  if ([...docs.values()].some((d) => d.dirty)) e.preventDefault();
});

// Dialogs.
el("ie-resize-form").addEventListener("submit", applyResize);
el("ie-resize-cancel").addEventListener("click", () => el("ie-resize-dialog").classList.add("hidden"));
el("ie-resize-w").addEventListener("input", () => syncResize("w"));
el("ie-resize-h").addEventListener("input", () => syncResize("h"));
el("ie-resize-p").addEventListener("input", () => syncResize("p"));
el("ie-export-form").addEventListener("submit", (e) => {
  e.preventDefault();
  void exportSave();
});
el("ie-export-download").addEventListener("click", () => void exportDownload());
el("ie-export-cancel").addEventListener("click", closeExport);
for (const id of ["ie-export-format", "ie-export-quality", "ie-export-max"]) el(id).addEventListener("input", updateEstimate);
for (const id of ["ie-export-dialog", "ie-resize-dialog"]) {
  el(id).addEventListener("mousedown", (e) => {
    if (e.target === e.currentTarget) e.currentTarget.classList.add("hidden");
  });
}
})();
