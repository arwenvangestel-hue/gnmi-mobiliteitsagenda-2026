# Gemeentespiegel

Zelfstandige tweede pagina bij het GNMI-onderzoeksdossier. Werkt op GitHub Pages zonder server, API-sleutels, accounts of externe documentverwerking.

## Gegevens

`onderzoek.json` is reproduceerbaar opgebouwd uit de gepubliceerde CSV-exporten met `python scripts/build-gemeentespiegel.py`. De exports zijn opeenvolgende delen van één tabel; alleen het eerste deel heeft een kop. De bouwer controleert 85 gemeenten, 935 themascores en 3.672 gekoppelde passages. Oorspronkelijke scores en ranglijsten blijven ongewijzigd.

De standaardvergelijking gebruikt alle 85 individuele gemeentelijke akkoorden. Direct (44) en via regio (41) zijn apart te kiezen. Gemeentelijke en regionale gemiddelden worden niet gemengd. Gelijke totaalscores delen een rang. De oorspronkelijke rang binnen de eigen onderzoeksgroep blijft apart zichtbaar.

## Nieuwe documenten

PDF.js leest PDF-tekst met de fysieke PDF-pagina. DOCX-tekst wordt uit `word/document.xml` gehaald; DOCX en TXT krijgen geen verzonnen paginanummers. Er zijn grenzen aan bestandsgrootte, tekstomvang en pagina-aantal. Een scan zonder tekstlaag wordt geweigerd met een OCR-melding. Documenten verlaten de browser niet en worden niet opgeslagen.

De lokale scan zoekt per thema naar expliciete patronen en doet een voorlopig intensiteitsvoorstel. Dit is geen semantische AI-analyse en geen volwaardige herhaling van het menselijk gecontroleerde onderzoek. Context, ontkenningen, opmaak en niet-herkende formuleringen kunnen de scan beïnvloeden. Scores en passages zijn zichtbaar en themascores kunnen worden aangepast. De A- en B-inschattingen zijn benaderingen van de rubricering; C-alt volgt de beschreven inklemming op maximaal 2. Elk uploadresultaat en de bijbehorende PDF zijn als indicatief gemarkeerd en veranderen de referentiedata niet.

## PDF en huisstijl

De PDF wordt lokaal met pdf-lib en ingesloten Open Sans-lettertypen gemaakt. Zij bevat vergelijking, themabalken, verkenningsvragen, bewijsvoorbeelden, eigen bewijsankers, methodetoelichting en klikbare GNMI-links. De bronvermelding noemt de gebruikte akkoordversie.

GNMI-groepsinformatie is gecontroleerd op 26 oktober 2026. Voor assetmanagement wordt GNMI Mobiliteit als contactroute genoemd; een zelfstandige assetmanagementgroep wordt niet als bestaand gepresenteerd.

## Controle

`node --test scripts/check-gemeentespiegel.mjs`

Aanvullend: browsercontrole van selectie, vergelijkingsgroep, eigen scan en correctie; PDF-download genereren en renderen; controle van desktop en smal scherm.

## Gebundelde software

- PDF.js 5.6.205 (Apache 2.0)
- pdf-lib 1.17.1 (MIT)
- @pdf-lib/fontkit 1.1.1 (MIT)
- JSZip 3.10.1 (MIT / GPLv3)
- Open Sans (SIL Open Font License; bestaande huisstijlfont)

Licenties staan bij de leveranciersbestanden en in `assets/fonts/OFL.txt`.
