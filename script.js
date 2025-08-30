// Menu mobile
const navToggle = document.getElementById('navToggle');
const siteNav   = document.getElementById('siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => siteNav.classList.toggle('open'));
}

// Révélations au scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Démo carte + tracé + calculs (Leaflet + Haversine)
window.addEventListener('load', () => {
  const mapEl = document.getElementById('demoMap');
  if (!mapEl || typeof L === 'undefined') return;

  // Exemple de parcours (lat, lng)
  const track = [
    [48.858370, 2.294481], // Tour Eiffel
    [48.860611, 2.337644], // Louvre
    [48.852968, 2.349902], // Notre-Dame
    [48.886705, 2.343104], // Montmartre
  ];

  const map = L.map('demoMap', { zoomControl: true, scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OSM'
  }).addTo(map);

  const poly = L.polyline(track, { weight: 4 }).addTo(map);
  map.fitBounds(poly.getBounds(), { padding: [20, 20] });

  // Markers start/end
  L.circleMarker(track[0], { radius: 6 }).addTo(map).bindTooltip('Départ');
  L.circleMarker(track.at(-1), { radius: 6 }).addTo(map).bindTooltip('Arrivée');

  // Distance totale (km) via Haversine
  const haversine = (a, b) => {
    const toRad = d => d * Math.PI/180;
    const R = 6371e3; // m
    const φ1 = toRad(a[0]), φ2 = toRad(b[0]);
    const Δφ = toRad(b[0]-a[0]), Δλ = toRad(b[1]-a[1]);
    const s = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    return 2 * R * Math.asin(Math.sqrt(s)); // meters
  };
  let dist = 0;
  for (let i=0;i<track.length-1;i++) dist += haversine(track[i], track[i+1]);
  const km = (dist/1000).toFixed(2);

  // Affichage métriques
  const mDist = document.getElementById('mDist');
  const mSeg  = document.getElementById('mSeg');
  if (mDist) mDist.textContent = `${km} km`;
  if (mSeg)  mSeg.textContent  = `${track.length-1}`;
});
