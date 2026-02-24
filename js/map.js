/**
 * LV Logistics — Map Initialization & Theme
 * Handles Leaflet map setup, tile layers, and dark/light toggle.
 */

// ── Tile Layers ──
const darkBase = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OSM &copy; CARTO', subdomains: 'abcd', maxZoom: 19 }
);
const darkLabels = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
  { subdomains: 'abcd', maxZoom: 19, pane: 'overlayPane' }
);
const lightBase = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  { attribution: '&copy; OSM &copy; CARTO', subdomains: 'abcd', maxZoom: 19 }
);
const lightLabels = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
  { subdomains: 'abcd', maxZoom: 19, pane: 'overlayPane' }
);

// ── Map Instance ──
export const map = L.map('map', {
  center: [32, 48],
  zoom: 3,
  minZoom: 2,
  maxZoom: 10,
  zoomControl: true,
  worldCopyJump: false,
});

// Default to dark theme
let isDarkMode = true;
darkBase.addTo(map);
darkLabels.addTo(map);

// ── Theme Toggle ──
export function toggleTheme() {
  isDarkMode = !isDarkMode;
  const btn = document.getElementById('themeBtn');

  if (isDarkMode) {
    map.removeLayer(lightBase);
    map.removeLayer(lightLabels);
    darkBase.addTo(map);
    darkLabels.addTo(map);
    document.body.classList.remove('light-mode');
    btn.textContent = '☀️';
    btn.title = 'Switch to light mode';
  } else {
    map.removeLayer(darkBase);
    map.removeLayer(darkLabels);
    lightBase.addTo(map);
    lightLabels.addTo(map);
    document.body.classList.add('light-mode');
    btn.textContent = '🌙';
    btn.title = 'Switch to dark mode';
  }
}
