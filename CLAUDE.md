# Moskitos 2 – Team-Board (Projektwissen für Claude Code)

Analyse- und Trainertool für die Frauenmannschaft **Moskitos 2** (HSG DJK Marpingen-SC Alsweiler II),
Oberliga Frauen HV Saar, Saison 2026/2027. Läuft als statische Website auf **GitHub Pages** (Branch `main`, Root).
Sprache im Projekt: **Deutsch** (UI, Texte in Du-Form, Commit-Messages). Mannschaftskürzel **F2** (nie „M2“),
die Startseite heißt **„Team-Board“**.

Daten liegen in **Firebase** (Projekt `moskitos2-fe016`, Spark-Tarif, Firestore `europe-west3`, Auth per
E-Mail/Passwort). Die HTML-Dateien sind nur noch Code – Inhalte werden nicht mehr per Export hochgeladen.

Die Vorgeschichte aus Claude Chat und Cowork steht in `docs/VERLAUF.md` – vor größeren Änderungen lesen.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html` | Team-Board 4.2: Firebase-Login, Dashboard, `#gegner`, `#auswertung`, Verwaltung, Ersteinrichtung/Umzug |
| `analyse/index.html` | Spielanalyse 2.6 (Firebase-Modus, Präfix `a_`) |
| `training/index.html` | Trainertool 1.3 (Firebase-Modus, Präfix `t_`) |
| `board.json`, `alt/` | Alte verschlüsselte Daten – **nur für den einmaligen Umzug**, danach löschen |
| `gegner_daten.json` | Öffentliche Spielberichte (`games`) + Termine der Moskitos (`fixtures`); wird montags automatisch erneuert |
| `spielberichte_abruf.js` | Node-Skript: zählt handball360-IDs ab `START_ID` hoch, lädt PDFs, schreibt `gegner_daten.json` |
| `ga_parse.js` | PDF-Auslese (pdf.js) – **gleiche Logik wie im Gegner-Reiter** der Analyse; Änderungen an beiden Stellen synchron halten |
| `.github/workflows/montag.yml` | Jeden Montag 05:00 UTC Abruf, Commit durch „Gegneranalyse-Bot“ |
| `manifest.webmanifest`, `sw.js`, `icons/` | PWA (installierbar, Service Worker cacht bewusst nichts) |
| `moskitos2-update2.zip` | Älteres Update-Paket, überholt |
| `ANLEITUNG.md` | Anleitung für Menschen (Firebase-Ablauf, Stand 31.10.2026) |
| `firestore.rules` | **fehlt im Repo** (lag im Paket `datenbank-update`) |

## Wichtige Eigenschaften

- **Alles in einzelnen, selbstständigen HTML-Dateien** (CSS/JS inline, kein Build-Schritt, kein Framework).
  Die Dateien sind groß (Training ~3,8 MB im alten Stand) – gezielt mit `grep`/Offsets lesen, nicht komplett.
- **Eingebettete Bausteine** (inline in den HTML-Dateien, keine eigenen Dateien):
  `fb.js` (`window.MKFB`: Firebase Compat SDK 10.12.2, Benutzername → `u@moskitos2.team`, `ns()`-Wrapper mit
  Claude-DB-API, Dokumente als `{j: JSON.stringify(obj)}`, Bilder als Data-URL ≤ 450 KB),
  `fbmod.js` (stellt in den Modulen `window.claude.use(...)` bereit, nur wenn kein echtes `window.claude` da ist;
  ohne Login/Rolle → `../?ziel=…`), `mksite.js` (`window.MKSite`, Leiste/Footer/Theme), `ga_module.js` (`MKOpp`).
  Bausteine, die in mehreren Dateien stecken, **überall gleich halten**.
- **Firestore:** `a_*`/`t_*`/`team/summary`/`profiles/{pid}` als `{j}`; `users/{uid}` `{u, role, pid}`, `config/owner`,
  `tb_settings/*`, `rsvp/*` roh (nur darauf greifen die Regeln). `publish()` im Team-Board berechnet Team-/Profildaten
  im Browser eines Trainers (keine Cloud Functions im Spark-Tarif), schreibt nur bei geändertem Hash.
- **Rollen:** Admin (alles + Verwaltung), Trainer (Board, Training, Analyse, Gegner, alle Profile),
  Spielerin (nur eigenes Profil, `team/summary`, Gegneranalyse – **keine fremden Daten, keine Rankings**,
  serverseitig über Regeln erzwungen).
- **Datenschutz:** Repo ist **öffentlich**. Keine Zugangsdaten, Tokens oder personenbezogenen Daten committen
  (Ausnahme: offizielle Spielberichtsdaten in `gegner_daten.json`).
- **localStorage-Schlüssel** beginnen mit `mk2` (`mk2theme`, `mk2_gegner`, `mk2_gegner_notiz_…`).
- **Design „Kipper-CI“:** Lexend; Nachtblau `#1B2A4A`, Orange `#C2410C`, Holz `#F6C98B`, Ink `#0E1B2C`,
  Hintergrund `#F7F5F1`; Überschriften mit orangem Punkt („Moskitos 2.“); Hell/Dunkel; mobil zuerst, kein
  horizontaler Überlauf; Version + Datum im Footer; **kein Name/Logo des Admins**. Status nur als Klartext
  (Dabei/Offen/Absage/Nicht nominiert).

## Arbeiten im Repo

- Lokal testen: `python3 -m http.server 8000` im Repo-Root, dann `http://localhost:8000/`.
- Montags-Abruf lokal: `npm install --no-save pdfjs-dist@3.11.174 && node spielberichte_abruf.js`
  (braucht Netzzugriff auf handball360.isquad.de).
- Pokal: Wenn das erste Pokalspiel stattfindet, in `spielberichte_abruf.js` die Liste `KLASSEN` ergänzen.
- Neue Saison: `START_ID`, `SAISON` im Abruf-Skript und Teamnamen in `GA_TEAMS` (`ga_parse.js`) anpassen.
- Nicht direkt auf `main` entwickeln; `main` ist die Live-Seite.
- `gegner_daten.json` **nie von Hand überschreiben** – die pflegt der Montags-Bot.
- Bei Änderungen Versionsnummer/Datum im Footer hochzählen.
- Vor dem Push testen: Syntax-Check und Playwright-Durchlauf mit Fixtures bzw. Firebase-Mock
  (echte Firebase-Daten sind hier nicht zugänglich).
- Offene Aufgaben und bekannte Einschränkungen: `docs/VERLAUF.md`, Abschnitte 4 und 5.
