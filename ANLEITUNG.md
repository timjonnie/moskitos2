# Moskitos 2 – alles auf einer Website (GitHub Pages)

## Das Ziel

Eine Adresse für alles: `https://DEINNAME.github.io/moskitos2/`

| Adresse | Inhalt |
|---|---|
| `/moskitos2/` | Anmeldung und Startseite mit nächstem/letztem Spiel, Saisonzahlen, Trend, Tabelle |
| `/moskitos2/training/` | Trainertool (Kader, ZN, SR, Übungen, Training) |
| `/moskitos2/analyse/` | Spielanalyse mit Erfassung und Gegner-Reiter |
| `/moskitos2/analyse/#gegner` | direkt zur Gegneranalyse |

Jeden Montag holt GitHub die neuen Spielberichte. Startseite und Gegner-Reiter zeigen sie ohne weiteren Schritt.

## Der Ordner, so wie er ins Repo gehört

```
moskitos2/
├── index.html                  Startseite
├── gegner_daten.json           Spielberichte + Termine (wird montags erneuert)
├── spielberichte_abruf.js      Montags-Abruf
├── ga_parse.js                 Auslese der PDFs (gleiche Logik wie im Tool)
├── ANLEITUNG.md                diese Anleitung
├── analyse/
│   └── index.html              Spielanalyse inkl. Gegner
├── training/
│   └── index.html              Export aus dem Trainertool (von dir)
└── .github/
    └── workflows/
        └── montag.yml          Zeitplan: jeden Montag 06:00
```

## Teil A – vorbereiten (5 Minuten)

1. Den Ordner `moskitos2` aus der ZIP-Datei auf den PC entpacken.
2. Trainertool öffnen → Verwaltung → **HTML-Datei exportieren**.
   Die Datei heißt `index.html` → in den Ordner `moskitos2/training/` legen
   (die Textdatei `HIER-TRAINERTOOL-EXPORT-ABLEGEN.txt` darf weg).
3. Spielanalyse: Die Datei `analyse/index.html` ist bereits fertig (Stand heute Morgen + Gegner).
   Wenn in der Analyse seitdem etwas erfasst wurde: dort Verwaltung → HTML-Datei exportieren
   und die neue Datei in `analyse/` ersetzen.

## Teil B – GitHub einrichten (10 Minuten)

4. github.com → **Sign up** (kostenlos).
5. Oben rechts **+** → **New repository**
   - Name: `moskitos2`
   - **Public**
   - Haken bei **Add a README file** → **Create repository**
6. **Add file → Upload files** → den *Inhalt* des Ordners `moskitos2` in das Feld ziehen
   (also `index.html`, `gegner_daten.json`, `spielberichte_abruf.js`, `ga_parse.js`, `ANLEITUNG.md`
   und die Ordner `analyse` und `training`). Unten **Commit changes**.
   Prüfen: In der Dateiliste stehen jetzt die Ordner `analyse` und `training`.
7. Den Zeitplan anlegen (der Ordner `.github` lässt sich nicht hochziehen):
   **Add file → Create new file**, Name genau `.github/workflows/montag.yml`,
   Inhalt der Datei `montag.yml` hineinkopieren → **Commit changes**.
8. **Settings → Actions → General** → ganz unten **Read and write permissions** → **Save**.

## Teil C – einschalten und testen (5 Minuten)

9. **Settings → Pages** → Source **Deploy from a branch** → Branch **main**, Ordner **/(root)** → **Save**.
   Nach 1–2 Minuten steht oben der Link `https://DEINNAME.github.io/moskitos2/`.
10. **Actions → Spielberichte Montag → Run workflow** → grünen Haken abwarten.
11. Testen:
    - Startseite: Steht „Nächstes Spiel: TV Merchweiler – Moskitos 2“ da?
    - **Training** öffnen → mit dem bisherigen Trainertool-Login anmelden.
    - **Spielanalyse** öffnen → anmelden → Reiter **Gegner** ansehen.
12. Den Link an Lucas und die Mannschaft schicken. Die Netlify-Seiten bleiben vorerst online,
    bis alles zwei, drei Wochen problemlos läuft.

## Ein Login für alles (ab Version 2.0 der Startseite)

- Angemeldet wird nur noch auf der Startseite. Benutzername und Passwort sind die bisherigen.
- Die Startseite öffnet damit Training und Analyse gleichzeitig. Wer nur für ein Modul freigeschaltet ist,
  sieht das andere ausgegraut. Die Rollen (Admin, Trainer, Spielerin) gelten in den Modulen wie bisher.
- Wer ein Modul direkt aufruft, ohne angemeldet zu sein, landet automatisch auf der Anmeldung und danach im Modul.
- „Abmelden“ in einem Modul oder auf der Startseite meldet überall ab.
- Damit das in beiden Tools klappt, sollten Benutzername und Passwort in Training und Analyse gleich sein.
  Unterschiedliche Passwörter gehen auch, dann öffnet die Startseite nur das Modul, zu dem das Passwort passt.

## Verwaltung im Team-Board (ab Version 3.0)

Zugänge, Rollen und Spielerinnenprofile werden nur noch im Team-Board gepflegt (Bereich „Verwaltung“, nur für Admins).

| Rolle | sieht |
|---|---|
| Admin | alles, inkl. Verwaltung |
| Trainer | Team-Board, Training, Spielanalyse, Gegner, Profilansicht aller Spielerinnen |
| Spielerin | eigenes Dashboard mit allen eigenen Werten (Überblick, Verlauf, Plus/Minus, jedes Spiel im Detail, Einsätze, nächste Spiele mit Status), das Gesamtbild der Mannschaft und die Gegneranalyse – keine Daten anderer Spielerinnen, keine Rankings |

So funktioniert es:
1. Verwaltung öffnen → Zugänge anlegen oder ändern, Spielerinnen zuordnen, Namensabgleich prüfen.
2. „Speichern und Dateien erzeugen“ → es wird `team-board-update.zip` heruntergeladen.
3. ZIP entpacken und den Inhalt ins Repo hochladen: `board.json` in die oberste Ebene,
   `analyse/index.html` und `training/index.html` in ihre Ordner.
4. Profile und Teamdaten werden bei jedem Speichern neu aus Training und Analyse berechnet.
   Nach einem Spieltag also: Analyse exportieren und hochladen, dann in der Verwaltung einmal speichern.

Wichtig:
- Passwort nur eintragen bei neuen Zugängen, bei Passwortänderung oder wenn sich Rolle bzw. Zuordnung ändert.
- Spielerinnen bekommen keinen Zugang zu Training und Analyse. Ihre Profile sind einzeln verschlüsselt:
  Jede Spielerin kann technisch nur ihr eigenes Profil öffnen.
- Vor dem ersten Speichern zuerst die neuen Dateien aus dem Update-Paket hochladen, damit die Verwaltung
  auf dem aktuellen Stand der Module aufbaut.

## Als App aufs Handy

- iPhone (Safari): Teilen → „Zum Home-Bildschirm“.
- Android (Chrome): Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.

## So geht es im Alltag weiter

- **Spiel erfasst / Kader geändert:** im jeweiligen Tool exportieren → auf GitHub in den Ordner
  `analyse` bzw. `training` gehen → **Add file → Upload files** → `index.html` hineinziehen → Commit.
  Die alte Datei wird ersetzt, eine Minute später ist die neue online. Keine Credits, kein Limit.
- **Neue Spielberichte:** kommen jeden Montag automatisch. Einzelne PDFs kannst du weiterhin
  im Gegner-Reiter hochladen.
- **Etwas kaputt?** Jede Datei hat auf GitHub einen Verlauf (**History**) – alte Version öffnen,
  herunterladen, wieder hochladen.

## Wichtig zum Datenschutz

Das Repo ist öffentlich. Die Daten in `analyse/index.html` und `training/index.html` sind mit
eurem Login verschlüsselt und ohne Passwort nicht lesbar – also starke Passwörter verwenden.
`gegner_daten.json` enthält nur Angaben aus den öffentlichen Spielberichten.
Wer das Repo privat haben möchte, braucht GitHub Pro (ca. 4 $/Monat), dann geht Pages auch privat.

## Die nächsten Ausbaustufen

- **Stufe 2 – gemeinsame Spielerliste:** Trainertool als Quelle für Kader und Spielplan,
  die Analyse übernimmt Spielerinnen per ID statt per Namen.
- **Stufe 3 – eine App, ein Login:** Training und Analyse in einer Datei mit einer Anmeldung.
  Lohnt sich, sobald Stufe 2 läuft.
