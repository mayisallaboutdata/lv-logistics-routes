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
├── package.json        # Optional: `npm run check` for JS syntax
└── README.md
```

## Routes

| Route | Color | Path | Transit |
|-------|-------|------|---------|
| **LCL — USA** | Purple | Houston → Atlantic → Rotterdam → Med → Istanbul → Baku | 30–35 days |
| **LCL — China** | Red | Guangzhou → Singapore → Suez → Mersin → Istanbul → Baku | 35–40 days |
| **Silkway Rail** | Orange | Shanghai → Xi'an → Kazakhstan → Aktau → Caspian → Baku | 28–30 days |
| **LTL — EU** | Green | Frankfurt/Warsaw → Balkans → Istanbul → Georgia → Baku | 17–25 days |
| **Cape Alt** | Blue | Shanghai → Singapore → Cape of Good Hope → Rotterdam | 45–55 days |

## Features

- Light / Dark mode toggle
- Interactive route toggling
- Hub-spoke pattern (solid main routes, dashed feeder lines)
- Click hubs for details, route notes via 📋 icons
- Quick zoom navigation (Global / Europe / Central Asia / East Asia)

## Customization

> Note: the project now ships as a **single bundled script** (`js/bundle.js`). All map data and logic live there.

| What | Where |
|------|-------|
| Add/edit routes | `js/bundle.js` → `ROUTES` / `TRANSPORT_ICONS` / `BADGES` |
| Add/edit hubs | `js/bundle.js` → `HUBS` array |
| Change icons | `js/bundle.js` → `ICON_DATA` (PNG paths in `assets/`) |
| Edit route notes | `js/bundle.js` → `ROUTE_NOTES` object |
| Change colors | `js/bundle.js` → `ROUTE_COLORS` |
| Modify theme | `css/styles.css` → CSS custom properties in `:root` and `body.light-mode` |
| Replace logo / icons | Swap files in `assets/` |

## Tech

- [Leaflet.js 1.9.4](https://leafletjs.com/) — map rendering
- [CARTO](https://carto.com/) — tile layers (dark & light)
- Single bundled JS file (`js/bundle.js`) — no build step required
- Optional Node tooling:
  - `package.json` with `"type": "module"`
  - `npm run check` → quick syntax check for all JS files

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
