/* ============================================================
   Tijdreizigers — app-engine
   Navigatie (hash-routes), leerlingprofielen, voortgang
   (localStorage) en de lesspeler met interactieve oefeningen.
   Geen frameworks, geen backend: alles draait lokaal.
   ============================================================ */
(function () {
  "use strict";

  var OPSLAG_SLEUTEL = "tijdreizigers-v1";
  var AVATARS = ["🦁", "🦊", "🐼", "🦄", "🐸", "🦉", "🐯", "🐙", "🦖", "🐨"];

  var app = document.getElementById("app");

  /* ---------- opslag ---------- */

  function laadStaat() {
    try {
      var raw = localStorage.getItem(OPSLAG_SLEUTEL);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* kapotte of geblokkeerde opslag: begin opnieuw */ }
    return { leerlingen: [], actief: null };
  }

  var staat = laadStaat();

  function bewaar() {
    try {
      localStorage.setItem(OPSLAG_SLEUTEL, JSON.stringify(staat));
    } catch (e) { /* privémodus: voortgang geldt dan alleen deze sessie */ }
  }

  function actieveLeerling() {
    for (var i = 0; i < staat.leerlingen.length; i++) {
      if (staat.leerlingen[i].id === staat.actief) return staat.leerlingen[i];
    }
    return null;
  }

  function lesVoortgang(leerling, lesId) {
    return (leerling.voortgang || {})[lesId] || null;
  }

  function zetLesKlaar(leerling, lesId, sterren) {
    leerling.voortgang = leerling.voortgang || {};
    var oud = leerling.voortgang[lesId];
    leerling.voortgang[lesId] = { af: true, sterren: Math.max(sterren, oud ? oud.sterren : 0) };
    bewaar();
  }

  /* ---------- hulpjes ---------- */

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function schud(lijst) {
    var kopie = lijst.slice();
    for (var i = kopie.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = kopie[i]; kopie[i] = kopie[j]; kopie[j] = t;
    }
    return kopie;
  }

  /* Schud, maar nooit de originele volgorde teruggeven (anders is
     een sorteeroefening al 'opgelost' voordat je iets doet). */
  function schudAnders(lijst) {
    if (lijst.length < 2) return lijst.slice();
    var poging = schud(lijst);
    var gelijk = poging.every(function (x, i) { return x === lijst[i]; });
    return gelijk ? schudAnders(lijst) : poging;
  }

  function vindGroep(id) {
    return window.CURRICULUM.find(function (g) { return g.id === id; });
  }

  function vindLes(lesId) {
    for (var i = 0; i < window.CURRICULUM.length; i++) {
      var g = window.CURRICULUM[i];
      for (var j = 0; j < g.lessen.length; j++) {
        if (g.lessen[j].id === lesId) return { groep: g, les: g.lessen[j], index: j };
      }
    }
    return null;
  }

  function groepVoortgang(leerling, groep) {
    var af = 0, sterren = 0;
    groep.lessen.forEach(function (les) {
      var v = lesVoortgang(leerling, les.id);
      if (v && v.af) { af++; sterren += v.sterren; }
    });
    return { af: af, totaal: groep.lessen.length, sterren: sterren, pct: Math.round((af / groep.lessen.length) * 100) };
  }

  function sterrenTekst(n) {
    var s = "";
    for (var i = 0; i < 3; i++) s += i < n ? "⭐" : "☆";
    return s;
  }

  var GOED_TEKSTEN = ["Goed zo!", "Super!", "Knap gedaan!", "Helemaal goed!", "Toppertje!"];
  var MIS_TEKSTEN = ["Helaas, dat is niet goed.", "Bijna! Kijk nog eens goed.", "Dat klopt niet helemaal."];

  function kies(lijst) { return lijst[Math.floor(Math.random() * lijst.length)]; }

  /* ---------- weergave-basis ---------- */

  function render(html) {
    app.innerHTML = html;
    app.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function topbalk(opties) {
    var leerling = actieveLeerling();
    var h = '<header class="topbalk">';
    if (opties.terug) {
      h += '<button class="knop-terug" data-actie="ga" data-doel="' + esc(opties.terug) + '" aria-label="Terug">‹</button>';
    }
    h += '<div class="titel">' + esc(opties.titel || "Tijdreizigers") + "</div>";
    if (leerling && !opties.zonderChip) {
      h += '<button class="avatar-chip" data-actie="ga" data-doel="#/profielen">' +
        '<span class="emoji">' + leerling.avatar + "</span> " + esc(leerling.naam) + "</button>";
    }
    return h + "</header>";
  }

  /* ---------- schermen ---------- */

  function toonProfielen() {
    var h = topbalk({ titel: "Wie ben jij?", zonderChip: true });
    h += '<div class="inhoud">';
    h += '<div class="hero"><div class="logo">🧭</div><h1>Tijdreizigers</h1>' +
      "<p>Geschiedenis voor groep 4 t/m 8</p></div>";

    if (staat.leerlingen.length) {
      h += '<div class="profiel-lijst">';
      staat.leerlingen.forEach(function (l) {
        var totaalAf = 0;
        window.CURRICULUM.forEach(function (g) { totaalAf += groepVoortgang(l, g).af; });
        h += '<div class="profiel-knop" role="button" tabindex="0" data-actie="kies-leerling" data-id="' + esc(l.id) + '">' +
          '<span class="emoji">' + l.avatar + "</span>" +
          "<span>" + esc(l.naam) + '<span class="sub">' + totaalAf + " lessen gedaan</span></span>" +
          '<button class="verwijder" data-actie="verwijder-leerling" data-id="' + esc(l.id) + '" aria-label="Verwijder ' + esc(l.naam) + '">✕</button>' +
          "</div>";
      });
      h += "</div>";
    }

    h += '<button class="knop' + (staat.leerlingen.length ? " stil" : "") + '" data-actie="ga" data-doel="#/nieuw">➕ Nieuwe tijdreiziger</button>';
    h += "</div>";
    render(h);
  }

  function toonNieuwProfiel() {
    var h = topbalk({ titel: "Nieuwe tijdreiziger", terug: "#/profielen", zonderChip: true });
    h += '<div class="inhoud">';
    h += '<div class="kaart"><h2>Hoe heet je?</h2>' +
      '<p class="zacht klein" style="margin:6px 0 10px">Vraag je juf, meester of ouder om te helpen als typen lastig is.</p>' +
      '<input class="naam-invoer" id="naam-invoer" maxlength="20" placeholder="Jouw naam" autocomplete="off"></div>';
    h += '<div class="kaart"><h2>Kies je dier</h2><div class="avatar-raster" id="avatar-raster" style="margin-top:12px">';
    AVATARS.forEach(function (a, i) {
      h += '<button class="avatar-optie' + (i === 0 ? " gekozen" : "") + '" data-avatar="' + a + '">' + a + "</button>";
    });
    h += "</div></div>";
    h += '<button class="knop" data-actie="maak-leerling">🚀 Start je tijdreis!</button>';
    h += "</div>";
    render(h);
  }

  function toonHome() {
    var leerling = actieveLeerling();
    if (!leerling) { location.hash = "#/profielen"; return; }

    var h = topbalk({ titel: "Tijdreizigers" });
    h += '<div class="inhoud">';
    h += '<div class="kaart" style="text-align:center"><div style="font-size:2.6rem">🧭</div>' +
      "<h2>Hoi " + esc(leerling.naam) + "!</h2>" +
      '<p class="zacht">Kies jouw groep en reis door de tijd.</p></div>';

    window.CURRICULUM.forEach(function (g) {
      var v = groepVoortgang(leerling, g);
      h += '<button class="groep-kaart" style="border-left-color:' + g.kleur + '" data-actie="ga" data-doel="#/groep/' + g.id + '">' +
        '<span class="emoji">' + g.emoji + "</span>" +
        '<span class="info"><span class="naam">Groep ' + g.groep + " · " + esc(g.titel) + "</span>" +
        '<span class="sub">' + v.af + " van " + v.totaal + " lessen</span>" +
        '<span class="voortgang-balk"><div style="width:' + v.pct + '%"></div></span></span>' +
        '<span class="pct">' + v.pct + "%</span></button>";
    });

    h += '<div class="nav-onder">' +
      '<button class="knop stil" data-actie="ga" data-doel="#/tijdbalk">📏 Tijdbalk</button>' +
      '<button class="knop stil" data-actie="ga" data-doel="#/voortgang">📊 Voortgang</button>' +
      "</div>";
    h += "</div>";
    render(h);
  }

  function toonGroep(groepId) {
    var leerling = actieveLeerling();
    if (!leerling) { location.hash = "#/profielen"; return; }
    var groep = vindGroep(groepId);
    if (!groep) { location.hash = "#/home"; return; }

    var h = topbalk({ titel: "Groep " + groep.groep, terug: "#/home" });
    h += '<div class="inhoud">';
    h += '<div class="kaart" style="border-top:8px solid ' + groep.kleur + '">' +
      '<div style="font-size:2.4rem;text-align:center">' + groep.emoji + "</div>" +
      '<h2 class="centreer">' + esc(groep.titel) + "</h2>" +
      '<p class="zacht centreer klein" style="margin-top:4px">' + esc(groep.omschrijving) + "</p>" +
      '<h3 style="margin-top:14px">Dit ga je leren:</h3><ul class="doelen-lijst">' +
      groep.doelen.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") +
      "</ul></div>";

    var vorigeAf = true;
    groep.lessen.forEach(function (les, i) {
      var v = lesVoortgang(leerling, les.id);
      var open = i === 0 || vorigeAf;
      h += '<button class="les-rij' + (open ? "" : " dicht") + '" data-actie="' + (open ? "ga" : "dicht") + '" data-doel="#/les/' + les.id + '">' +
        '<span class="nummer">' + (open ? les.emoji : "🔒") + "</span>" +
        '<span class="info"><span class="naam">Les ' + (i + 1) + ": " + esc(les.titel) + "</span>" +
        '<span class="sub">' + esc(les.duur) + (open ? "" : " · maak eerst de vorige les af") + "</span></span>" +
        '<span class="sterren">' + (v && v.af ? sterrenTekst(v.sterren) : "") + "</span></button>";
      vorigeAf = !!(v && v.af);
    });

    h += "</div>";
    render(h);
  }

  function toonTijdbalk() {
    var h = topbalk({ titel: "De tien tijdvakken", terug: "#/home" });
    h += '<div class="inhoud">';
    h += '<div class="kaart"><h2>📏 De tijdbalk</h2>' +
      '<p class="zacht klein" style="margin-top:6px">Alle geschiedenis in tien tijdvakken, van heel lang geleden tot nu.</p></div>';
    window.TIJDVAKKEN.forEach(function (t) {
      h += '<div class="tijdvak-rij" style="border-left-color:' + t.kleur + '">' +
        '<span class="emoji">' + t.emoji + "</span>" +
        "<div><div class=\"naam\">" + t.nr + ". " + esc(t.naam) + "</div>" +
        '<div class="periode">' + esc(t.periode) + "</div></div></div>";
    });
    h += "</div>";
    render(h);
  }

  function toonVoortgang() {
    var leerling = actieveLeerling();
    if (!leerling) { location.hash = "#/profielen"; return; }

    var totAf = 0, totLessen = 0, totSterren = 0;
    window.CURRICULUM.forEach(function (g) {
      var v = groepVoortgang(leerling, g);
      totAf += v.af; totLessen += v.totaal; totSterren += v.sterren;
    });

    var h = topbalk({ titel: "Voortgang", terug: "#/home" });
    h += '<div class="inhoud">';
    h += '<div class="kaart" style="text-align:center"><div style="font-size:2.4rem">' + leerling.avatar + "</div>" +
      "<h2>" + esc(leerling.naam) + "</h2></div>";
    h += '<div class="stat-raster">' +
      '<div class="stat-blok"><div class="waarde">' + totAf + "/" + totLessen + '</div><div class="label">lessen af</div></div>' +
      '<div class="stat-blok"><div class="waarde">' + totSterren + '</div><div class="label">sterren</div></div>' +
      '<div class="stat-blok"><div class="waarde">' + Math.round((totAf / totLessen) * 100) + '%</div><div class="label">van de reis</div></div>' +
      "</div>";

    window.CURRICULUM.forEach(function (g) {
      var v = groepVoortgang(leerling, g);
      h += '<div class="kaart" style="padding:16px">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:1.6rem">' + g.emoji + "</span>" +
        '<strong style="flex:1">Groep ' + g.groep + " · " + esc(g.titel) + "</strong>" +
        '<span class="zacht klein">' + v.af + "/" + v.totaal + "</span></div>" +
        '<div class="voortgang-balk"><div style="width:' + v.pct + '%"></div></div>';
      g.lessen.forEach(function (les, i) {
        var lv = lesVoortgang(leerling, les.id);
        h += '<div style="display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:0.9rem">' +
          "<span>" + les.emoji + " Les " + (i + 1) + ": " + esc(les.titel) + "</span>" +
          '<span style="white-space:nowrap">' + (lv && lv.af ? sterrenTekst(lv.sterren) : '<span class="zacht">—</span>') + "</span></div>";
      });
      h += "</div>";
    });

    h += "</div>";
    render(h);
  }

  /* ---------- lesspeler ---------- */

  var speler = null; // { les, groep, stapIndex, fouten, terugDoel }

  function startLes(lesId) {
    var leerling = actieveLeerling();
    if (!leerling) { location.hash = "#/profielen"; return; }
    var info = vindLes(lesId);
    if (!info) { location.hash = "#/home"; return; }
    speler = {
      les: info.les,
      groep: info.groep,
      stapIndex: 0,
      fouten: 0,
      terugDoel: "#/groep/" + info.groep.id
    };
    toonStap();
  }

  function spelerKop() {
    var pct = Math.round((speler.stapIndex / speler.les.stappen.length) * 100);
    return '<header class="topbalk">' +
      '<button class="knop-terug" data-actie="stop-les" aria-label="Stoppen">✕</button>' +
      '<div class="les-voortgang"><div style="width:' + pct + '%"></div></div>' +
      "</header>";
  }

  function toonStap() {
    var stap = speler.les.stappen[speler.stapIndex];
    if (!stap) { toonKlaar(); return; }
    var h = spelerKop() + '<div class="inhoud">';

    switch (stap.type) {
      case "uitleg": h += bouwUitleg(stap); break;
      case "quiz": h += bouwQuiz(stap); break;
      case "waarnietwaar": h += bouwWaarNietWaar(stap); break;
      case "sorteer": h += bouwSorteer(stap); break;
      case "match": h += bouwMatch(stap); break;
    }

    h += '<div id="feedback-vak"></div>';
    h += '<button class="knop" id="volgende-knop" data-actie="volgende-stap" ' +
      (stap.type === "uitleg" ? "" : "disabled") + ">" +
      (stap.type === "uitleg" ? "Verder ➜" : "Volgende ➜") + "</button>";
    h += "</div>";
    render(h);

    if (stap.type === "sorteer") koppelSorteer(stap);
    if (stap.type === "match") koppelMatch(stap);
  }

  function toonFeedback(goed, uitleg) {
    var vak = document.getElementById("feedback-vak");
    vak.innerHTML = '<div class="feedback ' + (goed ? "goed" : "mis") + '">' +
      '<span class="f-emoji">' + (goed ? "🎉" : "🤔") + "</span>" +
      "<span>" + esc(goed ? kies(GOED_TEKSTEN) : kies(MIS_TEKSTEN)) +
      (uitleg ? '<div class="f-uitleg">' + esc(uitleg) + "</div>" : "") +
      "</span></div>";
  }

  function maakVolgendeVrij() {
    document.getElementById("volgende-knop").disabled = false;
  }

  /* --- uitleg --- */
  function bouwUitleg(stap) {
    // Uitlegteksten komen uit onze eigen lesbestanden en mogen <strong> bevatten.
    return '<div class="kaart">' +
      (stap.beeld ? '<div class="stap-beeld">' + stap.beeld + "</div>" : "") +
      '<h2 class="centreer">' + esc(stap.titel) + "</h2>" +
      '<div class="uitleg-tekst" style="margin-top:10px">' +
      stap.tekst.map(function (p) { return "<p>" + p + "</p>"; }).join("") +
      "</div>" +
      (stap.weetje ? '<div class="weetje">' + esc(stap.weetje) + "</div>" : "") +
      "</div>";
  }

  /* --- quiz (meerkeuze, evt. beeldraster) --- */
  function bouwQuiz(stap) {
    var h = '<div class="kaart">' +
      (stap.beeld ? '<div class="stap-beeld klein">' + stap.beeld + "</div>" : "") +
      '<div class="vraag-tekst">' + esc(stap.vraag) + "</div></div>";
    h += '<div class="opties' + (stap.raster ? " raster" : "") + '">';
    stap.opties.forEach(function (o, i) {
      h += '<button class="optie" data-actie="quiz-antwoord" data-index="' + i + '">' +
        (o.beeld ? '<span class="emoji">' + o.beeld + "</span>" : "") +
        "<span>" + esc(o.tekst) + "</span></button>";
    });
    return h + "</div>";
  }

  function quizAntwoord(stap, index, knop) {
    var goed = index === stap.juist;
    if (!goed) speler.fouten++;
    document.querySelectorAll(".optie").forEach(function (el, i) {
      el.classList.add("uit");
      if (i === stap.juist) el.classList.add("juist");
    });
    if (!goed) knop.classList.add("fout");
    toonFeedback(goed, stap.uitleg);
    maakVolgendeVrij();
  }

  /* --- waar / niet waar --- */
  function bouwWaarNietWaar(stap) {
    return '<div class="kaart">' +
      (stap.beeld ? '<div class="stap-beeld klein">' + stap.beeld + "</div>" : "") +
      '<div class="vraag-tekst">' + esc(stap.stelling) + "</div></div>" +
      '<div class="wnw-knoppen">' +
      '<button class="optie" data-actie="wnw-antwoord" data-antwoord="waar"><span class="emoji">👍</span><span>WAAR</span></button>' +
      '<button class="optie" data-actie="wnw-antwoord" data-antwoord="nietwaar"><span class="emoji">👎</span><span>NIET WAAR</span></button>' +
      "</div>";
  }

  function wnwAntwoord(stap, antwoord, knop) {
    var gekozenWaar = antwoord === "waar";
    var goed = gekozenWaar === stap.juist;
    if (!goed) speler.fouten++;
    document.querySelectorAll(".optie").forEach(function (el) {
      el.classList.add("uit");
      var isWaarKnop = el.getAttribute("data-antwoord") === "waar";
      if (isWaarKnop === stap.juist) el.classList.add("juist");
    });
    if (!goed) knop.classList.add("fout");
    toonFeedback(goed, stap.uitleg);
    maakVolgendeVrij();
  }

  /* --- sorteeroefening (tik-om-te-plaatsen: werkt fijn op touch) --- */
  var sorteerStaat = null;

  function bouwSorteer(stap) {
    var h = '<div class="kaart"><div class="vraag-tekst">' + esc(stap.opdracht) + "</div>" +
      '<p class="zacht klein centreer" style="margin-top:6px">Tik op een kaartje om het op de volgende lege plek te zetten. Tik nog eens om het terug te leggen.</p></div>';
    h += '<div class="sorteer-slots" id="sorteer-slots"></div>';
    h += '<div class="sorteer-pool" id="sorteer-pool" style="margin-top:4px"></div>';
    h += '<button class="knop groen" id="controleer-knop" data-actie="sorteer-controleer" disabled style="margin-top:4px">Controleer ✔</button>';
    return h;
  }

  function koppelSorteer(stap) {
    sorteerStaat = {
      stap: stap,
      // slots[i] = index in stap.items (of null); stap.items staat al in de juiste volgorde
      slots: stap.items.map(function () { return null; }),
      vast: stap.items.map(function () { return false; }),
      poolVolgorde: schudAnders(stap.items.map(function (_, i) { return i; }))
    };
    tekenSorteer();
  }

  function tekenSorteer() {
    var s = sorteerStaat;
    var slotsEl = document.getElementById("sorteer-slots");
    var poolEl = document.getElementById("sorteer-pool");

    slotsEl.innerHTML = s.slots.map(function (itemIndex, slotIndex) {
      var klas = "sorteer-slot";
      if (s.vast[slotIndex]) klas += " goed";
      else if (itemIndex !== null) klas += " gevuld";
      var binnen = "";
      if (itemIndex !== null) {
        var item = s.stap.items[itemIndex];
        binnen = '<button class="item-in-slot" data-actie="sorteer-leeg" data-slot="' + slotIndex + '"' +
          (s.vast[slotIndex] ? " disabled" : "") + ">" +
          '<span class="emoji">' + item.beeld + "</span><span>" + esc(item.tekst) + "</span></button>";
      } else {
        binnen = '<span class="zacht klein">tik een kaartje…</span>';
      }
      return '<div class="' + klas + '"><span class="rang">' + (slotIndex + 1) + "</span>" + binnen + "</div>";
    }).join("");

    var geplaatst = s.slots.filter(function (x) { return x !== null; });
    poolEl.innerHTML = s.poolVolgorde.filter(function (i) { return geplaatst.indexOf(i) === -1; })
      .map(function (i) {
        var item = s.stap.items[i];
        return '<button class="sorteer-item" data-actie="sorteer-plaats" data-item="' + i + '">' +
          '<span class="emoji">' + item.beeld + "</span><span>" + esc(item.tekst) + "</span></button>";
      }).join("");

    var vol = geplaatst.length === s.slots.length;
    var klaar = s.vast.every(function (v) { return v; });
    document.getElementById("controleer-knop").disabled = !vol || klaar;
  }

  function sorteerPlaats(itemIndex) {
    var s = sorteerStaat;
    for (var i = 0; i < s.slots.length; i++) {
      if (s.slots[i] === null) { s.slots[i] = itemIndex; break; }
    }
    tekenSorteer();
  }

  function sorteerLeeg(slotIndex) {
    var s = sorteerStaat;
    if (s.vast[slotIndex]) return;
    s.slots[slotIndex] = null;
    tekenSorteer();
  }

  function sorteerControleer() {
    var s = sorteerStaat;
    var foutErbij = false;
    s.slots.forEach(function (itemIndex, slotIndex) {
      if (itemIndex === slotIndex) {
        s.vast[slotIndex] = true;
      } else if (itemIndex !== null) {
        foutErbij = true;
      }
    });

    if (foutErbij) {
      speler.fouten++;
      // Foute kaartjes even rood laten zien en dan terugleggen.
      var slotsEl = document.getElementById("sorteer-slots");
      Array.prototype.forEach.call(slotsEl.children, function (el, i) {
        if (s.slots[i] !== null && !s.vast[i]) el.classList.add("fout-slot");
      });
      toonFeedback(false, "De groene staan goed. Probeer de rest opnieuw!");
      setTimeout(function () {
        s.slots = s.slots.map(function (itemIndex, slotIndex) {
          return s.vast[slotIndex] ? itemIndex : null;
        });
        tekenSorteer();
      }, 900);
    } else {
      tekenSorteer();
      toonFeedback(true, "Alles staat in de goede volgorde!");
      maakVolgendeVrij();
    }
  }

  /* --- matchoefening (tik links + tik rechts) --- */
  var matchStaat = null;

  function bouwMatch(stap) {
    return '<div class="kaart"><div class="vraag-tekst">' + esc(stap.opdracht) + "</div>" +
      '<p class="zacht klein centreer" style="margin-top:6px">Tik op een kaartje links en dan op het kaartje rechts dat erbij hoort.</p></div>' +
      '<div class="match-kolommen">' +
      '<div class="match-kolom" id="match-links"></div>' +
      '<div class="match-kolom" id="match-rechts"></div>' +
      "</div>";
  }

  function koppelMatch(stap) {
    matchStaat = {
      stap: stap,
      linksVolgorde: schud(stap.paren.map(function (_, i) { return i; })),
      rechtsVolgorde: schud(stap.paren.map(function (_, i) { return i; })),
      klaar: stap.paren.map(function () { return false; }),
      gekozenLinks: null,
      gekozenRechts: null
    };
    tekenMatch();
  }

  function tekenMatch() {
    var m = matchStaat;
    function kolom(volgorde, kant) {
      return volgorde.map(function (paarIndex) {
        var item = m.stap.paren[paarIndex][kant === "links" ? 0 : 1];
        var klas = "match-item";
        if (m.klaar[paarIndex]) klas += " klaar";
        if ((kant === "links" ? m.gekozenLinks : m.gekozenRechts) === paarIndex) klas += " geselecteerd";
        return '<button class="' + klas + '" data-actie="match-kies" data-kant="' + kant + '" data-paar="' + paarIndex + '">' +
          '<span class="emoji">' + item.beeld + "</span><span>" + esc(item.tekst) + "</span></button>";
      }).join("");
    }
    document.getElementById("match-links").innerHTML = kolom(m.linksVolgorde, "links");
    document.getElementById("match-rechts").innerHTML = kolom(m.rechtsVolgorde, "rechts");
  }

  function matchKies(kant, paarIndex, knop) {
    var m = matchStaat;
    if (m.klaar[paarIndex]) return;
    if (kant === "links") m.gekozenLinks = m.gekozenLinks === paarIndex ? null : paarIndex;
    else m.gekozenRechts = m.gekozenRechts === paarIndex ? null : paarIndex;

    if (m.gekozenLinks !== null && m.gekozenRechts !== null) {
      if (m.gekozenLinks === m.gekozenRechts) {
        m.klaar[m.gekozenLinks] = true;
        m.gekozenLinks = m.gekozenRechts = null;
        tekenMatch();
        if (m.klaar.every(function (k) { return k; })) {
          toonFeedback(true, "Alle paren gevonden!");
          maakVolgendeVrij();
        }
      } else {
        speler.fouten++;
        var links = m.gekozenLinks, rechts = m.gekozenRechts;
        m.gekozenLinks = m.gekozenRechts = null;
        tekenMatch();
        // De twee foute kaartjes even laten schudden.
        document.querySelectorAll(".match-item").forEach(function (el) {
          var p = parseInt(el.getAttribute("data-paar"), 10);
          var k = el.getAttribute("data-kant");
          if ((k === "links" && p === links) || (k === "rechts" && p === rechts)) el.classList.add("fout");
        });
        setTimeout(function () {
          document.querySelectorAll(".match-item.fout").forEach(function (el) { el.classList.remove("fout"); });
        }, 500);
      }
    } else {
      tekenMatch();
    }
  }

  /* --- klaar-scherm --- */
  function toonKlaar() {
    var sterren = speler.fouten === 0 ? 3 : speler.fouten <= 2 ? 2 : 1;
    var leerling = actieveLeerling();
    zetLesKlaar(leerling, speler.les.id, sterren);

    var complimenten = {
      3: "Foutloos! Jij bent een echte tijdreiziger!",
      2: "Knap gedaan! Bijna alles goed.",
      1: "Gehaald! Speel de les nog eens voor meer sterren."
    };

    var groepId = speler.groep.id;
    var lesIndex = speler.groep.lessen.indexOf(speler.les);
    var volgendeLes = speler.groep.lessen[lesIndex + 1];

    var h = '<header class="topbalk"><div class="titel centreer" style="text-align:center">Les klaar!</div></header>';
    h += '<div class="inhoud"><div class="kaart klaar-scherm">' +
      '<div class="grote-emoji">🏅</div>' +
      "<h1>" + esc(speler.les.titel) + "</h1>" +
      '<div class="klaar-sterren">' +
      [0, 1, 2].map(function (i) { return '<span class="ster">' + (i < sterren ? "⭐" : "☆") + "</span>"; }).join("") +
      "</div>" +
      "<p>" + esc(complimenten[sterren]) + "</p></div>";

    if (volgendeLes) {
      h += '<button class="knop" data-actie="start-les" data-les="' + volgendeLes.id + '">➜ Volgende les: ' + esc(volgendeLes.titel) + "</button>";
    }
    h += '<button class="knop stil" data-actie="ga" data-doel="#/groep/' + groepId + '">📚 Terug naar de lessen</button>';
    h += "</div>";
    speler = null;
    render(h);
  }

  /* ---------- gebeurtenissen ---------- */

  app.addEventListener("click", function (e) {
    var doel = e.target.closest("[data-actie]");
    if (!doel) return;
    var actie = doel.getAttribute("data-actie");

    switch (actie) {
      case "ga":
        location.hash = doel.getAttribute("data-doel");
        break;

      case "dicht":
        break; // vergrendelde les

      case "kies-leerling":
        if (e.target.closest('[data-actie="verwijder-leerling"]')) return;
        staat.actief = doel.getAttribute("data-id");
        bewaar();
        location.hash = "#/home";
        break;

      case "verwijder-leerling": {
        var id = doel.getAttribute("data-id");
        var leerling = staat.leerlingen.find(function (l) { return l.id === id; });
        if (leerling && window.confirm("Weet je zeker dat je " + leerling.naam + " wilt verwijderen? De voortgang gaat dan verloren.")) {
          staat.leerlingen = staat.leerlingen.filter(function (l) { return l.id !== id; });
          if (staat.actief === id) staat.actief = null;
          bewaar();
          toonProfielen();
        }
        break;
      }

      case "maak-leerling": {
        var invoer = document.getElementById("naam-invoer");
        var naam = (invoer.value || "").trim();
        if (!naam) { invoer.focus(); invoer.placeholder = "Vul eerst je naam in!"; return; }
        var gekozen = document.querySelector(".avatar-optie.gekozen");
        var nieuw = {
          id: "l" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          naam: naam.slice(0, 20),
          avatar: gekozen ? gekozen.getAttribute("data-avatar") : AVATARS[0],
          voortgang: {}
        };
        staat.leerlingen.push(nieuw);
        staat.actief = nieuw.id;
        bewaar();
        location.hash = "#/home";
        break;
      }

      case "start-les":
        location.hash = "#/les/" + doel.getAttribute("data-les");
        break;

      case "stop-les": {
        var terug = speler ? speler.terugDoel : "#/home";
        speler = null;
        location.hash = terug;
        break;
      }

      case "volgende-stap":
        if (!speler) return;
        speler.stapIndex++;
        toonStap();
        break;

      case "quiz-antwoord":
        quizAntwoord(speler.les.stappen[speler.stapIndex], parseInt(doel.getAttribute("data-index"), 10), doel);
        break;

      case "wnw-antwoord":
        wnwAntwoord(speler.les.stappen[speler.stapIndex], doel.getAttribute("data-antwoord"), doel);
        break;

      case "sorteer-plaats":
        sorteerPlaats(parseInt(doel.getAttribute("data-item"), 10));
        break;

      case "sorteer-leeg":
        sorteerLeeg(parseInt(doel.getAttribute("data-slot"), 10));
        break;

      case "sorteer-controleer":
        sorteerControleer();
        break;

      case "match-kies":
        matchKies(doel.getAttribute("data-kant"), parseInt(doel.getAttribute("data-paar"), 10), doel);
        break;
    }
  });

  // Avatar kiezen in het nieuw-profielscherm
  app.addEventListener("click", function (e) {
    var avatar = e.target.closest(".avatar-optie");
    if (!avatar) return;
    document.querySelectorAll(".avatar-optie").forEach(function (el) { el.classList.remove("gekozen"); });
    avatar.classList.add("gekozen");
  });

  /* ---------- router ---------- */

  function router() {
    var hash = location.hash || "#/";
    var delen = hash.replace(/^#\//, "").split("/");

    // Een les onderbreken door te navigeren: speler opruimen.
    if (delen[0] !== "les") speler = null;

    switch (delen[0]) {
      case "profielen": toonProfielen(); break;
      case "nieuw": toonNieuwProfiel(); break;
      case "home": toonHome(); break;
      case "groep": toonGroep(delen[1]); break;
      case "les": startLes(delen[1]); break;
      case "tijdbalk": toonTijdbalk(); break;
      case "voortgang": toonVoortgang(); break;
      default:
        if (!staat.leerlingen.length) location.hash = "#/nieuw";
        else if (!actieveLeerling()) location.hash = "#/profielen";
        else location.hash = "#/home";
    }
  }

  window.addEventListener("hashchange", router);
  router();
})();
