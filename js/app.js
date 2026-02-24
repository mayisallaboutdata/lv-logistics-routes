/**
 * LV Logistics — Application Logic
 * Route building, hub rendering, UI interactions.
 */

import {
  ICONS, ROUTE_COLORS, ROUTE_NOTES, ROUTES,
  TRANSPORT_ICONS, BADGES, HUBS, LABEL_OFFSETS, ZOOM_REGIONS,
} from './config.js';
import { map, toggleTheme } from './map.js';

// ── State ──
const routeLayers = {};
const routeVisible = {};
const routeTransportIcons = {};
const routeBadges = {};

Object.keys(ROUTE_COLORS).forEach(key => {
  routeVisible[key] = true;
  routeTransportIcons[key] = [];
  routeBadges[key] = [];
});

// ══════════════════════════════════════════
// Azerbaijan Highlight (circle)
// ══════════════════════════════════════════
L.circle([40.3, 49.0], {
  radius: 200000,
  color: '#e63946',
  weight: 2,
  opacity: 0.5,
  fillColor: '#e63946',
  fillOpacity: 0.08,
  dashArray: '8 4',
}).addTo(map);

// ══════════════════════════════════════════
// Route Line Factories
// ══════════════════════════════════════════
function createSolid(coords, color) {
  return L.polyline(coords, {
    color, weight: 3, opacity: 0.85,
    lineCap: 'round', lineJoin: 'round',
  });
}

function createFeeder(coords, color) {
  return L.polyline(coords, {
    color, weight: 2, opacity: 0.45,
    dashArray: '6 6', lineCap: 'round',
  });
}

function createGlow(coords, color) {
  return L.polyline(coords, {
    color, weight: 9, opacity: 0.1,
    lineCap: 'round', lineJoin: 'round',
  });
}

// ══════════════════════════════════════════
// Build All Routes
// ══════════════════════════════════════════
Object.entries(ROUTES).forEach(([key, route]) => {
  const color = ROUTE_COLORS[key];
  const group = L.layerGroup();

  route.main.forEach(seg => {
    createGlow(seg.coords, color).addTo(group);
    createSolid(seg.coords, color).addTo(group);
  });

  if (route.feeders) {
    route.feeders.forEach(seg => {
      createFeeder(seg.coords, color).addTo(group);
    });
  }

  group.addTo(map);
  routeLayers[key] = group;
});

// ══════════════════════════════════════════
// Transport Icons
// ══════════════════════════════════════════
function addTransportIcon({ lat, lng, icon, tip, route }) {
  const svg = ICONS[icon];
  const el = L.divIcon({
    className: 'transport-svg-icon',
    html: `<div style="background:var(--transport-bg);border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid var(--transport-border);box-shadow:0 2px 10px rgba(0,0,0,0.5)">${svg}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
  const marker = L.marker([lat, lng], { icon: el, interactive: true }).addTo(map);
  if (tip) marker.bindTooltip(tip, { direction: 'top', offset: [0, -16] });
  routeTransportIcons[route].push(marker);
}

TRANSPORT_ICONS.forEach(addTransportIcon);

// ══════════════════════════════════════════
// Transit Time Badges
// ══════════════════════════════════════════
BADGES.forEach(({ lat, lng, text, route }) => {
  const color = ROUTE_COLORS[route];
  const el = L.divIcon({
    className: '',
    html: `<div class="transit-badge" style="background:${color}">${text}</div>`,
    iconSize: null,
    iconAnchor: [40, 10],
  });
  const marker = L.marker([lat, lng], { icon: el, interactive: false }).addTo(map);
  routeBadges[route].push(marker);
});

// ══════════════════════════════════════════
// Hub Markers
// ══════════════════════════════════════════
HUBS.forEach(hub => {
  const isPrimary = hub.type === 'primary';
  const isMajor = hub.type === 'major';
  const isMinor = hub.type === 'minor';

  const dotClass = isPrimary ? 'hub-dot primary' : 'hub-dot';
  const labelClass = isPrimary
    ? 'hub-label primary-label'
    : isMinor ? 'hub-label secondary' : 'hub-label';
  const dotColor = isPrimary ? '#e63946' : hub.color;
  const dotSize = isPrimary ? 14 : isMajor ? 9 : isMinor ? 6 : 8;
  const offset = LABEL_OFFSETS[hub.name] || [12, 0];

  const icon = L.divIcon({
    className: 'hub-marker',
    html: `<div class="${dotClass}" style="background:${dotColor};width:${dotSize}px;height:${dotSize}px"></div>`
      + `<span class="${labelClass}" style="position:relative;left:${offset[0]-12}px;top:${offset[1]}px">${hub.name}</span>`,
    iconSize: null,
    iconAnchor: [dotSize / 2, dotSize / 2],
  });

  const marker = L.marker([hub.lat, hub.lng], { icon }).addTo(map);

  marker.on('click', () => {
    const routeStr = hub.routes
      .map(r => `<span style="color:${ROUTE_COLORS[r.replace('Route ','route')]}">●</span> ${r}`)
      .join('<br>');
    document.getElementById('infoPanelTitle').innerHTML =
      `<span style="color:${isPrimary ? '#e63946' : 'var(--text-primary)'}">${hub.name}</span>`;
    document.getElementById('infoPanelDetail').innerHTML =
      `<p>${hub.desc}</p><br><strong>Routes:</strong><br>${routeStr}`;
    document.getElementById('infoPanel').classList.add('active');
  });
});

// ══════════════════════════════════════════
// UI — Route Toggle
// ══════════════════════════════════════════
function toggleRoute(key) {
  routeVisible[key] = !routeVisible[key];
  const item = document.querySelector(`.legend-item[data-route="${key}"]`);

  if (routeVisible[key]) {
    map.addLayer(routeLayers[key]);
    item.classList.remove('dimmed');
    routeBadges[key].forEach(b => map.addLayer(b));
    routeTransportIcons[key].forEach(i => map.addLayer(i));
  } else {
    map.removeLayer(routeLayers[key]);
    item.classList.add('dimmed');
    routeBadges[key].forEach(b => map.removeLayer(b));
    routeTransportIcons[key].forEach(i => map.removeLayer(i));
  }
}

// ══════════════════════════════════════════
// UI — Notes Panel
// ══════════════════════════════════════════
function showNotes(routeKey) {
  const data = ROUTE_NOTES[routeKey];
  if (!data) return;
  document.getElementById('notesPanelTitle').innerHTML =
    `<span style="color:${data.color}">●</span> ${data.title}`;
  document.getElementById('notesPanelContent').innerHTML =
    data.notes.map(n => `<div class="note-item">${n}</div>`).join('');
  document.getElementById('notesPanel').classList.add('active');
}

function closeNotesPanel() {
  document.getElementById('notesPanel').classList.remove('active');
}

// ══════════════════════════════════════════
// UI — Info Panel
// ══════════════════════════════════════════
function closeInfoPanel() {
  document.getElementById('infoPanel').classList.remove('active');
}

map.on('click', (e) => {
  if (!e.originalEvent.target.closest('.hub-marker')) {
    closeInfoPanel();
  }
});

// ══════════════════════════════════════════
// UI — Quick Zoom
// ══════════════════════════════════════════
function zoomTo(region) {
  const r = ZOOM_REGIONS[region];
  if (r) map.flyTo(r.center, r.zoom, { duration: 1.2 });
}

// ══════════════════════════════════════════
// Expose functions to HTML onclick handlers
// ══════════════════════════════════════════
window.toggleTheme = toggleTheme;
window.toggleRoute = toggleRoute;
window.showNotes = showNotes;
window.closeNotesPanel = closeNotesPanel;
window.closeInfoPanel = closeInfoPanel;
window.zoomTo = zoomTo;
