# Gemeentespiegel

Tweede pagina bij het GNMI-onderzoeksdossier. De openbare vergelijking gebruikt steeds dezelfde 85 onderzochte gemeenteakkoorden. Scores en data uit het oorspronkelijke onderzoek blijven ongewijzigd.

## Eén overzicht op web en PDF

`presentation.mjs` levert dezelfde inhoud aan de webpagina en de PDF: vier kerncijfers, een gemeenteprofiel, tien inhoudelijke thema’s, maximaal drie verkenningsvragen en passende GNMI-links. De PDF is één A4. Achtergrondinformatie en passages uit het eigen akkoord blijven op de webpagina uitklapbaar. Voorbeelden en citaten van andere gemeenten worden niet getoond.

De themabalken vergelijken de mate van uitwerking op de schaal 0–3. Een aparte kolom toont in hoeveel van de 85 akkoorden het thema wordt genoemd. Dit percentage is geen gemeentelijke score. Gelijke totaalscores delen een plek. Decimalen worden kleiner weergegeven; de oorspronkelijke deelrang en de A/B/C-deelscores staan niet in het overzicht.

## Data en uploads

`python scripts/build-gemeentespiegel.py` bouwt de datasnapshot opnieuw uit de openbare CSV-exporten en controleert 85 gemeenten, 935 themascores en 3.672 passages.

PDF.js leest PDF-tekst met paginaverwijzingen. DOCX en TXT krijgen geen verzonnen paginanummers. Bestanden blijven in de browser. Er zijn grenzen voor bestandsgrootte, tekstomvang en pagina-aantal; een scan zonder tekstlaag heeft eerst OCR nodig.

Nieuwe documenten krijgen een indicatieve lokale tekstscan. Context, ontkenningen en niet-herkende formuleringen kunnen de scan beïnvloeden. Gebruikers kunnen passages controleren en scores aanpassen. Uploads veranderen de 85 referentieakkoorden niet. De berekening benadert de onderzoeksrubriek en vervangt de menselijke controle niet.

## Controle

- `node --test scripts/check-gemeentespiegel.mjs`
- `node --test scripts/check-gemeentespiegel-pdf.mjs`
- Render de PDF voor visuele controle en controleer de website op breed en smal scherm.

## Software

Gebundeld: PDF.js 5.6.205, pdf-lib 1.17.1, @pdf-lib/fontkit 1.1.1 en JSZip 3.10.1. Leverancierslicenties staan in `vendor/`. De bestaande GNMI-huisstijl gebruikt Open Sans onder de SIL Open Font License; zie `assets/fonts/OFL.txt`.
