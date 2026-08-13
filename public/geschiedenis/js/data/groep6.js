/* ============================================================
   Module groep 6 (9–10 jaar) — "Steden, ontdekkers en hervormers"
   Tijdvak 4 en 5: steden en staten, ontdekkers en hervormers.
   Meer tekst en jaartallen, nog steeds speels.
   ============================================================ */
window.CURRICULUM.push({
  id: "groep6",
  groep: 6,
  titel: "Steden, ontdekkers en hervormers",
  emoji: "⛵",
  kleur: "#3d8b8b",
  omschrijving: "Steden groeien, boeken worden gedrukt, schepen varen de wereld over en Willem van Oranje komt in opstand!",
  tijdvakken: [4, 5],
  doelen: [
    "Je weet waarom er in de middeleeuwen steden ontstonden en wat stadsrechten zijn.",
    "Je weet wat de Hanze was en wat een gilde deed.",
    "Je begrijpt waarom de boekdrukkunst en de ontdekkingsreizen de wereld veranderden.",
    "Je weet wie Willem van Oranje was en hoe de Opstand tegen Spanje begon.",
    "Je kunt gebeurtenissen uit tijdvak 4 en 5 op volgorde zetten."
  ],
  lessen: [
    {
      id: "g6l1",
      titel: "Steden en stadsrechten",
      emoji: "🏘️",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "De steden groeien",
          beeld: "🏘️",
          tekst: [
            "Na het jaar 1000 ging het beter met de oogst. Boeren hadden eten óver en gingen dat <strong>verhandelen</strong> op markten.",
            "Bij drukke marktplaatsen, vaak aan een rivier, groeiden dorpen uit tot <strong>steden</strong>.",
            "Dit tijdvak (1000–1500) heet de <strong>tijd van steden en staten</strong>."
          ],
          weetje: "Veel Nederlandse steden, zoals Dordrecht, Utrecht en Den Bosch, werden in deze tijd belangrijk."
        },
        {
          type: "quiz",
          vraag: "Waar ontstonden de meeste steden?",
          opties: [
            { tekst: "Bij marktplaatsen aan een rivier", beeld: "🛶" },
            { tekst: "Boven op een berg", beeld: "⛰️" },
            { tekst: "Midden in het bos", beeld: "🌲" }
          ],
          juist: 0,
          uitleg: "Aan rivieren! Daar kwamen handelaars met hun schepen en werd markt gehouden."
        },
        {
          type: "uitleg",
          titel: "Stadsrechten",
          beeld: "📜",
          tekst: [
            "Een stad kon <strong>stadsrechten</strong> kopen of krijgen van de graaf of hertog.",
            "Met stadsrechten mocht een stad een <strong>muur</strong> bouwen, <strong>markt</strong> houden en zelf <strong>rechtspreken</strong>.",
            "Burgers in de stad waren vrijer dan boeren op het platteland. Er was zelfs een gezegde: <strong>stadslucht maakt vrij</strong>!"
          ]
        },
        {
          type: "match",
          opdracht: "Wat mocht een stad met stadsrechten? Maak de paren!",
          paren: [
            [{ tekst: "Stadsmuur", beeld: "🧱" }, { tekst: "de stad beschermen", beeld: "🛡️" }],
            [{ tekst: "Markt houden", beeld: "🧺" }, { tekst: "handel drijven", beeld: "🪙" }],
            [{ tekst: "Rechtspraak", beeld: "⚖️" }, { tekst: "zelf boeven straffen", beeld: "👮" }],
            [{ tekst: "Stadspoort", beeld: "🚪" }, { tekst: "'s nachts op slot", beeld: "🔒" }]
          ]
        },
        {
          type: "uitleg",
          titel: "Gilden: samen sterk",
          beeld: "🔨",
          tekst: [
            "Mensen met hetzelfde beroep, zoals bakkers of smeden, vormden samen een <strong>gilde</strong>.",
            "Het gilde lette op de <strong>kwaliteit</strong>: brood moest goed én eerlijk gewogen zijn.",
            "Wilde je een vak leren? Dan begon je als <strong>leerling</strong> bij een <strong>meester</strong>. Na jaren oefenen kon je zelf meester worden."
          ]
        },
        {
          type: "quiz",
          vraag: "Wat is een gilde?",
          opties: [
            { tekst: "Een club van mensen met hetzelfde beroep", beeld: "🔨" },
            { tekst: "Een soort kasteel", beeld: "🏰" },
            { tekst: "Een oud muntstuk", beeld: "🪙" }
          ],
          juist: 0,
          uitleg: "Precies! Bakkers, smeden en schoenmakers hadden elk hun eigen gilde dat regels maakte over het vak."
        },
        {
          type: "waarnietwaar",
          stelling: "Met stadsrechten mocht een stad een muur bouwen en markt houden.",
          beeld: "📜",
          juist: true,
          uitleg: "Klopt! Stadsrechten maakten een stad een beetje een land op zichzelf."
        }
      ]
    },
    {
      id: "g6l2",
      titel: "De Hanze: handel over zee",
      emoji: "🚢",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Samen handelen",
          beeld: "🚢",
          tekst: [
            "Handelssteden rond de Noordzee en Oostzee werkten samen in een verbond: de <strong>Hanze</strong>.",
            "Samen stond je sterker tegen zeerovers en kon je betere afspraken maken.",
            "Nederlandse Hanzesteden waren onder andere <strong>Kampen, Zwolle, Deventer en Zutphen</strong>."
          ],
          weetje: "Hanzeschepen heetten koggen: dikke, ronde zeilschepen die veel lading konden vervoeren."
        },
        {
          type: "quiz",
          vraag: "Wat was de Hanze?",
          opties: [
            { tekst: "Een verbond van handelssteden", beeld: "🤝" },
            { tekst: "Een beroemde ridder", beeld: "🤺" },
            { tekst: "Een soort belasting", beeld: "💰" }
          ],
          juist: 0,
          uitleg: "Een verbond van handelssteden! Samen handelen was veiliger en leverde meer op."
        },
        {
          type: "match",
          opdracht: "Wat werd er verhandeld? Maak de paren!",
          paren: [
            [{ tekst: "Uit het oosten", beeld: "🌲" }, { tekst: "hout en graan", beeld: "🌾" }],
            [{ tekst: "Uit de Noordzee", beeld: "🌊" }, { tekst: "haring", beeld: "🐟" }],
            [{ tekst: "Uit Vlaanderen", beeld: "🐑" }, { tekst: "wol en laken", beeld: "🧵" }],
            [{ tekst: "Uit het zuiden", beeld: "☀️" }, { tekst: "wijn en zout", beeld: "🍷" }]
          ]
        },
        {
          type: "quiz",
          vraag: "Welke stad was een Nederlandse Hanzestad?",
          raster: true,
          opties: [
            { tekst: "Kampen", beeld: "🚢" },
            { tekst: "Rotterdam", beeld: "🌉" },
            { tekst: "Almere", beeld: "🏗️" },
            { tekst: "Lelystad", beeld: "🌷" }
          ],
          juist: 0,
          uitleg: "Kampen! Net als Zwolle, Deventer en Zutphen, allemaal aan de rivier de IJssel."
        },
        {
          type: "waarnietwaar",
          stelling: "Hanzesteden werkten samen omdat handel dan veiliger en voordeliger was.",
          beeld: "🤝",
          juist: true,
          uitleg: "Goed zo! Samen sta je sterker: tegen rovers én bij het maken van handelsafspraken."
        }
      ]
    },
    {
      id: "g6l3",
      titel: "Boekdrukkunst en ontdekkingsreizen",
      emoji: "🗺️",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Een slimme uitvinding",
          beeld: "📖",
          tekst: [
            "Rond <strong>1450</strong> vond Johannes Gutenberg de <strong>boekdrukkunst</strong> uit: een machine met losse letters.",
            "Vroeger schreven monniken één boek in maanden over. Nu drukte je <strong>honderden boeken</strong> in dezelfde tijd!",
            "Boeken werden goedkoper. Meer mensen leerden lezen, en nieuwe ideeën verspreidden zich razendsnel."
          ]
        },
        {
          type: "quiz",
          vraag: "Waarom was de boekdrukkunst zo belangrijk?",
          opties: [
            { tekst: "Boeken werden goedkoper en ideeën verspreidden zich snel", beeld: "📖" },
            { tekst: "Boeken werden mooier om te zien", beeld: "🎨" },
            { tekst: "Monniken kregen eindelijk vakantie", beeld: "🏖️" }
          ],
          juist: 0,
          uitleg: "Kennis was niet langer alleen voor rijken en kloosters. Iedereen kon nu sneller leren!"
        },
        {
          type: "uitleg",
          titel: "Op zoek naar nieuwe routes",
          beeld: "⛵🌍",
          tekst: [
            "Specerijen zoals <strong>peper en kaneel</strong> kwamen uit Azië en waren peperduur.",
            "Zeevaarders zochten een route over zee. In <strong>1492</strong> voer <strong>Columbus</strong> naar het westen en kwam bij Amerika uit — een 'nieuwe' wereld voor de Europeanen.",
            "Dit tijdvak (1500–1600) heet daarom de <strong>tijd van ontdekkers en hervormers</strong>."
          ],
          weetje: "Columbus dacht zelf dat hij in Azië was aangekomen. Daarom noemde hij de bewoners 'Indianen'."
        },
        {
          type: "quiz",
          vraag: "Wat gebeurde er in 1492?",
          opties: [
            { tekst: "Columbus bereikte Amerika", beeld: "⛵" },
            { tekst: "De eerste trein reed", beeld: "🚂" },
            { tekst: "De boekdrukkunst werd uitgevonden", beeld: "📖" }
          ],
          juist: 0,
          uitleg: "In 1492 stak Columbus de oceaan over. Voor Europa was Amerika een compleet nieuwe wereld."
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: wat gebeurde eerst?",
          items: [
            { tekst: "Monniken schrijven boeken met de hand", beeld: "✍️" },
            { tekst: "Gutenberg drukt boeken (±1450)", beeld: "📖" },
            { tekst: "Columbus vaart naar Amerika (1492)", beeld: "⛵" },
            { tekst: "Kaarten van de nieuwe wereld worden gedrukt", beeld: "🗺️" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Ontdekkingsreizigers zochten vooral een zeeroute naar de specerijen in Azië.",
          beeld: "🌶️",
          juist: true,
          uitleg: "Klopt! Specerijen waren goud waard. Wie een route over zee vond, werd rijk."
        }
      ]
    },
    {
      id: "g6l4",
      titel: "Willem van Oranje en de Opstand",
      emoji: "🍊",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Ruzie over het geloof",
          beeld: "⛪",
          tekst: [
            "In <strong>1517</strong> zei de monnik <strong>Maarten Luther</strong> dat er veel mis was in de katholieke kerk. Zijn aanhangers heetten <strong>protestanten</strong>.",
            "Nederland hoorde toen bij het rijk van de Spaanse koning <strong>Filips II</strong>. Hij was streng katholiek en strafte protestanten hard.",
            "In <strong>1566</strong> sloegen boze protestanten beelden in katholieke kerken kapot: de <strong>Beeldenstorm</strong>."
          ]
        },
        {
          type: "quiz",
          vraag: "Wat was de Beeldenstorm (1566)?",
          opties: [
            { tekst: "Protestanten sloegen beelden in kerken kapot", beeld: "⛪" },
            { tekst: "Een zware storm op zee", beeld: "🌪️" },
            { tekst: "Een wedstrijd beeldhouwen", beeld: "🗿" }
          ],
          juist: 0,
          uitleg: "Boze protestanten vernielden katholieke kerkbeelden. Filips II was woedend en stuurde een leger."
        },
        {
          type: "uitleg",
          titel: "De Vader des Vaderlands",
          beeld: "🍊",
          tekst: [
            "<strong>Willem van Oranje</strong> was een rijke edelman. Hij vond dat iedereen zijn eigen geloof moest mogen kiezen.",
            "In <strong>1568</strong> begon hij de <strong>Opstand</strong> tegen de Spaanse koning. Die oorlog zou 80 jaar duren: de <strong>Tachtigjarige Oorlog</strong>.",
            "In <strong>1572</strong> veroverden de watergeuzen Den Briel. Steeds meer steden kozen voor Willem."
          ],
          weetje: "Ons volkslied, het Wilhelmus, gaat over Willem van Oranje. Het is het oudste volkslied ter wereld."
        },
        {
          type: "quiz",
          vraag: "Waarom kwam Willem van Oranje in opstand?",
          opties: [
            { tekst: "Hij wilde vrijheid van geloof en minder Spaanse macht", beeld: "🕊️" },
            { tekst: "Hij wilde zelf koning van Spanje worden", beeld: "👑" },
            { tekst: "Hij hield niet van sinaasappels", beeld: "🍊" }
          ],
          juist: 0,
          uitleg: "Willem vocht voor vrijheid van geloof en tegen de strenge Spaanse koning Filips II."
        },
        {
          type: "sorteer",
          opdracht: "Zet de Opstand op volgorde!",
          items: [
            { tekst: "Luther protesteert tegen de kerk (1517)", beeld: "📜" },
            { tekst: "De Beeldenstorm (1566)", beeld: "⛪" },
            { tekst: "Begin van de Opstand (1568)", beeld: "⚔️" },
            { tekst: "Watergeuzen veroveren Den Briel (1572)", beeld: "🚢" }
          ]
        },
        {
          type: "quiz",
          vraag: "Hoe lang duurde de oorlog tegen Spanje?",
          opties: [
            { tekst: "8 jaar", beeld: "8️⃣" },
            { tekst: "80 jaar", beeld: "⌛" },
            { tekst: "800 jaar", beeld: "😱" }
          ],
          juist: 1,
          uitleg: "80 jaar: van 1568 tot 1648. Daarom heet hij de Tachtigjarige Oorlog."
        },
        {
          type: "waarnietwaar",
          stelling: "Willem van Oranje wordt de Vader des Vaderlands genoemd.",
          beeld: "🍊",
          juist: true,
          uitleg: "Klopt! Hij staat aan het begin van het Nederland dat we nu kennen. In 1584 werd hij in Delft vermoord."
        }
      ]
    },
    {
      id: "g6l5",
      titel: "De grote terugblik",
      emoji: "🎯",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Twee tijdvakken in je hoofd",
          beeld: "🧠",
          tekst: [
            "Je kent nu de <strong>tijd van steden en staten</strong> (1000–1500) en de <strong>tijd van ontdekkers en hervormers</strong> (1500–1600).",
            "Steden, gilden, de Hanze, de boekdrukkunst, Columbus en Willem van Oranje. Laat zien wat je weet!"
          ]
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: wat gebeurde eerst?",
          items: [
            { tekst: "Steden krijgen stadsrechten", beeld: "📜" },
            { tekst: "Boekdrukkunst uitgevonden (±1450)", beeld: "📖" },
            { tekst: "Columbus naar Amerika (1492)", beeld: "⛵" },
            { tekst: "Begin van de Opstand (1568)", beeld: "⚔️" }
          ]
        },
        {
          type: "match",
          opdracht: "Wie of wat hoort bij elkaar?",
          paren: [
            [{ tekst: "Gilde", beeld: "🔨" }, { tekst: "mensen met één beroep", beeld: "👥" }],
            [{ tekst: "Hanze", beeld: "🚢" }, { tekst: "verbond van handelssteden", beeld: "🤝" }],
            [{ tekst: "Gutenberg", beeld: "📖" }, { tekst: "boekdrukkunst", beeld: "🖨️" }],
            [{ tekst: "Willem van Oranje", beeld: "🍊" }, { tekst: "de Opstand", beeld: "⚔️" }]
          ]
        },
        {
          type: "quiz",
          vraag: "Wat betekende 'stadslucht maakt vrij'?",
          opties: [
            { tekst: "Burgers in de stad waren vrijer dan boeren op het land", beeld: "🏘️" },
            { tekst: "In de stad was de lucht schoner", beeld: "🌬️" },
            { tekst: "Stadsmensen mochten gratis reizen", beeld: "🎫" }
          ],
          juist: 0,
          uitleg: "In de stad had je meer rechten en vrijheid dan als boer bij een landheer."
        },
        {
          type: "quiz",
          vraag: "Tegen welke koning begon de Opstand in 1568?",
          opties: [
            { tekst: "Filips II van Spanje", beeld: "👑" },
            { tekst: "Napoleon van Frankrijk", beeld: "🎩" },
            { tekst: "Caesar van Rome", beeld: "🏛️" }
          ],
          juist: 0,
          uitleg: "Filips II! De strenge Spaanse koning die protestanten vervolgde en hoge belastingen vroeg."
        },
        {
          type: "waarnietwaar",
          stelling: "Door de boekdrukkunst verspreidden nieuwe ideeën zich veel sneller.",
          beeld: "📖",
          juist: true,
          uitleg: "Top! Jij bent klaar voor groep 7: de Gouden Eeuw wacht op je!"
        }
      ]
    }
  ]
});
