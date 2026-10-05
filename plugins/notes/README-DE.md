# Notizen

Notizen in Ordnern, in einem Tab von Allkin. Du schreibst im formatierten Dokument – Überschriften,
Listen, Kontrollkästchen, Tabellen, Bilder –, ohne je ein Tag zu sehen: Geschrieben wird im
Markdown-Editor von Allkin.

Jede Notiz ist eine `.md`-Datei, jeder Ordner ein echter Ordner im gemeinsamen Ordner
(`~/.allkin/share/notes/`). Deine Agenten lesen und schreiben also dieselben Notizen: „Leg das
Protokoll in meinen Notizen ab, Ordner Besprechungen“ funktioniert genau so.

## Dieses Plugin benötigt den Markdown-Editor

Der Notizblock bearbeitet den Text nicht selbst: Er stützt sich auf das Plugin **Markdown-Editor**
(`markdown-editor`). Ist es noch nicht vorhanden, **installiert Allkin es automatisch mit** – das
Installationsfenster sagt es dir, bevor es losgeht. Wie jedes Plugin kommt es ohne Rechte an:
Gewähre ihm sein Recht „Oberfläche“ auf seiner Seite, sonst zeigt der Notizblock einen Bildschirm,
der dich dorthin führt. (Der Markdown-Editor wird mit Allkin ausgeliefert: Meist ist er bereits
installiert und zugelassen.)

## Erste Schritte

1. Installiere das Plugin, gewähre ihm sein Recht auf seiner Seite und lade Allkin neu.
2. Öffne **Notizen** in der Plugin-Liste des Allkin-Menüs.
3. **Notiz** legt eine Notiz im angezeigten Ordner an: Titel eingeben, dann Enter zum Schreiben.

Der Bildschirm hat drei Bereiche: die Ordner, die Notizen des Ordners, die Notiz. Auf einem
Smartphone ist jeweils ein Bereich zu sehen; der Pfeil in der Leiste führt zurück.

## Was du tun kannst

- **Ordner und Unterordner** – anlegen (Schaltfläche **Ordner** oder Rechtsklick auf einen Ordner),
  umbenennen, verschieben, löschen. Ein Klick auf den Pfeil klappt einen Ordner ein.
- **Ablegen** – ziehe eine Notiz oder einen Ordner auf einen Ordner oder nutze **Verschieben nach…**.
  Ablegen auf „Alle Notizen“ nimmt das Element aus jedem Ordner heraus.
- **Titel** – der Titel über der Notiz ist der Name ihrer Datei: Ihn zu ändern benennt die Notiz um.
- **Automatisches Speichern** – die Notiz wird beim Schreiben gespeichert; der Zustand steht in der
  Leiste. Strg/⌘ + S speichert sofort.
- **Anheften** – eine angeheftete Notiz bleibt oben in ihrer Liste und erscheint unter „Angeheftet“.
- **Suchen** – das Feld der Leiste durchsucht die Titel und den Text aller Notizen.
- **Sortieren** – nach letzter Änderung, Erstellungsdatum oder Titel.
- **Duplizieren, Text kopieren, herunterladen** der `.md`-Datei – Rechtsklick auf eine Notiz (langes
  Drücken auf einem Touchscreen) oder die Schaltfläche ⋯ der Leiste für die geöffnete Notiz.
- **Bilder und Dateien** – ziehe sie in den Text oder füge sie ein: Sie liegen in `notes/_files/`,
  und die Notiz behält sie, wenn sie den Ordner wechselt.
- **Papierkorb** – Löschen verschiebt in den Papierkorb des Notizblocks, von wo du an den
  ursprünglichen Ort **wiederherstellst**. Was du aus diesem Papierkorb entfernst, wandert in den
  des gemeinsamen Ordners (Seite Dateien) und bleibt dort, bis dieser geleert wird: Nichts
  verschwindet versehentlich.
- **Zähler** – Wörter, Zeichen und Änderungsdatum unter der Notiz.

## Wo die Notizen liegen

| Ort | Inhalt |
|-----|--------|
| `share/notes/…/*.md` | die Notizen in ihren Ordnern |
| `share/notes/Trash/` | der Papierkorb des Notizblocks |
| `share/notes/_files/` | in die Notizen gezogene Bilder und Dateien |
| `share/notes/.notes.json` | die angehefteten Notizen und die Herkunft der Elemente im Papierkorb |

Eine Notiz, die ein Agent ändert, während sie geöffnet ist, wird neu gelesen, wenn du zum Tab
zurückkehrst – solange du nicht gerade darin schreibst.

## Einstellungen

Keine.

## Angefordertes Recht

- **Oberfläche von Allkin** – das Plugin läuft in der Seite von Allkin, mit deiner Sitzung: Es fügt
  seinen Tab und seinen Eintrag in der Plugin-Liste hinzu. Es hat weder Dienst noch Agent und
  schreibt nur in seinen Ordner im gemeinsamen Ordner.

## Für andere Plugins

```js
Allkin.capability("notes").open();
const path = await Allkin.capability("notes").create({ title: "Idee", content: "# Idee\n", folder: "Projekte" });
```

## Wenn es nicht funktioniert

- **„Der Markdown-Editor fehlt“** – das Plugin Markdown-Editor ist nicht installiert oder sein Recht
  ist nicht gewährt. Die Schaltfläche des Bildschirms öffnet seine Seite; Recht gewähren, dann neu
  laden.
- **Der Tab erscheint nicht** – das Recht „Oberfläche“ des Notizblocks ist nicht gewährt, oder die
  Seite wurde seitdem nicht neu geladen.
- **„Nicht gespeichert“** – das Schreiben ist fehlgeschlagen (Datenträger voll, Sitzung abgelaufen).
  Der Text bleibt auf dem Bildschirm: In einem anderen Tab neu anmelden, dann Strg/⌘ + S.
- **Eine Notiz erscheint nicht** – nur `.md`-Dateien sind Notizen; Namen, die mit einem Punkt oder
  Unterstrich beginnen, werden ignoriert.
