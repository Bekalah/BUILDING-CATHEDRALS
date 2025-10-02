// Dynamic loader for Cathedral reference bundle
export async function loadReference(base='.') {
  const manifest = await (await fetch(base + '/reference-manifest.json')).json();
  let audioMap = null;
  try { audioMap = await (await fetch(base + '/audio-map.json')).json(); } catch {}
  return { manifest, audioMap };
}
