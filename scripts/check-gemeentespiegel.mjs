import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {report,scan,updateUpload} from '../vergelijking/engine.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../vergelijking/onderzoek.json',import.meta.url)));
test('frozen population and evidence have the published size',()=>{
 assert.equal(data.municipalities.length,85);assert.equal(Object.keys(data.evidence).length,3672);
 assert.equal(data.municipalities.filter(m=>m.route==='Rechtstreeks').length,44);
 assert.equal(data.municipalities.filter(m=>m.route==='Via regio').length,41);
});
test('all municipality/cohort combinations have valid scores and evidence',()=>{
 for(const m of data.municipalities){assert.equal(m.total,m.a+m.b+m.c);
  for(const code of Object.keys(m.themes))for(const id of m.themes[code].ids)assert.ok(data.evidence[id]);
  for(const mode of ['all','direct','regional']){const r=report(data,m,mode);assert.equal(r.themes.length,11);assert.ok(r.themes.every(t=>t.percent>=0&&t.percent<=100));}
 }
});
test('Tilburg matches published score, shared rank and asset management gap',()=>{
 const m=data.municipalities.find(x=>x.name==='Tilburg'),r=report(data,m);
 assert.equal(m.total,27.5);assert.equal(m.rank,17);assert.equal(report(data,m,'direct').rank,17);
 assert.equal(r.rank,26);assert.equal(r.breadth,9);assert.equal(r.opportunities[0].code,'T10');
 assert.equal(r.themes.find(t=>t.code==='T10').count,57);
});
test('equal scores share one rank and regional averages never enter the pool',()=>{
 const full=data.municipalities.filter(m=>m.total===30);
 assert.ok(full.length>1);for(const m of full)assert.equal(report(data,m).rank,1);
 const m=data.municipalities.find(x=>x.route==='Via regio');assert.equal(report(data,m,'direct').known,false);
});
test('upload is kept outside the frozen population',()=>{
 const m=scan('Nieuw',[{page:'1',text:'We verbeteren verkeersveiligheid en investeren in een meerjarenprogramma voor onderhoud van wegen en bruggen.'}],'nieuw.pdf');
 assert.equal(m.themes.T10.level,3);assert.equal(report(data,m).known,false);assert.equal(data.municipalities.length,85);
 const old=m.total;updateUpload(m,'T10',0);assert.ok(m.total<old);assert.equal(m.total,m.a+m.b+m.c);
});
test('unrelated safety, recreation and sewer maintenance are excluded',()=>{
 const m=scan('Test',[{page:'1',text:'Wij stimuleren recreatief wandelen en fietsen als sport en toerisme. We investeren in veilige buurten. Het onderhoud van riolering en groen wordt beter.'}],'test.txt');
 for(const code of ['T01','T02','T10'])assert.equal(m.themes[code].level,0);
});
test('the strongest upload evidence remains visible beyond the first twelve matches',()=>{
 const text=Array(14).fill('We willen meer aandacht voor verkeersveiligheid.').join(' ')+' We investeren in een meerjarenprogramma voor verkeersveiligheid.';
 const m=scan('Test',[{page:'1',text}],'test.txt');assert.equal(m.themes.T01.level,3);
 assert.ok(m.themes.T01.ids.some(id=>m.evidence[id].level===3));
});
