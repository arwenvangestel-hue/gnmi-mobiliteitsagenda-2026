import {groups} from './engine.mjs';

// One shared content model keeps the web overview and its one-page PDF aligned.
const prompts={
 T01:['Veilige schoolroutes, lagere snelheden en veilige kruispunten helpen ongelukken voorkomen.','Zijn de plekken waar inwoners risico lopen in beeld, en is duidelijk wat u daar wilt verbeteren?'],
 T02:['Goede fiets- en looproutes verbinden wijken met scholen, werk en voorzieningen.','Ontbreken er nog verbindingen, veilige oversteken of fietsenstallingen?'],
 T03:['Bus- en treinverbindingen houden werk, onderwijs en voorzieningen bereikbaar.','Welke wijken of dorpen vragen om betere verbindingen of haltes?'],
 T04:['Drukke wegen en slechte aansluitingen kunnen de bereikbaarheid beperken.','Zijn knelpunten en afspraken met de provincie of het Rijk duidelijk?'],
 T05:['Parkeren vraagt ruimte die ook nodig is voor wonen, groen en verkeer.','Passen parkeerplaatsen, tarieven en parkeernormen bij de plannen voor uw gemeente?'],
 T06:['Nieuwe woningen zorgen ook voor nieuwe verplaatsingen.','Worden routes, openbaar vervoer en parkeren vanaf de start van een bouwplan meegenomen?'],
 T07:['Deelauto’s, laadpalen en slimme vervoersdiensten bieden alternatieven voor de eigen auto.','Welke oplossing past lokaal, en wat is nodig om die te gebruiken?'],
 T08:['Niet iedereen kan zelfstandig of betaalbaar reizen.','Is het vervoer voor ouderen, mensen met een beperking en inwoners met een klein budget goed geregeld?'],
 T09:['Bevoorrading en vrachtverkeer vragen om ruimte en veilige routes.','Zijn routes, tijden en afspraken voor winkels en bedrijven voldoende geregeld?'],
 T10:['Wegen, bruggen en fietspaden moeten worden onderhouden en op tijd vervangen.','Is duidelijk wat wanneer moet gebeuren en welk geld daarvoor beschikbaar is?']
};
export function numberParts(value){
 const [integer,decimal]=Number(value).toLocaleString('nl-NL',{maximumFractionDigits:2}).split(',');
 return {integer,decimal:decimal?','+decimal:''};
}
export function overview(r){
 const themes=r.themes.filter(t=>t.code!=='T11');
 const priorities=r.opportunities.slice(0,3).map(t=>({...t,
  status:t.level===0?'Niet genoemd in uw akkoord':'Alleen als ambitie genoemd',
  description:prompts[t.code][0],question:prompts[t.code][1],
  presence:`${Math.round(t.percent)}% van ${r.n} akkoorden`,groupInfo:groups[t.group]}));
 const concrete=themes.filter(t=>t.level>=2).length;
 const network=[...new Set([...priorities.map(t=>t.group),...r.strong.map(t=>t.group),'mob'])].map(k=>groups[k]);
 return {reference:`${r.n} onderzochte gemeenten`,n:r.n,themes,priorities,network,
  profile:`${r.m.name} noemt ${r.breadth} van de 10 mobiliteitsthema’s. ${concrete} daarvan zijn uitgewerkt in maatregelen of een programma.`,
  footnote:'* De score gaat over wat in het akkoord staat, niet over de kwaliteit of uitvoering van beleid. De 85 onderzochte akkoorden vormen geen landelijke steekproef.',
  scale:'0 niet genoemd · 1 ambitie · 2 maatregel · 3 programma'};
}
