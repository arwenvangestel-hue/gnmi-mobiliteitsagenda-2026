import {overview,numberParts} from './presentation.mjs';

// This PDF is deliberately one A4: the same figures, chart and priorities as the web overview.
export async function makePDF(r,lib,logoBytes,fontResources){
 const {PDFDocument,StandardFonts,rgb,PDFString}=lib,v=overview(r);
 const doc=await PDFDocument.create();doc.setTitle(`GNMI Gemeentespiegel - ${r.m.name}`);doc.setAuthor('GNMI onderzoeksdossier');doc.setSubject(r.m.upload?'Gemeenteoverzicht - indicatieve documentscan':'Gemeenteoverzicht naast 85 onderzochte akkoorden');
 let font,bold;if(fontResources){doc.registerFontkit(fontResources.fontkit);font=await doc.embedFont(fontResources.regular,{subset:true});bold=await doc.embedFont(fontResources.bold,{subset:true});}else{font=await doc.embedFont(StandardFonts.Helvetica);bold=await doc.embedFont(StandardFonts.HelveticaBold);}
 const logo=await doc.embedJpg(logoBytes),page=doc.addPage([595.28,841.89]),left=30,right=565.28,width=right-left;
 const red=rgb(.718,.114,.29),dark=rgb(.416,.086,.098),green=rgb(.58,.765,.337),ink=rgb(.16,.16,.16),muted=rgb(.38,.38,.35),line=rgb(.86,.88,.83),pale=rgb(.96,.974,.935);
 const clean=s=>String(s??'').normalize('NFC').replace(/[\u2010-\u2015]/g,'-').replace(/[\u00a0\u202f]/g,' ').replace(/→|↗|↓/g,'').replace(/[^\x20-\x7e\u00a0-\u00ff\u20ac\u2018\u2019\u201c\u201d\u2022\u2026\n]/g,' ');
 const measure=(s,size,b=false)=>(b?bold:font).widthOfTextAtSize(clean(s),size);
 function draw(s,x,y,size=8,b=false,color=ink){page.drawText(clean(s),{x,y,size,font:b?bold:font,color});}
 function wrap(s,max,size,b=false){const out=[];for(const para of clean(s).split('\n')){let row='';for(const word of para.split(/\s+/).filter(Boolean)){if(row&&measure(row+' '+word,size,b)>max){out.push(row);row='';}if(measure(word,size,b)>max){for(const ch of word){if(measure(row+ch,size,b)>max){out.push(row);row='';}row+=ch;}}else row=row?row+' '+word:word;}if(row)out.push(row);}return out;}
 function box(s,x,top,max,{size=8,min=size,lines=2,leading=1.3,b=false,color=ink}={}){let rows=wrap(s,max,size,b);while(rows.length>lines&&size>min){size=Math.max(min,size-.2);rows=wrap(s,max,size,b);}if(rows.length>lines)throw new Error('De tekst past niet op één A4.');rows.forEach((row,i)=>draw(row,x,top-size-i*size*leading,size,b,color));return top-rows.length*size*leading;}
 function rect(x,y,w,h,color,border){page.drawRectangle({x,y,width:w,height:h,color,...(border?{borderColor:border,borderWidth:.5}:{})});}
 function link(label,url,x,y,size=7){draw(label,x,y,size,true,red);page.node.addAnnot(doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[x,y-2,x+measure(label,size,true),y+size+2],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(url)}}));}
 function score(value,denominator,x,y){const p=numberParts(value);draw(p.integer,x,y,25,true,dark);x+=measure(p.integer,25,true);if(p.decimal){draw(p.decimal,x,y,11,true,dark);x+=measure(p.decimal,11,true)+1;}if(denominator)draw('/'+denominator,x,y,17,true,dark);}
 rect(0,836,595.28,6,red);page.drawImage(logo,{x:left,y:785,width:155,height:41.55});draw('GEMEENTESPIEGEL 2026-2030',388,810,7,true,dark);
 let nameSize=24;while(measure(r.m.name,nameSize,true)>width&&nameSize>14)nameSize-=.5;box(r.m.name,left,779,width,{size:nameSize,min:10,lines:2,leading:1.05,b:true,color:dark});
 draw(`Vergeleken met ${v.reference}${r.m.upload?' | Indicatieve scan':''}`,left,733,8.5,false,muted);
 const cw=width/4,metrics=[{value:r.m.total,den:30,label:r.m.upload?'Totaalscore* - indicatief':'Totaalscore*'},{value:r.rank,label:r.m.upload?'Vergelijkingsplek naast 85 gemeenten':'Gedeelde plek van 85 gemeenten'},{value:r.mean,den:30,label:'Gemiddelde van 85 gemeenten'},{value:r.breadth,den:10,label:'Mobiliteitsthema’s aanwezig'}];
 metrics.forEach((m,i)=>{const x=left+i*cw;rect(x,651,cw,67,i===0?rgb(.977,.93,.948):rgb(1,1,1),line);rect(x,715,cw,3,red);score(m.value,m.den,x+10,681);box(m.label,x+10,673,cw-18,{size:7.2,lines:2,leading:1.25,b:true,color:dark});});
 box(v.footnote,left,642,width,{size:6.1,lines:2,leading:1.3,color:muted});
 if(r.m.upload)draw('* Nieuwe upload: automatische scan. Controleer de passages en scores.',left,616,6.1,true,red);
 draw('Uw profiel in één oogopslag',left,601,11.5,true,dark);box(v.profile,left,594,width,{size:8.5,min:7.5,lines:2,leading:1.25});
 const baseline=526,plotLeft=left+8,plotW=width-16;
 // The view model carries these scores on browser export; Node callers can supply the same fixed population.
 const scores=r.referenceScores||[];
 if(scores.length){const count={};for(const value of scores){const k=Math.round(value);count[k]=(count[k]||0)+1;}const step=Math.min(3,36/Math.max(...Object.values(count))),stack={};for(const value of scores){const k=Math.round(value),n=stack[k]||0;stack[k]=n+1;page.drawCircle({x:plotLeft+value/30*plotW,y:baseline+3+n*step,size:1.6,color:rgb(.43,.53,.33),opacity:.72});}}
 page.drawLine({start:{x:plotLeft,y:baseline},end:{x:plotLeft+plotW,y:baseline},thickness:.5,color:line});const mx=plotLeft+r.m.total/30*plotW;page.drawLine({start:{x:mx,y:baseline},end:{x:mx,y:566},thickness:1.2,color:red});const marker='Uw score '+r.m.total.toLocaleString('nl-NL');draw(marker,Math.max(plotLeft,Math.min(mx-measure(marker,6.5)/2,right-measure(marker,6.5))),568,6.5,true,red);
 draw('0',plotLeft,515,6.2,false,muted);draw('15',plotLeft+plotW/2-4,515,6.2,false,muted);draw('30',plotLeft+plotW-8,515,6.2,false,muted);draw('Elke stip is één gemeente.',left+95,515,6.2,false,muted);
 draw('Uw thema’s naast het onderzoeksbeeld',left,491,11.5,true,dark);draw('Thema',left,474,7.3,true,dark);draw('Uitwerking in het akkoord - 0-3',236,476,7.1,true,dark);rect(236,462,7,3,red);draw('Uw gemeente',247,460,6.2);rect(302,462,7,3,green);draw('Gemiddelde van 85 akkoorden',313,460,6.2);box('Genoemd in de\n85 akkoorden',482,482,83,{size:6.6,lines:2,b:true,color:dark});
 page.drawLine({start:{x:left,y:451},end:{x:right,y:451},thickness:1.3,color:green});
 for(const [i,t] of v.themes.entries()){const top=445-i*20,y=top-12;box(t.short,left,top-2,196,{size:7.8,min:7.3,lines:2,leading:1.05,b:true});rect(236,top-8,177,3,rgb(.94,.94,.92));if(t.level)rect(236,top-8,177*t.level/3,3,red);rect(236,top-14,177,3,rgb(.94,.94,.92));if(t.mean)rect(236,top-14,177*t.mean/3,3,green);draw(`${t.level}/3`,424,y,7.8,true,dark);const pct=Math.round(t.percent)+'%';draw(pct,484,y,9,true,dark);draw(`${t.count}/85`,531,y,6.2,false,muted);page.drawLine({start:{x:left,y:top-19},end:{x:right,y:top-19},thickness:.35,color:line});}
 draw(v.scale,left,233,6.2,false,muted);
 draw('Welke opgaven kunt u verder verkennen?',left,212,11.5,true,dark);
 if(v.priorities.length){const n=v.priorities.length,gap=8,w=(width-gap*(n-1))/n;for(const [i,t] of v.priorities.entries()){const x=left+i*(w+gap);rect(x,86,w,112,pale,line);rect(x,195,w,3,green);const end=box(t.short,x+8,188,w-16,{size:8.5,min:7.7,lines:2,b:true,color:dark});const badgeTop=end-3;const after=box(t.status+'\nWel in '+t.presence,x+8,badgeTop,w-16,{size:6,lines:3,leading:1.2,color:muted});box(t.description+' '+t.question,x+8,after-5,w-16,{size:7.1,min:6.1,lines:5,leading:1.25});link(t.groupInfo.name,t.groupInfo.url,x+8,93,6.4);}}
 else{rect(left,123,width,65,pale);box('Alle tien thema’s zijn uitgewerkt in maatregelen of een programma. Bespreek mogelijke vervolgstappen met GNMI.',left+12,173,width-24,{size:9,lines:3});}
 draw('Vind aansluiting bij GNMI',left,71,10.5,true,dark);let nx=left,ny=55;for(const g of v.network){const w=measure(g.name,6.7,true)+14;if(nx+w>right){nx=left;ny-=15;}rect(nx,ny-3,w,13,pale,line);link(g.name,g.url,nx+7,ny,6.7);nx+=w+6;}
 const base='https://arwenvangestel-hue.github.io/gnmi-mobiliteitsagenda-2026/gemeentespiegel.html';const source=r.m.upload?base:base+'?gemeente='+encodeURIComponent(r.m.name);page.drawLine({start:{x:left,y:29},end:{x:right,y:29},thickness:.7,color:green});draw('Bron: GNMI-onderzoek | 17 september 2026',left,17,6.1,false,muted);link('Eigen passages, uitleg en aanmelden',source,405,17,6.1);
 return doc.save();
}
