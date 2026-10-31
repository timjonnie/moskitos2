# Projektverlauf aus Claude Chat und Cowork

Diese Datei sammelt alles, was in früheren Chats und Cowork-Sitzungen zu Moskitos 2 besprochen und
entschieden wurde, damit Claude Code darauf aufbauen kann. Dateien selbst liegen bereits im Repo.

## So füllst du diese Datei

In **jedem** alten Chat bzw. jeder Cowork-Sitzung zu Moskitos 2 diesen Prompt absenden und die Antwort
unten als neuen Abschnitt einfügen (oder in Claude Code einfügen: „Trag das in docs/VERLAUF.md ein“):

> Fasse dieses Gespräch als Übergabe für einen Entwickler zusammen, der am Repo moskitos2 weiterarbeitet.
> Gliederung: 1. Ziel des Gesprächs, 2. Was wurde gebaut/geändert (Dateien, Funktionen, Versionsnummern),
> 3. Getroffene Entscheidungen und warum, 4. Bekannte Fehler und Einschränkungen, 5. Offene Aufgaben und Ideen,
> 6. Wichtige Regeln/Vorlieben (Design, Texte, Datenschutz). Keine Passwörter oder personenbezogenen Daten.
> Als Markdown, knapp und vollständig.

## Abgleich mit dem Repo (Stand 31.10.2026)

- Team-Board 4.1 und Spielanalyse 2.5 (29.10.2026) sind im Repo und laufen im Firebase-Modus
  (Projekt `moskitos2-fe016`). `fb.js`, `fbmod.js`, `mksite.js` und `ga_module.js` gibt es **nicht als eigene
  Dateien** – sie sind inline in `index.html`, `analyse/index.html` und `training/index.html` eingebettet.
- **`firestore.rules` fehlt im Repo** (lag im Paket `datenbank-update`). Sollte als Referenz eingecheckt werden.
- `ANLEITUNG.md` beschreibt noch den alten Ablauf (verschlüsselte Exporte, `team-board-update.zip`) und ist
  gegenüber dem Firebase-Stand veraltet.
- `alt/`, `board.json` und `moskitos2-update2.zip` liegen noch im Repo (nach dem Umzug löschen).

## Zusammenfassungen

<!-- Hier je Chat/Cowork-Sitzung einen Abschnitt einfügen: ### Datum – Thema -->

### bis 29.10.2026 – Gegneranalyse, Team-Board, GitHub Pages, Firebase

#### 1. Ziel des Gesprächs

- **Gegneranalyse** für die Damenmannschaft (Oberliga Frauen Saar, Saison 2026/27) auf Basis der offiziellen
  Spielberichte (handball360/DHB), wöchentlich automatisch aktualisiert.
- **Zusammenführung** von Trainertool, Spielanalyse und Gegneranalyse zu einer Website („Team-Board“) mit
  **zentralem Login und Rollen**.
- **Umzug** von Netlify auf **GitHub Pages**, danach von verschlüsselten Einzeldateien auf eine
  **Online-Datenbank (Firebase)**, damit nicht mehr nach jeder Änderung `index.html` exportiert und hochgeladen werden muss.
- **Spielerinnenprofile:** volle eigene Daten, kein Vergleich mit anderen.

#### 2. Was wurde gebaut/geändert

**Repo-Struktur** (GitHub Pages, Branch `main`, Root)

```
index.html                 Team-Board (Login, Dashboard, Gegner, Auswertung, Verwaltung)
manifest.webmanifest       PWA (start_url ./, standalone, theme #1B2A4A)
sw.js                      No-op-Service-Worker (nur Installierbarkeit, kein Cache)
icons/                     icon-192.png, icon-512.png, apple-touch-icon.png („F2.“)
gegner_daten.json          Öffentliche Spielberichtsdaten (vom Montags-Abruf gepflegt)
spielberichte_abruf.js     Node-Scraper handball360 → gegner_daten.json
ga_parse.js                PDF-Parser (pdf.js-Textpositionen), geteilt von Scraper und Tool
analyse/index.html         Spielanalyse (Firebase-Modus)
training/index.html        Trainertool (Firebase-Modus)
.github/workflows/montag.yml   Cron Mo 05:00 UTC, node 24, actions v5, commit gegner_daten.json
ANLEITUNG.md
alt/ + board.json          Nur für den einmaligen Umzug, danach löschen
```

**Versionen** (Stand Übergabe)

- **Team-Board 4.1:** Firebase, Rückmeldungen aus dem Trainertool.
- **Spielanalyse 2.5 / Trainertool 1.3:** Kipper-CI, Gegner-Reiter, Bereichs-Navigation, F2. Die ausgelieferten
  Dateien entsprechen den Artefakt-Live-Versionen plus Firebase-Shim.
- **Claude-Artefakte** (Spielanalyse, Trainertool) existieren weiter mit eigener Claude-Datenbank. Sie sind nicht
  mehr die führende Datenquelle.

**Kernbausteine**

- **`fb.js` (`window.MKFB`)**
  - Lädt das Firebase Compat SDK 10.12.2 von gstatic.
  - `email(u)`: Benutzername → `u@moskitos2.team`.
  - `ns(fs, prefix)`: Wrapper mit derselben API wie die Claude-Datenbank (`collection/doc/get/set/delete/onSnapshot`).
    Speichert Dokumente als `{j: JSON.stringify(obj)}`, weil Firestore keine verschachtelten Arrays erlaubt.
  - `assets.upload`: verkleinert Bilder auf max. 1400 px, JPEG, ≤ 450 KB, als Data-URL.
- **`fbmod.js`**
  - Nur aktiv auf `…/analyse/` bzw. `…/training/` und nur, wenn kein `window.claude` existiert.
  - Stellt `window.claude.use("db"|"user"|"assets")` bereit, Präfix `a_` bzw. `t_`.
  - Ist niemand angemeldet oder fehlt die Rolle Trainer/Admin, leitet es um auf `../?ziel=…`.
  - Die Module setzen `S.role` bzw. `ROLE` aus `MKFB.role`.
- **`mksite.js` (`window.MKSite`):** Leiste „← Team-Board“, Footer-Link, Theme aus `localStorage.mk2theme`.
- **Team-Board (`index.html`)**
  - Firebase-Login.
  - **Ersteinrichtung/Umzug:** liest `alt/*.html` und `board.json`, entschlüsselt mit den bisherigen Zugangsdaten
    und schreibt nach Firestore.
  - **Rollenansichten:**
    - Trainer/Admin: Kacheln, Schnellaktionen, Profilansicht, Rückmeldungen, Verwaltung.
    - Spielerin: Mein Dashboard, „Meine Auswertung“, Zu-/Absage, Gegner.
  - **Öffentliche Kennzahlen** aus `gegner_daten.json`: Tabelle, Form, Trend, nächstes und letztes Spiel.
  - **Gegneranalyse** (`#gegner`) mit `ga_module.js` (MKOpp), für alle Rollen nur lesend.
  - **Auswertung** (`#auswertung`): KPI-Kacheln mit Sparklines, Diagramme je Spiel, Plus/Minus, Spieltabelle mit
    Details. Formeln identisch zur Analyse (`fplus/fminus/gplus/gminus`, Effektivität = Σplus/(Σplus+Σminus),
    Durchschnitte nur über Spiele mit Aktionen).
  - **`publish()`** berechnet Team- und Profildaten clientseitig, sobald ein Trainer das Board öffnet. Geschrieben
    wird nur bei geändertem Hash.

**Firestore-Datenmodell**

| Pfad | Inhalt | Kodierung |
|---|---|---|
| `a_games/*`, `a_settings/aliases`, `a_gegner/*` | Spielanalyse | `{j}` |
| `t_players/*`, `t_games/*` (inkl. `squad`), `t_sessions/*`, `t_drills/*`, … | Trainertool | `{j}` |
| `team/summary` (inkl. `hash`), `profiles/{pid}` | berechnete Daten | `{j}` |
| `users/{uid}` `{u, role, pid}`, `config/owner`, `tb_settings/map\|pending`, `rsvp/{k}_{id}__{pid}` | Verwaltung, Rückmeldungen | roh |

- **`firestore.rules`:** Der Server erzwingt die Rollen (siehe Paket `datenbank-update`).
- **Firebase-Projekt:** `moskitos2-fe016`, Spark-Tarif, Firestore in `europe-west3`, Auth per E-Mail/Passwort,
  autorisierte Domain = GitHub-Pages-Domain.

#### 3. Getroffene Entscheidungen und warum

- **GitHub Pages statt Netlify:** keine Deploy-Credits, gleiche Origin für alle Module (geteilter Auth-State), Versionsverlauf.
- **Firebase statt Supabase:** Die Module nutzen bereits eine Firestore-ähnliche API, dadurch reicht ein Shim ohne
  Logik-Umbau. Spark pausiert nicht, die Datenbank liegt in Frankfurt.
- **Moduldaten als JSON-String:** robust gegen Firestore-Strukturlimits. Regeln greifen deshalb nur auf roh
  gespeicherte Dokumente (`users`, `rsvp`, `config`).
- **Profile serverseitig getrennt:** Spielerinnen haben keinen Zugriff auf `a_*`/`t_*`, nur auf ihr eigenes
  `profiles/{pid}` und `team/summary`. Rankings und Vergleiche bleiben technisch ausgeschlossen.
- **Profilberechnung im Client der Trainer**, weil Cloud Functions den Blaze-Tarif brauchen.
- **Bilder als Data-URL in Dokumenten:** Neuer Cloud Storage braucht ebenfalls Blaze.
- **Konten anlegen über eine zweite Firebase-App-Instanz:** Die Admin-Sitzung bleibt dabei erhalten.
- **Spielberichte von handball360.isquad.de** (`id_partido` fortlaufend, Saisonstart-ID 399579). handball.net
  rendert per JavaScript und liefert keine PDF-Links.
- **Parser über Spaltenmitten und Tabellen-Kopfzeilen:** Die PDFs haben zwei Tabellen nebeneinander und gelegentlich
  Mini-Tabellen untereinander. Endstand wird per Regex gefunden, weil das Label umbricht. Validierung: gezählte
  Tore = Endstand, sonst Hinweis „Prüfen“.

#### 4. Bekannte Fehler und Einschränkungen

- **Umzug nicht mit Echtdaten getestet**, weil die Daten verschlüsselt sind. Getestet ist er mit Fixtures und einem
  Firebase-Mock. Live geprüft sind nur Auth und Erreichbarkeit.
- **Kein Passwort-Reset durch Admins** (Spark, kein Admin SDK). Workaround: `users`-Dokument löschen und unter neuem
  Benutzernamen neu anlegen. Gelöschte Auth-Konten bleiben bestehen, ihr Benutzername ist dauerhaft belegt.
- **Profile und Teamwerte** aktualisieren sich erst, wenn ein Trainer das Team-Board öffnet.
- **Spielerinnen-Rückmeldungen (`rsvp`) fließen nicht ins Trainertool-`squad`.** Das Team-Board zeigt beides
  kombiniert, Selbstauskunft hat Vorrang.
- **Firestore-Dokumentlimit 1 MB:** Bilder sind auf 450 KB begrenzt. Sehr große Analyse-Spiele sind nicht geprüft.
- **`gegner_daten.json` ist öffentlich** und enthält Torschützinnen aus den offiziellen Berichten, also auch der
  eigenen Mannschaft.
- **Im Firebase-Modus zeigt die Spielanalyse noch Export- und Zugangsfunktionen** aus dem Artefakt-Modus. Sie sind
  obsolet, aber nicht ausgeblendet.
- **Vier Ligaspiele sind verlegt** und stehen offen: ST2, ST5 und zweimal ST6. Der Abruf erfasst sie, sobald ein
  Endstand vorliegt.
- **Pokal-Kennung im Abruf nicht hinterlegt:** In `KLASSEN` muss die Bezeichnung ergänzt werden, sobald das erste
  Pokalspiel gespielt ist.
- **Nach dem Umzug** müssen `alt/` und `board.json` aus dem Repo gelöscht werden.

#### 5. Offene Aufgaben und Ideen

- [ ] **Ersteinrichtung live durchführen.** Danach Sicherheitstest mit einem Konto ohne `users`-Dokument: darf nichts
  lesen und nichts schreiben.
- [ ] **Rückmeldungen ins Trainertool übernehmen**, per Knopf oder automatisch nach `t_games.squad`.
- [ ] **Analyse-UI im Firebase-Modus aufräumen:** Export, Netlify und modulinterne Zugänge ausblenden.
- [ ] Optional echte E-Mails pro Konto für den Passwort-Reset (`sendPasswordResetEmail`).
- [ ] Optional automatische Profil-Neuberechnung per Cloud Function (erfordert Blaze).
- [ ] **Einwilligungstext für Spielerinnen** zur Verarbeitung der Leistungsdaten.
- [ ] **Netlify und Claude-Artefakte** nach stabiler Phase stilllegen.
- Ideen: „Neu seit letztem Besuch“ erweitern, Mannschafts-PDF und Teilen-Bilder aus dem Team-Board erzeugen.

#### 6. Wichtige Regeln und Vorlieben

- **Design „Kipper-CI“:** Schrift Lexend. Nachtblau `#1B2A4A`, Buntstift-Orange `#C2410C`, Holz `#F6C98B`,
  Ink `#0E1B2C`, Hintergrund `#F7F5F1`. Überschriften mit orangem Punkt („Moskitos 2.“). Hell- und Dunkelmodus,
  mobil zuerst, nichts darf horizontal überlaufen. **Kein Name und kein Logo des Admins** in Ausgaben.
- **Benennung:** Mannschaftskürzel **F2** (nie „M2“). Die Startseite heißt **„Team-Board“**. Versionsnummer und
  Datum stehen im Footer.
- **Texte:** Deutsch, Du-Form, klare Handlungsanweisungen. Status nur mit Klartext-Labels
  (Dabei/Offen/Absage/Nicht nominiert).
- **Datenschutz:** Spielerinnen sehen nur eigene Daten und das Gesamtbild. Vergleiche und Rankings nur für Trainer.
  Keine personenbezogenen Daten in öffentlichen Dateien außer den offiziellen Berichtsdaten. Keine Zugangsdaten
  oder Tokens im Repo oder Chat.
- **Arbeitsweise:** Vor Änderungen den aktuellen Repo-Stand holen. Nur geänderte Dateien ausliefern.
  `gegner_daten.json` nie überschreiben, die pflegt der Bot. Änderungen an Modulen auch in die Artefakt-Vorlagen
  übernehmen, falls diese weiter genutzt werden. Vor der Auslieferung testen: Syntax-Check und Playwright-Durchlauf
  mit Fixtures bzw. Mock.
