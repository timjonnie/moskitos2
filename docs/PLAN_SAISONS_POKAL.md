# Plan: Vorsaison-Vergleich und Pokal (Opel Deckert Cup)

Stand 12.11.2026 – Start am 13.11.2026.

## Ziel

1. **Vorsaison 2025/26** (Oberliga Frauen, HV Saar) aus allen Spielberichten nachladen.
2. **Saison umschalten** (2026/27 ↔ 2025/26) in Ligastatistik, Gegneranalyse und eigener Auswertung.
3. **Vorjahresvergleich ein/aus**: Kennzahlen, Tabellenplatz, Bilanz gegen dieselben Gegner (Hin- und Rückspiel Vorjahr).
4. **Pokal** (Opel Deckert Cup Frauen, ca. 5–6 Spiele) inkl. Spielplan; kampflos gewonnene Runde berücksichtigen.

## Was schon funktioniert

- PDF-Auslese (`ga_parse.js`) liest jeden handball360-Spielbericht – unabhängig von Saison und Wettbewerb.
  Erkennt Pokalspiele bereits (`comp: "Pokal"`, wenn im Kopf „POKAL“ steht).
- Spielerinnen werden nach Namen gezählt (Nummernwechsel egal) – funktioniert auch saisonübergreifend.
- Abruf-Skript und GitHub-Workflow laufen; GitHub hat Zugriff auf handball360 (diese Claude-Umgebung nicht).
- Gegneranalyse, eigene Auswertung, Ligastatistik und Exporte rechnen generisch aus einer Spielliste.
- Pokalspiele werden in Liga-Tabellen bereits ausgeschlossen.

## Was gebaut werden muss

| Schritt | Inhalt |
|---|---|
| 1 | Abruf-Skript parametrisieren (Start-ID, Saison, Wettbewerb, Zieldatei) + Workflow „Saison nachladen“ (per Knopf mit Eingaben) |
| 2 | Vorsaison als eigene Datei `saisons/2025-26.json`, Übersicht `saisons.json`; aktuelle Saison bleibt `gegner_daten.json` |
| 3 | Mannschaftsnamen der Vorsaison in `GA_TEAMS` ergänzen (auch „…ALSWEILER 2“ als Moskitos 2), Abstiegs-/Aufstiegsteams |
| 4 | Browser-Zwischenspeicher (`mk2_gegner`) je Saison trennen, damit sich Saisons nie mischen |
| 5 | Saison-Umschalter (oben in Ligastatistik/Gegner) + Schalter „Vorjahresvergleich“ (Pfeile ▲▼ und Vorjahreswert neben den Kennzahlen) |
| 6 | Gegneranalyse: Block „Vorsaison gegen uns“ und Vergleich der Gegner-Kennzahlen zum Vorjahr; bekannte Spielerinnen aus dem Vorjahr markieren |
| 7 | Pokal: Wettbewerbsname in `KLASSEN`, Pokal-Spielplan aus den Berichten, eigener Bereich „Pokal“ (Runden, Ergebnisse, nächstes Pokalspiel); kampflose Runde als Eintrag ohne Bericht |
| 8 | Exporte (PDF/Bild) um Saison/Vorjahresvergleich ergänzen, Anleitung + Verlauf aktualisieren |

## Was ich von dir brauche

1. **Einen Link zu einem Spielbericht der Vorsaison** (beliebiges Oberliga-Frauen-Spiel 2025/26, ideal 1. Spieltag),
   z. B. `https://handball360.isquad.de/dhb_acta_completa_pdf.php?id_partido=…`.
   Daraus ergeben sich Start-ID und die genaue Liga-Bezeichnung. Ohne Link müsste der Workflow tausende IDs absuchen.
2. **Bestätigung**: Habt ihr 2025/26 in derselben Liga (Oberliga Frauen HV Saar) gespielt? Unter welchem Namen
   stand die Mannschaft im Bericht (z. B. „HSG DJK Marpingen-SC Alsweiler 2“ oder „… II“)?
3. **Pokal**: den Link zum Spielplan des Opel Deckert Cups (Frauen) oder einen Pokal-Spielbericht (sobald gespielt,
   z. B. Runde 2 am 22.11. gegen Quierschied). Zur geschenkten Runde: Gegner und Datum – soll sie als
   „kampflos gewonnen“ erscheinen?
4. **Optional**: In den Claude-Umgebungseinstellungen `handball360.isquad.de` unter *Allowed domains* freigeben
   (Umgebungsmenü in der Titelleiste → Edit → Network access). Dann kann ich PDFs direkt testen; sonst teste ich über
   GitHub-Workflow-Läufe (dauert pro Versuch einige Minuten).
5. **Entscheidung**: Wo soll der Vorjahresvergleich erscheinen? Vorschlag: Startseite (Saisonkennzahlen),
   Ligastatistik, Gegneranalyse, eigene Auswertung – jeweils per Schalter.

## Außerdem offen

- **Feedback von Lukas zur Spielerfassung** (Spielanalyse → Erfassung) einarbeiten – Feedback bitte mitbringen.

## Ablauf morgen

1. Du lieferst Punkt 1–3 (Punkt 4 optional).
2. Ich baue Schritt 1 (Workflow) → du startest „Saison nachladen“ → Daten liegen als `saisons/2025-26.json` im Repo.
3. Ich prüfe die Daten (Spielzahl, Tore = Summe der Spielerinnentore, Teamnamen) und baue Schritte 2–6.
4. Pokal (Schritt 7), sobald Name/Link bekannt sind.
