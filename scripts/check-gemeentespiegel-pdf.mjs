import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {report,scan} from '../vergelijking/engine.mjs';
import {makePDF} from '../vergelijking/pdf.mjs';
const require=createRequire(import.meta.url);
const lib=require('../vergelijking/vendor/pdf-lib.min.js'),fontkit=require('../vergelijking/vendor/fontkit.umd.min.js');
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url));
const data=JSON.parse(read('vergelijking/onderzoek.json'));
const fonts={fontkit,regular:read('assets/fonts/OpenSans-400.ttf'),bold:read('assets/fonts/OpenSans-700.ttf')};
test('PDF stays one A4 for decimal scores, many gaps, complete coverage and long names',async()=>{
 const cases=[...data.municipalities];
 cases.push(scan('Nieuwe gemeente met een lange naam',[{page:'1',text:'Cultuur en sport. Er staan hier geen mobiliteitsafspraken.'}],'eigen.txt'));
 for(const m of cases){const bytes=await makePDF(report(data,m),lib,read('assets/gnmi-logo.jpg'),fonts);const pdf=await lib.PDFDocument.load(bytes);assert.equal(pdf.getPages().length,1,m.name);const size=pdf.getPage(0).getSize();assert.equal(size.width,595.28);assert.equal(size.height,841.89);assert.ok(pdf.getPage(0).node.Annots().size()>0);}
});
