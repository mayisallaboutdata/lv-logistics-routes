/**
 * LV Logistics — Route Network Configuration
 * All route data, hub definitions, icons, and notes.
 */

// ── SVG Icons ──
export const ICONS = {
  ship: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 18l1.2-1.6a4 4 0 015.6 0L12 18l2.2-1.6a4 4 0 015.6 0L21 18" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M4 14l.5-5.5A1 1 0 015.5 7.5H8V5a1 1 0 011-1h6a1 1 0 011 1v2.5h2.5a1 1 0 011 .95L20 14" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="4" x2="12" y2="7.5" stroke="white" stroke-width="1.5"/></svg>',

  truck: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="1" y="6" width="14" height="10" rx="1.5" stroke="white" stroke-width="1.8"/><path d="M15 9h3.5a1.5 1.5 0 011.37.89l1.5 3.33A1.5 1.5 0 0121.5 14v2a.5.5 0 01-.5.5h-6" stroke="white" stroke-width="1.8"/><circle cx="6.5" cy="17.5" r="1.8" stroke="white" stroke-width="1.5"/><circle cx="17.5" cy="17.5" r="1.8" stroke="white" stroke-width="1.5"/></svg>',

  train: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="14" rx="3" stroke="white" stroke-width="1.8"/><path d="M4 12h16" stroke="white" stroke-width="1.5"/><circle cx="8.5" cy="15" r="1" fill="white"/><circle cx="15.5" cy="15" r="1" fill="white"/><path d="M9 17l-2 4M15 17l2 4M7 21h10" stroke="white" stroke-width="1.5" stroke-linecap="round"/><path d="M9 7h6" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>',
};

// ── Route Colors ──
export const ROUTE_COLORS = {
  route1: '#a855f7',
  route2: '#ef4444',
  route3: '#f59e0b',
  route4: '#10b981',
  route5: '#38bdf8',
};

// ── Route Notes (shown in notes panel) ──
export const ROUTE_NOTES = {
  route1: {
    title: 'LCL — USA via Rotterdam → CIS',
    color: '#a855f7',
    notes: [
      '<strong>Service type:</strong> LCL (Less than Container Load)',
      '<strong>US Hub:</strong> Houston — consolidation from LA, Seattle, New York, Savannah',
      '<strong>Transit hub:</strong> Rotterdam (Netherlands) — transshipment',
      '<strong>Route:</strong> Houston → Atlantic → Rotterdam → Mediterranean → Istanbul → overland → Baku/Alat',
      '<strong>Transit time:</strong> 30–35 days (port to door)',
    ],
  },
  route2: {
    title: 'LCL — China via Turkey → CIS',
    color: '#ef4444',
    notes: [
      '<strong>Service type:</strong> LCL (Less than Container Load)',
      '<strong>China Hub:</strong> Guangzhou — consolidation from Shenzhen, Ningbo, Qingdao, Xiamen, Shanghai',
      '<strong>Route:</strong> Guangzhou → Singapore → Suez Canal → Mersin/Istanbul → overland → Baku',
      '<strong>Transit time:</strong> 35–40 days (port to door)',
      '<strong>Note:</strong> Guangzhou is the primary consolidation hub for all Chinese origin cities',
    ],
  },
  route3: {
    title: 'Silkway — China via Kazakhstan',
    color: '#f59e0b',
    notes: [
      '<strong>Service type:</strong> Rail freight (FCL & LCL)',
      "<strong>Route:</strong> Shanghai → Xi'an → Dostyk → Kazakhstan → Aktau → Caspian → Baku/Alat",
      '<strong>Transit time:</strong> 28–30 days',
      '<strong>Key crossing:</strong> Dostyk — gauge change point',
    ],
  },
  route4: {
    title: 'LTL — EU via Turkey → CIS',
    color: '#10b981',
    notes: [
      '<strong>Service type:</strong> LTL — road transport',
      '<strong>Origin hubs:</strong> Frankfurt, Warsaw + other EU cities',
      '<strong>Route:</strong> EU → Vienna → Budapest → Balkans → Istanbul → Turkey → Tbilisi → Baku',
      '<strong>Transit time:</strong> 17–25 days (door to door)',
    ],
  },
  route5: {
    title: 'Alt — China via Cape of Good Hope',
    color: '#38bdf8',
    notes: [
      '<strong>Service type:</strong> FCL — alternative ocean route',
      '<strong>Route:</strong> Shanghai → Singapore → Cape of Good Hope → Atlantic → Rotterdam → CIS',
      '<strong>Transit time:</strong> 45–55 days',
      '<strong>Purpose:</strong> Alternative when Suez Canal faces disruptions',
    ],
  },
};

// ── Route Coordinates ──
// Each route has mainSegments (solid lines) and optional feederSegments (dashed lines)

export const ROUTES = {
  route1: {
    main: [
      // Houston → south of Cuba → open Atlantic → Rotterdam
      { coords: [
        [29.76,-95.36],[27.0,-91.0],[24.0,-86.0],[22.0,-82.0],
        [20.0,-76.0],[22.0,-68.0],[28.0,-58.0],[35.0,-45.0],
        [42.0,-30.0],[47.0,-15.0],[50.0,-5.0],[51.92,4.48],
      ]},
      // Rotterdam → Gibraltar → south of Sicily → south of Greece → Istanbul
      { coords: [
        [51.92,4.48],[48.0,0.0],[44.0,-4.0],[39.0,-6.0],
        [36.0,-5.5],[36.5,-2.0],[37.0,3.0],[37.5,8.0],
        [36.5,13.0],[36.0,17.0],[36.5,21.0],[37.5,24.0],
        [39.0,26.0],[40.5,28.5],[41.01,29.0],
      ]},
      // Istanbul → overland Turkey → Georgia → Baku
      { coords: [
        [41.01,29.0],[40.6,30.5],[40.0,32.9],[39.9,36.2],
        [39.5,39.0],[40.2,41.0],[41.0,42.5],[41.69,44.8],
        [41.3,46.5],[40.95,48.5],[40.41,49.87],
      ]},
    ],
    feeders: [
      { coords: [[47.6,-122.33],[29.76,-95.36]] },   // Seattle → Houston
      { coords: [[33.75,-118.2],[29.76,-95.36]] },    // LA → Houston
      { coords: [[40.68,-74.05],[29.76,-95.36]] },    // New York → Houston
      { coords: [[32.08,-81.1],[29.76,-95.36]] },     // Savannah → Houston
    ],
  },

  route2: {
    main: [
      // Guangzhou → South China Sea → Singapore
      { coords: [
        [23.13,113.26],[20.0,112.0],[15.0,111.0],
        [10.0,108.0],[5.0,105.0],[1.35,103.82],
      ]},
      // Singapore → south of Sri Lanka → Red Sea → Suez → Mersin
      { coords: [
        [1.35,103.82],[-2.0,96.0],[0.0,88.0],[3.0,80.0],
        [5.0,76.0],[8.0,68.0],[11.0,55.0],[12.5,48.0],
        [13.0,44.0],[15.0,42.0],[20.0,38.5],[27.0,34.5],
        [30.0,32.6],[31.5,32.3],[32.0,32.0],[33.5,33.0],
        [35.0,33.5],[36.8,34.63],
      ]},
      // Mersin → Istanbul
      { coords: [
        [36.8,34.63],[37.0,32.5],[38.0,31.0],
        [39.0,30.0],[40.5,28.5],[41.01,29.0],
      ]},
      // Istanbul → overland → Baku
      { coords: [
        [41.01,29.0],[40.6,30.5],[40.0,32.9],[39.9,36.2],
        [39.5,39.0],[40.2,41.0],[41.0,42.5],[41.69,44.8],
        [41.3,46.5],[40.95,48.5],[40.41,49.87],
      ]},
    ],
    feeders: [
      { coords: [[31.23,121.47],[23.13,113.26]] },    // Shanghai → Guangzhou
      { coords: [[22.54,114.06],[23.13,113.26]] },     // Shenzhen → Guangzhou
      { coords: [[29.87,121.55],[23.13,113.26]] },     // Ningbo → Guangzhou
      { coords: [[36.07,120.38],[23.13,113.26]] },     // Qingdao → Guangzhou
      { coords: [[24.48,118.09],[23.13,113.26]] },     // Xiamen → Guangzhou
    ],
  },

  route3: {
    main: [
      { coords: [[31.23,121.47],[33,114],[34.26,108.94]] },
      { coords: [[34.26,108.94],[36,104],[38,100],[40,95],[42,89],[43.8,87.6],[44.5,82],[45.22,78.38]] },
      { coords: [[45.22,78.38],[46,74],[47.5,69],[48,64],[48.5,59],[47.5,56],[46,53],[43.65,51.15]] },
      { coords: [[43.65,51.15],[42.5,51],[41.5,50.5],[40.8,50.1],[40.41,49.87]] },
    ],
    feeders: null,
  },

  route4: {
    main: [
      { coords: [[50.11,8.68],[49.5,12],[48.8,16.5],[48.14,17.11]] },
      { coords: [[48.14,17.11],[47.5,19.04]] },
      { coords: [[47.5,19.04],[46.5,21],[44.8,20.5],[44.0,22.5],[43.2,23.5],[42.7,25.3],[42,27.5],[41.5,28.5],[41.01,29.0]] },
      { coords: [[52.23,21.01],[51.1,17.04],[50.08,14.44],[48.14,17.11]] },
      { coords: [[41.01,29.0],[40.6,30.5],[40,32.9],[39.9,36.2],[39.5,39],[40.2,41],[41.0,42.5],[41.69,44.8],[41.3,46.5],[40.95,48.5],[40.41,49.87]] },
    ],
    feeders: null,
  },

  route5: {
    main: [
      // Shanghai → Singapore
      { coords: [
        [31.23,121.47],[26.0,118.0],[20.0,115.0],
        [12.0,110.0],[5.0,106.0],[1.35,103.82],
      ]},
      // Singapore → Indian Ocean → south of Madagascar → Cape Town
      { coords: [
        [1.35,103.82],[-4.0,94.0],[-10.0,82.0],[-16.0,68.0],
        [-22.0,52.0],[-28.0,40.0],[-33.0,30.0],[-35.5,22.0],[-34.9,18.5],
      ]},
      // Cape Town → well off West Africa → north Atlantic → Rotterdam
      { coords: [
        [-34.9,18.5],[-30.0,10.0],[-22.0,2.0],[-12.0,-4.0],
        [-2.0,-8.0],[8.0,-16.0],[18.0,-19.0],[28.0,-16.0],
        [36.0,-8.0],[43.0,-6.0],[48.0,-3.0],[51.0,2.0],[51.92,4.48],
      ]},
    ],
    feeders: null,
  },
};

// ── Transport Icons (placed on actual route paths in open water/road) ──
export const TRANSPORT_ICONS = [
  // Route 1
  { lat: 35.0, lng: -45.0, icon: 'ship', tip: 'Vessel — Mid-Atlantic crossing', route: 'route1' },
  { lat: 36.5, lng: 13.0, icon: 'ship', tip: 'Vessel — Mediterranean', route: 'route1' },
  { lat: 40.2, lng: 41.0, icon: 'truck', tip: 'Road — Eastern Turkey → Georgia → Baku', route: 'route1' },
  // Route 2
  { lat: 10.0, lng: 108.0, icon: 'ship', tip: 'Vessel — South China Sea', route: 'route2' },
  { lat: 3.0, lng: 80.0, icon: 'ship', tip: 'Vessel — Indian Ocean south of Sri Lanka', route: 'route2' },
  { lat: 20.0, lng: 38.5, icon: 'ship', tip: 'Vessel — Red Sea', route: 'route2' },
  // Route 3
  { lat: 38.0, lng: 100.0, icon: 'train', tip: 'Rail — Western China corridor', route: 'route3' },
  { lat: 48.0, lng: 64.0, icon: 'train', tip: 'Rail — Kazakhstan steppe', route: 'route3' },
  { lat: 41.5, lng: 50.5, icon: 'ship', tip: 'Vessel — Caspian Sea crossing', route: 'route3' },
  // Route 4
  { lat: 49.5, lng: 12.0, icon: 'truck', tip: 'Road — Central Europe', route: 'route4' },
  { lat: 43.2, lng: 23.5, icon: 'truck', tip: 'Road — Balkans corridor', route: 'route4' },
  // Route 5
  { lat: -10.0, lng: 82.0, icon: 'ship', tip: 'Vessel — Central Indian Ocean', route: 'route5' },
  { lat: -33.0, lng: 30.0, icon: 'ship', tip: 'Vessel — South Africa approach', route: 'route5' },
  { lat: 8.0, lng: -16.0, icon: 'ship', tip: 'Vessel — Atlantic north', route: 'route5' },
];

// ── Transit Time Badges ──
export const BADGES = [
  { lat: 46.0, lng: -28.0, text: '30–35 days', route: 'route1' },
  { lat: -4.0, lng: 68.0, text: '35–40 days', route: 'route2' },
  { lat: 50.0, lng: 72.0, text: '28–30 days', route: 'route3' },
  { lat: 45.5, lng: 16.0, text: '17–25 days', route: 'route4' },
  { lat: -26.0, lng: 0.0, text: '45–55 days', route: 'route5' },
];

// ── Hub Definitions ──
export const HUBS = [
  { name: 'BAKU', lat: 40.41, lng: 49.87, type: 'primary', color: '#e63946', routes: ['Route 1','Route 2','Route 3','Route 4'], desc: 'Primary destination — Baku / Alat International Seaport, Azerbaijan' },
  { name: 'ISTANBUL', lat: 41.01, lng: 29.0, type: 'major', color: '#fff', routes: ['Route 1','Route 2','Route 4'], desc: 'Major transit hub — Europe/Caucasus gateway' },
  { name: 'TBILISI', lat: 41.69, lng: 44.8, type: 'major', color: '#fff', routes: ['Route 1','Route 2','Route 4'], desc: 'Transit hub — Georgia overland corridor' },
  { name: 'ROTTERDAM', lat: 51.92, lng: 4.48, type: 'major', color: '#fff', routes: ['Route 1','Route 5'], desc: 'European port — transatlantic arrival' },
  { name: 'HOUSTON', lat: 29.76, lng: -95.36, type: 'major', color: '#fff', routes: ['Route 1'], desc: 'US consolidation hub — LA, Seattle, New York, Savannah' },
  { name: 'GUANGZHOU', lat: 23.13, lng: 113.26, type: 'major', color: '#fff', routes: ['Route 2'], desc: 'China consolidation hub — Shenzhen, Ningbo, Qingdao, Xiamen, Shanghai' },
  { name: 'SHANGHAI', lat: 31.23, lng: 121.47, type: 'major', color: '#fff', routes: ['Route 2','Route 3','Route 5'], desc: 'Major China origin port' },
  { name: 'AKTAU', lat: 43.65, lng: 51.15, type: 'major', color: '#fff', routes: ['Route 3'], desc: 'Caspian port — Kazakhstan rail terminus' },
  { name: 'LOS ANGELES', lat: 33.75, lng: -118.2, type: 'secondary', color: '#c0c8e0', routes: ['Route 1'], desc: 'US West Coast — feeds Houston hub' },
  { name: 'SEATTLE', lat: 47.6, lng: -122.33, type: 'secondary', color: '#c0c8e0', routes: ['Route 1'], desc: 'US Pacific NW — feeds Houston hub' },
  { name: 'NEW YORK', lat: 40.68, lng: -74.05, type: 'secondary', color: '#c0c8e0', routes: ['Route 1'], desc: 'US East Coast — feeds Houston hub' },
  { name: 'SAVANNAH', lat: 32.08, lng: -81.1, type: 'secondary', color: '#c0c8e0', routes: ['Route 1'], desc: 'US Southeast — feeds Houston hub' },
  { name: 'SHENZHEN', lat: 22.54, lng: 114.06, type: 'secondary', color: '#c0c8e0', routes: ['Route 2'], desc: 'South China — feeds Guangzhou hub' },
  { name: 'NINGBO', lat: 29.87, lng: 121.55, type: 'secondary', color: '#c0c8e0', routes: ['Route 2'], desc: 'East China — feeds Guangzhou hub' },
  { name: 'QINGDAO', lat: 36.07, lng: 120.38, type: 'secondary', color: '#c0c8e0', routes: ['Route 2'], desc: 'North China — feeds Guangzhou hub' },
  { name: 'XIAMEN', lat: 24.48, lng: 118.09, type: 'secondary', color: '#c0c8e0', routes: ['Route 2'], desc: 'Southeast China — feeds Guangzhou hub' },
  { name: 'SINGAPORE', lat: 1.35, lng: 103.82, type: 'secondary', color: '#c0c8e0', routes: ['Route 2','Route 5'], desc: 'Transshipment hub' },
  { name: 'MERSIN', lat: 36.8, lng: 34.63, type: 'secondary', color: '#c0c8e0', routes: ['Route 2'], desc: 'Turkish Mediterranean port' },
  { name: 'DOSTYK', lat: 45.22, lng: 78.38, type: 'secondary', color: '#c0c8e0', routes: ['Route 3'], desc: 'China–Kazakhstan rail border' },
  { name: "XI'AN", lat: 34.26, lng: 108.94, type: 'secondary', color: '#c0c8e0', routes: ['Route 3'], desc: 'Silk Road rail hub' },
  { name: 'FRANKFURT', lat: 50.11, lng: 8.68, type: 'secondary', color: '#c0c8e0', routes: ['Route 4'], desc: 'European road transport hub' },
  { name: 'WARSAW', lat: 52.23, lng: 21.01, type: 'secondary', color: '#c0c8e0', routes: ['Route 4'], desc: 'Northern European road connector' },
  { name: 'CAPE TOWN', lat: -34.0, lng: 18.5, type: 'secondary', color: '#c0c8e0', routes: ['Route 5'], desc: 'Cape of Good Hope waypoint' },
  { name: 'VIENNA', lat: 48.14, lng: 17.11, type: 'minor', color: '#8899bb', routes: ['Route 4'], desc: 'Central European transit' },
  { name: 'BUDAPEST', lat: 47.5, lng: 19.04, type: 'minor', color: '#8899bb', routes: ['Route 4'], desc: 'Balkans corridor transit' },
  { name: 'SRI LANKA', lat: 7.0, lng: 79.8, type: 'minor', color: '#8899bb', routes: ['Route 2'], desc: 'Indian Ocean waypoint' },
];

// ── Hub Label Offsets (prevents label overlap) ──
export const LABEL_OFFSETS = {
  'ISTANBUL': [12,-2], 'TBILISI': [12,-8], 'MERSIN': [12,6],
  'ROTTERDAM': [12,0], 'FRANKFURT': [12,-6], 'WARSAW': [12,-4],
  'VIENNA': [-60,6], 'BUDAPEST': [12,6], 'BAKU': [14,-2],
  'AKTAU': [12,-6], 'DOSTYK': [12,0], "XI'AN": [12,0],
  'SHANGHAI': [12,0], 'GUANGZHOU': [14,4], 'SHENZHEN': [14,8],
  'NINGBO': [12,-4], 'QINGDAO': [12,-4], 'XIAMEN': [12,0],
  'LOS ANGELES': [12,4], 'SEATTLE': [12,-4], 'NEW YORK': [12,-4],
  'HOUSTON': [14,4], 'SAVANNAH': [12,0], 'SINGAPORE': [12,6],
  'CAPE TOWN': [12,0], 'SRI LANKA': [12,0],
};

// ── Quick Zoom Regions ──
export const ZOOM_REGIONS = {
  global:     { center: [32, 48], zoom: 3 },
  europe:     { center: [43, 25], zoom: 5 },
  centralasia:{ center: [43, 58], zoom: 5 },
  asia:       { center: [30, 105], zoom: 4 },
};
