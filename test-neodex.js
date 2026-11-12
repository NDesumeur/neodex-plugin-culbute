// lancé par le test « local » de NeoDex : part, fait un saut moyen et vérifie que la partie a bougé (meuble suivant, ou partie finie proprement)
// (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème : la charge, le vol, la suite)
module.exports = async ({ pj, sleep }) => {
  const key = (k, type) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('cbCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('cbCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'culbute-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await shot('0-depart');
  await key(' ', 'keydown'); await sleep(450); await shot('1-charge'); await key(' ', 'keyup');
  await sleep(250); await key(' ', 'keydown'); await sleep(200); await shot('2-vol'); await sleep(150); await key(' ', 'keyup');
  await sleep(1500); await shot('3-suite');
  const first = await label();
  if (!/^Culbute : (\d+ points, meuble \d+|partie finie)/.test(first)) throw new Error('partie bloquée : « ' + first + ' »');
  if (process.env.NEO_SHOTS) { for (let i = 0; i < 3; i++) { await key(' ', 'keydown'); await sleep(500); await key(' ', 'keyup'); await sleep(1600); } await shot('4-fin'); }
  return first;
};
