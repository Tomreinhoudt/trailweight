/* ============================================================
   Module groep 8 (11–12 jaar) — "De twintigste eeuw"
   Tijdvak 9 en 10: wereldoorlogen, televisie en computer.
   Meeste diepgang; serieuze onderwerpen leeftijdsgericht
   behandeld. Sluit af met de meesterproef over alle tijdvakken.
   ============================================================ */
window.CURRICULUM.push({
  id: "groep8",
  groep: 8,
  titel: "De twintigste eeuw",
  emoji: "🕊️",
  kleur: "#8b5cf6",
  omschrijving: "Twee wereldoorlogen, de wederopbouw en de wereld van televisie en computer. Plus: de grote meesterproef over álle tijdvakken!",
  tijdvakken: [9, 10],
  doelen: [
    "Je weet wat er in de Eerste Wereldoorlog gebeurde en dat Nederland neutraal bleef.",
    "Je weet wat de bezetting in de Tweede Wereldoorlog betekende en wat de Jodenvervolging was.",
    "Je kent het verhaal van Anne Frank en weet waarom herdenken belangrijk is.",
    "Je weet hoe Nederland na de oorlog werd opgebouwd en wat de Watersnoodramp was.",
    "Je kunt alle tien tijdvakken op volgorde zetten en herkennen."
  ],
  lessen: [
    {
      id: "g8l1",
      titel: "De Eerste Wereldoorlog",
      emoji: "🎖️",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "De Grote Oorlog (1914–1918)",
          beeld: "🎖️",
          tekst: [
            "In <strong>1914</strong> brak in Europa een enorme oorlog uit: de <strong>Eerste Wereldoorlog</strong>. Miljoenen soldaten vochten in <strong>loopgraven</strong>: lange gangen in de grond.",
            "Nieuwe wapens zoals machinegeweren en gifgas maakten de oorlog verschrikkelijk. Ongeveer <strong>tien miljoen soldaten</strong> stierven.",
            "<strong>Nederland deed niet mee</strong>: het bleef <strong>neutraal</strong>. Maar ook hier was het zwaar: eten was schaars en op de bon."
          ],
          weetje: "Eén miljoen Belgen vluchtte naar het neutrale Nederland toen België werd binnengevallen."
        },
        {
          type: "quiz",
          vraag: "Wat betekent 'neutraal blijven'?",
          opties: [
            { tekst: "Niet meevechten en geen partij kiezen", beeld: "🏳️" },
            { tekst: "Met beide kanten meevechten", beeld: "⚔️" },
            { tekst: "Stiekem meedoen", beeld: "🤫" }
          ],
          juist: 0,
          uitleg: "Nederland koos geen partij en vocht niet mee in de Eerste Wereldoorlog."
        },
        {
          type: "quiz",
          vraag: "Waar vochten de soldaten in de Eerste Wereldoorlog vooral?",
          opties: [
            { tekst: "In loopgraven", beeld: "🕳️" },
            { tekst: "In de lucht met straaljagers", beeld: "✈️" },
            { tekst: "Op ruimteschepen", beeld: "🚀" }
          ],
          juist: 0,
          uitleg: "In loopgraven: modderige gangen in de grond, tegenover elkaar. Jarenlang schoof het front amper op."
        },
        {
          type: "uitleg",
          titel: "Na de oorlog",
          beeld: "🗳️",
          tekst: [
            "In <strong>1918</strong> eindigde de oorlog. Duitsland verloor en moest enorm veel betalen. Veel Duitsers waren arm en boos — dat werd later gevaarlijk.",
            "In Nederland veranderde er ook iets moois: in <strong>1919</strong> kregen <strong>vrouwen kiesrecht</strong>. Eindelijk mochten ook vrouwen stemmen!",
            "In de jaren '30 kwam er een wereldwijde <strong>crisis</strong>: veel mensen verloren hun werk."
          ]
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: 1914–1939.",
          items: [
            { tekst: "Begin Eerste Wereldoorlog (1914)", beeld: "🎖️" },
            { tekst: "Einde van de oorlog (1918)", beeld: "🕊️" },
            { tekst: "Vrouwenkiesrecht in Nederland (1919)", beeld: "🗳️" },
            { tekst: "Wereldwijde crisis (jaren '30)", beeld: "📉" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Nederland vocht mee in de Eerste Wereldoorlog.",
          beeld: "🎖️",
          juist: false,
          uitleg: "Nederland bleef neutraal. In de Tweede Wereldoorlog lukte dat helaas niet meer."
        }
      ]
    },
    {
      id: "g8l2",
      titel: "De Tweede Wereldoorlog",
      emoji: "✈️",
      duur: "±14 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Nederland bezet",
          beeld: "✈️",
          tekst: [
            "In Duitsland greep <strong>Adolf Hitler</strong> de macht. Hij gaf de Joden overal de schuld van en wilde meer land veroveren.",
            "Op <strong>10 mei 1940</strong> viel het Duitse leger Nederland binnen. Na het <strong>bombardement op Rotterdam</strong> gaf Nederland zich op 15 mei over.",
            "Vijf jaar lang was Nederland <strong>bezet</strong>: de Duitsers waren de baas. Er was steeds minder vrijheid en steeds minder eten."
          ]
        },
        {
          type: "quiz",
          vraag: "Wanneer viel Duitsland Nederland binnen?",
          opties: [
            { tekst: "10 mei 1940", beeld: "✈️" },
            { tekst: "5 mei 1945", beeld: "🎉" },
            { tekst: "1 januari 2000", beeld: "🎆" }
          ],
          juist: 0,
          uitleg: "Op 10 mei 1940. Na vijf dagen en het bombardement op Rotterdam gaf Nederland zich over."
        },
        {
          type: "uitleg",
          titel: "De Jodenvervolging en Anne Frank",
          beeld: "🕯️",
          tekst: [
            "De nazi's vervolgden de <strong>Joden</strong>. Joodse mensen mochten steeds minder en werden weggevoerd naar <strong>concentratiekampen</strong>, waar de meesten werden vermoord. Dit noemen we de <strong>Holocaust</strong>.",
            "Het Joodse meisje <strong>Anne Frank</strong> zat met haar familie ondergedoken in het <strong>Achterhuis</strong> in Amsterdam. Ze schreef daar haar beroemde <strong>dagboek</strong>.",
            "Anne werd verraden en stierf in een kamp. Haar dagboek wordt nu over de hele wereld gelezen, zodat we nooit vergeten. Het is een van de beroemdste <strong>historische bronnen</strong> ter wereld."
          ],
          weetje: "Van de 140.000 Joden in Nederland overleefden er ongeveer 38.000 de oorlog. Sommige Nederlanders hielpen onderduikers; dat was levensgevaarlijk verzet."
        },
        {
          type: "quiz",
          vraag: "Waarom is het dagboek van Anne Frank zo belangrijk?",
          opties: [
            { tekst: "Het laat zien wat oorlog en vervolging met mensen doen", beeld: "📖" },
            { tekst: "Het is het oudste boek van Nederland", beeld: "📜" },
            { tekst: "Het gaat over ridders en kastelen", beeld: "🏰" }
          ],
          juist: 0,
          uitleg: "Door Annes ogen begrijpen miljoenen mensen wat de Jodenvervolging betekende. Herdenken helpt herhaling voorkomen."
        },
        {
          type: "uitleg",
          titel: "Verzet, hongerwinter en bevrijding",
          beeld: "🕊️",
          tekst: [
            "Sommige Nederlanders pleegden <strong>verzet</strong>: ze verstopten onderduikers, maakten illegale krantjes of saboteerden de bezetter.",
            "De winter van 1944–1945 was de <strong>Hongerwinter</strong>: in het westen was bijna geen eten meer. Mensen aten zelfs tulpenbollen.",
            "Op <strong>5 mei 1945</strong> werd heel Nederland bevrijd. Daarom vieren we op 5 mei <strong>Bevrijdingsdag</strong>, en herdenken we op 4 mei alle oorlogsslachtoffers."
          ]
        },
        {
          type: "match",
          opdracht: "De oorlogsjaren: wat hoort bij elkaar?",
          paren: [
            [{ tekst: "10 mei 1940", beeld: "✈️" }, { tekst: "Duitse inval", beeld: "⚔️" }],
            [{ tekst: "Anne Frank", beeld: "📖" }, { tekst: "dagboek in het Achterhuis", beeld: "🏠" }],
            [{ tekst: "Hongerwinter", beeld: "❄️" }, { tekst: "1944–1945", beeld: "🥣" }],
            [{ tekst: "5 mei 1945", beeld: "🕊️" }, { tekst: "Bevrijdingsdag", beeld: "🎉" }]
          ]
        },
        {
          type: "sorteer",
          opdracht: "Zet de Tweede Wereldoorlog op volgorde.",
          items: [
            { tekst: "Duitse inval (10 mei 1940)", beeld: "✈️" },
            { tekst: "Anne Frank duikt onder (1942)", beeld: "🏠" },
            { tekst: "De Hongerwinter (1944–1945)", beeld: "❄️" },
            { tekst: "Bevrijding (5 mei 1945)", beeld: "🕊️" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Op 4 mei herdenken we de slachtoffers en op 5 mei vieren we de vrijheid.",
          beeld: "🕯️",
          juist: true,
          uitleg: "Klopt. Twee minuten stil op 4 mei om 20.00 uur, feest van de vrijheid op 5 mei."
        }
      ]
    },
    {
      id: "g8l3",
      titel: "Wederopbouw en de Watersnoodramp",
      emoji: "🏗️",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Nederland bouwt weer op",
          beeld: "🏗️",
          tekst: [
            "Na de oorlog was Nederland kapot en arm. Iedereen ging aan de slag: de <strong>wederopbouw</strong>.",
            "Amerika hielp Europa met geld: het <strong>Marshallplan</strong>. Fabrieken draaiden weer, overal verrezen nieuwe wijken.",
            "In deze tijd werd ook <strong>Indonesië onafhankelijk</strong> (1945–1949), tot dan een Nederlandse kolonie. Daar ging strijd aan vooraf."
          ]
        },
        {
          type: "quiz",
          vraag: "Wat betekent 'wederopbouw'?",
          opties: [
            { tekst: "Het land na de oorlog weer opbouwen", beeld: "🏗️" },
            { tekst: "Een nieuw soort belasting", beeld: "💶" },
            { tekst: "Oude gebouwen afbreken voor de lol", beeld: "🧨" }
          ],
          juist: 0,
          uitleg: "Huizen, bruggen, havens en fabrieken werden hersteld en nieuw gebouwd. Iedereen hielp mee."
        },
        {
          type: "uitleg",
          titel: "De Watersnoodramp van 1953",
          beeld: "🌊",
          tekst: [
            "In de nacht van <strong>1 februari 1953</strong> joeg een zware storm het zeewater over de dijken van Zeeland en Zuid-Holland.",
            "Dijken braken, dorpen verdronken. <strong>1836 mensen</strong> kwamen om. Het was de grootste ramp van de eeuw in Nederland.",
            "Daarna zei Nederland: <strong>dit nooit meer</strong>. De <strong>Deltawerken</strong> werden gebouwd: dammen en stormvloedkeringen die het land beschermen."
          ],
          weetje: "De Oosterscheldekering is 9 kilometer lang en wordt wel het achtste wereldwonder genoemd."
        },
        {
          type: "quiz",
          vraag: "Wat bouwde Nederland na de Watersnoodramp?",
          opties: [
            { tekst: "De Deltawerken", beeld: "🌊" },
            { tekst: "De Afsluitdijk", beeld: "🛣️" },
            { tekst: "Hogere flatgebouwen", beeld: "🏢" }
          ],
          juist: 0,
          uitleg: "De Deltawerken: dammen en keringen in Zeeland. (De Afsluitdijk was er al: die kwam in 1932.)"
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: 1945–1986.",
          items: [
            { tekst: "Bevrijding (1945)", beeld: "🕊️" },
            { tekst: "Wederopbouw met het Marshallplan", beeld: "🏗️" },
            { tekst: "Watersnoodramp (1953)", beeld: "🌊" },
            { tekst: "Deltawerken beschermen het land", beeld: "🧱" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "De Watersnoodramp gebeurde in 1953 in Zeeland en Zuid-Holland.",
          beeld: "🌊",
          juist: true,
          uitleg: "Klopt. Sindsdien horen de Deltawerken bij de beste waterbescherming ter wereld."
        }
      ]
    },
    {
      id: "g8l4",
      titel: "Televisie, computer en Europa",
      emoji: "💻",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Alles wordt sneller",
          beeld: "📺",
          tekst: [
            "In <strong>1951</strong> begon de Nederlandse televisie. Eerst keek een hele straat bij één gezin; later had iedereen een tv.",
            "Daarna kwamen de <strong>computer</strong>, de <strong>mobiele telefoon</strong> en het <strong>internet</strong>. Nieuws vliegt nu in seconden de wereld rond.",
            "Nederland veranderde mee: vrouwen gingen vaker werken, en <strong>arbeidsmigranten</strong> en mensen uit bijvoorbeeld Indonesië, Suriname, Turkije en Marokko kwamen hier wonen en bouwden Nederland mee op."
          ]
        },
        {
          type: "quiz",
          vraag: "Wat kwam er het eerst?",
          opties: [
            { tekst: "De televisie", beeld: "📺" },
            { tekst: "De smartphone", beeld: "📱" },
            { tekst: "Het internet voor iedereen", beeld: "🌐" }
          ],
          juist: 0,
          uitleg: "De tv (in Nederland vanaf 1951). Internet werd pas in de jaren '90 populair, de smartphone nog later."
        },
        {
          type: "uitleg",
          titel: "Samenwerken in Europa",
          beeld: "🇪🇺",
          tekst: [
            "Na twee wereldoorlogen wilden landen <strong>nooit meer oorlog</strong> met elkaar. Ze gingen samenwerken.",
            "Die samenwerking groeide uit tot de <strong>Europese Unie</strong> (EU). Landen handelen samen en overleggen in plaats van vechten.",
            "Sinds <strong>2002</strong> betalen we in veel EU-landen met hetzelfde geld: de <strong>euro</strong>."
          ],
          weetje: "Door de EU kun je zonder paspoortcontrole naar bijna al onze buurlanden reizen."
        },
        {
          type: "match",
          opdracht: "De moderne tijd: wat hoort bij elkaar?",
          paren: [
            [{ tekst: "1951", beeld: "📺" }, { tekst: "eerste tv-uitzending NL", beeld: "🎬" }],
            [{ tekst: "Europese Unie", beeld: "🇪🇺" }, { tekst: "samenwerken, geen oorlog", beeld: "🤝" }],
            [{ tekst: "2002", beeld: "💶" }, { tekst: "de euro in je portemonnee", beeld: "👛" }],
            [{ tekst: "Internet", beeld: "🌐" }, { tekst: "nieuws in seconden wereldwijd", beeld: "⚡" }]
          ]
        },
        {
          type: "sorteer",
          opdracht: "Zet de uitvindingen op volgorde van oud naar nieuw.",
          items: [
            { tekst: "Stoomtrein", beeld: "🚂" },
            { tekst: "Televisie", beeld: "📺" },
            { tekst: "Computer thuis", beeld: "🖥️" },
            { tekst: "Smartphone", beeld: "📱" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "De Europese landen gingen samenwerken om nieuwe oorlogen te voorkomen.",
          beeld: "🇪🇺",
          juist: true,
          uitleg: "Precies! Uit die samenwerking groeide de Europese Unie."
        }
      ]
    },
    {
      id: "g8l5",
      titel: "Meesterproef: alle tien tijdvakken",
      emoji: "🏆",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "De grote meesterproef",
          beeld: "🏆",
          tekst: [
            "Van jagers en boeren tot televisie en computer: jij kent nu <strong>alle tien tijdvakken</strong>.",
            "Dit is de meesterproef van de hele basisschool. Haal jij drie sterren?"
          ]
        },
        {
          type: "sorteer",
          opdracht: "Zet de eerste vijf tijdvakken op volgorde!",
          items: [
            { tekst: "Jagers en boeren", beeld: "🏹" },
            { tekst: "Grieken en Romeinen", beeld: "🏛️" },
            { tekst: "Monniken en ridders", beeld: "🏰" },
            { tekst: "Steden en staten", beeld: "🏘️" },
            { tekst: "Ontdekkers en hervormers", beeld: "⛵" }
          ]
        },
        {
          type: "sorteer",
          opdracht: "En nu de laatste vijf tijdvakken!",
          items: [
            { tekst: "Regenten en vorsten", beeld: "🎨" },
            { tekst: "Pruiken en revoluties", beeld: "🎩" },
            { tekst: "Burgers en stoommachines", beeld: "🚂" },
            { tekst: "Wereldoorlogen", beeld: "🕊️" },
            { tekst: "Televisie en computer", beeld: "💻" }
          ]
        },
        {
          type: "match",
          opdracht: "Welk beeld hoort bij welk tijdvak?",
          paren: [
            [{ tekst: "Hunebed", beeld: "🪨" }, { tekst: "jagers en boeren", beeld: "🏹" }],
            [{ tekst: "De limes", beeld: "🚧" }, { tekst: "Grieken en Romeinen", beeld: "🏛️" }],
            [{ tekst: "De Nachtwacht", beeld: "🖼️" }, { tekst: "regenten en vorsten", beeld: "🎨" }],
            [{ tekst: "Anne Frank", beeld: "📖" }, { tekst: "wereldoorlogen", beeld: "🕊️" }]
          ]
        },
        {
          type: "quiz",
          vraag: "Welke gebeurtenis hoort bij het jaar 1602?",
          opties: [
            { tekst: "Oprichting van de VOC", beeld: "🚢" },
            { tekst: "De eerste trein", beeld: "🚂" },
            { tekst: "De Watersnoodramp", beeld: "🌊" }
          ],
          juist: 0,
          uitleg: "1602: de VOC. De trein kwam in 1839, de Watersnoodramp was in 1953."
        },
        {
          type: "quiz",
          vraag: "Wat is de goede volgorde van deze personen?",
          opties: [
            { tekst: "Willibrord → Willem van Oranje → Rembrandt → Anne Frank", beeld: "✅" },
            { tekst: "Rembrandt → Willibrord → Anne Frank → Willem van Oranje", beeld: "🔀" },
            { tekst: "Anne Frank → Rembrandt → Willem van Oranje → Willibrord", beeld: "🔄" }
          ],
          juist: 0,
          uitleg: "Willibrord (±690) → Willem van Oranje (16e eeuw) → Rembrandt (17e eeuw) → Anne Frank (20e eeuw)."
        },
        {
          type: "waarnietwaar",
          stelling: "Geschiedenis helpt je te begrijpen waarom de wereld nu is zoals hij is.",
          beeld: "🌍",
          juist: true,
          uitleg: "Gefeliciteerd, meester-tijdreiziger! 🏆 Je hebt de hele basisschoolgeschiedenis doorlopen!"
        }
      ]
    }
  ]
});
