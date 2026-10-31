# Moskitos 2 – Team-Board (Projektwissen für Claude Code)

Analyse- und Trainertool für die Frauenmannschaft **Moskitos 2** (HSG DJK Marpingen-SC Alsweiler II),
Oberliga Frauen HV Saar, Saison 2026/2027. Läuft als statische Website auf **GitHub Pages** (Branch `main`, Root).
Sprache im Projekt: **Deutsch** (UI, Texte, Commit-Messages).

Die Vorgeschichte aus Claude Chat und Cowork steht in `docs/VERLAUF.md` – vor größeren Änderungen lesen.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Startseite / Team-Board (Login, nächstes/letztes Spiel, Saisonzahlen, Tabelle, Verwaltung). Aktuell Version 4.1 |
| `analyse/index.html` | Spielanalyse mit Erfassung und Gegner-Reiter (`#gegner`). Version 2.5 |
| `training/index.html` | Trainertool (Kader, ZN, SR, Übungen, Training) |
| `board.json` | Zugänge (`users`), Rollen, Team-Daten, verschlüsselte Spielerinnen-Profile (`profiles`), `admin` |
| `gegner_daten.json` | Öffentliche Spielberichte (`games`) + Termine der Moskitos (`fixtures`); wird montags automatisch erneuert |
| `spielberichte_abruf.js` | Node-Skript: zählt handball360-IDs ab `START_ID` hoch, lädt PDFs, schreibt `gegner_daten.json` |
| `ga_parse.js` | PDF-Auslese (pdf.js) – **gleiche Logik wie im Gegner-Reiter** der Analyse; Änderungen an beiden Stellen synchron halten |
| `.github/workflows/montag.yml` | Jeden Montag 05:00 UTC Abruf, Commit durch „Gegneranalyse-Bot“ |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA (installierbar, Service Worker cacht bewusst nichts) |
| `alt/` | Alte Stände von Analyse und Training (Backup) |
| `moskitos2-update2.zip` | Update-Paket vom 29.10.2026 (Inhalt bereits im Repo) |
| `ANLEITUNG.md` | Bedienungs- und Einrichtungsanleitung für Menschen |

## Wichtige Eigenschaften

- **Alles in einzelnen, selbstständigen HTML-Dateien** (CSS/JS inline, kein Build-Schritt, kein Framework).
  Die Dateien sind groß (Training ~3,8 MB im alten Stand) – gezielt mit `grep`/Offsets lesen, nicht komplett.
- **Verschlüsselung:** Daten in `analyse/` und `training/` sowie die Profile in `board.json` sind mit
  WebCrypto verschlüsselt (PBKDF2 → AES-GCM). Ohne Passwort nicht lesbar. Niemals Klartextdaten oder
  Passwörter committen – das Repo ist **öffentlich**.
- **Ein Login für alles:** Anmeldung auf der Startseite öffnet Training und Analyse; Abmelden meldet überall ab.
- **Rollen:** Admin (alles + Verwaltung), Trainer (Board, Training, Analyse, Gegner, alle Profile),
  Spielerin (nur eigenes Dashboard, Mannschafts-Gesamtbild, Gegneranalyse – keine fremden Daten, keine Rankings).
- **Bisheriger Datenfluss:** Die Tools exportieren sich selbst als HTML („Verwaltung → HTML-Datei exportieren“),
  die Verwaltung im Team-Board erzeugt `team-board-update.zip` (board.json + beide Modul-HTMLs), Upload per
  GitHub-Weboberfläche. Mit Claude Code können Änderungen jetzt direkt im Repo gemacht und gepusht werden.
- **localStorage-Schlüssel** beginnen mit `mk2` (`mk2theme`, `mk2_gegner`, `mk2_gegner_notiz_…`).
- Design: Schrift Lexend, Farben als CSS-Variablen auf `:root` (Hell/Dunkel), Band `#1B2A4A`, Akzent `#C2410C`.

## Arbeiten im Repo

- Lokal testen: `python3 -m http.server 8000` im Repo-Root, dann `http://localhost:8000/`.
- Montags-Abruf lokal: `npm install --no-save pdfjs-dist@3.11.174 && node spielberichte_abruf.js`
  (braucht Netzzugriff auf handball360.isquad.de).
- Pokal: Wenn das erste Pokalspiel stattfindet, in `spielberichte_abruf.js` die Liste `KLASSEN` ergänzen.
- Neue Saison: `START_ID`, `SAISON` im Abruf-Skript und Teamnamen in `GA_TEAMS` (`ga_parse.js`) anpassen.
- Nicht direkt auf `main` entwickeln; `main` ist die Live-Seite.
