# Moskitos 2 – Team-Board: Anleitung

Eine Adresse für alles: `https://timjonnie.github.io/moskitos2/`

| Adresse | Inhalt | für |
|---|---|---|
| `/moskitos2/` | Team-Board: Anmeldung, Dashboard, nächstes/letztes Spiel, Tabelle, Rückmeldungen, Verwaltung | alle |
| `/moskitos2/#gegner` | Gegneranalyse | alle |
| `/moskitos2/#auswertung` | Auswertung (Spielerinnen: die eigene, Trainer: die gewählte Spielerin) | alle |
| `/moskitos2/training/` | Trainertool (Kader, ZN, SR, Übungen, Training) | Trainer, Admin |
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

## Als App aufs Handy

- iPhone (Safari): Teilen → „Zum Home-Bildschirm“.
- Android (Chrome): Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.

## Änderungen am Team-Board selbst

Änderungen am Aussehen oder an Funktionen macht Claude Code direkt im Repo auf einem eigenen Branch.
Du prüfst den Pull Request auf GitHub und klickst **Merge** – eine Minute später ist die neue Version online.
Jede Datei hat auf GitHub einen Verlauf (**History**), alte Stände lassen sich jederzeit wiederherstellen.

## Datenschutz

- Das Repo ist öffentlich. Es enthält nur den Programmcode und `gegner_daten.json` mit Angaben aus den
  offiziellen, öffentlichen Spielberichten (auch Torschützinnen der eigenen Mannschaft).
- Alle Mannschaftsdaten (Kader, Training, Analyse, Profile, Rückmeldungen) liegen geschützt in der Datenbank.
- Keine Passwörter in Chats, Mails oder Dateien weitergeben. Startpasswörter beim ersten Anmelden ändern lassen.
- Vor dem Start: Einwilligung der Spielerinnen zur Verarbeitung ihrer Leistungsdaten einholen (Text noch offen).
