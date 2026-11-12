# Moskitos 2 – Team-Board: Anleitung

Eine Adresse für alles: `https://timjonnie.github.io/moskitos2/`

| Adresse | Inhalt | für |
|---|---|---|
| `/moskitos2/` | Team-Board: Anmeldung, Dashboard, nächstes/letztes Spiel, Tabelle, Rückmeldungen, Verwaltung | alle |
| `/moskitos2/#gegner` | Gegneranalyse | alle |
| `/moskitos2/#auswertung` | Auswertung (Spielerinnen: die eigene, Trainer: die gewählte Spielerin) | alle |
| `/moskitos2/training/` | Trainertool – auf der Startseite die Kachel **„Trainer“** (Kader, ZN, SR, Übungen, Training) | Trainer, Admin |
| `/moskitos2/analyse/` | Spielanalyse mit Erfassung | Trainer, Admin |

Alle Daten liegen in einer Online-Datenbank (Firebase, Server in Frankfurt).
Was du in Training, Analyse oder Team-Board speicherst, ist sofort für alle Berechtigten sichtbar.
**Exportieren und Hochladen ist nicht mehr nötig.**

## Anmelden

- Angemeldet wird auf der Startseite. Ein Login gilt für das ganze Team-Board.
- Wer Training oder Analyse direkt aufruft, ohne angemeldet zu sein, landet auf der Anmeldung und danach im Modul.
- „Abmelden“ meldet überall ab.
- Passwort ändern: oben auf **Passwort ändern** tippen. Das macht jede Person selbst.

## Rollen

| Rolle | sieht |
|---|---|
| Admin | alles, inkl. Verwaltung |
| Trainer | Team-Board, Training, Spielanalyse, Gegner, Profilansicht aller Spielerinnen, Rückmeldungen |
| Spielerin | eigenes Dashboard mit allen eigenen Werten, Zu-/Absage für Spiele und Training, Gesamtbild der Mannschaft, Gegneranalyse – keine Daten anderer Spielerinnen, keine Rankings |

Die Rollen werden von der Datenbank selbst durchgesetzt: Eine Spielerin kann technisch nur ihr eigenes Profil lesen.

## Einmalig: Ersteinrichtung (Umzug der alten Daten)

1. Startseite öffnen → **Ersteinrichtung**.
2. Mit dem **bisherigen Admin-Zugang** anmelden (Benutzername und Passwort wie früher) → **Daten übertragen**.
   Training, Analyse und die alte Verwaltung werden aus dem Ordner `alt/` und `board.json` gelesen und in die Datenbank geschrieben.
3. Danach in der **Verwaltung** unter „Aus der alten Verwaltung übernommen“ für jeden bisherigen Zugang ein Startpasswort
   vergeben → **Alle mit eingetragenem Passwort anlegen**.
4. Prüfen, ob Training, Analyse und Profile stimmen. Dann Bescheid geben: Der Ordner `alt/` und `board.json`
   werden aus dem Repo gelöscht. Sie enthalten die alten, verschlüsselten Daten und werden nicht mehr gebraucht.

## Verwaltung (nur Admin)

Team-Board → **Verwaltung öffnen**.

1. **Zugänge:** neue Zugänge anlegen (Benutzername, Rolle, zugeordnete Spielerin, Startpasswort),
   Rolle oder Zuordnung ändern, Zugänge entfernen. Änderungen gelten sofort.
   Mit „Für alle aktiven Spielerinnen ohne Zugang anlegen“ bekommen alle Spielerinnen auf einmal einen Zugang.
2. **Namensabgleich:** Namen aus der Spielanalyse den Spielerinnen im Kader zuordnen.

**Passwort vergessen:** Ein Admin kann Passwörter nicht zurücksetzen (Einschränkung des kostenlosen Firebase-Tarifs).
Lösung: den Zugang entfernen und unter einem **neuen** Benutzernamen neu anlegen (z. B. `anna.m2` statt `anna.m`).
Der alte Benutzername bleibt dauerhaft belegt.

## Ligastatistik

Auf der Startseite steht über der Tabelle die **Ligastatistik** (auf- und zuklappbar), berechnet aus allen Spielberichten
der Liga: Spiele und Heim-/Gastsiege, Tore gesamt und je Spiel, bester Angriff (meiste Tore je Spiel) und beste Abwehr
(wenigste Gegentore je Spiel), höchster Heim- und Auswärtssieg, torreichstes und
torärmstes Spiel, meiste Tore / 7m-Tore / Feldtore einer Spielerin in einem Spiel, beste Torschützin der Saison,
Siebenmeter-Quote und Zeitstrafen – jeweils mit der führenden Mannschaft (beste 7m-Quote ab 5 Würfen, meiste
verwandelte 7m, meiste Zeitstrafen je Spiel). Spiele mit Moskitos 2 sind orange markiert.
Trainer und Admin können sie unten im Bereich als **PDF**, **Bild (PNG)** oder per **Teilen …** exportieren – im gleichen Format wie die Gegneranalyse.

### Seite „Alle Ligastatistiken“ (`#liga`)

Über den Link unter der Ligastatistik: Spieltag-Rückblick und -Vorschau, Tabellen (Heim, Auswärts, 1./2. Halbzeit,
Form der letzten 5), Tabellenverlauf (mit Vergleichsmannschaft), Phasen-Tabelle (Start- und Schlussphase),
Spannung und Comebacks, Übersicht und Rekorde, Disziplin, Auszeiten-Wirkung, Unter-/Überzahl (exakt aus den 2-Minuten-Strafen),
Restprogramm Moskitos 2. **Ranglisten** (Torschützinnen, 7m-Schützinnen) sehen nur Trainer und Admin.
Die Spieltags-Vorschau enthält alle Ligaspiele, sobald der Montags-Abruf sie mitliefert (`league_fixtures`).
Ganz unten (Trainer und Admin): **Ligastatistik exportieren** – die ganze Seite als mehrseitiges A4-PDF, Bild oder zum
Teilen; alle fünf Tabellen untereinander. Mit Haken bei „Ranglisten mitexportieren“ entsteht die Trainerstab-Version.

Auf der Startseite füllt sich die Ligastatistik am Desktop automatisch mit weiteren Kennzahlen (beste Heim-/Auswärts-
mannschaft, formstärkste Mannschaft, beste Start-/Schlussphase, fairste Mannschaft, Siegesserie, beste Halbzeiten,
wirksamste Auszeiten), bis sie mit der linken Spalte bündig abschließt.

## Rückmeldungen der Spielerinnen

- Spielerinnen sagen in ihrem Dashboard bei den nächsten Spielen und Trainings zu oder ab.
- Trainer sehen im Team-Board unter **Rückmeldungen der Spielerinnen** pro Termin, wer dabei ist, wer abgesagt hat und wer offen ist.
- Bei Spielen gibt es den Knopf **„… Rückmeldungen ins Trainertool übernehmen“**. Er trägt Zusagen als „Dabei“ und
  Absagen als „Absage“ beim Spiel im Trainertool ein. Eine Zusage ändert nichts an „Nicht nominiert“ – das bleibt Entscheidung des Trainers.

## Profile und Teamwerte

Profile und Mannschaftszahlen werden neu berechnet, **sobald ein Trainer oder Admin das Team-Board öffnet**.
Nach einem Spieltag also: Spiel in der Analyse erfassen, danach einmal das Team-Board öffnen.

## Spielberichte (automatisch)

- Jeden Montag um 6 Uhr (Winterzeit) holt GitHub die neuen Spielberichte von handball360 und aktualisiert `gegner_daten.json`.
- Sofort abrufen: GitHub → **Actions → Spielberichte Montag → Run workflow**.
- Verlegte Spiele erscheinen automatisch, sobald ein Endstand vorliegt.
- Einzelne PDFs können weiterhin im Gegner-Reiter der Spielanalyse hochgeladen werden.

## Gegneranalyse exportieren (Trainer und Admin)

Im Reiter **Gegner** (Team-Board oder Spielanalyse) einen Gegner wählen → unten **Komplette Analyse exportieren**.

- Ohne Haken entsteht die **Version für die Mannschaft**: Kennzahlen, Torschützinnen, Spielerinnen-Tabelle,
  Torphasen, Spielverläufe, Ergebnisse und Spiele gegen uns.
- Mit Haken bei **„Das fällt auf“** (und in der Spielanalyse optional **Trainer-Notizen**) entsteht die
  **Version für den Trainerstab**. Sie ist im Kopf und auf jeder Seite so markiert und gehört nicht in die Mannschaftsgruppe.
- **Teilen …** (Handy, als PDF), **Als PDF** (A4, mehrseitig) oder **Als Bild (PNG)** (eine lange Grafik).

## Eigene Auswertung (Moskitos 2)

Im Reiter **Gegner** steht in der Auswahl ganz oben **„Moskitos 2 – eigene Auswertung“**. Trainer und Admin kommen auch direkt über den Knopf **„Bericht“** auf der Startseite dorthin. Sie wertet unsere eigenen
Spielberichte genauso aus wie die der Gegner: Bilanz, Torphasen, Spielverläufe, Ergebnisse, Heim und auswärts.

- **Spielerinnen** sehen nur Mannschaftswerte – keine Torschützinnen, keine Tabelle mit einzelnen Spielerinnen.
- **Trainer und Admin** sehen zusätzlich Torschützinnen und Spielerinnen-Tabelle.
- Beim Export enthält die Version für die Mannschaft nur Mannschaftswerte. Mit Haken bei
  „Das fällt auf und Werte einzelner Spielerinnen“ entsteht die Version für den Trainerstab.

## Als App aufs Handy

- iPhone (Safari): Teilen → „Zum Home-Bildschirm“.
- Android (Chrome): Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.

## Änderungen am Team-Board selbst

Änderungen am Aussehen oder an Funktionen macht Claude Code direkt im Repo auf einem eigenen Branch.
Du prüfst den Pull Request auf GitHub und klickst **Merge** – eine Minute später ist die neue Version online.
Jede Datei hat auf GitHub einen Verlauf (**History**), alte Stände lassen sich jederzeit wiederherstellen.

## Wenn eine Änderung nicht online erscheint

Im Footer der Startseite steht die Version. Ist sie nach ein paar Minuten noch alt:
GitHub → **Actions → Website veröffentlichen** → **Run workflow**. Nach ein bis zwei Minuten ist der neue Stand online.

## Datenschutz

- Das Repo ist öffentlich. Es enthält nur den Programmcode und `gegner_daten.json` mit Angaben aus den
  offiziellen, öffentlichen Spielberichten (auch Torschützinnen der eigenen Mannschaft).
- Alle Mannschaftsdaten (Kader, Training, Analyse, Profile, Rückmeldungen) liegen geschützt in der Datenbank.
- Keine Passwörter in Chats, Mails oder Dateien weitergeben. Startpasswörter beim ersten Anmelden ändern lassen.
- Vor dem Start: Einwilligung der Spielerinnen zur Verarbeitung ihrer Leistungsdaten einholen (Text noch offen).
