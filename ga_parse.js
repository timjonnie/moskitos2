/* Spielbericht-PDF (handball360 / DHB) auslesen. Erwartet pdf.js-Textelemente {s,x,y,p}. */
var GA_TEAMS={"TV MERCHWEILER":"TV Merchweiler","HF KÖLLERTAL":"HF Köllertal","ASC QUIERSCHIED":"ASC Quierschied","TV KIRKEL":"TV Kirkel",
 "HG SAARLOUIS":"HG Saarlouis","HSG TV BIRKENFELD/NOHFELDEN-TUS SCHWARZENBACH":"HSG Birkenfeld/Nohfelden-Schwarzenbach","HC PERL":"HC Perl",
 "HSG TVA/ATSV SAARBRÜCKEN":"HSG TVA/ATSV Saarbrücken","HF UNTERE SAAR 2":"HF Untere Saar 2","SG ZWEIBRÜCKEN":"SG Zweibrücken",
 "HSG DJK MARPINGEN-SC ALSWEILER II":"Moskitos 2","MOSKITOS 2":"Moskitos 2"};
function gaTeam(s){ s=String(s||"").replace(/\s+/g," ").trim(); var u=s.toUpperCase(); if(GA_TEAMS[u]) return GA_TEAMS[u];
  return s.toLowerCase().replace(/(^|[\s\/\-])(\S)/g,function(m,a,b){return a+b.toUpperCase();}).replace(/\b(Tv|Hsg|Hg|Hc|Hf|Sg|Asc|Djk|Sc|Tus|Ii)\b/g,function(m){return m.toUpperCase();}); }
function gaLines(items){
  var arr=items.slice().sort(function(a,b){return a.p-b.p||b.y-a.y||a.x-b.x;}), lines=[], cur=null;
  arr.forEach(function(it){ if(cur&&cur.p===it.p&&Math.abs(cur.y-it.y)<=2.5){ cur.items.push(it); } else { cur={p:it.p,y:it.y,items:[it]}; lines.push(cur); } });
  lines.forEach(function(l){ l.items.sort(function(a,b){return a.x-b.x;}); l.t=l.items.map(function(i){return i.s;}).join(" ").replace(/\s+/g," ").trim(); });
  return lines;
}
var GA_EV=[[/^Siebenmeter.*Fehlwurf/,"pen_miss"],[/^Siebenmeter.*Tor/,"pen_goal"],[/^Tor/,"goal"],[/^ZweiMinuten/,"two_min"],[/^Verwarnung/,"warning"],[/^Disqualifikation/,"disq"],[/^Auszeit/,"timeout"]];
function gaType(e){ e=String(e||"").replace(/\s+/g,"");
  for(var i=0;i<GA_EV.length;i++) if(GA_EV[i][0].test(e)) return GA_EV[i][1]; return null; }
function gaEventsByColumns(items, lines){
  var title=lines.filter(function(l){return /^Spielverlauf\b/.test(l.t);})[0]; if(!title) return null;
  var events=[], pages={}, found=false;
  items.forEach(function(it){ if(it.p<title.p||(it.p===title.p&&it.y>=title.y)) return; (pages[it.p]=pages[it.p]||[]).push(it); });
  Object.keys(pages).forEach(function(pk){
    var its=pages[pk];
    function hdr(name){ return its.filter(function(i){return i.s===name;}); }
    // Pro Seite können mehrere Tabellen nebeneinander stehen: je Kopfzeile "Team" eine Tabelle
    var teams=hdr("Team"); if(!teams.length) return;
    var xs=[]; teams.forEach(function(t){ if(!xs.some(function(x){return Math.abs(x-t.x)<10;})) xs.push(t.x); }); xs.sort(function(a,b){return a-b;});
    teams.forEach(function(th){
      var ci=xs.findIndex(function(x){return Math.abs(x-th.x)<10;}), x0=xs[ci]-4, x1=ci+1<xs.length?xs[ci+1]-4:1e9, hy=th.y;
      // nächste Kopfzeile darunter in derselben Spalte begrenzt die Tabelle
      var below=teams.filter(function(t){return Math.abs(t.x-th.x)<10&&t.y<hy-1;}).map(function(t){return t.y;}), yEnd=below.length?Math.max.apply(null,below)+1:-1e9;
      function inT(i){ return i.x>=x0&&i.x<x1&&i.y>yEnd; }
      function first(name){ return hdr(name).filter(function(i){return inT(i)&&Math.abs(i.y-hy)<3;})[0]; }
      var hz=first("Zeit"), hs=first("Stand"), he=first("Ereignis"), hp=first("Person"); if(!hz||!he||!hp) return;
      found=true;
      var cl=[["team",th.x],["zeit",hz.x],["stand",hs?hs.x:null],["ev",he.x],["person",hp.x]].filter(function(c){return c[1]!=null;}).sort(function(a,b){return a[1]-b[1];});
      function col(i){ var c=cl[0][0]; for(var k=1;k<cl.length;k++){ if(i.x>=(cl[k-1][1]+cl[k][1])/2) c=cl[k][0]; } return c; }
      var body=its.filter(function(i){ return inT(i)&&i.y<hy-1; });
      var anchors=body.filter(function(i){return col(i)==="zeit"&&/^\d{2}:\d{2}$/.test(i.s);}).map(function(a){return {a:a,team:[],ev:[],person:[]};});
      if(!anchors.length) return;
      body.forEach(function(i){ var c=col(i); if(c==="zeit"||c==="stand"||!c) return;
        var best=null,bd=1e9; anchors.forEach(function(r){ var d=Math.abs(r.a.y-i.y); if(d<bd){bd=d;best=r;} });
        if(best&&bd<=14) best[c].push(i); });
      anchors.sort(function(a,b){return b.a.y-a.a.y;}).forEach(function(r){
        function txt(arr){ return arr.sort(function(a,b){return b.y-a.y||a.x-b.x;}).map(function(i){return i.s;}).join(" ").replace(/\s+/g," ").trim(); }
        var team=txt(r.team), typ=gaType(txt(r.ev)); if(!typ||!/^(Heim|Gast)/.test(team)) return;
        var m=txt(r.person).match(/^(\d{1,3})\b/), nr=m?+m[1]:null; if(nr===0&&typ!=="timeout") return;
        var t=r.a.s.split(":"); events.push({s:+t[0]*60+ +t[1],side:/^Heim/.test(team)?"home":"away",type:typ,nr:typ==="timeout"?null:nr});
      });
    });
  });
  return found?events:null;
}
function gaEventsFlat(lines){
  var i=lines.map(function(l){return l.t;}).join("\n"), k=i.indexOf("Spielverlauf"); if(k<0) return [];
  var flat=i.slice(k).split("\n").filter(function(l){return !/^(OBERLIGA|SAISON|Spielnummer|Datum|Spielort|Endstand|Seite \d|Team Zeit Stand|Powered by|POKAL)/i.test(l);}).join(" ");
  var re=/(Heim|Gast)\s+(\d{2}):(\d{2})\s+(?:\d+:\d+\s+)?(Siebenmeter Tor|Siebenmeter Fehlwurf|Zwei Minuten|Verwarnung|Disqualifikation|Auszeit|Tor)\b\s*(\d{1,3})?/g, m, ev=[];
  while((m=re.exec(flat))){ var typ=gaType(m[4]), nr=m[5]?+m[5]:null; if(nr===0) continue; ev.push({s:+m[2]*60+ +m[3],side:m[1]==="Heim"?"home":"away",type:typ,nr:typ==="timeout"?null:nr}); }
  return ev;
}
function gaParse(items, id, url){
  var lines=gaLines(items), t=lines.map(function(l){return l.t;}).join("\n");
  var m=t.match(/(\d+):(\d+)\s*\((\d+)-(\d+)\)/); if(!m) return {error:"Kein Endstand im Bericht. Das Spiel ist vermutlich noch nicht gespielt."};
  var score=[+m[1],+m[2]], ht=[+m[3],+m[4]];
  var nr=(t.match(/Spielnummer\s+(\S+)/)||[])[1]||"", dt=t.match(/Datum\s+(\d{2})\.(\d{2})\.(\d{4}),\s*Spielbeginn\s+(\d{2}:\d{2})/);
  var st=(t.match(/SPIELTAG\s+(\d+)/)||[])[1], ort=((t.match(/^Spielort\s+(.+?)(?:\s+Gastmannschaft.*)?$/m)||[])[1]||""), kl=((t.match(/Spielklasse\s+(.+?)\s*$/m)||[])[1]||"").toUpperCase();
  var home=(t.match(/^Heim:\s*(.+)$/m)||[])[1], away=(t.match(/^Gast:\s*(.+)$/m)||[])[1];
  if(!home||!away||!dt) return {error:"Kopfdaten (Mannschaften, Datum) nicht gefunden."};
  var roster={home:{},away:{}}, side=null;
  lines.forEach(function(l){ var s=l.t;
    if(/^Heim:/.test(s)){side="home";return;} if(/^Gast:/.test(s)){side="away";return;} if(/^Spielverlauf/.test(s)){side=null;return;}
    if(!side) return; var r=s.match(/^(\d{1,3})\s+(\D+?)(?:\s+(\d{1,2}))?(?:\s+(\d{1,2})\/(\d{1,2}))?(?:\s+\d{2}:\d{2})*\s*$/);
    if(r) roster[side][r[1]]=r[2].replace(/^[A-Z]\s+/,"").trim(); });
  function count(ev){ return ["home","away"].map(function(sd){return ev.filter(function(e){return e.side===sd&&(e.type==="goal"||e.type==="pen_goal");}).length;}); }
  var a=gaEventsByColumns(items,lines), b=gaEventsFlat(lines), ev=null;
  if(a&&String(count(a))===String(score)) ev=a; else if(String(count(b))===String(score)) ev=b; else ev=(a&&a.length>=b.length)?a:b;
  var c=count(ev), note=String(c)===String(score)?"":"Prüfen: aus dem Spielverlauf gezählt "+c[0]+":"+c[1]+", Endstand "+score[0]+":"+score[1];
  var pid=url&&(url.match(/id_partido=(\d+)/)||[])[1];
  return {game:{id:pid?+pid:(id||nr),nr:nr,comp:/POKAL/.test(kl)?"Pokal":"Liga",st:st?+st:null,date:dt[3]+"-"+dt[2]+"-"+dt[1],time:dt[4],
    venue:ort.toLowerCase().replace(/(^|\s)(\S)/g,function(x,p,q){return p+q.toUpperCase();}),home:gaTeam(home),away:gaTeam(away),score:score,ht:ht,roster:roster,events:ev,note:note,
    pdf:pid?"https://handball360.isquad.de/dhb_acta_completa_pdf.php?id_partido="+pid:"",source:"upload"}};
}
async function gaPdfItems(buf){
  var pdf=await window.pdfjsLib.getDocument({data:buf}).promise, out=[];
  for(var p=1;p<=pdf.numPages;p++){ var page=await pdf.getPage(p), tc=await page.getTextContent();
    tc.items.forEach(function(it){ var s=(it.str||"").trim(); if(s) out.push({s:s,x:it.transform[4],y:it.transform[5],p:p}); }); }
  return out;
}
