/* ═══════════════════════════════════════════
   FLO KARL BERGER — Interaction Layer
   Handles: boot, keyboard nav, page rendering,
   language toggle, sprites.
   ═══════════════════════════════════════════ */

var currentPage = 'menu';
var cursor = 0;
var lines = [];
var ready = false;
var lang = 'DE';
var spriteTimers = [];
var scrollEl = document.getElementById('scroll');


/* ── INDENT MEASUREMENT ───────────────────── */

function measureIndent() {
  var m = document.getElementById('measure');
  m.style.padding = '0';
  m.textContent = 'FLO ';
  var w = m.getBoundingClientRect().width;
  document.documentElement.style.setProperty('--indent', w + 'px');
}
window.addEventListener('resize', measureIndent);


/* ── SPRITES ──────────────────────────────── */

var PX = 2;
var SPR_W = 10;
var SPR_H = 14;

var flagFrames = [
  ['          ','   ##     ','  #  #    ','   ##     ','   #  ####','  ###  ## ',' # # #    ','   #      ','   #      ','  # #     ','  #  #    ',' #    #   ','          ','          '],
  ['          ','   ##     ','  #  #    ','   ##     ','   # #### ','  ### ##  ',' # # #    ','   #      ','   #      ','  # #     ','  #  #    ',' #    #   ','          ','          '],
  ['          ','   ##     ','  #  #    ','   ##     ','   #  ####','  ###  ## ',' # # #  # ','   #      ','   #      ','  # #     ','  #  #    ',' #    #   ','          ','          '],
];

var digFrames = [
  ['          ','  ##      ',' #  #     ','  ##      ','  ##      ',' ####     ','  # #   # ','  #  # #  ','  #   #   ',' # #  #   ',' #  # #   ','#    ##   ','      #   ','          '],
  ['          ','  ##      ',' #  #     ','  ##      ','  ##      ',' ####     ','  # # #   ','  #  ##   ','  #  #    ',' # # #    ',' #  ##    ','#    #    ','     ##   ','          '],
  ['          ','  ##      ',' #  #     ','  ##      ','  #       ',' ####     ','  # ##    ','  # # #   ','  #   #   ',' # #  #   ',' #  # #   ','#    ###  ','          ','          '],
];

var singFrames = [
  ['          ','   ##     ','  #  #    ','   ##     ','   #  |   ','  ### |   ',' # # #|   ','   #  |   ','   #  |   ','  # # |   ','  #  #|   ',' #   ###  ','          ','          '],
  ['        # ','   ##  #  ','  #  #    ','  #  #    ','   #  |   ','  ### |   ',' # # #|   ','   #  |   ','   #  |   ','  # # |   ','  #  #|   ',' #   ###  ','          ','          '],
  ['       #  ','   ##   # ','  #  #    ','  #  #    ','   #  |   ','  ### |   ',' # # #|   ','   #  |   ','   #  |   ','  # # |   ','  #  #|   ',' #   ###  ','          ','          '],
];

var marchFrames = [
  ['          ','   ##     ','  #  #    ','   ##     ','   #      ','  ###     ',' # # #    ','   #      ','   #      ','  # #     ',' #    #   ','  #  #    ','          ','          '],
  ['          ','   ##     ','  #  #    ','   ##     ','   #      ','  ###     ',' # # #    ','   #      ','   #      ','  # #     ','  #  #    ',' #    #   ','          ','          '],
  ['          ','   ##     ','  #  #    ','   ##     ','   #      ','  ###     ',' # # #    ','   #      ','   #      ','  # #     ','#    #    ',' #  #     ','          ','          '],
];

var spriteMap = {
  BIO: flagFrames,
  WORKS: digFrames,
  GROUPS: singFrames,
  CONTACT: marchFrames,
};

function drawSprite(canvas, frames, frameIndex) {
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var frame = frames[frameIndex % frames.length];
  for (var y = 0; y < frame.length; y++) {
    for (var x = 0; x < frame[y].length; x++) {
      var ch = frame[y][x];
      if (ch === '#') {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--dim').trim();
        ctx.fillRect(x * PX, y * PX, PX, PX);
      } else if (ch === '|') {
        ctx.fillStyle = '#5566AA';
        ctx.fillRect(x * PX, y * PX, PX, PX);
      }
    }
  }
}

function clearSprites() {
  spriteTimers.forEach(function(t) { clearInterval(t); });
  spriteTimers = [];
}

function attachSprite(el, frames) {
  var canvas = document.createElement('canvas');
  canvas.width = SPR_W * PX;
  canvas.height = SPR_H * PX;
  canvas.className = 'sprite-canvas';
  canvas.style.left = 'calc(100% + 10px)';
  el.appendChild(canvas);
  var fi = 0;
  drawSprite(canvas, frames, fi);
  var timer = setInterval(function() {
    fi = (fi + 1) % frames.length;
    drawSprite(canvas, frames, fi);
  }, 500);
  spriteTimers.push(timer);
}


/* ── TRANSLATIONS ─────────────────────────── */

var DE = {
  bioTitle: '──── BIO ────',
  bioLines: ['ARBEITET MIT DEM SOZIALEN,','POLITISCHEN UND MATERIELLEN','AUSDRUCK VON'],
  assembly: 'VERSAMMLUNG',
  bioDesc1: ['TEMPORÄRE SKULPTURALE SITUATIONEN','MIT FOKUS AUF ZEIT, ERINNERUNG UND','DIE KOLLEKTIVEN STRUKTUREN DES RITUALS.'],
  bioDesc2: ['FRIEDHOFSGÄRTNER. GRABSTEIN-','GESTALTER. TRAUERPROZESSIONEN','AUS ASSEMBLAGEN ÜBERSCHRIEBENER','ORTE. HAUSBESETZERINITIATIVEN IN','WIEN, LJUBLJANA, HELSINKI.'],
  based: 'LEBT IN WIEN / BURGENLAND',
  back: '◀ ZURÜCK ZUM MENÜ',
  worksTitle: '──── ARBEITEN ────',
  groupsTitle: '──── GRUPPEN ────',
  groupsFooter: ['STRATEGIEN FÜR EINE BESSERE','WELT DURCH FÜRSORGLICHE,','LOKALE BEZIEHUNGEN'],
  contactTitle: '──── KONTAKT ────',
  noInsta: 'KEIN INSTAGRAM', noPdf: 'KEIN PORTFOLIO PDF', opening: 'KOMM ZUR ERÖFFNUNG',
  legendMenu: '▲▼:WÄHLEN   ENTER:ÖFFNEN',
  legendSub: '▲▼:BLÄTTERN   ESC/◀:ZURÜCK',
};

var EN = {
  bioTitle: '──── BIO ────',
  bioLines: ['WORKING WITH THE','SOCIAL, POLITICAL,','AND MATERIAL','EXPRESSION OF'],
  assembly: 'ASSEMBLY',
  bioDesc1: ['TEMPORARY SCULPTURAL SITUATIONS','FOCUSED ON TIME, MEMORY, AND THE','COLLECTIVE STRUCTURES OF RITUAL.'],
  bioDesc2: ['CEMETERY GARDENER. GRAVESTONE','DESIGNER. FUNERARY PROCESSIONS','FROM ASSEMBLAGES OF OVERWRITTEN','SITES. SQUATTERS INITIATIVES IN','VIENNA, LJUBLJANA, HELSINKI.'],
  based: 'BASED IN VIENNA / BURGENLAND',
  back: '◀ BACK TO MENU',
  worksTitle: '──── WORKS ────',
  groupsTitle: '──── GROUPS ────',
  groupsFooter: ['STRATEGIES FOR A BETTER','WORLD THROUGH CARING,','LOCAL RELATIONSHIPS'],
  contactTitle: '──── CONTACT ────',
  noInsta: 'NO INSTAGRAM', noPdf: 'NO PORTFOLIO PDF', opening: 'COME TO THE OPENING',
  legendMenu: '▲▼:SELECT   ENTER:OPEN',
  legendSub: '▲▼:BROWSE   ESC/◀:BACK',
};

function T() { return lang === 'DE' ? DE : EN; }


/* ── LINE BUILDER ─────────────────────────── */

function L(text, opts) {
  return Object.assign({ text: text, size: 'big', color: 'white', mt: '', action: null, back: false, indent: false, sprite: null }, opts);
}


/* ── DATA ─────────────────────────────────── */

var works = [
  { year: '2024', title: 'FRIEDHOF SESSIONS IV', place: 'ZENTRALFRIEDHOF, VIENNA', type: 'SCULPTURAL PROCESSION' },
  { year: '2023', title: 'WIR BLEIBEN ALLE', place: 'GRUPPE BUSSI / PUBLIC SPACE, GRAZ', type: 'PARTICIPATORY INTERVENTION' },
  { year: '2023', title: 'TAFEL//TISCH//GRAB', place: 'KUNSTRAUM NIEDEROESTERREICH', type: 'INSTALLATION' },
  { year: '2022', title: 'OVERWRITTEN SITES I-III', place: 'VARIOUS SQUATS, LJUBLJANA', type: 'ASSEMBLAGE SERIES' },
  { year: '2022', title: 'CUSTOM STONES', place: 'COMMISSIONED / BURGENLAND', type: 'GRAVESTONE DESIGN' },
  { year: '2021', title: 'SKATEPARK RITUALS', place: 'ST. MARX INITIATIVE, VIENNA', type: 'COMMUNITY WORKSHOP' },
  { year: '2020', title: 'CARE STRUCTURES', place: 'HELSINKI / SUVILAHTI', type: 'SITE-SPECIFIC SCULPTURE' },
  { year: '2019', title: 'PANNONISCHE PROCESSIONS', place: 'BURGENLAND REGION', type: 'FUNERARY ASSEMBLAGE' },
  { year: '2018', title: 'GARDEN FOR THE DEAD', place: 'WIENER NEUSTADT', type: 'SCULPTURAL SITUATION' },
];

var groups = [
  { name: 'PANNONISCHE TAFEL', since: '2008', desc: 'FOODBANK + SOCIAL OUTREACH / BURGENLAND' },
  { name: 'ST. MARX INITIATIVE', since: '2012', desc: 'DIY SKATEPARK + COMMUNITY WORKSHOPS / WIEN III' },
  { name: 'GRUPPE BUSSI', since: '2015', desc: 'ANARCHIST ART COLLECTIVE / PARTICIPATORY PUBLIC INTERVENTIONS' },
];


/* ── PAGE BUILDERS ────────────────────────── */

function toggleLang() {
  lang = lang === 'DE' ? 'EN' : 'DE';
  var savedCursor = cursor;
  goTo('menu');
  cursor = savedCursor;
  highlight();
}

function pageMenu() {
  return [
    L('──── MENU ────', { color: 'dim' }),
    L('FLO KARL BERGER', { color: 'dim', mt: 'lg' }),
    L('BIO', { mt: 'sm', action: function() { goTo('bio'); }, indent: true, sprite: 'BIO' }),
    L('WORKS', { action: function() { goTo('works'); }, indent: true, sprite: 'WORKS' }),
    L('GROUPS', { action: function() { goTo('groups'); }, indent: true, sprite: 'GROUPS' }),
    L('CONTACT', { action: function() { goTo('contact'); }, indent: true, sprite: 'CONTACT' }),
    L('IDIOMA/LANGUE:' + lang, { color: 'dim', size: 'sml', mt: 'sm', action: toggleLang, indent: true }),
    L('SELECT:▲ ▼ KEY', { color: 'dim', size: 'sml', mt: 'lg' }),
    L('SET   :▶ KEY', { color: 'dim', size: 'sml' }),
    L('END   :ACTION KEY', { color: 'dim', size: 'sml' }),
  ];
}

function pageBio() {
  var t = T();
  var r = [ L(t.bioTitle, { color: 'dim' }) ];
  t.bioLines.forEach(function(l, i) { r.push(L(l, { mt: i === 0 ? 'lg' : '' })); });
  r.push(L(t.assembly));
  t.bioDesc1.forEach(function(l, i) { r.push(L(l, { color: 'dim', size: 'sml', mt: i === 0 ? 'lg' : '' })); });
  t.bioDesc2.forEach(function(l, i) { r.push(L(l, { color: 'dim', size: 'sml', mt: i === 0 ? 'md' : '' })); });
  r.push(L(t.based, { size: 'sml', mt: 'md' }));
  r.push(L(t.back, { mt: 'xl', action: function() { goTo('menu'); }, back: true }));
  return r;
}

function pageWorks() {
  var t = T();
  var r = [ L(t.worksTitle, { color: 'dim' }) ];
  works.forEach(function(w, i) {
    r.push(L(w.title, { mt: i === 0 ? 'lg' : 'sm' }));
    r.push(L(w.year + '  ' + w.place + '  ' + w.type, { color: 'dim', size: 'sml' }));
  });
  r.push(L(t.back, { mt: 'xl', action: function() { goTo('menu'); }, back: true }));
  return r;
}

function pageGroups() {
  var t = T();
  var r = [ L(t.groupsTitle, { color: 'dim' }) ];
  groups.forEach(function(g, i) {
    r.push(L(g.name, { mt: i === 0 ? 'lg' : 'sm' }));
    r.push(L('SINCE ' + g.since + '  ' + g.desc, { color: 'dim', size: 'sml' }));
  });
  t.groupsFooter.forEach(function(l, i) { r.push(L(l, { size: 'sml', mt: i === 0 ? 'lg' : '' })); });
  r.push(L(t.back, { mt: 'xl', action: function() { goTo('menu'); }, back: true }));
  return r;
}

function pageContact() {
  var t = T();
  return [
    L(t.contactTitle, { color: 'dim' }),
    L('MAIL', { color: 'dim', mt: 'lg' }),
    L('FLO@GRUPPEBUSSI.ORG'),
    L('SIGNAL', { color: 'dim', mt: 'md' }),
    L('ON REQUEST'),
    L(t.noInsta, { color: 'dim', size: 'sml', mt: 'lg' }),
    L(t.noPdf, { color: 'dim', size: 'sml' }),
    L(t.opening, { color: 'dim', size: 'sml' }),
    L(t.back, { mt: 'xl', action: function() { goTo('menu'); }, back: true }),
  ];
}

var PAGES = { menu: pageMenu, bio: pageBio, works: pageWorks, groups: pageGroups, contact: pageContact };


/* ── RENDER ENGINE ────────────────────────── */

function render() {
  clearSprites();
  var container = document.getElementById('content');
  container.innerHTML = '';
  lines = PAGES[currentPage]();

  lines.forEach(function(line, i) {
    var el = document.createElement('div');
    var cls = 'r';
    cls += line.size === 'sml' ? ' sml' : ' big';
    cls += ' c-' + line.color;
    if (line.action) cls += ' clickable';
    if (line.back) cls += ' back-btn';
    if (line.indent) cls += ' indent';
    if (line.mt) cls += ' mt-' + line.mt;
    el.className = cls;
    el.textContent = line.text;
    el.dataset.idx = i;

    if (line.action) {
      (function(fn) {
        el.addEventListener('click', function() { glitch(); fn(); });
      })(line.action);
    }
    (function(idx) {
      el.addEventListener('mouseenter', function() { cursor = idx; highlight(); });
    })(i);

    container.appendChild(el);

    if (line.sprite && spriteMap[line.sprite]) {
      attachSprite(el, spriteMap[line.sprite]);
    }
  });

  highlight();
  var t = T();
  document.getElementById('legend').textContent = currentPage === 'menu' ? t.legendMenu : t.legendSub;
  scrollEl.scrollTop = 0;
}

function highlight() {
  document.querySelectorAll('.r').forEach(function(el) { el.classList.remove('hi'); });
  var el = document.querySelector('.r[data-idx="' + cursor + '"]');
  if (el) {
    el.classList.add('hi');
    var elRect = el.getBoundingClientRect();
    var containerRect = scrollEl.getBoundingClientRect();
    var statusbarHeight = 60;
    var visibleBottom = containerRect.bottom - statusbarHeight;
    if (elRect.bottom > visibleBottom) {
      scrollEl.scrollTop += elRect.bottom - visibleBottom + 10;
    } else if (elRect.top < containerRect.top) {
      scrollEl.scrollTop += elRect.top - containerRect.top - 10;
    }
  }
}

function move(dir) {
  cursor = (cursor + dir + lines.length) % lines.length;
  highlight();
}

function glitch() {
  var g = document.getElementById('glitch');
  g.classList.add('on');
  setTimeout(function() { g.classList.remove('on'); }, 150);
}

function goTo(page) {
  currentPage = page;
  cursor = 0;
  measureIndent();
  render();
}


/* ── KEYBOARD ─────────────────────────────── */

document.addEventListener('keydown', function(e) {
  if (!ready) return;
  if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
  else if (e.key === 'Enter' || e.key === 'ArrowRight') {
    e.preventDefault();
    var line = lines[cursor];
    if (line && line.action) { glitch(); line.action(); }
  }
  else if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'ArrowLeft') {
    e.preventDefault();
    if (currentPage !== 'menu') { glitch(); goTo('menu'); }
  }
});


/* ── BOOT SEQUENCE ────────────────────────── */

window.addEventListener('load', function() {
  document.body.focus();
  setTimeout(function() { document.getElementById('boot-0').style.display = 'block'; }, 400);
  setTimeout(function() { document.getElementById('boot-1').style.display = 'block'; }, 1100);
  setTimeout(function() { document.getElementById('boot-2').style.display = 'block'; }, 1800);
  setTimeout(function() { document.getElementById('boot-3').style.display = 'block'; }, 2200);
  setTimeout(function() {
    document.getElementById('boot').classList.add('hidden');
    document.getElementById('content').classList.add('visible');
    measureIndent();
    goTo('menu');
    ready = true;
  }, 2800);
});
