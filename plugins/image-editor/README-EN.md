# Image editor

Crop, resize, compress and annotate an image without leaving Allkin: a screenshot to comment on,
a photo too heavy to send, a detail to hide before sharing.

## Getting started

- **An image of an agent or of the shared folder**: in the file explorer, right-click the image ›
  **Edit the image**. It opens in a tab of its own.
- **An image of this device**: Plugins list of the Allkin menu › **Image editor**, or the editor's
  **Open** button. You can also drop a file on the editor, or paste an image (Ctrl+V) while it is
  shown.

## Tools

On the left (at the bottom on a phone):

- **Select**: a click picks an annotation, dragging moves it, Del deletes it; double-click a text
  to edit it. Changing the colour or the thickness applies to the picked annotation.
- **Crop**: draw the frame to keep, then Enter (or "Crop").
- **Arrow**, **line**, **rectangle**, **ellipse**: Shift for a straight line, a square, a circle.
  Rectangle and ellipse can be filled.
- **Pen** and **highlighter** (a wide, translucent stroke).
- **Text**: click where it goes; `\n` for a new line; a contrasting background if you want.
- **Numbered step**: each click adds the next number (1, 2, 3…).
- **Pixelate**: draw over what must not be read (a name, a key, an address). It is final in the
  saved image.
- **Rotate**, **flip**, **resize** (pixels, percentage, proportions kept).

Above the image: colours, thickness, text size, zoom (Ctrl + wheel, or the percentage to switch
between "fit" and "actual size"). Undo / redo: Ctrl+Z / Ctrl+Shift+Z, up to 40 steps.

Annotations stay editable until the image is saved. Cropping, rotating, flipping or resizing
merges them into the image, so that they follow the pixels.

## Save, export

- **Save** (Ctrl+S) writes the image back in place, in its own format. **The previous version goes
  to the bin** of its folder (`Trash/`): nothing is lost. A GIF or a BMP, which the browser cannot
  write, is offered as a PNG copy.
- **Export** picks the format (PNG, JPEG, WebP), the **quality** — that is the compression: lower
  is lighter — and the largest side (reduction). The resulting weight shows before you confirm.
  Then **Download**, or **Save a copy** next to the original. An image from this device is saved
  in the shared folder, under `share/image-editor/`.
- **Copy** puts the annotated image on the clipboard, ready to paste elsewhere.

Closing a tab without saving keeps the changes in memory until the page is reloaded: reopening
the image finds them again.

## Settings

None.

## Right asked

- **Interface**: the editor is added to the Allkin page. It reads and writes images with your
  session, through the same routes as the file explorer.

## When it does not work

- *"Edit the image" is missing in the explorer*: the explorer must be 1.0.15 or later, and the page
  reloaded after the plugin was activated.
- *Copy does not work*: the browser refuses the clipboard outside HTTPS; use Export.
- *A very large image*: the browser may run out of memory past about 16,000 pixels a side; reduce
  it first.

Experimental plugin: a first draft, to be validated.
