// lancé par le test « local » de NeoDex : part, accélère quelques secondes, vérifie que le chrono tourne et que la voiture roule,
// puis recommence avec Entrée et vérifie que le chrono repart de zéro (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème)
module.exports = async ({ pj, sleep }) => {
  const ev = (type, k) => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('vrCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('vrCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'virage-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(500); await shot('0-depart');
  await ev('keydown', ' '); await sleep(1500); await shot('1-compte');
  await sleep(1800); await ev('keydown', 'ArrowUp'); await sleep(2500); await shot('2-route');
  await ev('keydown', 'ArrowRight'); await sleep(500); await ev('keyup', 'ArrowRight'); await sleep(1500); await shot('3-plus-loin');
  await ev('keyup', 'ArrowUp');
  const l = await label(), m = /: (\d+):(\d+)\.(\d+), .* vitesse (\d+)/.exec(l);
  if (!m || +m[2] < 2 || +m[4] < 10) throw new Error('la voiture devait rouler et le chrono tourner : « ' + l + ' »');
  await ev('keydown', 'Enter'); await sleep(400);
  const l2 = await label();
  if (!/: 0:00\.00,/.test(l2)) throw new Error('Entrée devait recommencer : « ' + l2 + ' »');
  return l;
};
