/* ============================================================
   Module groep 7 (10–11 jaar) — "De Gouden Eeuw en daarna"
   Tijdvak 6, 7 en 8: regenten en vorsten, pruiken en
   revoluties, burgers en stoommachines. Meer diepgang,
   ook de schaduwkanten (slavernij, kinderarbeid).
   ============================================================ */
window.CURRICULUM.push({
  id: "groep7",
  groep: 7,
  titel: "De Gouden Eeuw en daarna",
  emoji: "🎨",
  kleur: "#b8860b",
  omschrijving: "De Republiek wordt rijk en beroemd, maar niet voor iedereen. Daarna: revoluties, stoommachines en grote veranderingen!",
  tijdvakken: [6, 7, 8],
  doelen: [
    "Je weet waarom de 17e eeuw de Gouden Eeuw wordt genoemd en voor wie die niet gouden was.",
    "Je kent de VOC en begrijpt wat de slavenhandel was.",
    "Je kent Rembrandt en Michiel de Ruyter.",
    "Je weet wat er gebeurde in de Franse tijd en hoe Nederland een koninkrijk werd.",
    "Je begrijpt hoe stoommachines en fabrieken het leven veranderden."
  ],
  lessen: [
    {
      id: "g7l1",
      titel: "De Republiek en de Gouden Eeuw",
      emoji: "🏛️",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Een land zonder koning",
          beeld: "🏛️",
          tekst: [
            "Tijdens de Opstand gingen de Nederlandse gewesten samen verder <strong>zonder koning</strong>: de <strong>Republiek der Zeven Verenigde Nederlanden</strong>.",
            "Rijke burgers, de <strong>regenten</strong>, bestuurden de steden. Daarom heet tijdvak 6 (1600–1700) de <strong>tijd van regenten en vorsten</strong>.",
            "In <strong>1648</strong> werd vrede gesloten met Spanje: de <strong>Vrede van Munster</strong>. De Republiek was nu écht een eigen land."
          ],
          weetje: "Bijna alle landen om ons heen hadden een koning of keizer. Een republiek was heel bijzonder!"
        },
        {
          type: "quiz",
          vraag: "Wie bestuurden de steden in de Republiek?",
          opties: [
            { tekst: "Rijke burgers: de regenten", beeld: "🎩" },
            { tekst: "De koning van Spanje", beeld: "👑" },
            { tekst: "De ridders", beeld: "🤺" }
          ],
          juist: 0,
          uitleg: "Regenten: rijke handelaars en bestuurders. Nederland had geen koning!"
        },
        {
          type: "uitleg",
          titel: "Waarom 'Gouden Eeuw'?",
          beeld: "💰",
          tekst: [
            "In de 17e eeuw werd de Republiek <strong>schatrijk</strong> door handel over zee. Amsterdam werd de belangrijkste handelsstad van Europa.",
            "Er werden <strong>grachten</strong> gegraven en prachtige <strong>grachtenhuizen</strong> gebouwd. Kunst en wetenschap bloeiden.",
            "Maar let op: het goud was <strong>niet voor iedereen</strong>. Veel gewone mensen bleven arm, en de rijkdom kwam deels door slavernij en oorlog."
          ]
        },
        {
          type: "quiz",
          vraag: "Welke stad werd in de Gouden Eeuw dé handelsstad van Europa?",
          raster: true,
          opties: [
            { tekst: "Amsterdam", beeld: "🏘️" },
            { tekst: "Parijs", beeld: "🗼" },
            { tekst: "Rome", beeld: "🏛️" },
            { tekst: "Londen", beeld: "🎡" }
          ],
          juist: 0,
          uitleg: "Amsterdam! De grachtengordel uit die tijd staat nu op de Werelderfgoedlijst."
        },
        {
          type: "match",
          opdracht: "De Gouden Eeuw: wat hoort bij elkaar?",
          paren: [
            [{ tekst: "Regent", beeld: "🎩" }, { tekst: "bestuurt de stad", beeld: "🏛️" }],
            [{ tekst: "Koopman", beeld: "⚖️" }, { tekst: "handelt over zee", beeld: "🚢" }],
            [{ tekst: "Grachtenhuis", beeld: "🏠" }, { tekst: "wonen aan het water", beeld: "🛶" }],
            [{ tekst: "Vrede van Munster", beeld: "🕊️" }, { tekst: "einde van de oorlog (1648)", beeld: "📜" }]
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "In de Gouden Eeuw was iedereen in de Republiek rijk.",
          beeld: "💰",
          juist: false,
          uitleg: "Nee! Veel mensen bleven arm. De rijkdom was vooral voor kooplieden en regenten."
        }
      ]
    },
    {
      id: "g7l2",
      titel: "De VOC en de slavernij",
      emoji: "🚢",
      duur: "±14 min",
      stappen: [
        {
          type: "uitleg",
          titel: "De VOC",
          beeld: "🚢",
          tekst: [
            "In <strong>1602</strong> werd de <strong>VOC</strong> opgericht: de Verenigde Oost-Indische Compagnie.",
            "VOC-schepen haalden <strong>specerijen</strong> zoals peper, kruidnagel en nootmuskaat uit Azië, vooral uit het gebied dat nu Indonesië is.",
            "De VOC werd het grootste handelsbedrijf ter wereld. Maar ze gebruikte ook <strong>geweld</strong> om de handel af te dwingen."
          ],
          weetje: "Een reis naar Azië duurde ongeveer acht maanden. Veel zeelieden werden onderweg ziek."
        },
        {
          type: "quiz",
          vraag: "Wat haalde de VOC vooral uit Azië?",
          opties: [
            { tekst: "Specerijen zoals peper en nootmuskaat", beeld: "🌶️" },
            { tekst: "Goud en diamanten", beeld: "💎" },
            { tekst: "Auto's en computers", beeld: "🚗" }
          ],
          juist: 0,
          uitleg: "Specerijen! Ze waren in Europa peperduur. Daar komt dat woord vandaan."
        },
        {
          type: "uitleg",
          titel: "De schaduwkant: slavernij",
          beeld: "⛓️",
          tekst: [
            "Nederland deed ook mee aan de <strong>slavenhandel</strong>. Schepen van de WIC voeren naar Afrika.",
            "Daar werden mensen <strong>gekocht, gevangen en verscheept</strong> naar Amerika en het Caribisch gebied. Ze moesten zonder loon en zonder vrijheid werken op plantages, bijvoorbeeld in Suriname.",
            "Dit is een zwarte bladzijde uit onze geschiedenis. Pas in <strong>1863</strong> schafte Nederland de slavernij af."
          ],
          weetje: "Op 1 juli wordt met Keti Koti ('verbroken ketenen') de afschaffing van de slavernij herdacht en gevierd."
        },
        {
          type: "quiz",
          vraag: "Wat betekende slavernij voor de mensen die tot slaaf werden gemaakt?",
          opties: [
            { tekst: "Ze verloren hun vrijheid en moesten zonder loon werken", beeld: "⛓️" },
            { tekst: "Ze kregen een goedbetaalde baan", beeld: "💰" },
            { tekst: "Ze mochten kiezen waar ze wilden wonen", beeld: "🏠" }
          ],
          juist: 0,
          uitleg: "Ze werden behandeld als eigendom, niet als mens. Families werden uit elkaar gehaald en het werk was zwaar."
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: de geschiedenis van de slavernij.",
          items: [
            { tekst: "Oprichting van de VOC (1602)", beeld: "🚢" },
            { tekst: "Slavenhandel over de oceaan", beeld: "⛓️" },
            { tekst: "Afschaffing slavernij (1863)", beeld: "🕊️" },
            { tekst: "Keti Koti: herdenken en vieren (nu)", beeld: "🎗️" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "De rijkdom van de Gouden Eeuw kwam deels door slavernij en geweld.",
          beeld: "⚖️",
          juist: true,
          uitleg: "Klopt helaas. Daarom kijken we nu eerlijker naar die tijd: knap én donker tegelijk."
        }
      ]
    },
    {
      id: "g7l3",
      titel: "Rembrandt en Michiel de Ruyter",
      emoji: "🎨",
      duur: "±10 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Meesterschilder Rembrandt",
          beeld: "🎨",
          tekst: [
            "Rijke burgers lieten zich graag schilderen. De beroemdste schilder was <strong>Rembrandt van Rijn</strong>.",
            "In <strong>1642</strong> schilderde hij <strong>De Nachtwacht</strong>: een enorme groepsfoto-in-verf van Amsterdamse schutters.",
            "Rembrandt was een meester in <strong>licht en donker</strong>. Zijn schilderijen lijken wel toneel!",
            "Schilderijen uit die tijd zijn nu belangrijke <strong>historische bronnen</strong>: ze laten zien hoe mensen, kleren en huizen er toen uitzagen."
          ],
          weetje: "De Nachtwacht hangt in het Rijksmuseum in Amsterdam en is bijna 4 meter breed."
        },
        {
          type: "quiz",
          vraag: "Welk beroemd schilderij maakte Rembrandt in 1642?",
          opties: [
            { tekst: "De Nachtwacht", beeld: "🖼️" },
            { tekst: "Het Melkmeisje", beeld: "🥛" },
            { tekst: "De Zonnebloemen", beeld: "🌻" }
          ],
          juist: 0,
          uitleg: "De Nachtwacht! Het Melkmeisje is van Vermeer en de Zonnebloemen van Van Gogh (veel later)."
        },
        {
          type: "uitleg",
          titel: "Zeeheld Michiel de Ruyter",
          beeld: "⚓",
          tekst: [
            "De Republiek voerde ook oorlog op zee, vooral tegen Engeland. De beroemdste admiraal was <strong>Michiel de Ruyter</strong>.",
            "In <strong>1667</strong> voer hij dwars de Engelse rivier de Theems op en versloeg de vloot: de <strong>Tocht naar Chatham</strong>.",
            "Michiel begon als arm jongetje in Vlissingen en werd de beste zeeman van zijn tijd."
          ]
        },
        {
          type: "match",
          opdracht: "Beroemde mensen uit de Gouden Eeuw: wie deed wat?",
          paren: [
            [{ tekst: "Rembrandt", beeld: "🎨" }, { tekst: "schilderde De Nachtwacht", beeld: "🖼️" }],
            [{ tekst: "Michiel de Ruyter", beeld: "⚓" }, { tekst: "won zeeslagen", beeld: "🚢" }],
            [{ tekst: "Antoni van Leeuwenhoek", beeld: "🔬" }, { tekst: "zag bacteriën door zijn microscoop", beeld: "🦠" }],
            [{ tekst: "Christiaan Huygens", beeld: "🕰️" }, { tekst: "vond het slingeruurwerk uit", beeld: "⏰" }]
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Rembrandt was beroemd om zijn gebruik van licht en donker.",
          beeld: "🎨",
          juist: true,
          uitleg: "Klopt! Dat licht-donkereffect maakt zijn schilderijen zo spannend."
        }
      ]
    },
    {
      id: "g7l4",
      titel: "Pruiken, revoluties en Napoleon",
      emoji: "🎩",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "Tijd van pruiken en revoluties",
          beeld: "🎩",
          tekst: [
            "In de 18e eeuw (1700–1800) droegen rijke mensen witte <strong>pruiken</strong>. Maar onder die pruiken broeide het!",
            "Burgers wilden <strong>meebeslissen</strong> over het land. In Frankrijk werd in <strong>1789</strong> de koning afgezet: de <strong>Franse Revolutie</strong>.",
            "Ook in Nederland wilden de <strong>patriotten</strong> verandering: minder macht voor de stadhouder, meer voor gewone burgers."
          ]
        },
        {
          type: "quiz",
          vraag: "Wat wilden de patriotten?",
          opties: [
            { tekst: "Dat burgers mochten meebeslissen", beeld: "🗳️" },
            { tekst: "Meer macht voor de stadhouder", beeld: "👑" },
            { tekst: "Grotere pruiken voor iedereen", beeld: "🎩" }
          ],
          juist: 0,
          uitleg: "De patriotten vonden dat niet één man, maar de burgers het land moesten besturen."
        },
        {
          type: "uitleg",
          titel: "De Franse tijd",
          beeld: "🇫🇷",
          tekst: [
            "In <strong>1795</strong> trokken Franse soldaten Nederland binnen. De Republiek werd de <strong>Bataafse Republiek</strong>.",
            "Later werd de Franse keizer <strong>Napoleon</strong> hier de baas. Hij voerde handige dingen in: <strong>achternamen</strong>, huisnummers en dezelfde maten en gewichten overal.",
            "In <strong>1813</strong> was Napoleon verslagen. Nederland werd een <strong>koninkrijk</strong>: Willem I werd onze eerste koning in 1815."
          ],
          weetje: "Sommige families kozen als grap een gekke achternaam, zoals 'Naaktgeboren'. Die namen bestaan nog steeds!"
        },
        {
          type: "quiz",
          vraag: "Wat voerde Napoleon in Nederland in?",
          raster: true,
          opties: [
            { tekst: "Achternamen", beeld: "📛" },
            { tekst: "De televisie", beeld: "📺" },
            { tekst: "De euro", beeld: "💶" },
            { tekst: "Het internet", beeld: "🌐" }
          ],
          juist: 0,
          uitleg: "Achternamen! Iedereen moest zich laten inschrijven. Handig voor belastingen en het leger."
        },
        {
          type: "sorteer",
          opdracht: "Zet op volgorde: van Republiek naar Koninkrijk.",
          items: [
            { tekst: "Patriotten willen verandering", beeld: "🗳️" },
            { tekst: "Franse Revolutie (1789)", beeld: "🇫🇷" },
            { tekst: "Fransen in Nederland (1795)", beeld: "⚔️" },
            { tekst: "Willem I wordt koning (1815)", beeld: "👑" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Na de Franse tijd werd Nederland een koninkrijk.",
          beeld: "👑",
          juist: true,
          uitleg: "Klopt! Sinds 1815 heeft Nederland een koning. Daarvoor was het bijna 250 jaar een republiek."
        }
      ]
    },
    {
      id: "g7l5",
      titel: "Stoommachines en kinderarbeid",
      emoji: "🚂",
      duur: "±12 min",
      stappen: [
        {
          type: "uitleg",
          titel: "De stoommachine verandert alles",
          beeld: "🚂",
          tekst: [
            "In de 19e eeuw (1800–1900) kwam er een machine die de wereld veranderde: de <strong>stoommachine</strong>.",
            "Stoommachines lieten <strong>fabrieken</strong> draaien, <strong>treinen</strong> rijden en <strong>stoomboten</strong> varen.",
            "In <strong>1839</strong> reed de eerste Nederlandse trein, van <strong>Amsterdam naar Haarlem</strong>. Mensen vonden hem eng snel: wel 40 km per uur!"
          ]
        },
        {
          type: "quiz",
          vraag: "Waartussen reed de eerste Nederlandse trein (1839)?",
          opties: [
            { tekst: "Amsterdam en Haarlem", beeld: "🚂" },
            { tekst: "Groningen en Maastricht", beeld: "🗺️" },
            { tekst: "Rotterdam en Parijs", beeld: "🗼" }
          ],
          juist: 0,
          uitleg: "Van Amsterdam naar Haarlem! De rit duurde ongeveer een half uur."
        },
        {
          type: "uitleg",
          titel: "Werken in de fabriek",
          beeld: "🏭",
          tekst: [
            "Veel mensen verhuisden naar de stad om in <strong>fabrieken</strong> te werken. Het werk was zwaar, lang en slecht betaald.",
            "Ook <strong>kinderen</strong> werkten in fabrieken, soms wel 12 uur per dag. Naar school gaan zat er niet in.",
            "In <strong>1874</strong> kwam het <strong>Kinderwetje van Van Houten</strong>: fabrieksarbeid voor kinderen onder de 12 werd verboden."
          ],
          weetje: "In 1901 kwam de leerplicht: alle kinderen van 6 tot 12 jaar moesten naar school."
        },
        {
          type: "quiz",
          vraag: "Wat regelde het Kinderwetje van Van Houten (1874)?",
          opties: [
            { tekst: "Kinderen onder 12 mochten niet meer in fabrieken werken", beeld: "🚸" },
            { tekst: "Kinderen kregen gratis snoep", beeld: "🍬" },
            { tekst: "Kinderen mochten niet meer buiten spelen", beeld: "⛔" }
          ],
          juist: 0,
          uitleg: "Het verbood fabrieksarbeid voor jonge kinderen. Een eerste stap: later kwam de leerplicht."
        },
        {
          type: "match",
          opdracht: "De stoomtijd: wat hoort bij elkaar?",
          paren: [
            [{ tekst: "Stoommachine", beeld: "⚙️" }, { tekst: "kracht voor fabrieken", beeld: "🏭" }],
            [{ tekst: "Eerste trein (1839)", beeld: "🚂" }, { tekst: "Amsterdam–Haarlem", beeld: "🛤️" }],
            [{ tekst: "Kinderwetje (1874)", beeld: "📜" }, { tekst: "stop kinderarbeid in fabrieken", beeld: "🚸" }],
            [{ tekst: "Leerplicht (1901)", beeld: "🏫" }, { tekst: "alle kinderen naar school", beeld: "🎒" }]
          ]
        },
        {
          type: "sorteer",
          opdracht: "Zet de 19e eeuw op volgorde!",
          items: [
            { tekst: "Willem I wordt koning (1815)", beeld: "👑" },
            { tekst: "Eerste trein in Nederland (1839)", beeld: "🚂" },
            { tekst: "Kinderwetje van Van Houten (1874)", beeld: "📜" },
            { tekst: "Leerplicht (1901)", beeld: "🏫" }
          ]
        },
        {
          type: "waarnietwaar",
          stelling: "Dankzij de stoommachine konden fabrieken, treinen en boten werken zonder paarden of wind.",
          beeld: "⚙️",
          juist: true,
          uitleg: "Geweldig! Jij bent klaar voor groep 8: de twintigste eeuw!"
        }
      ]
    }
  ]
});
