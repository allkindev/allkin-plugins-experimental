# Notes

Notes filed in folders, in a tab of Allkin. You write in the formatted document — headings, lists,
checkboxes, tables, images — without ever seeing a tag: Allkin's Markdown editor does the writing.

Each note is a `.md` file, each folder a real folder, in the shared folder
(`~/.allkin/share/notes/`). Your agents therefore read and write the same notes: “file the minutes
in my notes, folder Meetings” works as it is.

## This tool needs the Markdown editor

The notepad does not edit text itself: it relies on the **Markdown editor** tool
(`markdown-editor`). If it is not there yet, **Allkin installs it automatically at the same time** —
the installation window tells you so before starting. Like any tool, it arrives with no right:
grant its “Interface” right on its page, otherwise the notepad shows a screen that takes you there.
(The Markdown editor is one of Allkin's built-in tools: it is always installed and allowed.)

## Getting started

1. Install the tool, grant its right on its page and reload Allkin.
2. Open **Notes** in the list of tools of the Allkin menu.
3. **Note** creates a note in the folder shown: type its title, then Enter to write.

The screen has three panes: the folders, the notes of the folder, the note. On a phone, one pane at
a time; the arrow of the bar goes back.

## What you can do

- **Folders and subfolders** — create (the **Folder** button, or a right click on a folder),
  rename, move, delete. A click on its arrow folds a folder.
- **Filing** — drag a note or a folder onto a folder, or use **Move to…**. Dropping on “All notes”
  takes the element out of every folder.
- **Title** — the title above the note is the name of its file: changing it renames the note.
- **Automatic saving** — the note is saved while you write; the state is shown in the bar.
  Ctrl/⌘ + S saves at once.
- **Pin** — a pinned note stays at the top of its list and appears under “Pinned”.
- **Search** — the field of the bar searches the titles and the text of every note.
- **Sort** — by last modification, date created or title.
- **Duplicate, copy the text, download** the `.md` file — right click on a note (long press on a
  touch screen), or the ⋯ button of the bar for the note open.
- **Images and files** — drag them into the text or paste them: they are stored in `notes/_files/`
  and the note keeps them when it changes folder.
- **Bin** — deleting sends to the bin of the notepad, from where you **restore** to the original
  place. What you erase from that bin goes to the bin of the shared folder (Files page), where it
  stays until that one is emptied: nothing disappears by accident.
- **Counter** — words, characters and date of modification, under the note.

## Where the notes are

| Place | Content |
|-------|---------|
| `share/notes/…/*.md` | the notes, in their folders |
| `share/notes/Trash/` | the bin of the notepad |
| `share/notes/_files/` | images and files dropped in the notes |
| `share/notes/.notes.json` | the pins, and where the elements of the bin come from |

A note changed by an agent while it is open is read again when you come back to the tab, as long as
you are not writing in it.

## Settings

None.

## Right requested

- **Allkin's interface** — the tool runs in Allkin's page, with your session: it adds its tab and
  its entry in the list of tools. It has neither a service nor an agent, and writes only in its
  folder of the shared folder.

## For other tools

```js
Allkin.capability("notes").open();
const path = await Allkin.capability("notes").create({ title: "Idea", content: "# Idea\n", folder: "Projects" });
```

## When it does not work

- **“The Markdown editor is missing”** — the Markdown editor tool is not installed, or its right
  is not granted. The button of the screen opens its page; grant the right, then reload.
- **The tab does not appear** — the “Interface” right of the notepad is not granted, or the page was
  not reloaded since.
- **“Not saved”** — writing failed (disk full, session expired). The text stays on screen: sign in
  again in another tab, then Ctrl/⌘ + S.
- **A note does not appear** — only `.md` files are notes; names starting with a dot or an
  underscore are ignored.
