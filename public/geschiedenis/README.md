# 🧭 Tijdreizigers — geschiedenis voor groep 4 t/m 8

Een mobile-first, app-klare leeromgeving voor het vak **geschiedenis** op de
Nederlandse basisschool (groep 4 t/m 8, ± 7–12 jaar). Dit is een **testplatform**:
per groep is één module volledig uitgewerkt, zodat het concept gevalideerd kan
worden voordat het curriculum verder wordt uitgebreid.

## Starten

Geen backend, geen build-stap. Twee opties:

1. **Direct openen**: open `index.html` in een browser.
2. **Via een webserver** (nodig voor sommige browsers op mobiel):
   ```bash
   npx serve public/geschiedenis
   # of: python3 -m http.server --directory public/geschiedenis 8080
   ```

Omdat de app in `public/` staat, serveert de Next.js-dev-server van deze repo
hem ook automatisch op `http://localhost:3000/geschiedenis/index.html`.

Alle voortgang wordt lokaal opgeslagen (`localStorage`), per leerlingprofiel.
Er gaan geen gegevens naar een server.

## Didactische opzet

Het curriculum is gebouwd op het kader van de **tien tijdvakken**
(commissie-De Rooy) en de **SLO-kerndoelen** voor Oriëntatie op jezelf en de
wereld (m.n. kerndoel 51: tijdbalk en tijdvakken, kerndoel 52: kenmerkende
aspecten, kerndoel 53: belangrijke personen en gebeurtenissen).

| Groep | Module | Tijdvakken | Accent |
|---|---|---|---|
| 4 | Vroeger en nu | intro + 1 | Tijdsbesef: vroeger/nu/later, eigen tijdlijn, jagers & eerste boeren |
| 5 | Van jagers tot ridders | 1–3 | Tijdbalk, hunebedden, Romeinen (limes), monniken & ridders |
| 6 | Steden, ontdekkers en hervormers | 4–5 | Stadsrechten, gilden, Hanze, boekdrukkunst, Columbus, Willem van Oranje & de Opstand |
| 7 | De Gouden Eeuw en daarna | 6–8 | Republiek, VOC én slavernij, Rembrandt/De Ruyter, Franse tijd, stoommachines & kinderarbeid |
| 8 | De twintigste eeuw | 9–10 | Wereldoorlogen, Anne Frank, wederopbouw, Watersnoodramp, Europa + **meesterproef over alle tijdvakken** |

De moeilijkheid loopt op met de leeftijd:

- **Groep 4**: heel korte zinnen, veel beeld, geen jaartallen.
- **Groep 5/6**: iets langere teksten, eerste jaartallen en begrippen.
- **Groep 7/8**: meer diepgang, ook de schaduwkanten van de geschiedenis
  (slavernij, kinderarbeid, Jodenvervolging) leeftijdsgericht behandeld.

Elke module heeft expliciete **leerdoelen** en ±5 korte lessen (±10 min) met
een vaste opbouw: uitlegkaarten afgewisseld met interactieve oefeningen.
Lessen binnen een module worden lineair vrijgespeeld.

## Werkvormen (allemaal tik-gebaseerd, geen typwerk)

- **Uitlegkaart** — korte tekst, groot beeld, "weetje".
- **Quiz** — meerkeuze, ook als beeldraster (plaatjes kiezen).
- **Waar / niet waar** — stelling met twee grote knoppen.
- **Tijdlijn sorteren** — kaartjes in chronologische volgorde tikken;
  goede kaartjes worden groen vergrendeld, foute mag je opnieuw proberen.
- **Matchen** — paren zoeken over twee kolommen met directe feedback.

Scoring: 0 fouten → ⭐⭐⭐, ≤ 2 fouten → ⭐⭐, anders ⭐. Lessen zijn
herspeelbaar; de hoogste score telt.

## Voortgang per leerling

Meerdere leerlingprofielen (naam + dier-avatar) op één apparaat. Per leerling
is zichtbaar: lessen af per groep, sterren per les en het totaal van de reis
(scherm **Voortgang**). Het scherm **Tijdbalk** toont de tien tijdvakken als
naslag.

## Technische opzet

```
public/geschiedenis/
├── index.html          # schil, laadt alles
├── css/stijl.css       # mobile-first, grote tapdoelen (min. 48–56px)
└── js/
    ├── tijdvakken.js   # de tien tijdvakken (gedeelde data)
    ├── app.js          # engine: router, profielen, opslag, lesspeler
    └── data/
        ├── groep4.js … groep8.js   # één module per groep (pure data)
```

- Vanilla JS (ES5-compatibel), geen dependencies, geen build-stap.
- Alle beelden zijn emoji: geen assets, werkt offline, laadt direct.
- Hash-routing (`#/groep/groep6`, `#/les/g6l3`, …) zodat terug-knop en
  verversen gewoon werken.

### Een les of module toevoegen

Content is pure data. Voeg in `js/data/groepN.js` een les toe aan `lessen`
met een reeks `stappen`; de engine kent vijf staptypes:

```js
{ type: "uitleg",       titel, beeld, tekst: ["<p>-teksten"], weetje }
{ type: "quiz",         vraag, opties: [{tekst, beeld}], juist: 0, uitleg, raster: true|false }
{ type: "waarnietwaar", stelling, beeld, juist: true|false, uitleg }
{ type: "sorteer",      opdracht, items: [/* in de juiste volgorde */] }
{ type: "match",        opdracht, paren: [[links, rechts], …] }
```

Nieuwe modules push je naar `window.CURRICULUM` en registreer je met een
extra `<script>`-tag in `index.html` — verder is er niets nodig.
