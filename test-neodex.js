// lancé par le test « local » de NeoDex : la vérification interne (meubles atteignables, pièces, vies), un saut réussi guidé par la prédiction,
// une bouteille perdue puis la fin de partie, la cuisine, la manette, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('cbCanvas').__cb, cb = T.st(), CB = T.CB; ${code} })()`);
  const key = (k, type) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('cbCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'culbute-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`document.getElementById('cbNew').click(), 0`); await sleep(100);
  // une charge qui mène au meuble suivant, puis en vol : maintenir tant que le fantôme n'est pas vert, comme le ferait un joueur
  const p = await C(`for (let q = .25; q <= 1; q += .01) { const b = {x: cb.x, y: cb.y, a: 0}; b.vx = 1 + q * 2.2; b.vy = -(2 + q * 3.2); const r = T.predict(b); if (r && r.land === 1 && r.a > 3.2 && r.a < 6.28 - CB.OK) return (q - .15) / .85; } return -1;`);
  if (p < 0) throw new Error('aucune charge ne mène au meuble 1 avec un tour à compléter');
  await key(' ', 'keydown'); await sleep(120); await C(`cb.charge = ${p}; return 0;`); await shot('0-charge');
  await key(' ', 'keyup'); await sleep(120); await shot('1-vol');
  let down = false, held = 0;
  for (let i = 0; i < 200 && await C('return cb.fly;'); i++) {
    const ok = await C(`const r = T.predict(cb); return !!r && r.land === 1 && Math.abs(((r.a + Math.PI) % (2 * Math.PI)) - Math.PI) < CB.OK * .6;`);
    if (!ok && !down) { await key(' ', 'keydown'); down = true; held++; } else if (ok && down) { await key(' ', 'keyup'); down = false; }
    await sleep(15);
  }
  if (down) await key(' ', 'keyup');
  const at = await C('return cb.at + "|" + cb.mode + "|" + cb.lives;'); if (at !== '1|play|3') throw new Error('le saut devait réussir : ' + at + ' (charge ' + p + ', maintiens ' + held + ', ' + await C('return JSON.stringify({fly: cb.fly, x: cb.x, y: cb.y, a: cb.a, how: cb.how, pop: cb.pop, f1: cb.furn[1]});') + ')');
  await sleep(150); await shot('2-pose');
  // une bouteille perdue : on repart du même meuble avec une de moins ; la dernière finit la partie
  await C(`cb.fly = true; T.st().vx = 0; return 0;`); await C(`cb.y = CB.FLOOR; return 0;`); await sleep(200);
  const l1 = await C('return cb.lives + "|" + cb.mode + "|" + cb.at;'); if (l1 !== '2|play|1') throw new Error('une bouteille perdue : ' + l1);
  await shot('3-oups'); await sleep(1400);
  if (await C('return cb.respawn + "|" + cb.fly;') !== '0|false') throw new Error('la bouteille devait revenir sur son meuble');
  // la cuisine : 15e meuble et plus
  await C(`cb.lives = 1; return 0;`);
  await C(`cb.furn.length = cb.at + 1; const gen = n => { while (cb.furn.length < n) { const q = cb.furn[cb.furn.length - 1], k = cb.furn.length; cb.furn.push({x: q.x + q.w + 20, y: 100, w: 30, kind: 'plan', n: k}); } }; gen(22); cb.at = 16; cb.x = cb.furn[16].x + 10; cb.y = cb.furn[16].y - 8; cb.cam = cb.x - 50; return 0;`);
  await sleep(250); await shot('4-cuisine');
  if (await C('return T.room(cb.at);') !== 1) throw new Error('le meuble 16 devait être dans la cuisine');
  if (process.env.NEO_SHOTS) for (const [n, at, kinds] of [['4b-chambre', 34, ['lit', 'armoire', 'chevet', 'coffre', 'commode']], ['4c-jardin', 49, ['banc', 'muret', 'pot', 'tonneau', 'souche']]]) {
    await C(`const K = ${JSON.stringify(kinds)}; cb.furn.length = 17; while (cb.furn.length < ${at + 6}) { const q = cb.furn[cb.furn.length - 1], k = cb.furn.length; cb.furn.push({x: q.x + q.w + 18, y: [100, 70, 118, 92, 110][k % 5], w: 34, kind: K[k % K.length], n: k}); }
      cb.at = ${at}; cb.x = cb.furn[${at}].x + 10; cb.y = cb.furn[${at}].y - 8; cb.cam = cb.x - 50; return 0;`); await sleep(250); await shot(n);
  }
  await C(`cb.furn.length = 22; cb.at = 16; cb.x = cb.furn[16].x + 10; cb.y = cb.furn[16].y - 8; cb.cam = cb.x - 50; return 0;`);
  // la manette : A maintenu charge, relâché saute ; Start met en pause
  await pj(`(() => { const pad = {axes: [0, 0], buttons: Array.from({length: 17}, () => ({pressed: false}))}; window.__pad = pad; navigator.getGamepads = () => [pad]; return 0; })()`);
  await pj(`(__pad.buttons[0].pressed = true, 0)`); await sleep(300);
  const ch = await C('return cb.hold && cb.charge > 0;'); await pj(`(__pad.buttons[0].pressed = false, 0)`); await sleep(120);
  if (!ch || !await C('return cb.fly;')) throw new Error('A devait charger puis lancer');
  for (let i = 0; i < 30 && await C('return cb.fly || cb.respawn > 0;'); i++) await sleep(100);
  if (await C('return cb.mode;') === 'play') { await pj(`(__pad.buttons[9].pressed = true, 0)`); await sleep(120); await pj(`(__pad.buttons[9].pressed = false, 0)`); await sleep(120);
    if (await C('return cb.mode;') !== 'pause') throw new Error('Start ne met pas en pause'); }
  // la fin de partie : la dernière bouteille perdue
  await C(`cb.mode = 'play'; cb.lives = 1; cb.respawn = 0; cb.fly = true; cb.vx = 0; cb.y = CB.FLOOR; return 0;`); await sleep(200);
  if (await C('return cb.mode;') !== 'over') throw new Error('la partie devait finir avec la dernière bouteille');
  await sleep(600); await shot('5-fin');
  await pj(`navigator.getGamepads = () => [], 0`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('cbFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('cbCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  await pj(`document.getElementById('cbNew').click(), 0`);
  const L = await pj(`(() => { const r = document.getElementById('cbCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('cbCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · saut réussi · bouteille perdue puis revenue · cuisine · manette · fin de partie · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
