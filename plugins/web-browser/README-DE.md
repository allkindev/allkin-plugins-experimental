# Webbrowser

Öffnet Websites in Tabs von Allkin. Ein angeklickter Link in einer Unterhaltung, einem Dokument oder
einer Seite führt nicht mehr aus der Anwendung: Die Website öffnet sich in einem Tab neben allem
anderen.

## Erste Schritte

- **Ein Link**: Ein Klick auf einen Link zu einer anderen Website öffnet sie in einem Tab von
  Allkin. **Strg + Klick** (⌘ + Klick auf dem Mac), Umschalt + Klick oder ein Mittelklick behalten
  das Verhalten des Browsers: ein neuer Browser-Tab, wie bisher.
- **Eine Adresse**: Werkzeugliste der Seitenleiste › **Webbrowser**, dann die Adresse. Was keine
  Adresse ist, startet eine Suche.
- Im Tab: die Adressleiste (Eingabe zum Aufrufen), **Neu laden**, **Link kopieren**, **Im Browser
  öffnen**. Das Schloss zeigt, ob die Verbindung verschlüsselt ist (HTTPS).

Jede Website behält ihre Seite, solange ihr Tab offen ist: Wechsel zu einem anderen Fenster und
zurück findet sie unverändert (höchstens acht Websites; darüber hinaus lädt die älteste beim
Zurückkehren neu).

## Websites, die sich weigern

Viele Websites verbieten die Anzeige innerhalb einer anderen (Google, GitHub, Banken, die meisten
Online-Konten): Das schützt vor Klick-Hijacking. Der Browser würde es nicht melden – der Rahmen
bliebe leer. Der Dienst des Plugins liest die Header der Website, bevor er sie anzeigt; weigert sie
sich, sagt der Tab es und bietet **Im Browser öffnen** an. „Trotzdem versuchen“ zeigt den Rahmen
dennoch.

Die angezeigte Adresse ist die geöffnete: Folgt man Links innerhalb der Website, lässt der Browser
Allkin sie nicht wissen.

## Einstellungen

- **Lokaler Port** (9345): der Port des Dienstes, nur auf dieser Maschine. Ändern, falls belegt.

## Angeforderte Rechte

- **Oberfläche**: die Tabs des Browsers und das Öffnen externer Links darin.
- **Netzwerk**: Der Dienst liest die Header einer Website (sonst nichts, nichts wird gespeichert).
  Er lauscht nur auf 127.0.0.1, hinter der Sitzung von Allkin.

Damit die Prüfung funktioniert, das Plugin auf seiner Seite auch **als Dienst starten** lassen. Ohne
Dienst öffnen sich Websites trotzdem; nur die Warnung fehlt.

## Wenn es nicht funktioniert

- *Ein Tab bleibt leer*: Die Website verweigert wohl den Rahmen und der Dienst läuft nicht
  (Plugin-Seite › Dienst). „Im Browser öffnen“ verwenden.
- *Allkin läuft über HTTPS und eine HTTP-Website erscheint nicht*: Der Browser blockiert
  unverschlüsselte Inhalte in einer verschlüsselten Seite. Im Browser öffnen.
- *Links öffnen sich weiterhin außerhalb von Allkin*: Seite nach dem Aktivieren des Plugins neu
  laden.

Experimentelles Plugin: ein erster Entwurf, noch zu validieren.
