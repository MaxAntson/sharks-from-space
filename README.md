[README.md](https://github.com/user-attachments/files/22500357/README.md)
# 🦈 Sharks from Space 🌍  
**Tracking hammerhead sharks from orbit — with satellites, open data, and conservation insights.**  

![Sharks Banner](public/blog/covers/satellite-ocean.jpg)  

---

## 📛 Badges  
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)  
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet&logoColor=white)  
![NASA Space Apps](https://img.shields.io/badge/NASA-Space_Apps_2025-blue?logo=nasa)  
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)  
![Status](https://img.shields.io/badge/Status-Hackathon_Prototype-orange)  

---

## 🚀 About the Project  
**Sharks from Space** is our submission to the **NASA Space Apps Hackathon 2025**.  
We explore how **satellite imagery**, **open ocean datasets**, and **ecological models** can be combined to:  

- Detect **hammerhead shark (Sphyrna spp.)** occurrences  
- Filter and visualize them on an **interactive global map**  
- Provide **species intelligence** (status, threats, datapoints)  
- Share insights through **stories, blog posts, and datasets**  

This project is both a **data platform** and an **educational tool** to raise awareness of shark conservation challenges.  

---

## ✨ Features  
- 🗺️ **Interactive Map** — GBIF occurrence data filtered with a global land mask (Turf.js + Leaflet).  
- 📊 **Species Explorer** — Search, filter, and sort 10 hammerhead species. Export CSV of results.  
- 📈 **Data Overview** — Comparative charts and datapoint shares across species.  
- 📰 **Blog / Stories Section** — Conservation notes, research summaries, and satellite stories.  
- 📚 **Sources** — Transparency on open datasets (GBIF, EMODnet, NOAA, etc.).  
- 🔒 **Error Boundaries** — Resilient React setup, handling map rendering errors gracefully.  
- 🎨 **Responsive Design** — Custom dark theme with cards, badges, and grid layouts.  

---

## 🧩 Tech Stack  
- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)  
- **Mapping**: [Leaflet](https://leafletjs.com/), [React-Leaflet](https://react-leaflet.js.org/)  
- **Data Processing**: Turf.js (point-in-polygon filtering), CSV → GeoJSON conversion scripts  
- **SEO & Metadata**: [react-helmet-async](https://github.com/staylor/react-helmet-async)  
- **Styling**: Custom CSS variables + responsive grid system  
- **Deployment**: Vercel-ready  

---

## 📊 Data Sources  
- **GBIF** (Global Biodiversity Information Facility) — Shark occurrence records (2000–2025)  
- **OpenStreetMap** — Basemap tiles  
- **EMODnet / NOAA / NASA** — Oceanographic reference layers (planned)  
- **Scientific Literature** — Hammerhead ecology, distribution, and conservation status  

---

## 🔍 Pages Overview  

| Page         | Description |
|--------------|-------------|
| `/` **Home** | Hero section, project intro, KPIs, reference model |
| `/map` **Map** | Interactive global sightings with filters & legend |
| `/species` **Species Explorer** | Profiles of hammerhead species, filters, CSV export |
| `/data` **Datasets Overview** | Datapoint comparisons and visualization |
| `/blog` **Blog / Stories** | Articles, research notes, and conservation posts |
| `/research` **Research Notes** | Models, methods, and references |
| `/sources` **Sources** | Links to open datasets and references |
| `/about` **About** | Team story & NASA Hackathon context |
| `/contact` **Contact** | Email + social links |

---

## ⚙️ Installation  

Clone and run locally:  

```bash
git clone https://github.com/your-username/sharks-from-space.git
cd sharks-from-space
npm install
npm run dev
```

Build for production:  
```bash
npm run build
```

---

## 🛠️ Development  

Convert raw CSV data to GeoJSON:  
```bash
node scripts/csv2geojson.mjs --in src/data/raw/file.csv --out public/data/sphyrna_points.geojson
```

---

## 🌍 Roadmap  
- ✅ Filter occurrence data with land/ocean mask  
- ✅ Add species explorer with CSV export  
- ✅ Blog / Stories section  
- ⏳ Add more species & dataset integration (EMODnet, NOAA)  
- ⏳ Layer oceanographic features (temperature, depth)  
- ⏳ Improve clustering for large datasets (performance)  
- ⏳ Deploy live site with QR code sharing  

---

## 👩‍🚀 Team  
Built during **NASA Space Apps Hackathon 2025** by:  

- **Max Antson** – Team Lead  
- **Zurab Metreveli** – Full-stack developer, 42 Barcelona  
- **Kaoli** – Data researcher & storytelling  

---

## 🐋 License  
This project is open source under the **MIT License**.  
