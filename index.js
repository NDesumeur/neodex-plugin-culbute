// Culbute : une bouteille saute de meuble en meuble en faisant des tours sur elle-même, et doit se poser debout.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Culbute</span><span class="hint">Maintiens Espace (ou le clic) pour charger, lâche pour sauter · maintiens en l'air pour tourner plus vite · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="cbCanvas" width="160" height="150" role="img" aria-label="Culbute"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="cbStats"></div></div>
      <div class="row"><button class="btn main" id="cbNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Plus tu maintiens, plus la bouteille saute loin et haut : les points blancs montrent tout le saut, jusqu'au meuble où elle retombe. En l'air, elle tourne toute seule ; maintiens pour qu'elle tourne deux fois plus vite. Elle doit retomber debout sur le dessus d'un meuble, à 40° près ; presque droite, c'est PARFAIT et ça compte double. Sauter par-dessus un meuble rapporte plus. Si elle se renverse ou tombe par terre, c'est fini ; si elle retombe sur le même meuble, tu peux réessayer.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,660px);width:auto;aspect-ratio:160/150;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
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
  pxSkin(view.querySelector('.appWrap'), { title: "CULBUTE", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#7ac8f0", "accL": "#c8e8f8", "accS": "#3a8ad8", "accD": "#0a2a4a", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#ffd84a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#1a3a5a", "spark2": "#7ac8f0", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["....kkk.....", "....bbb.....", "....kkk.....", "...kwwwk....", "..kwwwwwk...", "..kwbbbwk...", "..krrrrrk...", "..kwbbbwk...", "..kwbbbwk...", "...kkkkk....", "oooooooooooo"],
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

/* ---------- Culbute : une bouteille saute de meuble en meuble dans un salon. Maintenir charge le saut, lâcher la lance ;
   maintenir pendant le vol la fait tourner plus vite. Elle doit se poser debout (à 40° près) sur le dessus d'un meuble ---------- */
const CB = {W: 160, H: 150, HUD: 12, FLOOR: 140, G: .16, SPIN: .11, TUCK: .23, OK: .7, PERFECT: .2, CHARGE: 50};
const cbs = gstore('culbute', {games: 0, flips: 0, perfect: 0});
let cb = null, cbac = null, cbMute = false;
// la bouteille (7 x 16) : bouchon, goulot, eau, étiquette ; 32 images tournées d'avance, au pixel près
const CB_BOTTLE = ['..kkk..', '..bbb..', '..kkk..', '..kwk..', '.kwwwk.', 'kwwwwwk', 'kwlllwk', 'kwlllwk', 'krrrrrk', 'kryyrrk', 'krrrrrk', 'kwlllwk', 'kwlllwk', 'kwlllwk', 'kwlllwk', '.kkkkk.'];
const CB_PAL = {k: '#1a2a3a', b: '#3a7ad8', w: '#c8e8f8', l: '#7ac8f0', r: '#d83a3a', y: '#ffd84a'};
const CB_ROT = Array.from({length: 32}, (_, i) => {
  const a = i / 32 * Math.PI * 2, c = el('canvas'); c.width = c.height = 20; const g = c.getContext('2d'), ca = Math.cos(a), sa = Math.sin(a);
  for (let y = 0; y < 20; y++) for (let x = 0; x < 20; x++) {  // pour chaque pixel de l'image, le pixel de la bouteille droite qui tombe dessus
    const dx = x - 9.5, dy = y - 9.5, sx = Math.round(dx * ca + dy * sa + 3), sy = Math.round(-dx * sa + dy * ca + 7.5), row = CB_BOTTLE[sy], col = row && CB_PAL[row[sx]];
    if (col) px(g, col, x, y);
  }
  return c; });
// les meubles : un dessus (le seul endroit où se poser) et ce qu'il y a dessous
const CB_KINDS = ['table', 'tabouret', 'livres', 'commode', 'caisse'];
function cbFurniture(g, f, ox) {
  const x = Math.round(f.x - ox), y = Math.round(f.y), w = f.w, h = CB.FLOOR - y;
  if (x > CB.W + 4 || x + w < -4) return;
  if (f.kind === 'table' || f.kind === 'tabouret') {
    px(g, '#1a1018', x - 1, y - 1, w + 2, 6); px(g, f.kind === 'table' ? '#a86a3a' : '#c84a3a', x, y, w, 4); px(g, f.kind === 'table' ? '#d8945a' : '#e87a5a', x, y, w, 1);
    for (const lx of f.kind === 'table' ? [x + 2, x + w - 5] : [x + 3, x + w - 6]) { px(g, '#1a1018', lx - 1, y + 4, 5, h - 4); px(g, '#7a4a2a', lx, y + 4, 3, h - 4); }
    if (f.kind === 'tabouret') { px(g, '#1a1018', x + 3, y + Math.round(h * .6), w - 6, 2); }
  } else if (f.kind === 'livres') {
    let yy = y; const cols = [['#3a6ac8', '#5a8ae8'], ['#4aa84a', '#7ac87a'], ['#c83a5a', '#e86a8a'], ['#c8a03a', '#e8c86a']];
    for (let i = 0; yy < CB.FLOOR; i++) { const bh = 5 + (i % 2), dx = (i * 3) % 5 - 2, c = cols[i % 4]; px(g, '#1a1018', x + dx - 1, yy - 1, w + 2, bh + 1); px(g, c[0], x + dx, yy, w, bh - 1); px(g, c[1], x + dx, yy, w, 1); px(g, '#f0e8d8', x + dx + w - 3, yy + 1, 2, bh - 2); yy += bh; }
  } else {  // commode ou caisse : un bloc plein avec tiroirs ou planches
    const wood = f.kind === 'commode' ? ['#8a5a3a', '#b87a4a', '#5a3a22'] : ['#b8884a', '#d8a868', '#7a5a2a'];
    px(g, '#1a1018', x - 1, y - 1, w + 2, h + 1); px(g, wood[0], x, y, w, h); px(g, wood[1], x, y, w, 1);
    for (let yy = y + 6; yy < CB.FLOOR - 2; yy += 9) { px(g, wood[2], x + 2, yy, w - 4, 1); if (f.kind === 'commode') px(g, '#ffd84a', x + Math.floor(w / 2) - 1, yy + 4, 2, 1); }
    if (f.kind === 'caisse') { px(g, wood[2], x + 1, y + 1, 1, h - 2); px(g, wood[2], x + w - 2, y + 1, 1, h - 2); }
  }
  if (f.n && f.n % 10 === 0) pxFont(g, String(f.n), x + w / 2, y - 4, '#ffd84a', 8, 'center');
}
// le salon : papier peint à rayures, plinthe, parquet ; une fenêtre et un cadre qui défilent plus lentement
const CB_WALL = (() => { const c = el('canvas'); c.width = 64; c.height = CB.FLOOR; const g = c.getContext('2d');
  px(g, '#4a3a5a', 0, 0, 64, CB.FLOOR); for (let x = 0; x < 64; x += 8) { px(g, '#54446a', x, 0, 3, CB.FLOOR); for (let y = 4; y < CB.FLOOR; y += 12) px(g, '#6a5a82', x + 1, y, 1, 1); }
  px(g, '#2a1e30', 0, CB.FLOOR - 7, 64, 1); px(g, '#e8e0d8', 0, CB.FLOOR - 6, 64, 6); px(g, '#b8b0a8', 0, CB.FLOOR - 1, 64, 1); return c; })();
const CB_DECOR = (() => { const c = el('canvas'); c.width = 240; c.height = 70; const g = c.getContext('2d');
  px(g, '#1a1018', 20, 10, 44, 50); px(g, '#2a3a6a', 22, 12, 40, 46); px(g, '#e8e0d8', 41, 12, 2, 46); px(g, '#e8e0d8', 22, 33, 40, 2); px(g, '#f0e8d8', 28, 18, 2, 2); px(g, '#f0e8d8', 52, 42, 1, 1); px(g, '#ffd84a', 50, 18, 4, 4);
  px(g, '#1a1018', 140, 20, 34, 26); px(g, '#c8a03a', 141, 21, 32, 24); px(g, '#4a8a5a', 144, 24, 26, 18); px(g, '#7ac87a', 150, 30, 8, 6); px(g, '#3a6ac8', 144, 36, 26, 6);
  return c; })();
function cbBeep(f, d, type = 'square', slide = 0, vol = .04) { if (cbMute) return; try { cbac ??= new AudioContext(); const o = cbac.createOscillator(), g = cbac.createGain(), t = cbac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(cbac.destination); o.start(t); o.stop(t + d); } catch {} }
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
function cbNew() {
  const g = cb?.g;
  cb = renew(cb, {g, mode: 'ready', tick: 0, seen: 0, furn: [{x: 10, y: 100, w: 30, kind: 'table', n: 0}], at: 0, score: 0, flips: 0, perfect: 0, streak: 0, charge: 0, hold: false, cam: 0, dead: 0, record: false, rnd: seeded(Date.now() % 1e9), pop: null, drops: []});
  cbGen(8); cbPlace(); cbInfo();
}
function cbGen(n) {
  while (cb.furn.length < n) {
    const p = cb.furn[cb.furn.length - 1], k = cb.furn.length, r = cb.rnd, d = Math.min(1, k / 40);
    const w = Math.round(32 - d * 8 + r() * 10), gap = Math.round(16 + r() * (22 + d * 30)), y = Math.round(Math.max(56, Math.min(124, p.y + (r() - .5) * (40 + d * 30))));
    cb.furn.push({x: p.x + p.w + gap, y, w, kind: CB_KINDS[Math.floor(r() * CB_KINDS.length)], n: k});
  }
}
const cbPlace = () => { const f = cb.furn[cb.at]; Object.assign(cb, {x: f.x + Math.min(10, f.w / 2), y: f.y - 8, vx: 0, vy: 0, a: 0, w: 0, fly: false}); };
// un pas de vol (partagé avec la vérification) : la gravité, la rotation (plus rapide si on maintient), et l'atterrissage
function cbStep(b, tuck, furn) {
  const prevBottom = b.y + 8;
  b.vy += CB.G; b.x += b.vx; b.y += b.vy; b.a += tuck ? CB.TUCK : CB.SPIN;
  const bx = b.x, bottom = b.y + 8;
  if (b.vy > 0) for (let i = 0; i < furn.length; i++) { const f = furn[i]; if (prevBottom <= f.y && bottom >= f.y && bx >= f.x - 1 && bx <= f.x + f.w + 1) { b.y = f.y - 8; return {land: i}; } }
  if (bottom >= CB.FLOOR) return {floor: true};
  return null;
}
const cbAngle = a => { a %= Math.PI * 2; if (a > Math.PI) a -= Math.PI * 2; return a; };
const cbLaunch = (b, p) => { b.vx = 1 + p * 2.2; b.vy = -(2 + p * 3.2); b.w = 0; b.fly = true; };
function cbLanded(i) {
  const a = Math.abs(cbAngle(cb.a));
  if (i === cb.at) return cbFail('pareil');  // retombée sur le même meuble : rien gagné, rien perdu
  if (a > CB.OK || i < cb.at) return cbFail('renversée');
  const perfect = a < CB.PERFECT, jump = i - cb.at, gain = jump * (perfect ? 2 : 1);
  cb.streak++; cb.flips++; if (perfect) cb.perfect++;
  cb.score += gain * 10 + Math.min(5, cb.streak) * 2;
  cb.at = i; cb.a = 0; cb.fly = false; cb.vx = cb.vy = 0; cbGen(cb.at + 8);
  cb.pop = {text: perfect ? 'PARFAIT !' : jump > 1 ? 'SAUT DE ' + jump : 'DEBOUT !', t: 50};
  cbBeep(perfect ? 990 : 660, .08); if (!cbMute) setTimeout(() => cbBeep(perfect ? 1320 : 880, .12), 80);
}
function cbFail(how) {
  if (how === 'pareil') { cb.a = 0; cb.fly = false; cb.vx = cb.vy = 0; cbPlace(); cb.streak = 0; cbBeep(300, .06); return; }
  cb.mode = 'over'; cb.dead = 0; cb.how = how; cb.fly = false;
  for (let i = 0; i < 12; i++) cb.drops.push({x: cb.x, y: cb.y + 4, vx: (cb.rnd() - .5) * 2, vy: -cb.rnd() * 2, t: 40});
  cbs.games++; cbs.flips += cb.flips; cbs.perfect += cb.perfect; cb.record = best('culbute', cb.score); saveGames(); cbInfo();
  cbBeep(180, .5, 'sawtooth', 50, .06);
}
function cbUpdate() {
  for (const d of cb.drops) { d.x += d.vx; d.y += d.vy; d.vy += .15; if (d.y > CB.FLOOR) { d.y = CB.FLOOR; d.vy = 0; d.vx *= .6; } d.t--; } cb.drops = cb.drops.filter(d => d.t > 0);
  if (cb.pop && --cb.pop.t <= 0) cb.pop = null;
  if (cb.mode === 'over') { cb.dead++; if (cb.dead < 30 && cb.how === 'renversée') { cb.a += .2; cb.y = Math.min(cb.y + 2, CB.FLOOR - 4); } return; }
  if (cb.mode !== 'play') return;
  if (!cb.fly) { if (cb.hold) cb.charge = Math.min(1, cb.charge + 1 / CB.CHARGE); }
  else { const r = cbStep(cb, cb.hold, cb.furn); if (r?.land !== undefined) cbLanded(r.land); else if (r?.floor) cbFail('tombée'); }
  // la caméra garde la bouteille au premier tiers
  cb.cam += (Math.max(0, cb.x - 50) - cb.cam) * .08;
}
function cbPress() {
  if (cb.mode === 'ready' || cb.mode === 'pause') cb.mode = 'play';
  if (cb.mode === 'over') { if (cb.dead > 60) { cbNew(); cb.mode = 'play'; } return; }
  cb.hold = true; if (!cb.fly) cb.charge = 0;
}
function cbRelease() {
  if (!cb.hold) return; cb.hold = false;
  if (cb.mode === 'play' && !cb.fly && cb.charge > .05) { cbLaunch(cb, .15 + cb.charge * .85); cbBeep(240 + cb.charge * 300, .1, 'triangle', 600, .04); cb.charge = 0; }
}
function cbDraw() {
  const g = cb.g, {W, H, HUD, FLOOR} = CB, ox = Math.round(cb.cam);
  for (; cb.seen < cb.tick; cb.seen++) if (cb.mode !== 'play') cbUpdate();
  g.imageSmoothingEnabled = false;
  const wo = ((-ox % 64) + 64) % 64; for (let x = wo - 64; x < W; x += 64) g.drawImage(CB_WALL, x, 0);
  const dofs = ((-Math.round(ox * .5) % 240) + 240) % 240; for (let x = dofs - 240; x < W; x += 240) g.drawImage(CB_DECOR, x, 26);
  // le parquet
  px(g, '#6a4028', 0, FLOOR, W, H - FLOOR); for (let x = ((-ox % 16) + 16) % 16 - 16; x < W; x += 16) { px(g, '#4a2a18', x, FLOOR, 1, H - FLOOR); px(g, '#8a5a38', x + 1, FLOOR, 14, 1); }
  for (const f of cb.furn) cbFurniture(g, f, ox);
  // la trajectoire pendant la charge, jusqu'à l'atterrissage (sans la rotation : à toi de choisir quand maintenir)
  if (cb.mode === 'play' && !cb.fly && cb.hold) { const b = {x: cb.x, y: cb.y, a: 0}; cbLaunch(b, .15 + cb.charge * .85); for (let i = 0; i < 120; i++) { const r = cbStep(b, false, cb.furn.slice(cb.at + 1)); if (i % 3 === 2 || r) px(g, r ? '#ffd84a' : '#ffffff', Math.round(b.x - ox) - (r ? 1 : 0), Math.round(b.y + 8), r ? 3 : 1, 1); if (r) break; } }
  for (const d of cb.drops) px(g, '#7ac8f0', d.x - ox, d.y, 2, 1);
  const fr = ((Math.round(cbAngle(cb.a) / (Math.PI * 2) * 32) % 32) + 32) % 32;
  g.drawImage(CB_ROT[fr], Math.round(cb.x - ox) - 10, Math.round(cb.y) - 10 + (cb.hold && !cb.fly ? Math.round(cb.charge * 2) : 0));
  // la jauge de charge à côté de la bouteille
  if (cb.mode === 'play' && !cb.fly && cb.hold) { const n = Math.round(cb.charge * 10), bx = Math.round(cb.x - ox) + 8, by = Math.round(cb.y) - 10; px(g, '#1a1018', bx, by - 1, 4, 22); for (let i = 0; i < 10; i++) px(g, i < n ? (i < 4 ? '#7ee07a' : i < 8 ? '#ffd84a' : '#ff8a3a') : '#3a2a32', bx + 1, by + 19 - i * 2, 2, 1); }
  if (cb.pop) pxFont(g, cb.pop.text, W / 2, HUD + 24 - Math.round((50 - cb.pop.t) / 8), '#ffd84a', 8, 'center');
  px(g, '#140e18', 0, 0, W, HUD);
  pxFont(g, String(cb.score), 4, 9, '#ffffff', 8); pxFont(g, 'Meuble ' + cb.at, W / 2, 9, '#c8b0d8', 8, 'center');
  if (cb.streak > 1) pxFont(g, '×' + Math.min(5, cb.streak), W - 4, 9, '#ffd84a', 8, 'right');
  if (cb.mode === 'ready') gameText(g, W, [['CULBUTE', '#7ac8f0', 16], ['Maintiens, lâche : saut', '#ffffff'], ['Maintiens en l\'air :', '#ffffff'], ['elle tourne plus vite', '#ffffff'], ['Pose-la debout !', '#b8b0c8'], ['Record ' + (games.best.culbute || 0), '#ffd84a']], 46);
  if (cb.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace : reprendre', '#b8b0c8']], 70);
  if (cb.mode === 'over' && cb.dead > 40) gameText(g, W, [[cb.how === 'tombée' ? 'PAR TERRE !' : 'RENVERSÉE !', '#ff8a3a', 12], [cb.score + ' points · ' + cb.flips + (cb.flips > 1 ? ' culbutes' : ' culbute'), '#ffffff'], [cb.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.culbute || 0), '#ffd84a'], [cb.dead > 60 ? 'Espace : recommencer' : '', '#b8b0c8']], 58);
  if (cb.tick % 30 === 0) g.canvas.setAttribute('aria-label', 'Culbute : ' + (cb.mode === 'play' ? cb.score + ' points, meuble ' + cb.at + ', ' + cb.flips + ' culbutes' : cb.mode === 'over' ? 'partie finie, ' + cb.score + ' points' : cb.mode === 'pause' ? 'pause' : 'prêt'));
}
function cbInfo() {
  $('cbStats').replaceChildren(...[['Meilleur score', games.best.culbute || 0], ['Parties', cbs.games], ['Culbutes', cbs.flips], ['Parfaites', cbs.perfect]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
const CB_KEYS = [' ', 'ArrowUp', 'Enter', 'z', 'w'];
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !cb || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (CB_KEYS.includes(e.key)) { e.preventDefault(); if (!e.repeat) cbPress(); }
  if ((e.key.toLowerCase() === 'p' || e.key === 'Escape') && cb.mode === 'play' && !cb.fly) { cb.mode = 'pause'; cb.hold = false; }
});
document.addEventListener('keyup', e => { if (cb && CB_KEYS.includes(e.key)) cbRelease(); });
$('cbCanvas').onpointerdown = e => { e.preventDefault(); if (cb) cbPress(); };
document.addEventListener('pointerup', () => { if (cb) cbRelease(); });
$('cbNew').onclick = () => { cbNew(); $('cbNew').blur(); };
{  // vérification : depuis chaque meuble, il existe une charge et une durée de rotation rapide qui posent la bouteille debout sur le suivant
  const keep = cb; cb = null; cbMute = true; cbNew(); cbGen(40);
  let reach = 0, total = 0;
  for (let i = 0; i < 12; i++) {  // les 12 premiers suffisent au démarrage (la simulation complète a été faite sur 5 parties de 40 meubles)
    total++; const f = cb.furn[i]; let ok = false;
    for (let p = .15; p <= 1 && !ok; p += .03) for (let tuck = 0; tuck < 90 && !ok; tuck += 3) {
      const b = {x: f.x + Math.min(10, f.w / 2), y: f.y - 8, a: 0}; cbLaunch(b, p);
      for (let t = 0; t < 200; t++) { const r = cbStep(b, t < tuck, cb.furn); if (r) { if (r.land === i + 1 && Math.abs(cbAngle(b.a)) < CB.OK) ok = true; break; } }
    }
    if (ok) reach++;
  }
  console.assert(reach === total, 'culbute', {reach, total});
  cb = keep; cbMute = false;
}
ctx.onOpen(() => {
  if (!cb || !cb.g) { cbNew(); cb.g = $('cbCanvas').getContext('2d'); }
  gameLoop(cb, 'culbute', cbUpdate, cbDraw); cbInfo();
});
}
