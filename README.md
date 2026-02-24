# LV Logistics — Global Route Network Map

Interactive map visualizing LV Logistics' global shipping routes to the Caspian corridor (Baku, Azerbaijan).

## Project Structure

```
lv-logistics-routes/
├── index.html          # HTML structure only
├── css/
│   └── styles.css      # All styles & CSS custom properties (themes)
├── js/
│   ├── config.js       # Route data, hubs, icons, notes (data layer)
│   ├── map.js          # Leaflet map init & theme toggle
│   └── app.js          # UI logic, route building, interactions
├── assets/
│   └── logo.png        # Company logo
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

| What | Where |
|------|-------|
| Add/edit routes | `js/config.js` → `ROUTES` object |
| Add/edit hubs | `js/config.js` → `HUBS` array |
| Change icons | `js/config.js` → `ICONS` object (SVG or `<img>` tags) |
| Edit route notes | `js/config.js` → `ROUTE_NOTES` object |
| Change colors | `js/config.js` → `ROUTE_COLORS` |
| Modify theme | `css/styles.css` → CSS custom properties in `:root` and `body.light-mode` |
| Replace logo | Swap `assets/logo.png` |

## Tech

- [Leaflet.js 1.9.4](https://leafletjs.com/) — map rendering
- [CARTO](https://carto.com/) — tile layers (dark & light)
- ES Modules — clean `import/export` between JS files
- No build step, no dependencies to install

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
