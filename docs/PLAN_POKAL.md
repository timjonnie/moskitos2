# Plan: Pokal (Opel Deckert Cup Frauen) – Stand 13.11.2026

## Ziel

Pokalwettbewerb 2026/27 (Opel Deckert Cup Frauen, HV Saar, ca. 5–6 Spiele) ins Team-Board holen:
Spielplan, Ergebnisse, Spielberichte, nächstes Pokalspiel; die kampflos gewonnene 1. Runde berücksichtigen.

- Wettbewerb auf handball.net: https://www.handball.net/ligen/10446?phaseId=17425

## Was schon funktioniert

- PDF-Auslese (`ga_parse.js`) erkennt Pokalspiele bereits (`comp: "Pokal"`, wenn im Berichtskopf „POKAL“ steht).
- Ligatabellen und Ligaseite schließen Pokalspiele bereits aus.
- Gegneranalyse und eigene Auswertung zeigen Pokalspiele mit „Pokal“ statt Spieltag.
- Pokal-Termine aus dem Trainertool (z. B. Runde 2 am 22.11. gegen Quierschied) erscheinen schon bei Rückmeldungen/Terminen.

## Was noch fehlt

| Schritt | Inhalt |
|---|---|
| 1 | Herausfinden, wie die Pokal-Spielberichte auf handball360 nummeriert sind (`id_partido`) und wie der Wettbewerb im Berichtskopf heißt |
| 2 | Abruf-Skript: Pokal-Bezeichnung in `KLASSEN`, Pokal-Nummernbereich zusätzlich absuchen, Pokal-Termine speichern |
| 3 | Bereich „Pokal“ (Runden, Ergebnisse, nächstes Pokalspiel, kampflose Runde ohne Bericht) auf Startseite/Ligaseite |
| 4 | Anleitung + Verlauf |

## Blocker / was ich brauche

Diese Claude-Umgebung erreicht weder **handball.net** noch **handball360.isquad.de** (Netzwerkregel, 403). Eine der beiden Lösungen:

1. **Freigabe (empfohlen):** Umgebungsmenü in der Titelleiste → Edit → Network access → unter *Allowed domains*
   `www.handball.net` und `handball360.isquad.de` eintragen. Dann lese ich Spielplan und Berichte direkt aus und teste sofort.
2. **Oder** einen **Link zu einem Pokal-Spielbericht** (PDF, `…dhb_acta_completa_pdf.php?id_partido=…`), sobald das
   erste Pokalspiel mit Bericht gespielt ist (Runde 2 am 22.11.). Dazu Gegner und Datum der kampflos gewonnenen 1. Runde.

## Sobald der Network Access freigegeben ist

Mit Zugriff auf **www.handball.net** kann ich dort auch die **kommenden Spiele crawlen** – nicht nur für den Pokal:

- **Pokal-Spielplan** (Runden, Gegner, Termine, Hallen) direkt von der Pokalseite (Liga 10446, Phase 17425).
- **Liga-Spielplan** der Oberliga Frauen mit allen offenen Spielen und Spieltagen – damit ist die Spieltags-Vorschau auf der
  Ligaseite sofort vollständig (heute nur über `league_fixtures` aus den PDFs, die erst montags kommen).
- **Verlegte Spiele / Nachholtermine** aktuell halten (neue Termine erscheinen auf handball.net oft früher als im PDF).
- Möglichst als Teil des Montags-Abrufs (GitHub-Workflow), damit die Termine automatisch aktuell bleiben – vorher einmal
  hier testen, wie handball.net die Daten ausliefert (die Seite lädt per JavaScript, ggf. über eine JSON-Schnittstelle).

Erste Schritte nach der Freigabe:
1. Prüfen, ob `www.handball.net` und `handball360.isquad.de` erreichbar sind.
2. Struktur der Pokal- und Ligaseite analysieren (Spielplan, Spiel-IDs, Links zu den Spielberichten).
3. Abruf-Skript erweitern: kommende Spiele (Liga + Pokal) und Pokal-Spielberichte.
4. Pokal-Bereich bauen, Spieltags-Vorschau und Termine auf die neuen Daten umstellen.

## Merkposten (später)

- **Vorsaison-Vergleich** (2025/26) – derzeit nicht möglich: Nach der Umstellung des Systems ist nur die neue Saison
  migriert, ältere Spielberichte sind nicht mehr abrufbar. Wieder aufgreifen, falls alte Daten zugänglich werden
  (Saison-Umschalter, Vorjahresvergleich, „Vorsaison gegen uns“).
