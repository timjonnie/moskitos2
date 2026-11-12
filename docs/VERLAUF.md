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
- [x] **Rückmeldungen ins Trainertool übernehmen** (Team-Board 4.2, per Knopf), per Knopf oder automatisch nach `t_games.squad`.
- [x] **Analyse-UI im Firebase-Modus aufräumen** (Spielanalyse 2.6): Export, Netlify und modulinterne Zugänge ausblenden.
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

### 31.10.2026 – Umzug nach Claude Code

- `CLAUDE.md` und diese Datei angelegt; Projektwissen aus Chat/Cowork übernommen.
- **Team-Board 4.2:** In „Rückmeldungen der Spielerinnen“ pro Spiel Knopf „… ins Trainertool übernehmen“.
  Schreibt in `t_games/{id}.squad`: Zusage → `x`, Absage → `o`. Eine Zusage überschreibt kein `-` (nicht nominiert).
  Trainings haben im Trainertool keine Anwesenheitsliste – dort bleiben die Rückmeldungen nur im Team-Board.
- **Spielanalyse 2.6:** Im Firebase-Modus (`S.site`) sind „Zugänge und Rollen“, „Für die Mannschaft exportieren“ und
  „Stand aus der Mannschafts-Datei übernehmen“ ausgeblendet; stattdessen Hinweis auf sofortiges Speichern und das Team-Board.
  Der eingebettete Export-Bauplan (`window.__MK_TPL__`) wurde nicht angepasst.
- **`ANLEITUNG.md`** komplett auf den Firebase-Ablauf umgeschrieben.
- Getestet mit Playwright und Firebase-Mock (390 px Breite, kein Überlauf, keine Skriptfehler).

### 09.11.2026 – Spielberichte kamen scheinbar nicht an

- Der geplante Montagslauf ist am 09.11. nicht gestartet (am 02.11. lief er mit 8 h Verspätung). Der manuelle Lauf
  um 07:01 UTC war erfolgreich, `gegner_daten.json` enthielt danach den 8. Spieltag.
- **Fehler 1:** Im Team-Board zeigte `DATA_URL` auf `../gegner_daten.json` – auf GitHub Pages außerhalb von `/moskitos2/` (404).
- **Fehler 2:** Der Gegner-Baustein übernahm Termine und Datenstand aus dem Browser-Speicher (`mk2_gegner`) ungeprüft,
  auch wenn sie älter waren als die Datei. Dadurch alte Termine/falscher nächster Gegner. Jetzt nur, wenn neuer.
- Team-Board 4.3, Spielanalyse 2.7. Zeitplan auf krumme Minuten (05:23 UTC) plus zweiter Lauf 13:47 UTC;
  `git pull --rebase` vor dem Push, falls beide Läufe sich überschneiden.

### 11.11.2026 – Gegneranalyse komplett exportieren

- Neuer Bereich „Komplette Analyse exportieren“ im Gegner-Baustein (`MKOpp`, in `index.html` und `analyse/index.html`
  identisch). Erzeugt A4-PDF (mehrseitig, eigener PDF-Bauer ohne Bibliothek), langes PNG oder teilt das PDF per
  `navigator.share`. Immer helles Kipper-CI, Diagramme werden dafür kurz im hellen Farbschema neu erzeugt.
- Auswahl: „Das fällt auf“ (nur Trainerstab) und – nur in der Spielanalyse – Trainer-Notizen. Mit Haken wird die Datei
  als „Trainerstab“ gekennzeichnet (Kopf, Fußzeile, Dateiname), ohne Haken als „Mannschaft“.
- Sichtbar für Trainer/Admin: in der Analyse über `admin()`, im Team-Board über neuen Host-Hook `MKHost.canExport` (= `isCoach()`).
  Spielerinnen sehen den Bereich nicht.
- Team-Board 4.4, Spielanalyse 2.8. Getestet mit Playwright + Firebase-Mock und Sichtprüfung der PDF-Seiten.
- Bekannt: Sehr lange Namen werden in der Torschützinnen-Grafik links abgeschnitten (auch in der normalen Ansicht).

### 11.11.2026 – Eigene Auswertung aus den Spielberichten

- Gegner-Baustein (`MKOpp`, beide Dateien identisch): In der Auswahl oben „Moskitos 2 – eigene Auswertung“ (Optgroup
  „Eigene Mannschaft“). `analyse()` war schon mannschaftsneutral.
- Für die eigene Mannschaft statt „Gegen uns“/„Gemeinsame Gegner“ der Block „Heim und auswärts“ (`haLine`).
- Datenschutz: `R.teamOnly` blendet Spielerinnen-Grafik, -Tabelle und namensbezogene „Das fällt auf“-Punkte aus,
  wenn nicht Trainer/Admin (`canExp()`). Export: Mannschaftsversion ohne Spielerinnenwerte; mit Haken
  („Das fällt auf und Werte einzelner Spielerinnen“) Trainerstab-Version. Dateiname `Eigene_Auswertung_…`.
- Team-Board 4.5, Spielanalyse 2.9.

### 11.11.2026 – Veröffentlichung über eigenen Workflow

- Nach dem Merge von #5 brach GitHubs eingebauter Lauf „pages build and deployment“ zweimal mit `startup_failure` ab
  (ohne Job, ohne Protokoll); normale Workflows liefen. Live blieb Team-Board 4.4.
- Neu: `.github/workflows/pages.yml` (configure-pages, upload-pages-artifact, deploy-pages), ausgelöst bei Push auf
  `main`, nach „Spielberichte Montag“ (Bot-Commits lösen selbst keinen Push-Lauf aus) und per Knopf. `.nojekyll` ergänzt.
- Einmalig nötig: Settings → Pages → Source „GitHub Actions“.

### 11.11.2026 – Kurzlink „Bericht“

- Team-Board 4.6: In der Schnellzugriff-Leiste (Trainer/Admin) Knopf „Bericht“ → `#gegner` mit „Moskitos 2 – eigene Auswertung“.
  Neuer Hook `MKOpp.select(team)` (beide Kopien); Kachel „Gegner“ und „Zur Gegneranalyse“ setzen die Auswahl zurück
  auf den nächsten Gegner. Veröffentlichung läuft seit #6 über `pages.yml` (hat funktioniert).

### 11.11.2026 – Spielerinnen nach Namen statt Rückennummer zählen

- Fehler: Gegner-Baustein (`analyse()`) und Startseite (`teamProfile()`) fassten Tore über alle Spiele **nach Rückennummer**
  zusammen. Nummern wechseln aber oft (z. B. #21: viermal Jolien Atz, einmal Nele Dillo → „Nele Dillo 16 Tore“ statt 2;
  bei HC Perl „Jennifer Christ 16“ statt 27). In fast jeder Mannschaft betroffen.
- Jetzt Schlüssel = Name aus dem Spielbericht (klein, Leerzeichen normalisiert); ohne Namen Fallback `#Nr`.
  Angezeigt werden alle getragenen Nummern (`p.nrTxt`, z. B. „8/21“). Geprüft: Summe der Spielerinnentore = Mannschaftstore
  bei allen 11 Mannschaften; keine Schreibvarianten desselben Namens in den Berichten (nur Geschwister).
- Team-Board 4.7, Spielanalyse 2.10.

### 11.11.2026 – Spielverläufe farbig

- `cCurve()`: Jedes Spiel bekommt eine eigene Farbe (12er-Palette, ab dem 13. Spiel gestrichelt). Vorher waren nur Spiele
  mit zeitweise 2+ Toren Rückstand farbig, der Rest grau.
- Tipp auf ein Spiel in der Legende (`data-gahl`) hebt dessen Verlauf hervor, die anderen werden blass; erneuter Tipp hebt
  es auf. PDF-Export übernimmt die Farben (Legenden-Regex in `xLegend` angepasst).
- Team-Board 4.8, Spielanalyse 2.11.

### 12.11.2026 – Ligastatistik, Kachel „Trainer“

- Team-Board 4.9: Aufklappbarer Bereich „Ligastatistik“ über der Tabelle (`ligaStats()` in `index.html`, Vorlage: handballstatistiken.de).
  Werte: Spiele (Heim/Remis/Gast), Tore gesamt/Schnitt (Heim/Gast), höchster Heim-/Auswärtssieg, torreichstes/-ärmstes Spiel,
  meiste Tore/7m-Tore/Feldtore einer Spielerin in einem Spiel, beste Torschützin der Saison (nach Name+Mannschaft),
  7m-Quote, Zeitstrafen. Gleichstände werden alle genannt; Moskitos 2 orange. Für alle Rollen sichtbar (öffentliche Berichtsdaten).
- Kachel „Training“ heißt jetzt „Trainer“ (Ziel unverändert `training/`).
- Team-Board 4.10: Export der Ligastatistik (PDF eine A4-Seite, PNG, Teilen) für Trainer/Admin. Nutzt die Export-Bausteine
  des Gegner-Moduls, die jetzt als `MKOpp.x` bereitstehen (in beiden Kopien gleich). Daten über `ligaRows()`/`LIGA`.
- Team-Board 4.11: Ligastatistik um „Bester Angriff“ (Tore ÷ Spiele) und „Beste Abwehr“ (Gegentore ÷ Spiele) ergänzt,
  Gleichstand auf zwei Nachkommastellen → alle genannt. Export als ein Baustein, damit er immer auf eine A4-Seite passt.
- Team-Board 4.12: Ligastatistik nennt bei „Siebenmeter“ die beste Quote (ab 5 Würfen) und die meisten verwandelten 7m,
  bei „Zeitstrafen“ die Mannschaft mit den meisten Zeitstrafen je Spiel (Gleichstände: alle).
- Team-Board 4.13: Desktop-Anordnung `.row.lt` – links „Form und Trend“ + Tabelle, rechts Ligastatistik (kein Leerraum mehr links).
  Handy (≤ 700 px): Spalten per `display:contents` aufgelöst, Reihenfolge Form → Ligastatistik → Tabelle wie bisher.
- Team-Board 4.14: „Letztes Spiel“ links, „Nächstes Spiel“ rechts. „Form und Trend“ erweitert (`trendMore()`): Heim/auswärts,
  Halbzeiten, „Wann fallen die Tore?“ (Tore/Gegentore je 10 Min.), „Alle Ergebnisse“ mit Halbzeitstand – alles aus den
  öffentlichen Spielberichten, für alle Rollen. Linke Spalte und Ligastatistik dehnen sich (`flex:1`), Unterkanten bündig.

### 12.11.2026 – Seite „Ligastatistik“ (#liga)

- Vorschläge per Auswahl angenommen (alle). Neue Ansicht `#ligaView` mit Navigation: Spieltag (Rückblick + Vorschau),
  Tabellen (Heim/Auswärts/1. HZ/2. HZ/Form 5), Tabellenverlauf (Platz je Spieltag, Vergleichsteam), Phasen-Tabelle,
  Spannung & Comebacks, Übersicht + Rekorde, Disziplin, Auszeiten-Wirkung (±5 Min.), Unter-/Überzahl (2 Min. nach Strafe,
  geschätzt), Restprogramm Moskitos, Ranglisten (nur `isCoach()`).
- Rekorde (höchste Halbzeitführung, schnellstes Tor, längste Torserie, meiste Tore einer Halbzeit) über `lgRekordRows()`
  auch in der Ligastatistik der Startseite und im Export (bleibt eine Seite).
- Pokalspiele werden auf der Ligaseite nicht mitgezählt (`comp!=="Pokal"`).
- `spielberichte_abruf.js`: speichert zusätzlich `league_fixtures` (alle offenen Ligaspiele) für die Spieltags-Vorschau.
  Bis zum nächsten Abruf zeigt die Vorschau nur das eigene Spiel mit Hinweis.
- Team-Board 4.15.
- Team-Board 4.16: Export der ganzen Ligaseite (`lvBlocks()` setzt die gerenderten Abschnitte in Canvas-Bausteine um:
  Tabellen, Listen, Kacheln, Kennzahlzeilen, SVG; alle fünf Tabellen; Überschriften bleiben beim Inhalt). Option
  „Ranglisten mitexportieren“ → Trainerstab-Version. `MKOpp.x.img` neu (beide Kopien; Spielanalyse 2.12).
- Startseite: `fillLiga()` misst am Desktop die natürliche Höhe der linken Spalte und hängt Zusatz-Kennzahlen aus
  `lgExtraRows()` an, bis die Ligastatistik bündig ist; Rest wird als Zeilenabstand verteilt. Läuft bei Laden, Größenänderung
  (ResizeObserver auf linker Spalte) und Auf-/Zuklappen. Ist die Ligastatistik von sich aus länger, wird nichts angehängt.
- Team-Board 4.17: Unter-/Überzahl exakt statt geschätzt (Hinweis Nutzer: Zeitstrafe dauert immer genau 2 Minuten).
  `lgStrength()` baut je Spiel die Strafintervalle [s, s+120) (auch Disqualifikation = 2 Min. Unterzahl, steht im Bericht ohne
  extra Zeitstrafe); Unter-/Überzahl = weniger/mehr Spielerinnen als der Gegner zu diesem Zeitpunkt (Überlappungen verrechnet).
  Ausgabe: Strafen, Minuten in Unter-/Überzahl, Tore:Gegentore je Zustand. Gegengerechnet in Python (Moskitos 14:43 Min., 5:8).
- Team-Board 4.18: Schnellzugriff „Ligastatistik“ (→ `#liga`) zwischen „Bericht“ und „Zugänge verwalten“ (Trainer/Admin).
