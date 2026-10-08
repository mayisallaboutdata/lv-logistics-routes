# LV Logistics — Global Route Network Map

Interactive map visualizing LV Logistics' global shipping routes to the Caspian corridor (Baku, Azerbaijan).

## Project Structure

```
lv-logistics-routes/
├── index.html          # HTML shell, loads the bundled script
├── css/
│   └── styles.css      # All styles & CSS custom properties (themes)
├── js/
│   └── bundle.js       # Bundled app: data, map init, UI logic
├── assets/
│   ├── logo.png        # Company logo
│   ├── ocean_freight.png  # Ship icon (ocean freight)
│   ├── road_transport.png # Truck icon (road transport)
│   └── rail_freight.png   # Train icon (rail transport)
└── README.md
```

## Routes

| Route | Color | Path | Transit |
|-------|-------|------|---------|
| **FCL/LCL — USA via Rotterdam** | Purple | Houston → Atlantic → Rotterdam → onward via FTL/LTL → Baku | 30–35 days |
| **FCL/LCL — China via Turkey** | Red | Guangzhou → Singapore → Suez Canal → Mersin → overland → Baku | 35–40 days |
| **Silkway — China via Kazakhstan** | Orange | Shanghai/Beijing/… → Xi'an → Dostyk → Kazakhstan → Aktau → Caspian → Baku/Alat | 28–30 days |
| **FTL/LTL — EU via Turkey** | Green | EU hubs (Frankfurt/Warsaw/Paris/Trieste) → Balkans/Turkey → Istanbul → Tbilisi → Baku | 17–25 days |
| **Via Cape of Good Hope** | Blue | Shanghai → Singapore → Cape of Good Hope → Gibraltar → Mediterranean → Mersin → Istanbul → Baku | 45–55 days |

## Features

- Interactive route toggling, with route notes & transit times via 📋 icons
- Hub-spoke pattern (solid main routes, dashed feeder lines)
- Click hubs for details
- Quick zoom navigation (Global / Europe / East Asia)
- Road legs are fetched live from OSRM and cached as rendered polylines — see **Routing notes** below

## Customization

> Note: the project now ships as a **single bundled script** (`js/bundle.js`). All map data and logic live there.

| What | Where |
|------|-------|
| Add/edit ocean or ferry paths | `js/bundle.js` → `OCEAN_ROUTES` |
| Add/edit live-routed road legs | `js/bundle.js` → `ROAD_SEGMENTS` (fetched via OSRM in `buildRoutes()`) |
| Add/edit transport icons along a route | `js/bundle.js` → `TRANSPORT_ICONS` |
| Add/edit transit-time labels | `js/bundle.js` → `TRANSIT_LABELS` |
| Add/edit hubs | `js/bundle.js` → `HUBS` array |
| Change marker/route icons | `js/bundle.js` → `SVG_ICONS` |
| Edit route notes (the 📋 panel) | `js/bundle.js` → `ROUTE_NOTES` object |
| Change colors | `js/bundle.js` → `ROUTE_COLORS` |
| Modify theme | `css/styles.css` → CSS custom properties in `:root` and `body.light-mode` |
| Replace logo / icons | Swap files in `assets/` |

## Routing notes

Road segments are routed live against the public [OSRM](https://project-osrm.org/) demo server
(`router.project-osrm.org`), which returns real road geometry for a given pair of coordinates —
see `fetchOSRMRoute()` in `js/bundle.js`.

That public server's road graph has a small gap exactly at the Georgia/Azerbaijan border
checkpoint (Red Bridge, near Sadakhlo/Qazakh): querying it end-to-end for Tbilisi → Baku
silently detours ~500km south through Armenia to find a connected path, instead of the real
~500km route east through Azerbaijan. The gap itself, once binary-searched against the live
server, turned out to be only ~700m wide — right at the checkpoint. `buildGeorgiaAzerbaijanCrossing()`
routes everything else live and bridges only that unavoidable ~700m with a straight line, so the
Tbilisi–Baku leg (shared by routes 1, 2, 4, and 5) stays on real roads through Georgia and
Azerbaijan instead of cutting through Armenia.

If OSRM's routing improves or you move to a self-hosted instance, this workaround can likely be
simplified back to a single live-routed call across `ROAD_SEGMENTS.*_to_baku`.

Past the border, OSRM's default path runs directly through Shamakhi town center, which
management wants avoided. `GA_BORDER_TO_BAKU` adds a waypoint near Kurdamir to force the route
onto the southern Hajigabul/Kurdamir lowland highway instead — a real road, ~11km longer, with
45+km of clearance from Shamakhi.

## Tech

- [Leaflet.js 1.9.4](https://leafletjs.com/) — map rendering
- [Esri World Street Map](https://www.esri.com/) tiles (via ArcGIS Online), OpenStreetMap contributors
- Single bundled JS file (`js/bundle.js`) — no build step required

## Deployment (GitHub Pages)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
gh repo create lv-logistics-routes --public --source=. --push
gh api repos/$(gh api user --jq .login)/lv-logistics-routes/pages \
  -f source='{"branch":"main","path":"/"}' --method POST
```

Site will be live at: `https://<username>.github.io/lv-logistics-routes/`
