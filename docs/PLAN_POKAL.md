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

## Merkposten (später)

- **Vorsaison-Vergleich** (2025/26) – derzeit nicht möglich: Nach der Umstellung des Systems ist nur die neue Saison
  migriert, ältere Spielberichte sind nicht mehr abrufbar. Wieder aufgreifen, falls alte Daten zugänglich werden
  (Saison-Umschalter, Vorjahresvergleich, „Vorsaison gegen uns“).
