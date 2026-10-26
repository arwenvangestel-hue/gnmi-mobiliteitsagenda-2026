"""Build a traceable public snapshot from the frozen CSV exports (no recoding)."""
import csv, json, pathlib, re, html
ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / 'data_csv'

def table(name):
    rows = list(csv.reader((DATA / name).open(encoding='utf-8-sig', newline='')))
    return [dict(zip(rows[4], row)) for row in rows[5:] if row and row[0]]

def chunks(prefix):
    rows = []
    for f in sorted(DATA.glob(prefix + '_deel_*.csv')):
        for row in csv.reader(f.open(encoding='utf-8-sig', newline='')):
            rows.append((row, f.name))
    header = rows[4][0]
    return [(dict(zip(header, row)), f) for row, f in rows[5:] if row and row[0]]

sources = {}
for tr in re.findall(r'<tr>(.*?)</tr>', (ROOT / 'akkoorden.html').read_text(), re.S):
    name = re.search(r'<strong>(.*?)</strong>', tr)
    url = re.search(r'href="(https://[^"]+)"', tr)
    if name and url:
        sources[html.unescape(name[1])] = html.unescape(url[1])
evidence = {}
for row, f in chunks('bronnen_en_bewijs__bewijspassages'):
    evidence[row['Evidence-ID']] = {'id':row['Evidence-ID'], 'name':row['Gemeente'], 'page':row['PDF-pagina'],
        'text':row['Letterlijke passage'], 'level':int(row['Passage-intensiteit']), 'csv':f}
themes = [r for r in table('onderzoeksbestand__codeboom.csv') if re.fullmatch(r'T\d\d', r['Code'])]
theme_rows = {}
for row, f in chunks('onderzoeksbestand__thema_scores'):
    ids = [x.strip() for x in row['Bewijs-ID’s'].split(';') if x.strip()]
    assert all(i in evidence for i in ids), (row['Gemeente'],ids)
    theme_rows[(row['Gemeente'],row['Code'])] = {'level':int(row['Intensiteit']), 'ids':ids, 'csv':f}
rank = {r['Gemeente']: {'rank':int(r['Gedeelde rang']), 'order':int(r['Volgorde'])}
        for f in ['onderzoeksbestand__rang_direct.csv','onderzoeksbestand__rang_regiogem.csv'] for r in table(f)}
indicators = {r['Gemeente']:r for r in table('onderzoeksbestand__gnmi_indicatoren.csv')}
municipalities=[]
for r in table('onderzoeksbestand__scoreberekening.csv'):
    name=r['Gemeente']
    municipality={'name':name,'route':r['Route'],'region':r['Regio'],'province':r['Provincie'],
        'source':r['Bron-ID'],'file':r['Bestand'],'url':sources.get(name,''),
        'a':float(r['Score A']),'b':float(r['Score B']),'c':float(r['Score C-alt']),'total':float(r['Totaal']),
        'clusters':[int(indicators[name]['C'+str(i)]) for i in range(1,6)],
        'themes':{t['Code']:theme_rows[(name,t['Code'])] for t in themes}, **rank[name]}
    assert municipality['a']+municipality['b']+municipality['c']==municipality['total']
    municipalities.append(municipality)
assert len(municipalities)==85 and len(theme_rows)==935 and len(evidence)==3672
out={'version':'17 september 2026 / gemeentespiegel 26 oktober 2026','referenceDate':'15 augustus 2026',
     'municipalities':municipalities,'themes':[{k:r[k] for k in ['Code','Thema','Definitie','Inclusie','Exclusie','Zoektermen']} for r in themes],
     'evidence':evidence,'missing':['Edam-Volendam','Leidschendam-Voorburg','Leiden']}
(ROOT/'vergelijking'/'onderzoek.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')))
print(f'Verified snapshot: {len(municipalities)} gemeenten, {len(theme_rows)} themascores, {len(evidence)} passages')
