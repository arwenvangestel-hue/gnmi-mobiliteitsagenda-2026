export const labels=['Niet aangetroffen','Ambitie of probleem','Concrete maatregel','Programmatische aanpak'];
export const groups={mob:{name:'GNMI Mobiliteit',url:'https://gnmi.nl/content/156-gnmi-mobiliteit'},safe:{name:'GNMI Verkeersveiligheid',url:'https://gnmi.nl/content/162-gnmi-verkeersveiligheid'},ov:{name:'GNMI OV',url:'https://gnmi.nl/content/159-gnmi-ov'},park:{name:'GNMI Parkeren',url:'https://gnmi.nl/content/168-gnmi-parkeren'},log:{name:'GNMI Stadslogistiek',url:'https://gnmi.nl/content/171-gnmi-stadslogistiek'}};
export const context={
 T01:{short:'Verkeersveiligheid',group:'safe',why:'Andere akkoorden verbinden verkeersveiligheid aan veilige routes, snelheid, inrichting en gedrag. Dat maakt het een gezamenlijke ontwerp- en uitvoeringsopgave.',question:'Welke routes, kruispunten of schoolomgevingen vragen lokaal om een aanvullende veiligheidsaanpak?'},
 T02:{short:'Lopen en fietsen',group:'mob',why:'Loop- en fietsverbindingen worden ingezet voor dagelijkse bereikbaarheid en de verdeling van straatruimte. Voorbeelden laten zien welke schakels en voorzieningen gemeenten willen verbeteren.',question:'Zijn ontbrekende loop- en fietsverbindingen en stallingsvoorzieningen voldoende in beeld?'},
 T03:{short:'Openbaar en collectief vervoer',group:'ov',why:'Akkoorden agenderen verbindingen, haltes, stations en collectieve diensten. Gemeenten hebben daarbij vaak andere overheden en vervoerders nodig.',question:'Welke bestemmingen of groepen worden door het bestaande vervoersaanbod onvoldoende bereikt?'},
 T04:{short:'Wegennet en ontsluiting',group:'mob',why:'Gemeenten benoemen knelpunten in doorstroming en ontsluiting en de afstemming met regionale en landelijke netwerken. Dat maakt prioritering en samenwerking relevant.',question:'Welke lokale bereikbaarheidsknelpunten vragen om afstemming met provincie, regio of Rijk?'},
 T05:{short:'Parkeren',group:'park',why:'Parkeerbeleid raakt de verdeling van openbare ruimte, bereikbaarheid en gebiedsontwikkeling. Andere akkoorden maken keuzes over normen, regulering en capaciteit.',question:'Sluiten parkeernormen en regulering aan op woningbouw, bereikbaarheid en de gewenste straatruimte?'},
 T06:{short:'Woningbouw en leefomgeving',group:'mob',why:'Andere gemeenten koppelen mobiliteitskeuzes aan woningbouw, gebiedsontwikkeling en de kwaliteit van de openbare ruimte. Die koppeling helpt afhankelijkheden vroeg zichtbaar te maken.',question:'Wordt mobiliteit vanaf de start betrokken bij woningbouw en de inrichting van wijken?'},
 T07:{short:'Duurzame, gedeelde en slimme mobiliteit',group:'mob',why:'Akkoorden noemen onder meer deelvervoer, laadinfrastructuur en slimme diensten. De voorbeelden laten zien welke concrete toepassing achter de transitieambitie zit.',question:'Welke duurzame of gedeelde vervoersoplossing verdient hier een concrete uitwerking?'},
 T08:{short:'Toegankelijke en betaalbare mobiliteit',group:'ov',why:'Andere akkoorden maken mobiliteit voor specifieke groepen, betaalbaarheid en bereikbaarheid van kernen expliciet. Een algemeen bereikbaarheidsdoel dekt deze vragen niet vanzelf.',question:'Wie kan lokaal onvoldoende zelfstandig of betaalbaar reizen, en wat vraagt dat van het beleid?'},
 T09:{short:'Logistiek en bijzondere vervoersstromen',group:'log',why:'Goederenstromen, bevoorrading en bijzondere vervoersmarkten hebben eigen ruimte- en bereikbaarheidsvragen. De precieze lokale aanleiding verschilt; raadpleeg de passages hieronder.',question:'Vragen bevoorrading, vrachtverkeer of andere bijzondere vervoersstromen om aanvullende afspraken?'},
 T10:{short:'Beheer, onderhoud en vervanging',group:'mob',why:'Het onderzoek signaleert een collectieve opgave rond instandhouding en vervanging van mobiliteitsinfrastructuur. In andere akkoorden komen kwaliteit, planning en financiering van wegen en civiele objecten terug.',question:'Zijn onderhoudsniveaus, vervangingsinvesteringen en de meerjarige financiering expliciet belegd?'},
 T11:{short:'Uitvoering en samenwerking',group:'mob',why:'Dit is een doorsnijdende uitvoeringsdimensie, geen extra inhoudelijk hoofdthema.',question:'Zijn capaciteit, financiering, monitoring en samenwerkingsafspraken toereikend?'}
};
export function cohort(data,mode='all'){return data.municipalities.filter(m=>mode==='all'||(mode==='direct'?m.route==='Rechtstreeks':m.route==='Via regio'));}
export function average(list,fn){return list.length?list.reduce((s,m)=>s+fn(m),0)/list.length:0;}
const evidenceTerms={T01:/verkeersveilig|schoolroute|30 km|fatbike/i,T02:/fiets|loopagenda|voetganger/i,T03:/openbaar vervoer|\bOV\b|busverbinding|treinstation|HOV|concessie/i,T04:/doorstroming|wegennet|ontsluit|ringbaan|verkeerscirculatie/i,T05:/parkeer/i,T06:/(?:woning|wonen|gebied|ruimte|leefomgeving).{0,200}(?:mobiliteit|verkeer)|(?:mobiliteit|verkeer).{0,200}(?:woning|wonen|gebied|ruimte|leefomgeving)/i,T07:/deelmobiliteit|deelauto|laad|slimme mobiliteit|duurzame mobiliteit|zero.emissie/i,T08:/betaalbaar|toegankelijk.{0,80}(?:vervoer|halte)|(?:vervoer|halte).{0,80}toegankelijk|Bravoflex|doelgroepen|minima/i,T09:/logistiek|vracht|goederen|bevoorrading|taxi|scheepvaart/i,T10:/onderhoud|vervang|wegenbeheer|assetmanagement|civiele/i,T11:/uitvoeringsprogramma|monitoren|mobiliteitsplan|financier|regionale samenwerking/i};
function evidenceQuality(code,e){return (evidenceTerms[code].test(e.text)?1000:0)+e.level*100+(/programma|strategie|agenda|beleidsplan/i.test(e.text)?80:0)+Math.min(e.text.length,230)+(e.text.length>=90?100:-180)+(e.text.length<=650?70:-e.text.length/12)+(/[.!?]$/.test(e.text)?35:0);}
export function report(data,m,mode='all'){
 const pool=cohort(data,mode), known=pool.some(x=>x.name===m.name)&&!m.upload;
 const higher=pool.filter(x=>x.total>m.total).length, ties=pool.filter(x=>x.total===m.total).length;
 const themes=data.themes.map(t=>{const code=t.Code,level=m.themes[code].level;
  const count=pool.filter(x=>x.themes[code].level>0).length,mean=average(pool,x=>x.themes[code].level);
  const peers=pool.filter(x=>x.name!==m.name&&x.themes[code].level>level&&x.themes[code].level>=2)
    .sort((a,b)=>(b.province===m.province)-(a.province===m.province)||b.themes[code].level-a.themes[code].level||a.name.localeCompare(b.name,'nl'));
  const quality=e=>evidenceQuality(code,e);
  const candidates=peers.map(x=>{const es=x.themes[code].ids.map(id=>data.evidence[id]).filter(Boolean).sort((a,b)=>quality(b)-quality(a));return {name:x.name,url:x.url,file:x.file,level:x.themes[code].level,evidence:es[0]};});
  const readable=candidates.filter(x=>x.evidence&&x.evidence.text.length>=90);
  const examples=(readable.length?readable:candidates).slice(0,3);
  return {...t,...context[code],code,level,count,mean,percent:count/pool.length*100,examples,own:m.themes[code].ids.map(id=>m.upload?m.evidence[id]:data.evidence[id]).filter(Boolean).sort((a,b)=>quality(b)-quality(a))};
 });
 const opportunities=themes.filter(t=>t.code!=='T11'&&t.level<2&&t.examples.length).sort((a,b)=>a.level-b.level||b.percent-a.percent);
 const strong=themes.filter(t=>t.code!=='T11'&&t.level>=2&&t.level>=t.mean);
 return {m,mode,n:pool.length,known,rank:higher+1,ties,mean:average(pool,x=>x.total),themes,opportunities,strong,
  breadth:themes.filter(t=>t.code!=='T11'&&t.level>0).length,
  summary:`${m.name} legt ${themes.filter(t=>t.code!=='T11'&&t.level>0).length} van de 10 inhoudelijke mobiliteitsthema’s vast in het ${m.upload?'aangeleverde':'onderzochte'} akkoord. ${strong.length} thema’s zijn concreet uitgewerkt en scoren minstens op het gemiddelde van de gekozen vergelijkingsgroep. ${opportunities.length?`De belangrijkste verkenningsvraag is ${opportunities[0].short.toLowerCase()}.`:'Alle inhoudelijke thema’s zijn ten minste concreet uitgewerkt; gebruik de voorbeelden om de lokale keuzes verder te verdiepen.'}`};
}
// Transparent lexical first scan. Scores are proposals, never validated research results.
const patterns={T01:/verkeersveilig\w*|verkeersslachtoffer\w*|schoolroute\w*|schoolstraat\w*|snelheidsrem\w*|fatbike\w*|verkeershandhaving|veilige (?:kruispunten|oversteek|school)/i,T02:/fiets\w*|voetganger\w*|actieve mobiliteit|wandelpad\w*|looproute\w*/i,T03:/openbaar vervoer|\bOV\b|buurtbus|wijkbus|vraagafhankelijk vervoer|busbaan\w*|buslijn\w*|station\w*|trein\w*|spoorverbinding\w*/i,T04:/wegennet|ontsluit\w*|doorstroming|ringweg|rondweg|randweg|sluipverkeer|verkeerscirculatie|autoluw|hoofdweg\w*/i,T05:/parkeer\w*|betaald parkeren|blauwe zone|\bP\+R\b/i,T06:/STOMP|STROMP|mobiliteitstransitie|knooppuntontwikkeling|15.minutenstad|(?:mobiliteit|verkeer|fiets|parkeren).{0,180}(?:woningbouw|gebiedsontwikkeling|openbare ruimte)|(?:woningbouw|gebiedsontwikkeling|openbare ruimte).{0,180}(?:mobiliteit|verkeer|fiets|parkeren)/i,T07:/deelmobiliteit|deelauto\w*|deelfiets\w*|laadpa\w*|laadinfrastructuur|elektrisch (?:rijden|vervoer)|zero.emissie|mobiliteitshub\w*|smart mobility|slimme mobiliteit|\bMaaS\b/i,T08:/(?:toegankelijk\w*|betaalbaar\w*|ouderen|minima|beperking|kleine kernen).{0,160}(?:vervoer|mobiliteit|halte|bereikbaar)|(?:vervoer|mobiliteit|halte|bereikbaar).{0,160}(?:toegankelijk\w*|betaalbaar\w*|ouderen|minima|beperking)|Wmo.vervoer|leerlingenvervoer|gratis (?:OV|vervoer)/i,T09:/logistiek\w*|vrachtverkeer|goederenvervoer|bevoorrading|venstertijd\w*|scheepvaart|vaarweg\w*|truckparking|\btaxi\b|luchthaven/i,T10:/(?:onderhoud|beheer|vervang\w*|renovatie).{0,130}(?:wegen|wegdek|brug\w*|kade\w*|tunnel\w*|fietspad\w*|stoep\w*|infrastructuur)|(?:wegen|wegdek|brug\w*|kade\w*|tunnel\w*|fietspad\w*|stoep\w*).{0,130}(?:onderhoud|beheer|vervang\w*|renovatie)|wegenbeheerplan|assetmanagement|civiele kunstwerken/i,T11:/mobiliteitsvisie|mobiliteitsplan|verkeersplan|(?:verkeer|mobiliteit|infrastructuur).{0,120}(?:budget|financier\w*|regio|monitoring|uitvoeringsprogramma)|(?:budget|financier\w*|regio|monitoring|uitvoeringsprogramma).{0,120}(?:verkeer|mobiliteit|infrastructuur)/i};
export function scan(name,pages,file){
 const evidence={},themes={};let seq=0;
 for(const [code,re] of Object.entries(patterns)){
  const ids=[];
  for(const p of pages){
   const parts=p.text.replace(/\s+/g,' ').split(/(?<=[.!?;])\s+/);
   for(const text of parts){
    if(text.length<25||!re.test(text))continue;
    if(code==='T02'&&/recreati|toerisme|sport/i.test(text)&&!/verbinding|bereikbaar|netwerk|woon.werk|school|infrastructuur/i.test(text))continue;
    if(code==='T05'&&/fietspark|fietsstall/i.test(text)&&!/(?<!fiets)parkeer/i.test(text))continue;
    const program=/programma|meerjaren|uitvoeringsagenda|beheerplan|mobiliteitsvisie|mobiliteitsplan|wegenbeleidsplan/i.test(text);
    const action=/aanleg\w*|realis\w*|invest\w*|verbeter\w*|bouw\w*|invoer\w*|voeren.{0,20}in|maatregel\w*|uitvoer\w*|aanpak\w*|budget|\bwe (?:maken|zetten|passen|werken|leggen)\b/i.test(text);
    const level=program&&action?3:action?2:1,id='UPLOAD-'+(++seq);
    evidence[id]={id,name,page:p.page,text,level,csv:null};ids.push(id);
   }
  }
  ids.sort((a,b)=>evidence[b].level-evidence[a].level);
  themes[code]={level:ids.length?evidence[ids[0]].level:0,ids:ids.slice(0,12)};
 }
 const levels=Object.values(themes).slice(0,10).map(t=>t.level);
 const aParts=[themes.T11.level>=2?2:themes.T11.level?1:0,levels.filter(x=>x>0).length>=7?2:levels.some(x=>x>0)?1:0,Math.max(themes.T04.level,themes.T10.level)>=2?2:Math.max(themes.T04.level,themes.T10.level)>0?1:0,themes.T06.level>=2?2:themes.T06.level?1:0,levels.filter(x=>x>=2).length>=4?2:levels.some(x=>x>=2)?1:0];
 const collapse=x=>Math.min(x,2);
 const clusters=[themes.T01.level,Math.max(themes.T02.level,themes.T03.level,themes.T08.level),Math.max(themes.T02.level,themes.T07.level),Math.max(themes.T05.level,themes.T06.level),themes.T11.level];
 const a=aParts.reduce((s,x)=>s+x,0),b=clusters.reduce((s,x)=>s+collapse(x),0),c=['T04','T08','T09','T10'].reduce((s,k)=>s+1.25*collapse(themes[k].level),0);
 return {name,upload:true,file,route:'Nieuwe upload',region:'',province:'',source:'Eigen document',url:'',themes,evidence,a,b,c,total:a+b+c,aParts,clusters};
}
export function updateUpload(m,code,level){
 m.themes[code].level=level;const t=m.themes,ls=Object.values(t).slice(0,10).map(x=>x.level);
 m.aParts=[t.T11.level>=2?2:t.T11.level?1:0,ls.filter(x=>x>0).length>=7?2:ls.some(x=>x>0)?1:0,Math.max(t.T04.level,t.T10.level)>=2?2:Math.max(t.T04.level,t.T10.level)>0?1:0,t.T06.level>=2?2:t.T06.level?1:0,ls.filter(x=>x>=2).length>=4?2:ls.some(x=>x>=2)?1:0];
 m.clusters=[t.T01.level,Math.max(t.T02.level,t.T03.level,t.T08.level),Math.max(t.T02.level,t.T07.level),Math.max(t.T05.level,t.T06.level),t.T11.level];
 m.a=m.aParts.reduce((s,x)=>s+x,0);m.b=m.clusters.reduce((s,x)=>s+Math.min(x,2),0);m.c=['T04','T08','T09','T10'].reduce((s,k)=>s+1.25*Math.min(t[k].level,2),0);m.total=m.a+m.b+m.c;
}
