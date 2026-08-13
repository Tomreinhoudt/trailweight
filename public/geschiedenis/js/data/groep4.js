/* ============================================================
   Module groep 4 (7–8 jaar) — "Vroeger en nu"
   Accent: tijdsbesef (kerndoel 51) + eerste kennismaking met
   tijdvak 1 (jagers en boeren). Korte zinnen, veel beeld.
   ============================================================ */
window.CURRICULUM.push({
  id: "groep4",
  groep: 4,
  titel: "Vroeger en nu",
  emoji: "🕰️",
  kleur: "#f59e0b",
  omschrijving: "Wat is vroeger? Jij gaat op reis door de tijd. Van jouw eigen leven naar heel lang geleden!",
  tijdvakken: [1],
  doelen: [
    "Je weet wat 'vroeger', 'nu' en 'later' betekenen.",
    "Je kunt gebeurtenissen uit je eigen leven op volgorde zetten.",
    "Je weet hoe jagers en verzamelaars leefden.",
    "Je weet dat de eerste boeren zelf eten gingen verbouwen.",
    "Je ziet verschillen tussen spullen van vroeger en nu."
  ],
  lessen: [
    {
      id: "g4l1",
      titel: "Wat is vroeger?",
      emoji: "⏳",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Tijd gaat altijd door",
          beeld: "⏳",
          tekst: [
            "Gisteren is <strong>vroeger</strong>. Vandaag is <strong>nu</strong>. Morgen is <strong>later</strong>.",
            "Sommige dingen zijn een beetje vroeger. Zoals gisteren.",
            "Sommige dingen zijn <strong>heel lang geleden</strong>. Zoals de tijd van ridders. Of nog veel langer geleden!"
          ],
          weetje: "Alles wat vroeger is gebeurd, noemen we geschiedenis."
        },
        {
          type: "quiz",
          vraag: "Wat was het langst geleden?",
          opties: [
            { tekst: "Gisteren", beeld: "🛏️" },
            { tekst: "Toen jij een baby was", beeld: "👶" },
            { tekst: "De tijd van de ridders", beeld: "🏰" }
          ],
          juist: 2,
          uitleg: "Ridders leefden honderden jaren geleden. Dat is véél langer geleden dan gisteren!"
        },
        {
          type: "uitleg",
          titel: "Oud en nieuw",
          beeld: "📻 ➡️ 📱",
          tekst: [
            "Spullen van vroeger zien er anders uit dan spullen van nu.",
            "Vroeger luisterde je naar een grote <strong>radio</strong>. Nu heb je een <strong>telefoon</strong> in je zak.",
            "Aan spullen kun je zien of iets oud of nieuw is."
          ]
        },
        {
          type: "quiz",
          vraag: "Welk ding is het oudst?",
          raster: true,
          opties: [
            { tekst: "Tablet", beeld: "📱" },
            { tekst: "Ridderhelm", beeld: "⛑️" },
            { tekst: "Auto", beeld: "🚗" },
            { tekst: "Televisie", beeld: "📺" }
          ],
          juist: 1,
          uitleg: "De ridderhelm is honderden jaren oud. Veel ouder dan een auto of tv!"
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: wat komt eerst?",
          items: [
            { tekst: "Vanmorgen: opstaan", beeld: "🌅" },
            { tekst: "Nu: leren", beeld: "📚" },
            { tekst: "Straks: naar huis", beeld: "🏠" },
            { tekst: "Vanavond: slapen", beeld: "🌙" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Alles wat vroeger is gebeurd, heet geschiedenis.",
          beeld: "📖",
          juist: true,
          uitleg: "Klopt! Geschiedenis gaat over alles van vroeger. Ook over jouw eigen leven!"
        }
      ]
    },
    {
      id: "g4l2",
      titel: "Jouw eigen tijdlijn",
      emoji: "👶",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Jij hebt ook geschiedenis!",
          beeld: "👶 🧒 🧑",
          tekst: [
            "Eerst was jij een <strong>baby</strong>. Toen een <strong>peuter</strong>. Nu ben je een <strong>kind</strong>.",
            "Jouw leven kun je op een lijn zetten. Dat heet een <strong>tijdlijn</strong>.",
            "Links staat vroeger. Rechts staat nu."
          ],
          weetje: "Ook opa en oma waren vroeger kind, net als jij nu!"
        },
        {
          type: "sorteer",
          opdracht: "Zet het leven op volgorde. Wat komt eerst?",
          items: [
            { tekst: "Baby", beeld: "👶" },
            { tekst: "Peuter", beeld: "🚼" },
            { tekst: "Kind (dat ben jij!)", beeld: "🧒" },
            { tekst: "Volwassene", beeld: "🧑" },
            { tekst: "Opa of oma", beeld: "🧓" }
          ]
        },
        {
          type: "quiz",
          vraag: "Wie was er het éérst kind?",
          opties: [
            { tekst: "Jij", beeld: "🧒" },
            { tekst: "Je vader of moeder", beeld: "🧑" },
            { tekst: "Je opa of oma", beeld: "🧓" }
          ],
          juist: 2,
          uitleg: "Opa en oma zijn het oudst. Zij waren al kind toen jouw ouders nog niet bestonden!"
        },
        {
          type: "sorteer",
          opdracht: "Zet de familie op volgorde: wie werd het eerst geboren?",
          items: [
            { tekst: "Opa en oma", beeld: "🧓" },
            { tekst: "Papa en mama", beeld: "🧑" },
            { tekst: "Grote broer of zus", beeld: "🧒" },
            { tekst: "De baby", beeld: "👶" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Op een tijdlijn staat vroeger links en nu rechts.",
          beeld: "📏",
          juist: true,
          uitleg: "Goed zo! Zo lees je een tijdlijn: van links (vroeger) naar rechts (nu)."
        }
      ]
    },
    {
      id: "g4l3",
      titel: "Jagers en verzamelaars",
      emoji: "🏹",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Heel, heel lang geleden",
          beeld: "🏹",
          tekst: [
            "Heel lang geleden waren er geen winkels. Geen huizen. Geen scholen!",
            "Mensen <strong>jaagden</strong> op dieren. En ze <strong>verzamelden</strong> noten, bessen en planten.",
            "Daarom noemen we ze <strong>jagers en verzamelaars</strong>."
          ],
          weetje: "Dit was meer dan 10.000 jaar geleden. Dat is super lang!"
        },
        {
          type: "quiz",
          vraag: "Hoe kwamen jagers en verzamelaars aan eten?",
          opties: [
            { tekst: "Uit de supermarkt", beeld: "🛒" },
            { tekst: "Jagen en verzamelen", beeld: "🏹" },
            { tekst: "Bestellen met de telefoon", beeld: "📱" }
          ],
          juist: 1,
          uitleg: "Er waren nog geen winkels. Ze jaagden op dieren en zochten bessen en noten."
        },
        {
          type: "uitleg",
          titel: "Altijd onderweg",
          beeld: "⛺",
          tekst: [
            "Jagers bleven niet op één plek wonen.",
            "Was al het eten op? Dan liepen ze verder. Naar een nieuwe plek met dieren en planten.",
            "Ze woonden in <strong>tenten</strong> van dierenhuid of in <strong>hutten</strong>."
          ]
        },
        {
          type: "quiz",
          vraag: "Wat gebruikten jagers om mee te jagen?",
          raster: true,
          opties: [
            { tekst: "Speer", beeld: "🔱" },
            { tekst: "Geweer", beeld: "🔫" },
            { tekst: "Hengel met motor", beeld: "🎣" },
            { tekst: "Robot", beeld: "🤖" }
          ],
          juist: 0,
          uitleg: "Ze maakten speren en pijlen van hout en steen. Geweren bestonden nog lang niet!"
        },
        {
          type: "match",
          opdracht: "Wat hoort bij elkaar? Tik op twee vakjes.",
          paren: [
            [{ tekst: "Jagen", beeld: "🏹" }, { tekst: "op een hert", beeld: "🦌" }],
            [{ tekst: "Verzamelen", beeld: "🧺" }, { tekst: "bessen en noten", beeld: "🫐" }],
            [{ tekst: "Wonen", beeld: "⛺" }, { tekst: "in een tent of hut", beeld: "🛖" }],
            [{ tekst: "Vuur maken", beeld: "🔥" }, { tekst: "met steentjes", beeld: "🪨" }]
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Jagers en verzamelaars woonden hun hele leven in één huis.",
          beeld: "🏠",
          juist: false,
          uitleg: "Ze trokken steeds verder, op zoek naar eten. Ze hadden geen vast huis."
        }
      ]
    },
    {
      id: "g4l4",
      titel: "De eerste boeren",
      emoji: "🌾",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Zelf eten maken",
          beeld: "🌾",
          tekst: [
            "Op een dag ontdekten mensen iets slims: je kunt <strong>zaadjes planten</strong>!",
            "Dan groeit er graan. Daar kun je brood van maken.",
            "Ze hielden ook dieren: koeien, schapen en varkens. Deze mensen noemen we <strong>boeren</strong>."
          ],
          weetje: "De eerste boeren in Nederland leefden ongeveer 7000 jaar geleden."
        },
        {
          type: "quiz",
          vraag: "Waarom hoefden boeren niet meer rond te trekken?",
          opties: [
            { tekst: "Ze verbouwden zelf eten", beeld: "🌾" },
            { tekst: "Ze hadden een auto", beeld: "🚗" },
            { tekst: "Ze waren te moe", beeld: "😴" }
          ],
          juist: 0,
          uitleg: "Boeren lieten hun eten groeien op het land. Dus konden ze op één plek blijven wonen!"
        },
        {
          type: "uitleg",
          titel: "Een boerderij van vroeger",
          beeld: "🛖🐄",
          tekst: [
            "Boeren bouwden <strong>echte huizen</strong> van hout, takken en klei.",
            "De dieren woonden vaak binnen, bij de mensen in huis. Lekker warm!",
            "Naast het huis lag de <strong>akker</strong>. Daar groeide het graan."
          ]
        },
        {
          type: "match",
          opdracht: "Wat geeft elk dier? Tik op twee vakjes.",
          paren: [
            [{ tekst: "Koe", beeld: "🐄" }, { tekst: "melk", beeld: "🥛" }],
            [{ tekst: "Kip", beeld: "🐔" }, { tekst: "eieren", beeld: "🥚" }],
            [{ tekst: "Schaap", beeld: "🐑" }, { tekst: "wol", beeld: "🧶" }],
            [{ tekst: "Akker met graan", beeld: "🌾" }, { tekst: "brood", beeld: "🍞" }]
          ]
        },
        {
          type: "sorteer",
          opdracht: "Van zaadje naar brood: zet op volgorde!",
          items: [
            { tekst: "Zaadjes planten", beeld: "🌱" },
            { tekst: "Het graan groeit", beeld: "🌾" },
            { tekst: "Graan malen tot meel", beeld: "🪨" },
            { tekst: "Brood bakken", beeld: "🍞" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "De eerste boeren bleven op één plek wonen.",
          beeld: "🛖",
          juist: true,
          uitleg: "Klopt! Hun eten groeide op de akker. Ze hoefden niet meer rond te trekken."
        }
      ]
    },
    {
      id: "g4l5",
      titel: "Toen en nu in huis",
      emoji: "🏠",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Wonen: toen en nu",
          beeld: "🕯️ ➡️ 💡",
          tekst: [
            "Vroeger was er thuis <strong>geen stroom</strong>. Geen lamp, geen tv, geen wc met een knopje!",
            "Licht kwam van <strong>kaarsen</strong>. Warmte kwam van het <strong>vuur</strong>.",
            "Kijk maar eens wat er allemaal anders was."
          ],
          weetje: "Honderd jaar geleden hadden veel huizen in Nederland nog geen elektrisch licht."
        },
        {
          type: "match",
          opdracht: "Wat hoort bij elkaar: vroeger en nu?",
          paren: [
            [{ tekst: "Kaars", beeld: "🕯️" }, { tekst: "Lamp", beeld: "💡" }],
            [{ tekst: "Paard en wagen", beeld: "🐴" }, { tekst: "Auto", beeld: "🚗" }],
            [{ tekst: "Brief", beeld: "✉️" }, { tekst: "Berichtje", beeld: "📱" }],
            [{ tekst: "Wasbord", beeld: "🪣" }, { tekst: "Wasmachine", beeld: "🌀" }]
          ]
        },
        {
          type: "quiz",
          vraag: "Hoe maakte je vroeger licht in huis?",
          raster: true,
          opties: [
            { tekst: "Met een kaars", beeld: "🕯️" },
            { tekst: "Met een schakelaar", beeld: "💡" },
            { tekst: "Met een telefoon", beeld: "📱" },
            { tekst: "Met een zaklamp", beeld: "🔦" }
          ],
          juist: 0,
          uitleg: "Er was geen stroom. Kaarsen en olielampen gaven licht."
        },
        {
          type: "quiz",
          vraag: "Hoe reisde je vroeger, vóór er auto's waren?",
          opties: [
            { tekst: "Met paard en wagen", beeld: "🐴" },
            { tekst: "Met het vliegtuig", beeld: "✈️" },
            { tekst: "Met een elektrische step", beeld: "🛴" }
          ],
          juist: 0,
          uitleg: "Mensen liepen, of gingen met paard en wagen. Dat duurde veel langer dan nu!"
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: van heel lang geleden naar nu.",
          items: [
            { tekst: "Jagers in een tent", beeld: "⛺" },
            { tekst: "Boeren in een hut", beeld: "🛖" },
            { tekst: "Huis met kaarsen", beeld: "🕯️" },
            { tekst: "Huis met stroom en wifi", beeld: "🏠" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Kinderen konden vroeger televisie kijken bij het kampvuur.",
          beeld: "📺",
          juist: false,
          uitleg: "Televisie bestaat nog niet zo lang. Vroeger vertelden mensen verhalen bij het vuur!"
        }
      ]
    }
  ]
});
