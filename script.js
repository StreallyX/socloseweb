// Menu mobile
const navToggle = document.getElementById('navToggle');
const siteNav   = document.getElementById('siteNav');
if (navToggle && siteNav) navToggle.addEventListener('click', () => siteNav.classList.toggle('open'));

// Révélations au scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold: 0.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Studio interactif (Leaflet) =====
window.addEventListener('load', () => {
  const mapEl = document.getElementById('studioMap');
  if (!mapEl || typeof L === 'undefined') return;

  // Carte centrée sur Paris par défaut
  const map = L.map('studioMap', { zoomControl:true, scrollWheelZoom:false })
               .setView([48.858370, 2.294481], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OSM' }).addTo(map);

  const zones = [];
  const points = [];
  let poly = null;

  const $ = id => document.getElementById(id);
  const updateMetrics = () => {
    // Distance totale des points
    const toRad = d => d*Math.PI/180, R=6371e3;
    const hav = (a,b)=>{
      const φ1=toRad(a[0]), φ2=toRad(b[0]);
      const dφ=toRad(b[0]-a[0]), dλ=toRad(b[1]-a[1]);
      const s=Math.sin(dφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(dλ/2)**2;
      return 2*R*Math.asin(Math.sqrt(s));
    };
    let dist=0;
    for(let i=0;i<points.length-1;i++) dist += hav(points[i], points[i+1]);

    $('mZones').textContent = zones.length.toString();
    $('mPts').textContent   = points.length.toString();
    $('mDist').textContent  = (dist/1000).toFixed(2) + ' km';
  };

  // Ajouter une zone circulaire
  $('addZone').addEventListener('click', () => {
    const lat = parseFloat($('lat').value || '48.858370');
    const lng = parseFloat($('lng').value || '2.294481');
    const r   = Math.max(5, parseFloat($('radius').value || '60'));
    const c = L.circle([lat,lng], { radius:r, color:'#e7c05f', fillColor:'#e7c05f', fillOpacity:0.15 });
    c.addTo(map);
    zones.push(c);
    map.flyTo([lat,lng], 15, { duration:.6 });
    updateMetrics();
  });

  // Ajouter un point de chemin
  $('addPoint').addEventListener('click', () => {
    const lat = parseFloat($('lat').value || '48.858370');
    const lng = parseFloat($('lng').value || '2.294481');
    points.push([lat,lng]);
    L.circleMarker([lat,lng], { radius:5, color:'#f6e27a' }).addTo(map);
    if (poly) poly.remove();
    poly = L.polyline(points, { weight:4, color:'#f6e27a' }).addTo(map);
    map.panTo([lat,lng]);
    updateMetrics();
  });

  // Effacer
  $('clear').addEventListener('click', () => {
    zones.forEach(z => z.remove()); zones.length = 0;
    points.length = 0;
    if (poly) { poly.remove(); poly = null; }
    updateMetrics();
  });

  // Click sur la carte = remplir lat/lng
  map.on('click', (e) => {
    $('lat').value = e.latlng.lat.toFixed(6);
    $('lng').value = e.latlng.lng.toFixed(6);
  });

  updateMetrics();
});
