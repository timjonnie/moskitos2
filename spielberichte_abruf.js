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
const KLASSEN = ["OBERLIGA FRAUEN"];
// Pokal (Opel Deckert Cup | Pokal Frauen): alle Runden sind als Berichte vorab angelegt, als Block ab POKAL_START.
// Neue Saison: erste Nummer des Pokal-Blocks hier eintragen (z. B. aus einem Spielbericht-Link auf handball.net).
const POKAL = { name: "OPEL DECKERT CUP | POKAL FRAUEN", anzeige: "Opel Deckert Cup", start: 687617, maxMiss: 5 };
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

// Pokal-Bericht lesen: Runde, Termin, Halle, Mannschaften, Endstand (auch ohne Spielverlauf), Sieger
function cupEntry(lines, items, id) {
  const t = lines.map(l => l.t).join("\n");
  const round = (t.match(/POKAL FRAUEN • ([A-ZÄÖÜ]+)/) || [])[1] || "";
  const dt = t.match(/Datum (\d{2})\.(\d{2})\.(\d{4}), Spielbeginn (\d{2}:\d{2})/);
  // lange Namen brechen im Kopf um – dann die Zeilen „Heim:“/„Gast:“ der Aufstellung nehmen
  const pick = (a, b) => { a = (a || "").trim(); b = (b || "").trim(); return b.length > a.length ? b : a; };
  const home = pick((t.match(/Heimmannschaft (.*)$/m) || [])[1], (t.match(/^Heim:[ \t]*(.*)$/m) || [])[1]);
  const away = pick((t.match(/Gastmannschaft (.*)$/m) || [])[1], (t.match(/^Gast:[ \t]*(.*)$/m) || [])[1]);
  const ort = ((t.match(/^Spielort (.*?)\s*Gastmannschaft/m) || [])[1] || "").trim();
  const end = t.match(/Endstand (\d+):(\d+) \(([^)]*)\)(?:, Sieger ([^\n]+?))?\s*Zuschauer/);
  const nr = (t.match(/Spielnummer (\S+)/) || [])[1] || "";
  const clean = n => n ? gaTeam(n.replace(/\s*\(ZURÜCKGEZOGEN[^)]*\)+/i, " (zurückgezogen)")) : null;
  const e = { id, nr, round: round.charAt(0) + round.slice(1).toLowerCase(),
    date: dt ? `${dt[3]}-${dt[2]}-${dt[1]}` : null, time: dt && dt[4] !== "00:00" ? dt[4] : "",
    venue: ort ? ort.toLowerCase().replace(/(^|[\s\-(])(\S)/g, (x, p, q) => p + q.toUpperCase()) : "",
    home: clean(home), away: clean(away), score: null, ht: null, winner: null, status: "offen",
    pdf: URL(id) };
  if (end) { e.score = [+end[1], +end[2]]; if (end[4]) e.winner = clean(end[4]); }
  const r = gaParse(items, null, URL(id));
  if (!r.error && r.game) { const g = r.game; delete g.source; e.home = g.home || e.home; e.away = g.away || e.away; e.score = g.score; e.ht = g.ht; e.status = "gespielt"; e.game = g; }
  else if (e.score && (e.score[0] || e.score[1])) e.status = "Ergebnis";
  const heute = new Date().toISOString().slice(0, 10);
  if (e.status === "offen" && e.date && e.date < heute) e.status = e.home && e.away ? "ohne Ergebnis" : "Freilos";
  if (e.score && e.score[0] !== e.score[1] && !e.winner) e.winner = e.score[0] > e.score[1] ? e.home : e.away;
  return e;
}

async function pokalAbruf() {
  const out = []; let miss = 0;
  for (let id = POKAL.start; miss < POKAL.maxMiss; id++) {
    let buf;
    try { const r = await fetch(URL(id), { headers: { "User-Agent": "Moskitos2-Gegneranalyse (1x pro Woche)" } }); buf = new Uint8Array(await r.arrayBuffer()); }
    catch (e) { miss++; continue; }
    await sleep(300);
    if (String.fromCharCode(...buf.slice(0, 4)) !== "%PDF") { miss++; continue; }
    let items; try { items = await gaPdfItems(buf); } catch (e) { miss++; continue; }
    const lines = gaLines(items), text = lines.map(l => l.t).join("\n").toUpperCase();
    if (!text.includes(SAISON) || !text.includes(POKAL.name)) { miss++; continue; }
    miss = 0; out.push(cupEntry(lines, items, id));
  }
  // Wer ohne Ergebnis (kampflos) weiterkam: steht in einer späteren Runde
  const later = (e) => out.filter(x => x.id > e.id && x.round !== e.round);
  out.forEach(e => { if (!e.winner && e.status === "ohne Ergebnis") { const w = [e.home, e.away].filter(t => later(e).some(x => x.home === t || x.away === t));
    if (w.length === 1) { e.winner = w[0]; e.status = "kampflos"; } } });
  return out;
}

(async () => {
  const data = fs.existsSync(DATEI) ? JSON.parse(fs.readFileSync(DATEI, "utf8")) : { games: [] };
  const byNr = new Map(data.games.map(g => [String(g.nr || g.id), g]));
  const fixtures = [], ligaFixtures = [];
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
      if (f) ligaFixtures.push(f);
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
  if (ligaFixtures.length) data.league_fixtures = ligaFixtures.filter(f => f.date >= heute).sort((a, b) => a.date.localeCompare(b.date)); // alle offenen Ligaspiele (Spieltag-Vorschau)
  data.results_only = [];
  try { const cup = await pokalAbruf(); if (cup.length) data.cup = { name: POKAL.anzeige, games: cup };
    // eigene offene Pokalspiele zusätzlich als Termin (für „Nächstes Spiel“ und Gegneranalyse); comp = "Pokal"
    const pf = cup.filter(e => e.status === "offen" && e.date && e.date >= heute && e.home && e.away && (e.home === OWN || e.away === OWN)).map(e => {
      const tag = TAGE[new Date(e.date + "T12:00:00").getDay()], d = e.date.split("-");
      return { id: e.id, comp: "Pokal", round: e.round, date: e.date, home: e.home, away: e.away,
        label: `${tag}, ${d[2]}.${d[1]}.${d[0]}${e.time ? ", " + e.time : ""}${e.venue ? ", " + e.venue : ""} (Pokal, ${e.round}, ${e.home === OWN ? "Heimspiel" : "auswärts"})` }; });
    if (pf.length) data.fixtures = (data.fixtures || []).filter(f => f.comp !== "Pokal").concat(pf).sort((a, b) => a.date.localeCompare(b.date));
    console.log(`Pokal: ${cup.length} Einträge, ${cup.filter(e => e.status === "gespielt").length} mit Bericht.`); }
  catch (e) { console.log("Pokal-Abruf fehlgeschlagen: " + e.message); }
  data.updated = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  fs.writeFileSync(DATEI, JSON.stringify(data, null, 1));
  console.log(`Fertig: ${neu} neu, ${upd} aktualisiert, ${offen} noch nicht gespielt, ${data.fixtures ? data.fixtures.length : 0} Termine der Moskitos.`);
})();
