# Bildeditor

Ein Bild zuschneiden, verkleinern, komprimieren und beschriften, ohne Allkin zu verlassen: ein
Screenshot zum Kommentieren, ein zu schweres Foto, ein Detail, das vor dem Teilen verborgen werden
soll.

## Erste Schritte

- **Ein Bild eines Agenten oder des freigegebenen Ordners**: im Datei-Explorer Rechtsklick auf das
  Bild › **Bild bearbeiten**. Es öffnet sich in einem eigenen Tab.
- **Ein Bild von diesem Gerät**: Plugin-Liste des Allkin-Menüs › **Bildeditor**, oder die
  Schaltfläche **Öffnen** im Editor. Man kann auch eine Datei auf den Editor ziehen oder ein Bild
  einfügen (Strg+V), während er angezeigt wird.

## Werkzeuge

Links (auf dem Telefon unten):

- **Auswählen**: Ein Klick wählt eine Anmerkung, Ziehen verschiebt sie, Entf löscht sie;
  Doppelklick auf einen Text, um ihn zu bearbeiten. Farbe oder Stärke ändern wirkt auf die
  gewählte Anmerkung.
- **Zuschneiden**: den Rahmen ziehen, der bleiben soll, dann Eingabe (oder „Zuschneiden“).
- **Pfeil**, **Linie**, **Rechteck**, **Ellipse**: Umschalt für eine Gerade, ein Quadrat, einen
  Kreis. Rechteck und Ellipse können gefüllt sein.
- **Stift** und **Textmarker** (breiter, durchscheinender Strich).
- **Text**: dorthin klicken, wo er hin soll; `\n` für eine neue Zeile; auf Wunsch ein
  kontrastierender Hintergrund.
- **Nummerierter Schritt**: Jeder Klick setzt die nächste Nummer (1, 2, 3 …).
- **Verpixeln**: über das ziehen, was nicht lesbar sein soll (ein Name, ein Schlüssel, eine
  Adresse). Im gespeicherten Bild ist das endgültig.
- **Drehen**, **Spiegeln**, **Größe ändern** (Pixel, Prozent, Seitenverhältnis beibehalten).

Über dem Bild: Farben, Stärke, Textgröße, Zoom (Strg + Mausrad, oder die Prozentangabe zum
Wechsel zwischen „angepasst“ und „Originalgröße“). Rückgängig / Wiederholen: Strg+Z /
Strg+Umschalt+Z, bis zu 40 Schritte.

Anmerkungen bleiben bis zum Speichern bearbeitbar. Zuschneiden, Drehen, Spiegeln oder Größe ändern
verschmilzt sie mit dem Bild, damit sie den Pixeln folgen.

## Speichern, exportieren

- **Speichern** (Strg+S) schreibt das Bild an seinen Platz zurück, in seinem Format. **Die
  vorherige Version landet im Papierkorb** des Ordners (`Trash/`): Nichts geht verloren. Ein GIF
  oder BMP, das der Browser nicht schreiben kann, wird als PNG-Kopie angeboten.
- **Exportieren** wählt das Format (PNG, JPEG, WebP), die **Qualität** – das ist die Komprimierung:
  niedriger ist leichter – und die längste Seite (Verkleinerung). Das resultierende Gewicht wird vor
  dem Bestätigen angezeigt. Dann **Herunterladen** oder **Kopie daneben speichern**. Ein Bild von
  diesem Gerät wird im freigegebenen Ordner unter `share/image-editor/` gespeichert.
- **Kopieren** legt das beschriftete Bild in die Zwischenablage.

Einen Tab ohne Speichern zu schließen behält die Änderungen bis zum Neuladen der Seite im
Speicher: Erneutes Öffnen des Bildes findet sie wieder.

## Einstellungen

Keine.

## Angefordertes Recht

- **Oberfläche**: Der Editor wird der Allkin-Seite hinzugefügt. Er liest und schreibt Bilder mit
  deiner Sitzung, über dieselben Routen wie der Datei-Explorer.

## Wenn es nicht funktioniert

- *„Bild bearbeiten“ fehlt im Explorer*: Der Explorer muss mindestens Version 1.0.15 haben, und die
  Seite muss nach dem Aktivieren des Plugins neu geladen werden.
- *Kopieren funktioniert nicht*: Der Browser verweigert die Zwischenablage außerhalb von HTTPS;
  Exportieren verwenden.
- *Sehr großes Bild*: Ab etwa 16.000 Pixeln Seitenlänge kann dem Browser der Speicher ausgehen;
  zuerst verkleinern.

Experimentelles Plugin: ein erster Entwurf, noch zu validieren.
