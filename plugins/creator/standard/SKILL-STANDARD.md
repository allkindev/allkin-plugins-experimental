# Allkin skill standard

A **skill** is a know-how an agent loads on demand: a folder holding a
`SKILL.md` — a short header saying what the skill is for, then the procedure —
and, when useful, reference documents, templates or scripts. The agent starts a
session with only the names and descriptions of the skills it was given; when a
task matches one, it reads the body. This is the open "Agent Skills" format,
unchanged, plus one file of Allkin's own.

To the user, a skill is a **competence** (fr *compétence*, es *competencia*,
de *Fähigkeit*): the Competences page installs them, the agent's page (section
Reach) hands them to an agent. "Skill" stays the technical name: `SKILL.md`,
`skill.json`, `skills/<id>/`.

A skill **grants nothing**. It tells an agent how to do something with the tools
and rights it already has. The `allowed-tools` field of the open format is read
and ignored by Allkin.

"Must" is checked (an **error**); "should" is asked by the standard (a **warning**).

## 1. What a skill is

One folder, named by the skill's **identifier** (lowercase letters, digits,
hyphens; never renamed):

```
skills/<id>/
├── SKILL.md           must   header + procedure (the open format)
├── skill.json         must   Allkin's data: version, author, translations
├── README.md          must   the help shown to the user, in English
├── README-FR.md       should the help, in French
├── README-ES.md       should the help, in Spanish
├── README-DE.md       should the help, in German
├── validation.json    should { "status": "pending" }
├── icon.svg           optional a 256-grid Phosphor glyph, light weight
├── references/        optional long documents the procedure points to
├── assets/            optional templates, files to copy or fill
└── scripts/           optional programs the procedure names
```

Bounds: 500 files, 20 MB per file, file names in plain segments
(`[A-Za-z0-9_][A-Za-z0-9._-]*`).

## 2. `SKILL.md`

The file starts with a header between two lines `---`, then the body.

```markdown
---
name: markdown-tables
description: Use when the answer compares several items along the same criteria, or when the user asks for a table.
---

# Markdown tables

When to use it, then the procedure, step by step.
```

- `name` — must — **the folder name**, exactly. The engine lists the skill as
  `allkin:<name>`.
- `description` — must — one line. It is the only thing the agent reads before
  deciding to load the skill: say **when** it applies, in one or two sentences,
  with the words a user would use. "Use when…" is a good start.
- `license`, `metadata` — optional, ignored by Allkin.
- `allowed-tools` — read and ignored (see above). Its presence is a warning.
- The **body** — should not be empty — is the procedure: numbered steps, what
  to check, what to avoid, an example of the expected shape. Aim for a few
  hundred lines at most; what is longer goes in `references/` and the body says
  when to read it. A path in the body is relative to the skill's folder.
- Written in **English**: the body is read by a model, never shown to the user.
  The agent answers in the user's language whatever the language of its
  instructions.

## 3. `skill.json`

What the open format does not carry and Allkin needs:

```json
{
  "version": "1.0.0",
  "author": "Allkin",
  "homepage": "https://…",
  "icon": "icon.svg",
  "locales": {
    "en": { "name": "Markdown tables", "description": "…" },
    "fr": { "name": "Tableaux Markdown", "description": "…" },
    "es": { "name": "Tablas Markdown", "description": "…" },
    "de": { "name": "Markdown-Tabellen", "description": "…" }
  }
}
```

- `version` — must — `1.0.N`, nothing else (see the plugin standard, §3).
  Raised by 1 on **every** change of any file of the skill.
- `author`, `homepage` (`https://`), `icon` (a file at the root) — optional.
- `locales` — should hold `fr`, `es`, `de` — the name and description the
  **user** reads in the gallery and on the agent's page. `en` may repeat the
  header's values in a form fit for a reader.

## 4. The help: `README.md`

Readable before installing, from the Competences page. It says what the skill
is for, which agents should have it, and what it does not do. English, plus the
three translations.

## 5. Validation: `validation.json`

`{ "status": "pending" }` — always, for a new skill. Only the owner of Allkin
turns it into `validated`. An author never writes `validated`.

## 6. What a skill may not do

- It does not install, start or configure anything: it is text.
- It does not widen rights. A procedure that needs a tool the agent lacks says
  so to the user; it does not look for another way.
- Its scripts run only if the agent already has the right to run commands,
  and each run is approved by the user like any command.
- It does not store secrets: its files are readable by every agent that has it.

## 7. Conformance checklist

1. The folder name is a valid identifier, and `SKILL.md` says `name: <id>`.
2. The header gives `description` on one line, saying when the skill applies.
3. The body is a real procedure, in English.
4. `skill.json` parses, with `version` `1.0.N` and `locales` for `fr`, `es`, `de`.
5. `README.md` and its three translations exist.
6. `validation.json` says `pending`.
7. No `allowed-tools`; no secret; nothing outside the folder.
8. The version was raised by 1 for this batch of changes.
