/* ============================================================
   Module groep 5 (8–9 jaar) — "Van jagers tot ridders"
   Tijdvak 1 t/m 3: jagers en boeren, Grieken en Romeinen,
   monniken en ridders. Iets meer tekst, nog steeds veel beeld.
   ============================================================ */
window.CURRICULUM.push({
  id: "groep5",
  groep: 5,
  titel: "Van jagers tot ridders",
  emoji: "🏰",
  kleur: "#6d9dc5",
  omschrijving: "Reis van de hunebedden naar de Romeinse soldaten en de kastelen van de ridders!",
  tijdvakken: [1, 2, 3],
  doelen: [
    "Je kent de tijdbalk met de tien tijdvakken en weet dat 100 jaar een eeuw heet.",
    "Je weet wat historische bronnen zijn en wat een archeoloog doet.",
    "Je weet wat hunebedden zijn en wie ze bouwden.",
    "Je weet wat de oude Grieken ons brachten, zoals de democratie.",
    "Je weet dat de Romeinen lang geleden in Nederland waren.",
    "Je weet hoe monniken en ridders leefden.",
    "Je kunt gebeurtenissen in de goede volgorde zetten."
  ],
  lessen: [
    {
      id: "g5l1",
      titel: "De tijdbalk van de geschiedenis",
      emoji: "📏",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Tien tijdvakken",
          beeld: "📏",
          tekst: [
            "De geschiedenis is heel lang. Daarom knippen we hem in stukken: <strong>tien tijdvakken</strong>.",
            "Elk tijdvak heeft een naam. Zoals de <strong>tijd van jagers en boeren</strong>, of de <strong>tijd van monniken en ridders</strong>.",
            "Op een tijdbalk staan ze op een rij: van heel lang geleden (links) tot nu (rechts)."
          ],
          weetje: "Alle scholen in Nederland gebruiken deze tien tijdvakken. Kijk maar bij de knop 'Tijdbalk'!"
        },
        {
          type: "quiz",
          vraag: "Hoeveel tijdvakken heeft de tijdbalk?",
          opties: [
            { tekst: "Drie", beeld: "3️⃣" },
            { tekst: "Tien", beeld: "🔟" },
            { tekst: "Honderd", beeld: "💯" }
          ],
          juist: 1,
          uitleg: "Tien tijdvakken! Van de tijd van jagers en boeren tot de tijd van televisie en computer."
        },
        {
          type: "uitleg",
          titel: "Honderd jaar = een eeuw",
          beeld: "💯",
          tekst: [
            "Een periode van <strong>100 jaar</strong> noemen we een <strong>eeuw</strong>.",
            "Als iets '400 jaar geleden' gebeurde, zeg je ook wel: <strong>vier eeuwen</strong> geleden.",
            "Jij leeft nu in de <strong>21e eeuw</strong>. Je opa en oma zijn geboren in de 20e eeuw."
          ]
        },
        {
          type: "quiz",
          vraag: "Hoeveel jaar duurt één eeuw?",
          opties: [
            { tekst: "10 jaar", beeld: "🔟" },
            { tekst: "100 jaar", beeld: "💯" },
            { tekst: "1000 jaar", beeld: "😱" }
          ],
          juist: 1,
          uitleg: "Een eeuw is 100 jaar. Tien eeuwen samen (1000 jaar) heten een millennium!"
        },
        {
          type: "uitleg",
          titel: "Voor en na Christus",
          beeld: "🗓️",
          tekst: [
            "Wij tellen de jaren vanaf de geboorte van Christus, ongeveer 2000 jaar geleden.",
            "Dingen van dáárvoor noemen we <strong>voor Christus</strong> (v.Chr.).",
            "Hoe groter het getal v.Chr., hoe langer geleden. 3000 v.Chr. is dus ouder dan 100 v.Chr.!"
          ]
        },
        {
          type: "sorteer",
          opdracht: "Zet de eerste vier tijdvakken op volgorde!",
          items: [
            { tekst: "Jagers en boeren", beeld: "🏹" },
            { tekst: "Grieken en Romeinen", beeld: "🏛️" },
            { tekst: "Monniken en ridders", beeld: "🏰" },
            { tekst: "Steden en staten", beeld: "🏘️" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Het jaar 3000 v.Chr. is langer geleden dan het jaar 100 v.Chr.",
          beeld: "🗓️",
          juist: true,
          uitleg: "Goed! Bij 'voor Christus' tellen we terug: hoe groter het getal, hoe langer geleden."
        }
      ]
    },
    {
      id: "g5bronnen",
      titel: "Speuren naar vroeger",
      emoji: "🔍",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Hoe weten we dat allemaal?",
          beeld: "🔍",
          tekst: [
            "Niemand van nu was erbij, duizenden jaren geleden. Hoe weten we dan hoe het toen was?",
            "Door <strong>bronnen</strong>: alles wat is overgebleven uit het verleden en ons iets vertelt.",
            "Bronnen zijn bijvoorbeeld <strong>voorwerpen</strong> (potten, munten), <strong>gebouwen</strong>, <strong>afbeeldingen</strong> (schilderijen, foto's) en <strong>geschreven teksten</strong> (brieven, dagboeken)."
          ],
          weetje: "Ook verhalen van opa en oma over vroeger zijn bronnen. Dat heet een mondelinge bron."
        },
        {
          type: "quiz",
          vraag: "Wat is een historische bron?",
          opties: [
            { tekst: "Iets uit het verleden waarvan we over vroeger leren", beeld: "🏺" },
            { tekst: "Een fontein met heel oud water", beeld: "⛲" },
            { tekst: "Alleen hele dikke geschiedenisboeken", beeld: "📚" }
          ],
          juist: 0,
          uitleg: "Een pot, een munt, een foto, een brief: alles uit het verleden dat ons iets vertelt, is een bron."
        },
        {
          type: "uitleg",
          titel: "De archeoloog: speurneus in de grond",
          beeld: "⛏️",
          tekst: [
            "Een <strong>archeoloog</strong> graaft heel voorzichtig in de grond, op zoek naar sporen van vroeger.",
            "Scherven, botten, munten, oude muren: elk vondstje is een puzzelstukje van het verleden.",
            "Veel vondsten kun je bekijken in het <strong>museum</strong>. Daar worden bronnen veilig bewaard."
          ],
          weetje: "De tijd voordat mensen konden schrijven heet de prehistorie. Daaruit bestaan alleen voorwerpen als bron, geen teksten!"
        },
        {
          type: "quiz",
          vraag: "Wie graaft oude spullen op om het verleden te onderzoeken?",
          raster: true,
          opties: [
            { tekst: "Een archeoloog", beeld: "⛏️" },
            { tekst: "Een piloot", beeld: "✈️" },
            { tekst: "Een bakker", beeld: "🥖" },
            { tekst: "Een kapper", beeld: "✂️" }
          ],
          juist: 0,
          uitleg: "De archeoloog! Die onderzoekt voorwerpen uit de grond, laagje voor laagje."
        },
        {
          type: "match",
          opdracht: "Wat leer je van elke bron? Maak de paren!",
          paren: [
            [{ tekst: "Oude munt", beeld: "🪙" }, { tekst: "wie er de baas was", beeld: "👑" }],
            [{ tekst: "Etensresten en botten", beeld: "🦴" }, { tekst: "wat mensen aten", beeld: "🍖" }],
            [{ tekst: "Oude foto", beeld: "📷" }, { tekst: "hoe mensen eruitzagen", beeld: "👒" }],
            [{ tekst: "Dagboek", beeld: "📔" }, { tekst: "wat iemand meemaakte en dacht", beeld: "💭" }]
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Uit de prehistorie bestaan geen geschreven bronnen.",
          beeld: "📜",
          juist: true,
          uitleg: "Klopt! 'Prehistorie' betekent: vóór het schrift. Alles wat we weten komt uit voorwerpen, zoals de hunebedden. Daarover gaat de volgende les!"
        }
      ]
    },
    {
      id: "g5l2",
      titel: "Hunebedden: stenen reuzengraven",
      emoji: "🪨",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "De hunebedbouwers",
          beeld: "🪨",
          tekst: [
            "In <strong>Drenthe</strong> liggen enorme stapels stenen: de <strong>hunebedden</strong>.",
            "Ze zijn meer dan <strong>5000 jaar oud</strong>! Boeren bouwden ze als graf voor hun doden.",
            "Sommige stenen zijn zo zwaar als een vrachtwagen. En dat zonder machines!"
          ],
          weetje: "Er zijn nog 52 hunebedden in Nederland. Bijna allemaal liggen ze in Drenthe."
        },
        {
          type: "quiz",
          vraag: "Wat is een hunebed?",
          opties: [
            { tekst: "Een bed voor reuzen", beeld: "🛏️" },
            { tekst: "Een graf van grote stenen", beeld: "🪨" },
            { tekst: "Een oud kasteel", beeld: "🏰" }
          ],
          juist: 1,
          uitleg: "Een hunebed is een graf van reusachtige stenen, gebouwd door de eerste boeren."
        },
        {
          type: "quiz",
          vraag: "In welke provincie liggen de meeste hunebedden?",
          raster: true,
          opties: [
            { tekst: "Drenthe", beeld: "🪨" },
            { tekst: "Zuid-Holland", beeld: "🌷" },
            { tekst: "Limburg", beeld: "⛰️" },
            { tekst: "Friesland", beeld: "🐄" }
          ],
          juist: 0,
          uitleg: "In Drenthe! Daar lagen vroeger grote zwerfstenen, meegebracht door het ijs uit de ijstijd."
        },
        {
          type: "uitleg",
          titel: "Hoe kregen ze dat voor elkaar?",
          beeld: "🪵",
          tekst: [
            "Machines bestonden nog niet. Hoe tilden ze dan die zware stenen?",
            "Slim! Ze rolden de stenen over <strong>boomstammen</strong> en trokken met veel mensen tegelijk aan touwen.",
            "Daarna maakten ze een heuvel van zand en schoven de dekstenen er bovenop."
          ]
        },
        {
          type: "sorteer",
          opdracht: "Hoe bouw je een hunebed? Zet op volgorde!",
          items: [
            { tekst: "Grote stenen zoeken", beeld: "🪨" },
            { tekst: "Stenen rollen over boomstammen", beeld: "🪵" },
            { tekst: "Stenen rechtop zetten", beeld: "🧱" },
            { tekst: "Deksteen er bovenop", beeld: "⛰️" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "De hunebedden zijn gebouwd door reuzen.",
          beeld: "🧌",
          juist: false,
          uitleg: "Vroeger dachten mensen dat echt! Maar het waren gewone mensen: sterke, slimme boeren."
        }
      ]
    },
    {
      id: "g5grieken",
      titel: "De oude Grieken",
      emoji: "🏛️",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Slimme koppen aan zee",
          beeld: "🏛️",
          tekst: [
            "Zo'n 2500 jaar geleden woonden de <strong>oude Grieken</strong> in Griekenland, ver van Nederland.",
            "Ze woonden in <strong>stadstaten</strong>: steden met eigen regels, zoals <strong>Athene</strong> en <strong>Sparta</strong>.",
            "Ze bouwden prachtige <strong>tempels</strong> voor hun goden en waren dol op verhalen, sport en slimme vragen."
          ],
          weetje: "Tijdvak 2 heet 'tijd van Grieken en Romeinen'. De Grieken waren er eerst; de Romeinen namen later veel van hun ideeën over."
        },
        {
          type: "uitleg",
          titel: "De uitvinding van de democratie",
          beeld: "🗳️",
          tekst: [
            "In Athene bedachten ze iets bijzonders: de burgers mochten <strong>meebeslissen</strong> over de stad.",
            "Dat heet <strong>democratie</strong>: het volk regeert. Nederland is nu ook een democratie!",
            "Eerlijk was het nog niet helemaal: vrouwen en slaven mochten in Athene níet meestemmen."
          ]
        },
        {
          type: "quiz",
          vraag: "Wat betekent democratie?",
          opties: [
            { tekst: "Het volk mag meebeslissen", beeld: "🗳️" },
            { tekst: "Eén koning beslist alles", beeld: "👑" },
            { tekst: "Niemand mag iets beslissen", beeld: "🤷" }
          ],
          juist: 0,
          uitleg: "Democratie = het volk regeert. Die Griekse uitvinding gebruiken wij nog elke dag."
        },
        {
          type: "uitleg",
          titel: "Sport en wetenschap",
          beeld: "🏅",
          tekst: [
            "Eens in de vier jaar hielden de Grieken grote sportwedstrijden ter ere van de god Zeus: de <strong>Olympische Spelen</strong>.",
            "Griekse denkers (<strong>filosofen</strong>) stelden overal vragen over: Hoe werkt de wereld? Wat is eerlijk?",
            "Zo begon de <strong>wetenschap</strong>. Ook het theater hebben we van de Grieken!"
          ],
          weetje: "De Olympische Spelen bestaan nog steeds, al meer dan 2500 jaar later!"
        },
        {
          type: "match",
          opdracht: "Wat gaven de Grieken ons? Maak de paren!",
          paren: [
            [{ tekst: "Democratie", beeld: "🗳️" }, { tekst: "burgers beslissen mee", beeld: "🙋" }],
            [{ tekst: "Olympische Spelen", beeld: "🏅" }, { tekst: "sport voor de god Zeus", beeld: "⚡" }],
            [{ tekst: "Filosofen", beeld: "🤔" }, { tekst: "het begin van de wetenschap", beeld: "🔬" }],
            [{ tekst: "Theater", beeld: "🎭" }, { tekst: "toneelspelen", beeld: "😄" }]
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "De Olympische Spelen zijn bedacht door de oude Grieken.",
          beeld: "🏅",
          juist: true,
          uitleg: "Klopt! En nog iets: hierna leerden de Romeinen veel van de Grieken. Die komen in de volgende les naar Nederland!"
        }
      ]
    },
    {
      id: "g5l3",
      titel: "De Romeinen in Nederland",
      emoji: "🛡️",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Een reusachtig rijk",
          beeld: "🏛️",
          tekst: [
            "Zo'n 2000 jaar geleden hadden de <strong>Romeinen</strong> een enorm rijk. Het begon in Rome, in Italië.",
            "Hun leger veroverde heel veel landen. Ook een stuk van <strong>Nederland</strong>!",
            "De grens van het rijk lag bij de rivier de <strong>Rijn</strong>. Die grens heette de <strong>limes</strong>."
          ],
          weetje: "Utrecht en Nijmegen zijn begonnen als Romeinse legerplaatsen!"
        },
        {
          type: "quiz",
          vraag: "Welke rivier was de grens van het Romeinse rijk in Nederland?",
          opties: [
            { tekst: "De Rijn", beeld: "🌊" },
            { tekst: "De Amazone", beeld: "🌴" },
            { tekst: "Het Kanaal", beeld: "⛴️" }
          ],
          juist: 0,
          uitleg: "De Rijn! Ten zuiden van de Rijn was het Romeins. Die grens heette de limes."
        },
        {
          type: "uitleg",
          titel: "Romeinse soldaten",
          beeld: "🛡️⚔️",
          tekst: [
            "Romeinse soldaten waren goed getraind. Ze droegen een helm, een schild en een zwaard.",
            "Ze bouwden <strong>forten</strong> langs de grens en kaarsrechte <strong>wegen</strong> van steen.",
            "Over die wegen konden soldaten en handelaars snel reizen. Sommige wegen bestaan nog steeds!"
          ]
        },
        {
          type: "match",
          opdracht: "Wat brachten de Romeinen mee? Maak de paren!",
          paren: [
            [{ tekst: "Rechte wegen", beeld: "🛣️" }, { tekst: "snel reizen", beeld: "🐎" }],
            [{ tekst: "Forten", beeld: "🏯" }, { tekst: "de grens bewaken", beeld: "🛡️" }],
            [{ tekst: "Schrift", beeld: "✍️" }, { tekst: "dingen opschrijven", beeld: "📜" }],
            [{ tekst: "Munten", beeld: "🪙" }, { tekst: "betalen", beeld: "🛒" }]
          ]
        },
        {
          type: "quiz",
          vraag: "Hoe heette de grens van het Romeinse rijk?",
          opties: [
            { tekst: "De limes", beeld: "🚧" },
            { tekst: "De dijk", beeld: "🌊" },
            { tekst: "De muur van Rome", beeld: "🧱" }
          ],
          juist: 0,
          uitleg: "De limes! Dat is Latijn voor 'grens'. Hij liep dwars door Nederland, langs de Rijn."
        },
        {
          type: "uitleg",
          titel: "Wonen als een Romein",
          beeld: "🏺",
          tekst: [
            "De Romeinen brachten nieuwe dingen mee: <strong>steden</strong>, badhuizen, munten en het <strong>schrift</strong>.",
            "Omdat ze schreven, weten wij nu veel over die tijd. De geschiedenis met schrift noemen we ook wel de <strong>historie</strong>.",
            "Rond het jaar 400 vertrokken de Romeinen weer uit Nederland."
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "De Romeinen veroverden heel Nederland.",
          beeld: "🗺️",
          juist: false,
          uitleg: "Nee! Alleen het deel ten zuiden van de Rijn was Romeins. Daarboven woonden Friezen en andere volken."
        }
      ]
    },
    {
      id: "g5l4",
      titel: "Monniken en ridders",
      emoji: "🏰",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Na de Romeinen",
          beeld: "🏰",
          tekst: [
            "Toen de Romeinen weg waren, begon de tijd van <strong>monniken en ridders</strong> (500–1000).",
            "Er waren geen grote steden meer. De meeste mensen waren arme boeren.",
            "Machtige heren bouwden <strong>kastelen</strong>. Hun soldaten te paard heetten <strong>ridders</strong>."
          ]
        },
        {
          type: "quiz",
          vraag: "Wat droeg een ridder om zich te beschermen?",
          raster: true,
          opties: [
            { tekst: "Een harnas", beeld: "🛡️" },
            { tekst: "Een regenjas", beeld: "🧥" },
            { tekst: "Een voetbalshirt", beeld: "👕" },
            { tekst: "Een duikpak", beeld: "🤿" }
          ],
          juist: 0,
          uitleg: "Een harnas van metaal! Met helm, schild en zwaard. Zo'n uitrusting was heel duur."
        },
        {
          type: "uitleg",
          titel: "Monniken: schrijvers en helpers",
          beeld: "✍️📿",
          tekst: [
            "<strong>Monniken</strong> waren mannen die hun leven aan God gaven. Ze woonden samen in een <strong>klooster</strong>.",
            "Monniken konden <strong>lezen en schrijven</strong>. Heel bijzonder, want bijna niemand kon dat!",
            "Ze schreven boeken over met de hand en hielpen zieke en arme mensen."
          ],
          weetje: "De monnik Willibrord kwam rond het jaar 690 naar Nederland om over het christendom te vertellen."
        },
        {
          type: "match",
          opdracht: "Wie hoort waarbij? Maak de paren!",
          paren: [
            [{ tekst: "Ridder", beeld: "🤺" }, { tekst: "kasteel", beeld: "🏰" }],
            [{ tekst: "Monnik", beeld: "📿" }, { tekst: "klooster", beeld: "⛪" }],
            [{ tekst: "Boer", beeld: "👨‍🌾" }, { tekst: "akker", beeld: "🌾" }],
            [{ tekst: "Koning", beeld: "👑" }, { tekst: "troon", beeld: "🪑" }]
          ]
        },
        {
          type: "quiz",
          vraag: "Wie konden er in deze tijd bijna als enige lezen en schrijven?",
          opties: [
            { tekst: "De ridders", beeld: "🤺" },
            { tekst: "De monniken", beeld: "📿" },
            { tekst: "De boeren", beeld: "👨‍🌾" }
          ],
          juist: 1,
          uitleg: "De monniken! In het klooster schreven ze hele boeken over, letter voor letter, met de hand."
        },
        {
          type: "waarnietwaar",
          stelling: "In de tijd van monniken en ridders waren de meeste mensen boer.",
          beeld: "👨‍🌾",
          juist: true,
          uitleg: "Klopt! Bijna iedereen werkte op het land. Ridders en monniken waren maar een klein groepje."
        }
      ]
    },
    {
      id: "g5l5",
      titel: "De grote terugblik",
      emoji: "🎯",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Wat weet jij al?",
          beeld: "🧠",
          tekst: [
            "Je hebt drie tijdvakken leren kennen: <strong>jagers en boeren</strong>, <strong>Grieken en Romeinen</strong> en <strong>monniken en ridders</strong>.",
            "En je weet hoe we dat allemaal wéten: door <strong>bronnen</strong> te onderzoeken!",
            "Tijd voor de grote test. Laat zien wat je weet!"
          ]
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: wat was er eerst?",
          items: [
            { tekst: "Jagers en verzamelaars", beeld: "🏹" },
            { tekst: "Hunebedbouwers", beeld: "🪨" },
            { tekst: "Oude Grieken", beeld: "🏛️" },
            { tekst: "Romeinse soldaten", beeld: "🛡️" },
            { tekst: "Ridders en monniken", beeld: "🏰" }
          ]
        },
        {
          type: "quiz",
          vraag: "Welke bron vertelt ons iets over de prehistorie (vóór het schrift)?",
          opties: [
            { tekst: "Opgegraven voorwerpen, zoals scherven", beeld: "🏺" },
            { tekst: "Oude kranten", beeld: "📰" },
            { tekst: "Filmpjes op internet", beeld: "🎬" }
          ],
          juist: 0,
          uitleg: "Uit de prehistorie zijn er geen teksten. Archeologen leren alles uit voorwerpen in de grond."
        },
        {
          type: "quiz",
          vraag: "Welke uitvinding van de Grieken gebruiken wij nog steeds?",
          opties: [
            { tekst: "De democratie", beeld: "🗳️" },
            { tekst: "De stoommachine", beeld: "🚂" },
            { tekst: "De televisie", beeld: "📺" }
          ],
          juist: 0,
          uitleg: "De democratie! Burgers die meebeslissen: dat bedachten ze in Athene."
        },
        {
          type: "match",
          opdracht: "Welk plaatje hoort bij welk tijdvak?",
          paren: [
            [{ tekst: "Jagers en boeren", beeld: "🏹" }, { tekst: "hunebed", beeld: "🪨" }],
            [{ tekst: "Grieken en Romeinen", beeld: "🏛️" }, { tekst: "de limes", beeld: "🚧" }],
            [{ tekst: "Monniken en ridders", beeld: "🏰" }, { tekst: "klooster", beeld: "⛪" }]
          ]
        },
        {
          type: "quiz",
          vraag: "Wat bouwden de eerste boeren in Drenthe?",
          opties: [
            { tekst: "Hunebedden", beeld: "🪨" },
            { tekst: "Kastelen", beeld: "🏰" },
            { tekst: "Piramides", beeld: "🔺" }
          ],
          juist: 0,
          uitleg: "Hunebedden! Stenen graven van meer dan 5000 jaar oud."
        },
        {
          type: "quiz",
          vraag: "Wie kwamen er ongeveer 2000 jaar geleden naar Nederland?",
          opties: [
            { tekst: "De ridders", beeld: "🤺" },
            { tekst: "De Romeinen", beeld: "🛡️" },
            { tekst: "De ontdekkingsreizigers", beeld: "⛵" }
          ],
          juist: 1,
          uitleg: "De Romeinen! Ze maakten de Rijn tot grens van hun grote rijk."
        },
        {
          type: "waarnietwaar",
          stelling: "Een monnik woonde in een klooster en kon lezen en schrijven.",
          beeld: "📿",
          juist: true,
          uitleg: "Helemaal goed! Jij bent klaar voor groep 6. Op naar de steden en de ontdekkers!"
        }
      ]
    }
  ]
});
