#!/usr/bin/env node
/*
  Spielberichte Oberliga Frauen (HV Saar) automatisch abrufen.
  - zählt die IDs ab START_ID hoch: https://handball360.isquad.de/dhb_acta_completa_pdf.php?id_partido=<ID>
  - liest jeden Bericht mit derselben Logik wie der Gegner-Reiter (ga_parse.js)
  - gespielte Spiele -> games, noch nicht gespielte Spiele der Moskitos -> fixtures
  Aufruf: node spielberichte_abruf.js     (benötigt: npm i pdfjs-dist@3.11.174)
*/
const fs = require("fs"), path = require("path");
global.window = { pdfjsLib: require("pdfjs-dist/legacy/build/pdf.js") };
eval(fs.readFileSync(path.join(__dirname, "ga_parse.js"), "utf8"));

const START_ID = 399579;          // erstes Spiel der Saison (2627SAROLERWA0101)
const MAX_MISS = 30;              // so viele IDs ohne Oberliga-Bericht in Folge -> Ende
const SAISON = "2026/2027";
const KLASSEN = ["OBERLIGA FRAUEN"];   // Pokal nach dem ersten Pokalspiel ergänzen
const OWN = "Moskitos 2";
const DATEI = path.join(__dirname, "gegner_daten.json");
const URL = id => `https://handball360.isquad.de/dhb_acta_completa_pdf.php?id_partido=${id}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function fixtureFrom(lines, id) {
  const t = lines.map(l => l.t).join("\n");
  const dt = t.match(/(\d{2})\.(\d{2})\.(\d{4}),\s*Spielbeginn\s+(\d{2}:\d{2})/);
  const home = (t.match(/^Heim:\s*(.+)$/m) || [])[1], away = (t.match(/^Gast:\s*(.+)$/m) || [])[1];
  const st = (t.match(/SPIELTAG\s+(\d+)/) || [])[1];
  const ort = ((t.match(/^Spielort\s+(.+?)(?:\s+Gastmannschaft.*)?$/m) || [])[1] || "").trim();
  if (!dt || !home || !away) return null;
  const h = gaTeam(home), a = gaTeam(away), iso = `${dt[3]}-${dt[2]}-${dt[1]}`;
  const tag = TAGE[new Date(iso + "T12:00:00").getDay()];
  const own = h === OWN ? "Heimspiel" : a === OWN ? "auswärts" : "";
  const halle = ort ? ort.toLowerCase().replace(/(^|[\s\-])(\S)/g, (x, p, q) => p + q.toUpperCase()) : "";
  return { id, st: st ? +st : null, date: iso, home: h, away: a,
           label: `${tag}, ${dt[1]}.${dt[2]}.${dt[3]}, ${dt[4]}${halle ? ", " + halle : ""}${own ? " (" + own + ")" : ""}` };
}

(async () => {
  const data = fs.existsSync(DATEI) ? JSON.parse(fs.readFileSync(DATEI, "utf8")) : { games: [] };
  const byNr = new Map(data.games.map(g => [String(g.nr || g.id), g]));
  const fixtures = [];
  let miss = 0, neu = 0, upd = 0, offen = 0;
  for (let id = START_ID; miss < MAX_MISS; id++) {
    let buf;
    try {
      const r = await fetch(URL(id), { headers: { "User-Agent": "Moskitos2-Gegneranalyse (1x pro Woche)" } });
      buf = new Uint8Array(await r.arrayBuffer());
    } catch (e) { miss++; continue; }
    await sleep(300);
    if (String.fromCharCode(...buf.slice(0, 4)) !== "%PDF") { miss++; continue; }
    let items;
    try { items = await gaPdfItems(buf); } catch (e) { miss++; continue; }
    const lines = gaLines(items), text = lines.map(l => l.t).join("\n").toUpperCase();
    if (!text.includes(SAISON) || !KLASSEN.some(k => text.includes(k))) { miss++; continue; }
    miss = 0;
    const r = gaParse(items, null, URL(id));
    if (r.error) {                       // noch nicht gespielt
      const f = fixtureFrom(lines, id); offen++;
      if (f && (f.home === OWN || f.away === OWN)) fixtures.push(f);
      continue;
    }
    const g = r.game; delete g.source;
    const key = String(g.nr || g.id);
    if (byNr.has(key)) upd++; else neu++;
    byNr.set(key, g);
    console.log(`${id}: ST${g.st} ${g.home} – ${g.away} ${g.score[0]}:${g.score[1]}${g.note ? "  " + g.note : ""}`);
  }
  data.games = [...byNr.values()].sort((a, b) => a.date.localeCompare(b.date) || String(a.nr).localeCompare(String(b.nr)));
  const heute = new Date().toISOString().slice(0, 10);
  if (fixtures.length) data.fixtures = fixtures.filter(f => f.date >= heute).sort((a, b) => a.date.localeCompare(b.date));
  data.results_only = [];
  data.updated = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  fs.writeFileSync(DATEI, JSON.stringify(data, null, 1));
  console.log(`Fertig: ${neu} neu, ${upd} aktualisiert, ${offen} noch nicht gespielt, ${data.fixtures ? data.fixtures.length : 0} Termine der Moskitos.`);
})();
