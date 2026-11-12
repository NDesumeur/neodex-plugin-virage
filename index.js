// Virage : course contre la montre vue de dessus : six circuits, un fantôme, des médailles.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Virage</span><span class="hint">↑ accélérer · ↓ freiner · ← → tourner · Entrée : recommencer · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="vrCanvas" width="200" height="150" role="img" aria-label="Virage"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="vrStats"></div></div>
      <div class="row"><button class="btn main" id="vrNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Trois tours le plus vite possible. Le bitume tient la route, l'herbe et le sable freinent, la glace glisse et les flèches bleues donnent un coup de turbo. Passe les quatre plots bleus : à chacun, l'écart avec ton meilleur chrono s'affiche en vert ou en rouge. Ton meilleur chrono roule à côté de toi en fantôme. Bronze, argent, or et médaille d'auteur ; une médaille ouvre le circuit suivant. Entrée recommence tout de suite.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,600px);width:auto;aspect-ratio:200/150;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "VIRAGE", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#e83a3a", "accL": "#ffc8c0", "accS": "#a82a2a", "accD": "#2a0a08", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#2a0a08", "spark2": "#e83a3a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["...kkkkk....", "..kgrrrgk...", ".kkrwwwrkk..", ".kkrwwwrkk..", "..krrrrrr...", "..krwrwrr...", "..krrrrrr...", ".kkrwwwrkk..", ".kkrrrrrrk..", "..korrrok...", "...kkkkk....", "............"],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Virage : course contre la montre vue de dessus. Six circuits, trois tours, des points de passage, un fantôme de ton meilleur
   chrono, des médailles (bronze, argent, or, auteur). Le bitume tient, l'herbe et le sable freinent, la glace glisse, les flèches accélèrent ---------- */
const VR = {W: 200, H: 150, LAPS: 3, ROAD: 30, CURB: 3};
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const vrs = gstore('virage', {best: {}, laps: {}, splits: {}, ghosts: {}, medals: {}, games: 0, track: 0});
let vr = null, vrac = null, vrMute = false;
function vrBeep(f, d, type = 'square', slide = 0, vol = .03) { if (vrMute) return; try { vrac ??= new AudioContext(); const o = vrac.createOscillator(), g = vrac.createGain(), t = vrac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(vrac.destination); o.start(t); o.stop(t + d); } catch {} }
// les circuits : des points de passage (le tracé est lissé entre eux), et des zones (en fraction du tour) : glace, sable sur les côtés, flèches turbo
const VR_TRACKS = [
  {name: 'Prairie', pts: [[100, 250], [150, 120], [350, 90], [550, 120], [600, 250], [550, 380], [350, 410], [150, 380]]},
  {name: 'Épingles', pts: [[80, 100], [600, 100], [650, 160], [600, 220], [220, 220], [170, 280], [220, 340], [600, 340], [650, 400], [600, 460], [80, 460], [40, 280]]},
  {name: 'Banquise', pts: [[100, 150], [300, 80], [500, 120], [620, 260], [520, 400], [350, 340], [200, 420], [80, 320]], ice: [[.28, .58]]},
  {name: 'Dunes', pts: [[80, 250], [160, 100], [300, 160], [380, 80], [520, 120], [620, 240], [540, 380], [420, 320], [300, 420], [160, 400]], sand: 1, road: 26},
  {name: 'Turbo', pts: [[60, 80], [640, 80], [670, 140], [610, 180], [670, 220], [640, 420], [60, 420], [30, 250]], boost: [.02, .3, .5, .78]},
  {name: 'Nœud', pts: [[100, 80], [270, 60], [310, 160], [220, 200], [270, 280], [420, 240], [460, 100], [610, 120], [630, 300], [510, 440], [300, 430], [150, 450], [60, 320], [160, 250], [60, 170]], road: 26, ice: [[.62, .72]], boost: [.05, .45]},
];
// le tracé lissé (Catmull-Rom), un point tous les 2 pixels ; puis la carte des sols : 0 herbe, 1 bitume, 2 turbo, 3 glace, 4 sable, 5 bordure
function vrBuild(def) {
  const P = def.pts, n = P.length, pts = [];
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [P[(i - 1 + n) % n], P[i], P[(i + 1) % n], P[(i + 2) % n]], len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), steps = Math.max(4, Math.round(len / 2));
    for (let s = 0; s < steps; s++) { const t = s / steps, t2 = t * t, t3 = t2 * t, f = (a, b, c, d) => .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]); }
  }
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), ox = Math.min(...xs) - 60, oy = Math.min(...ys) - 60;
  for (const p of pts) { p[0] -= ox; p[1] -= oy; }
  const W = Math.ceil(Math.max(...xs) - ox + 60), H = Math.ceil(Math.max(...ys) - oy + 60), N = pts.length, surf = new Uint8Array(W * H), road = def.road || VR.ROAD, idx = new Int32Array(W * H).fill(-1);
  const inZ = (zs, i) => (zs || []).some(([a, b]) => i >= a * N && i <= b * N);
  const disc = (cx, cy, r, v, i) => { for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(H - 1, cy + r); y++) for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(W - 1, cx + r); x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) { const k = y * W + x; if (v === 5 ? surf[k] === 0 || surf[k] === 4 : true) { surf[k] = v; if (i >= 0) idx[k] = i; } } };
  if (def.sand) for (let i = 0; i < N; i += 3) disc(pts[i][0], pts[i][1], road / 2 + 12, 4, -1);
  for (let i = 0; i < N; i += 2) disc(pts[i][0], pts[i][1], road / 2 + VR.CURB, 5, i);
  for (let i = 0; i < N; i++) disc(pts[i][0], pts[i][1], road / 2, inZ(def.ice, i) ? 3 : 1, i);
  const boosts = (def.boost || []).map(f => Math.floor(f * N));
  for (const b of boosts) for (let i = b; i < b + 14; i++) { const p = pts[i % N]; disc(p[0], p[1], road / 2 - 5, 2, i % N); }
  const cps = [1, 2, 3, 4].map(k => Math.floor(k * N / 5));
  return {def, pts, N, W, H, surf, idx, road, cps, boosts};
}
const vrTracks = VR_TRACKS.map(vrBuild);
const VR_GRIP = [.86, .8, .8, .975, .88, .82], VR_MAX = [1.05, 2.7, 4.4, 2.7, .8, 2.2], VR_DRAG = [.965, .992, .992, .996, .955, .985];
function vrNew(ti = vrs.track) {
  const g = vr?.g, T = vrTracks[ti], p0 = T.pts[0], p1 = T.pts[6];
  vr = renew(vr, {g, mode: 'ready', tick: 0, seen: 0, ti, T, x: p0[0], y: p0[1], a: Math.atan2(p1[0] - p0[0], -(p1[1] - p0[1])), vx: 0, vy: 0, keys: new Set(),
    t: 0, count: 180, prog: 0, lap: 0, cp: 0, lapStart: 0, laps: [], splits: [], split: null, rec: [], boost: 0, fx: [], dead: 0, won: 0, medal: '', record: false, ghost: vrGhostLoad(ti), skid: []});
  vrInfo();
}
// le fantôme : x, y et angle tous les 6 images, rangés en texte court (base 32) pour la synchro
const VR_B32 = '0123456789abcdefghijklmnopqrstuv';
const vrEnc = s => s.map(([x, y, a]) => [x >> 5, x & 31, y >> 5, y & 31, a & 31].map(v => VR_B32[Math.max(0, Math.min(31, v))]).join('')).join('');
const vrDec = str => { const out = []; for (let i = 0; i + 5 <= str.length; i += 5) { const v = [...str.slice(i, i + 5)].map(c => VR_B32.indexOf(c)); out.push([v[0] * 32 + v[1], v[2] * 32 + v[3], v[4]]); } return out; };
const vrGhostLoad = ti => vrs.ghosts[ti] ? vrDec(vrs.ghosts[ti]) : null;
// le chrono de l'auteur (le pilote automatique) fixe les médailles : or +5 %, argent +15 %, bronze +30 %
const vrAuthor = [];
const vrMedals = ti => { const a = vrAuthor[ti]; return a ? {auteur: a, or: Math.round(a * 1.05), argent: Math.round(a * 1.15), bronze: Math.round(a * 1.3)} : null; };
const vrMedalOf = (ti, t) => { const m = vrMedals(ti); if (!m || !t) return ''; return t <= m.auteur ? 'auteur' : t <= m.or ? 'or' : t <= m.argent ? 'argent' : t <= m.bronze ? 'bronze' : ''; };
const vrUnlocked = ti => ti === 0 || !!vrs.medals[ti - 1];
const vrSurf = (T, x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return xi < 0 || yi < 0 || xi >= T.W || yi >= T.H ? 0 : T.surf[yi * T.W + xi]; };
// suit la progression le long du tracé : on ne cherche que près de la position actuelle, donc couper par l'herbe ne fait pas avancer
function vrProgress() {
  const T = vr.T; let best = vr.prog, bd = 1e9;
  for (let d = -20; d <= 45; d++) { const i = (vr.prog + d + T.N) % T.N, p = T.pts[i], dd = (p[0] - vr.x) ** 2 + (p[1] - vr.y) ** 2; if (dd < bd) { bd = dd; best = i; } }
  if (bd > 50 * 50) return;
  const prev = vr.prog; vr.prog = best;
  if (vr.cp < 4 && prev < T.cps[vr.cp] && best >= T.cps[vr.cp] && best - prev < 60) vrCheckpoint();
  if (vr.cp === 4 && prev > T.N - 60 && best < 60) vrLap();
}
function vrCheckpoint() {
  const k = vr.lap * 5 + vr.cp, t = vr.t, b = vrs.splits[vr.ti]?.[k];
  vr.splits[k] = t; vr.cp++; vr.split = {d: b ? t - b : null, t: 120}; vrBeep(1200, .06, 'triangle', 1600, .02);
}
function vrLap() {
  const k = vr.lap * 5 + 4, b = vrs.splits[vr.ti]?.[k];
  vr.splits[k] = vr.t; vr.laps.push(vr.t - vr.lapStart); vr.lapStart = vr.t; vr.lap++; vr.cp = 0; vr.split = {d: b ? vr.t - b : null, t: 120};
  if (vr.lap >= VR.LAPS) return vrFinish();
  vrBeep(880, .12, 'triangle', 1320);
}
function vrFinish() {
  vr.mode = 'over'; vr.won = 1; vr.dead = 0; vrs.games++;
  const ti = vr.ti, prev = vrs.best[ti];
  vr.record = !prev || vr.t < prev;
  if (vr.record) { vrs.best[ti] = vr.t; vrs.splits[ti] = vr.splits.slice(); vrs.ghosts[ti] = vrEnc(vr.rec); }
  const bl = Math.min(...vr.laps); if (!vrs.laps[ti] || bl < vrs.laps[ti]) vrs.laps[ti] = bl;
  vr.medal = vrMedalOf(ti, vr.t); const order = ['', 'bronze', 'argent', 'or', 'auteur'];
  if (order.indexOf(vr.medal) > order.indexOf(vrs.medals[ti] || '')) vrs.medals[ti] = vr.medal;
  saveGames(); vrInfo();
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => vrBeep(f, .14, 'triangle'), i * 110));
}
function vrUpdate() {
  if (vr.count > 0) { vr.count--; if (vr.count % 60 === 0) vrBeep(vr.count ? 440 : 880, .15, 'square'); return; }
  vr.t++;
  const T = vr.T, s = vrSurf(T, vr.x, vr.y), up = vr.keys.has('U'), down = vr.keys.has('D'), steer = (vr.keys.has('R') ? 1 : 0) - (vr.keys.has('L') ? 1 : 0);
  const fx = Math.sin(vr.a), fy = -Math.cos(vr.a), rx = Math.cos(vr.a), ry = Math.sin(vr.a);
  let vf = vr.vx * fx + vr.vy * fy, vl = vr.vx * rx + vr.vy * ry;
  if (s === 2) vr.boost = 70;
  const max = vr.boost > 0 && s !== 0 && s !== 4 ? 4.4 : VR_MAX[s];
  if (vr.boost > 0) vr.boost--;
  if (up) vf += s === 3 ? .035 : .06; if (down) vf -= vf > 0 ? .1 : .03;
  if (vr.boost > 0) vf = Math.max(vf, Math.min(4.4, vf + .12));
  vf *= VR_DRAG[s]; if (vf > max) vf += (max - vf) * .08; if (vf < -1) vf = -1;
  vr.a += steer * .05 * Math.min(1, Math.abs(vf) / 1.1) * Math.sign(vf || 1);
  vl *= VR_GRIP[s];
  vr.vx = fx * vf + rx * vl; vr.vy = fy * vf + ry * vl;
  vr.x = Math.max(4, Math.min(T.W - 4, vr.x + vr.vx)); vr.y = Math.max(4, Math.min(T.H - 4, vr.y + vr.vy));
  if (Math.abs(vl) > .6 && vr.t % 2 === 0) vr.skid.push([vr.x - fx * 4, vr.y - fy * 4, 240]);
  if ((s === 0 || s === 4) && Math.abs(vf) > .5 && vr.t % 3 === 0) vr.fx.push({x: vr.x - fx * 6, y: vr.y - fy * 6, t: 18, c: s === 4 ? '#e8c87a' : '#6a9a4a'});
  for (const k of vr.skid) k[2]--; if (vr.skid.length > 300 || vr.skid[0]?.[2] <= 0) vr.skid.shift();
  for (const f of vr.fx) f.t--; vr.fx = vr.fx.filter(f => f.t > 0);
  if (vr.split) { vr.split.t--; if (vr.split.t <= 0) vr.split = null; }
  if (vr.t % 6 === 0) vr.rec.push([Math.round(vr.x), Math.round(vr.y), Math.round(vr.a / (Math.PI * 2) * 32) & 31]);
  vrProgress();
}
/* ---------- le dessin : le circuit est peint une fois en pixels ; la voiture est tournée en 64 angles ---------- */
const VR_CAR = ['..kkkkk..', '.kycscyk.', 'kkccsccKk', 'kkcwwwcKk', '.kcwwwcK.', '.kccsccK.', '.kccsccK.', '.kccsccK.', '.kcwwwcK.', 'kkcccccKk', 'kkccsccKk', '.kRcscRk.', '..kkkkk..'];
const vrCarCache = new Map();
function vrCar(angle, pal, key) {
  const step = ((Math.round(angle / (Math.PI * 2) * 64) % 64) + 64) % 64, ck = key + step; let c = vrCarCache.get(ck); if (c) return c;
  c = Object.assign(document.createElement('canvas'), {width: 17, height: 17}); const g = c.getContext('2d'), a = step / 64 * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
  for (let y = 0; y < 17; y++) for (let x = 0; x < 17; x++) { const dx = x - 8, dy = y - 8, sx = Math.round(dx * ca + dy * sa + 4), sy = Math.round(-dx * sa + dy * ca + 6), ch = VR_CAR[sy]?.[sx]; if (ch && pal[ch]) px(g, pal[ch], x, y); }
  vrCarCache.set(ck, c); return c;
}
const VR_PAL = {k: '#14100a', c: '#e83a3a', K: '#a82a2a', w: '#8ad0f0', y: '#fff0a0', s: '#ffffff', R: '#ff6a5a'}, VR_GPAL = {k: '#5a5a7a', c: '#b8c8f0', K: '#8898c8', w: '#e8f0ff', y: '#ffffff', s: '#ffffff', R: '#b8c8f0'};
const vrMaps = new Map();
function vrMap(ti) {  // le circuit peint, et la petite carte
  if (vrMaps.has(ti)) return vrMaps.get(ti);
  const T = vrTracks[ti], c = Object.assign(document.createElement('canvas'), {width: T.W, height: T.H}), g = c.getContext('2d'), img = g.createImageData(T.W, T.H), d = img.data;
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const C = {grass: hex('#4a9a3a'), grass2: hex('#428a34'), road: hex('#5a5a66'), road2: hex('#52525e'), boost: hex('#3ab8e8'), ice: hex('#c8e8f8'), ice2: hex('#b0d8f0'), sand: hex('#e8c87a'), sand2: hex('#d8b86a'), red: hex('#e83a3a'), white: hex('#f0f0f0')};
  for (let y = 0; y < T.H; y++) for (let x = 0; x < T.W; x++) {
    const k = y * T.W + x, s = T.surf[k], h = (Math.imul(x * 73856093 ^ y * 19349663, 2654435761) >>> 24) & 15; let col;
    if (s === 0) col = h < 3 ? C.grass2 : C.grass; else if (s === 1) col = h < 2 ? C.road2 : C.road; else if (s === 3) col = h < 4 ? C.ice2 : C.ice; else if (s === 4) col = h < 4 ? C.sand2 : C.sand;
    else if (s === 5) col = (Math.floor(T.idx[k] / 6) % 2) ? C.red : C.white;
    else { const i = T.idx[k], p = T.pts[i], q = T.pts[(i + 3) % T.N], ang = Math.atan2(q[1] - p[1], q[0] - p[0]), u = (x - p[0]) * Math.cos(ang) + (y - p[1]) * Math.sin(ang), v = Math.abs(-(x - p[0]) * Math.sin(ang) + (y - p[1]) * Math.cos(ang)); col = ((u - v + 40) % 8 + 8) % 8 < 3 ? C.white : C.boost; }
    d[k * 4] = col[0]; d[k * 4 + 1] = col[1]; d[k * 4 + 2] = col[2]; d[k * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  // la ligne de départ en damier, et des plots bleus aux points de passage
  const line = (i, draw) => { const p = T.pts[i], q = T.pts[(i + 2) % T.N], a = Math.atan2(q[1] - p[1], q[0] - p[0]), nx = -Math.sin(a), ny = Math.cos(a); draw(p, nx, ny, a); };
  line(0, (p, nx, ny, a) => { for (let s = -T.road / 2; s < T.road / 2; s += 1) for (let r = 0; r < 4; r++) { const x = p[0] + nx * s + Math.cos(a) * r, y = p[1] + ny * s + Math.sin(a) * r; px(g, (Math.floor(s / 2) + Math.floor(r / 2)) % 2 ? '#1a1a1a' : '#ffffff', x, y, 1, 1); } });
  for (const cp of T.cps) line(cp, (p, nx, ny) => { for (const sd of [-1, 1]) { const x = p[0] + nx * sd * (T.road / 2 + 5), y = p[1] + ny * sd * (T.road / 2 + 5); px(g, '#14100a', x - 2, y - 2, 4, 5); px(g, '#3a7ae8', x - 1, y - 1, 2, 3); } });
  // de petits arbres et des cailloux dans l'herbe
  const r = seeded(ti * 31 + 7);
  for (let i = 0; i < T.W * T.H / 2500; i++) { const x = Math.floor(r() * T.W), y = Math.floor(r() * T.H); let ok = true; for (let dy = -8; dy <= 8 && ok; dy += 4) for (let dx = -8; dx <= 8 && ok; dx += 4) if (vrSurf(T, x + dx, y + dy) !== 0) ok = false; if (!ok) continue;
    if (r() < .6) sprite(g, ['..kkk..', '.kgggk.', 'kgGgggk', 'kggGggk', '.kgggk.', '..kbk..', '..kbk..'], x - 3, y - 4, {k: '#14280a', g: '#3a8a2a', G: '#5aaa3a', b: '#6a4a2a'}); else sprite(g, ['.kk.', 'kssk', '.kk.'], x, y, {k: '#3a3a3a', s: '#8a8a8a'}); }
  const mm = Object.assign(document.createElement('canvas'), {width: 44, height: 34}), mg = mm.getContext('2d'), sc = Math.min(42 / T.W, 32 / T.H);
  for (let i = 0; i < T.N; i += 3) px(mg, '#e8e0f0', 1 + T.pts[i][0] * sc, 1 + T.pts[i][1] * sc, 1, 1);
  const out = {c, mm, sc}; vrMaps.set(ti, out); return out;
}
const vrTime = t => { const cs = Math.floor(t / 60 * 100); return Math.floor(cs / 6000) + ':' + String(Math.floor(cs / 100) % 60).padStart(2, '0') + '.' + String(cs % 100).padStart(2, '0'); };
const VR_MEDAL_COL = {bronze: '#d88a4a', argent: '#c8c8d8', or: '#ffd84a', auteur: '#7ae0a0'};
function vrDraw() {
  const g = vr.g, {W, H} = VR, T = vr.T, M = vrMap(vr.ti);
  for (; vr.seen < vr.tick; vr.seen++) if (vr.mode === 'over') vr.dead++;
  g.imageSmoothingEnabled = false;
  const sp = Math.hypot(vr.vx, vr.vy), cx = Math.round(Math.max(0, Math.min(T.W - W, vr.x + vr.vx * 12 - W / 2))), cy = Math.round(Math.max(0, Math.min(T.H - H, vr.y + vr.vy * 12 - H / 2)));
  px(g, '#4a9a3a', 0, 0, W, H); g.drawImage(M.c, -cx, -cy);
  for (const [x, y, t] of vr.skid) if (t > 0) px(g, 'rgba(20,16,10,.35)', x - cx - 1, y - cy, 3, 1);
  for (const f of vr.fx) px(g, f.c, f.x - cx, f.y - cy - (18 - f.t) * .2, 2, 2);
  // le fantôme de ton meilleur chrono
  if (vr.ghost && vr.mode !== 'ready') { const i = Math.min(vr.ghost.length - 1, vr.t / 6), i0 = Math.floor(i), a = vr.ghost[i0], b = vr.ghost[Math.min(vr.ghost.length - 1, i0 + 1)], f = i - i0;
    if (a) { g.globalAlpha = .55; g.drawImage(vrCar(a[2] / 32 * Math.PI * 2, VR_GPAL, 'g'), Math.round(a[0] + (b[0] - a[0]) * f - cx - 8), Math.round(a[1] + (b[1] - a[1]) * f - cy - 8)); g.globalAlpha = 1; } }
  g.globalAlpha = .35; g.drawImage(vrCar(vr.a, {k: '#000', c: '#000', K: '#000', w: '#000', y: '#000', s: '#000', R: '#000'}, 's'), Math.round(vr.x - cx - 7), Math.round(vr.y - cy - 6)); g.globalAlpha = 1;
  g.drawImage(vrCar(vr.a, VR_PAL, 'p'), Math.round(vr.x - cx - 8), Math.round(vr.y - cy - 8));
  if (vr.boost > 0 && vr.t % 4 < 2) { const bx = vr.x - Math.sin(vr.a) * 9 - cx, by = vr.y + Math.cos(vr.a) * 9 - cy; px(g, '#ffd84a', bx - 1, by - 1, 3, 3); px(g, '#ff8a2a', bx, by, 1, 1); }
  // le haut : temps, tour, écart au meilleur chrono ; la petite carte en bas à droite
  px(g, 'rgba(14,10,20,.8)', 0, 0, W, 12);
  pxFont(g, vrTime(vr.t), 3, 9, '#ffffff', 8);
  pxFont(g, 'Tour ' + Math.min(VR.LAPS, vr.lap + 1) + '/' + VR.LAPS, W / 2, 9, '#ffd84a', 8, 'center');
  const bt = vrs.best[vr.ti]; pxFont(g, bt ? vrTime(bt) : '--', W - 3, 9, '#b8b0c8', 8, 'right');
  if (vr.split && vr.split.d !== null) { const d = vr.split.d; pxFont(g, (d <= 0 ? '-' : '+') + (Math.abs(d) / 60).toFixed(2), W / 2, 26, d <= 0 ? '#7ae05a' : '#ff6a5a', 12, 'center'); }
  px(g, 'rgba(14,10,20,.7)', W - 46, H - 36, 46, 36); g.drawImage(M.mm, W - 45, H - 35); px(g, '#ff4a3a', W - 45 + 1 + vr.x * M.sc - 1, H - 35 + 1 + vr.y * M.sc - 1, 3, 3);
  if (vr.mode === 'ready') { const m = vrMedals(vr.ti); gameText(g, W, [[T.def.name.toUpperCase() + ' · ' + VR.LAPS + ' TOURS', '#ffd84a', 12], ['↑ accélérer · ← → tourner', '#ffffff'], ['Entrée : recommencer à tout moment', '#b8d0ff'], [m ? 'Or : ' + vrTime(m.or) : '', '#ffd84a'], ['Espace : départ', '#b8b0c8']], 38); }
  if (vr.mode === 'play' && vr.count > 0) pxFont(g, String(Math.ceil(vr.count / 60)), W / 2, 70, '#ffd84a', 24, 'center');
  if (vr.mode === 'play' && vr.count === 0 && vr.t < 40) pxFont(g, 'PARTEZ !', W / 2, 70, '#7ae05a', 16, 'center');
  if (vr.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 60);
  if (vr.mode === 'over' && vr.dead > 20) { const m = vr.medal; gameText(g, W, [['ARRIVÉE !', '#ffd84a', 12], [vrTime(vr.t) + (vr.record ? '  RECORD !' : ''), '#ffffff', 12], [m ? 'Médaille ' + m : 'Pas de médaille', m ? VR_MEDAL_COL[m] : '#b8b0c8'], ['Meilleur tour ' + vrTime(Math.min(...vr.laps)), '#b8d0ff'], [vr.dead > 50 ? 'Espace : rejouer · ← → : circuit' : '', '#b8b0c8']], 40); }
  if (vr.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Virage, circuit ' + T.def.name + ' : ' + vrTime(vr.t) + ', tour ' + Math.min(VR.LAPS, vr.lap + 1) + ' sur ' + VR.LAPS + ', point ' + vr.cp + ' sur 5, vitesse ' + Math.round(sp * 30) +
    ', ' + ({0: 'dans l’herbe', 1: 'sur la route', 2: 'turbo', 3: 'sur la glace', 4: 'dans le sable', 5: 'sur la bordure'})[vrSurf(T, vr.x, vr.y)] + (vr.mode === 'over' ? ', arrivée' + (vr.medal ? ', médaille ' + vr.medal : '') : '') + '.');
}
function vrInfo() {
  const ti = vr ? vr.ti : vrs.track, m = vrMedals(ti);
  $('vrStats').replaceChildren(...[['Circuit', (ti + 1) + '. ' + VR_TRACKS[ti].name], ['Meilleur temps', vrs.best[ti] ? vrTime(vrs.best[ti]) : '--'], ['Meilleur tour', vrs.laps[ti] ? vrTime(vrs.laps[ti]) : '--'], ['Médaille', vrs.medals[ti] || '--'],
    ['Or en', m ? vrTime(m.or) : '--'], ['Auteur', m ? vrTime(m.auteur) : '--'], ['Médailles', Object.values(vrs.medals).filter(Boolean).length + ' / ' + VR_TRACKS.length]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
}
const VR_KEYS = {ArrowUp: 'U', z: 'U', w: 'U', ArrowDown: 'D', s: 'D', ArrowLeft: 'L', q: 'L', a: 'L', ArrowRight: 'R', d: 'R'};
function vrPickTrack(dir) { let ti = vr.ti; do ti = (ti + dir + VR_TRACKS.length) % VR_TRACKS.length; while (!vrUnlocked(ti)); vrs.track = ti; saveGames(); vrNew(ti); }
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !vr || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (vr.mode === 'over' || vr.mode === 'ready') {
    if ((k === 'ArrowLeft' || k === 'ArrowRight') && (vr.mode === 'ready' || vr.dead > 50)) { e.preventDefault(); vrPickTrack(k === 'ArrowLeft' ? -1 : 1); return; }
    if ((k === ' ' || k === 'Enter') && (vr.mode === 'ready' || vr.dead > 50)) { e.preventDefault(); if (vr.mode === 'over') vrNew(vr.ti); vr.mode = 'play'; }
    return;
  }
  if (k === 'p' || k === 'P' || k === 'Escape') { vr.mode = vr.mode === 'play' ? 'pause' : 'play'; return; }
  if (k === 'Enter' || k === 'Backspace' || k === 'Delete') { e.preventDefault(); if (vr.mode === 'pause') { vr.mode = 'play'; return; } vrNew(vr.ti); vr.mode = 'play'; return; }
  if (VR_KEYS[k]) { e.preventDefault(); vr.keys.add(VR_KEYS[k]); }
});
document.addEventListener('keyup', e => { if (vr && VR_KEYS[e.key]) vr.keys.delete(VR_KEYS[e.key]); });
{ const cv = $('vrCanvas');  // au doigt ou à la souris : maintenir à gauche ou à droite tourne, la voiture accélère toute seule
  const steer = e => { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; vr.keys.clear(); vr.keys.add('U'); if (x < .4) vr.keys.add('L'); else if (x > .6) vr.keys.add('R'); };
  cv.onpointerdown = e => { e.preventDefault(); if (!vr) return; if (vr.mode === 'ready' || (vr.mode === 'over' && vr.dead > 50)) { if (vr.mode === 'over') vrNew(vr.ti); vr.mode = 'play'; return; } if (vr.mode !== 'play') return; vr.drag = 1; steer(e); cv.setPointerCapture?.(e.pointerId); };
  cv.onpointermove = e => { if (vr?.drag) steer(e); };
  cv.onpointerup = () => { if (vr) { vr.drag = 0; vr.keys.clear(); } }; }
$('vrNew').onclick = () => { vrNew(vr?.ti ?? vrs.track); $('vrNew').blur(); };
// le pilote automatique : vise un point plus loin sur le tracé (plus loin quand il va vite), freine dans les virages serrés
function vrBot() {
  const T = vr.T, sp = Math.hypot(vr.vx, vr.vy), look = Math.round(10 + sp * 9), p = T.pts[(vr.prog + look) % T.N], far = T.pts[(vr.prog + look + 30) % T.N];
  const want = Math.atan2(p[0] - vr.x, -(p[1] - vr.y)), diff = Math.atan2(Math.sin(want - vr.a), Math.cos(want - vr.a)), want2 = Math.atan2(far[0] - vr.x, -(far[1] - vr.y)), turn = Math.abs(Math.atan2(Math.sin(want2 - vr.a), Math.cos(want2 - vr.a)));
  vr.keys.clear();
  if (diff > .06) vr.keys.add('R'); else if (diff < -.06) vr.keys.add('L');
  if (turn > .9 && sp > 1.7) vr.keys.add('D'); else vr.keys.add('U');
}
{  // vérification : le pilote automatique boucle les 3 tours de chaque circuit (son temps donne les médailles) ; couper par l'herbe ne compte pas ;
   // le fantôme se range et se relit à l'identique
  const bad = [], keep = vr, keepS = JSON.stringify(vrs);
  vrMute = true;
  for (let ti = 0; ti < VR_TRACKS.length; ti++) {
    vr = null; vrNew(ti); vr.mode = 'play'; vr.count = 0; vr.ghost = null;
    for (let t = 0; t < 12000 && vr.mode === 'play'; t++) { vrBot(); vrUpdate(); }
    if (vr.mode !== 'over') bad.push(VR_TRACKS[ti].name + ' : tour ' + vr.lap + ', point ' + vr.cp); else vrAuthor[ti] = vr.t;
  }
  vr = null; vrNew(0); vr.mode = 'play'; vr.count = 0; const far = vr.T.pts[Math.floor(vr.T.N * .5)]; vr.x = far[0]; vr.y = far[1]; for (let t = 0; t < 5; t++) vrUpdate();
  if (vr.cp > 0 || vr.prog > 60) bad.push('raccourci compté');
  const sample = [[0, 0, 0], [1023, 517, 31], [300, 200, 7]]; if (JSON.stringify(vrDec(vrEnc(sample))) !== JSON.stringify(sample)) bad.push('fantôme mal rangé');
  console.assert(!bad.length, 'virage', bad);
  Object.assign(vrs, JSON.parse(keepS)); for (const k of Object.keys(vrs)) if (!(k in JSON.parse(keepS))) delete vrs[k];
  vr = keep; vrMute = false;
}
ctx.onOpen(() => {
  if (!vr || !vr.g) { vrNew(vrUnlocked(vrs.track) ? vrs.track : 0); vr.g = $('vrCanvas').getContext('2d'); }
  gameLoop(vr, 'virage', vrUpdate, vrDraw); vrInfo();
});
}
