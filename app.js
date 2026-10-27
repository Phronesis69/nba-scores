var state={games:GAMES};
function $(i){return document.getElementById(i)}
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function dateKey(date){if(!date)return"";var parts=date.split(" ");return "20"+parts[2]+"-"+parts[1]+"-"+parts[0]}
function render(){
  var a=0,b=0,seriesL=0,seriesR=0,n=state.games.length;
  state.games.forEach(function(g){a+=g.ysb;b+=g.sek;if(g.ysb>g.sek)seriesL++;if(g.sek>g.ysb)seriesR++});
  $("totL").textContent=a;$("totR").textContent=b;
  $("seriesL").textContent=seriesL;$("seriesR").textContent=seriesR;
  $("gc").textContent=n+(n==1?" MATCH":" MATCHES");
  $("empty").style.display=n?"none":"block";
  var version=$("version"),selected=version.value;
  version.textContent="";var all=el("option",0,"All versions");all.value="";version.appendChild(all);
  Array.from(new Set(state.games.map(function(g){return g.game}).filter(Boolean))).sort().forEach(function(v){var option=el("option",0,"NBA "+v);option.value=v;version.appendChild(option)});
  version.value=selected; if(version.selectedIndex<0)version.value="";
  var from=$("dateFrom").value,to=$("dateTo").value;
  var tb=$("rows");tb.textContent="";
  for(var i=n-1;i>=0;i--){
    var g=state.games[i],date=dateKey(g.date);
    if(version.value&&g.game!==version.value||from&&(!date||date<from)||to&&(!date||date>to))continue;
    var m=el("div","m"),r=el("div","mrow");
    function side(c,nm,v,o){var s=el("div","pt "+c+(v>o?" win":v<o?" lose":""));s.append(el("span","nm",nm),el("span","sc",v));return s}
    r.append(side("l","YSB",g.ysb,g.sek),el("div","dv","-"),side("r","SEK",g.sek,g.ysb));
    var f=el("div","mf");f.append(el("span",0,"MATCH "+(i+1)));if(g.date)f.append(el("span",0,"\u00b7"),el("span",0,g.date));
    if(g.game)f.appendChild(el("span","mv "+(/27/.test(g.game)?"v27":"v26"),"NBA "+g.game));
    m.append(f,r);tb.appendChild(m);
  }
  $("filterEmpty").hidden=!n||tb.children.length>0;
}
["dateFrom","dateTo","version"].forEach(function(id){$(id).onchange=render});
$("clearFilters").onclick=function(){$("dateFrom").value="";$("dateTo").value="";$("version").value="";render()};
$("hint").onclick=function(e){e.preventDefault();$("log").scrollIntoView({behavior:"smooth",block:"start"})};
$("music").volume=0.25;
render();
