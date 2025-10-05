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

Sharks from Space is our submission to the NASA Space Apps Hackathon 2025.
We combine satellite data, open biodiversity records, and machine learning to:
• Detect hammerhead shark (Sphyrna spp.) occurrences
• Enrich points with sea-surface temperature (SST) and distance to coast
• Build a presence–absence dataset for ecological modeling
• Visualize results on an interactive global map
• Share insights through stories, dashboards, and datasets

This project is both a conservation data platform and an educational tool.

⸻

✨ Features
• 🗺️ Interactive Map — GBIF shark records, filtered with a land mask and enriched with SST + distance to coast.
• 📊 Presence–Absence Dataset — Balanced ~48% presences, ready for ML (XGBoost).
• 📈 Data Explorer — Compare species, filter by year, export CSV/Parquet.
• 📰 Blog / Stories — Research notes, conservation updates, and satellite insights.
• 🎨 Responsive UI — Custom dark theme, cards, badges, grid layouts.

⸻

🧩 Tech Stack
• Frontend: React 19, Vite
• Mapping: Leaflet + React-Leaflet, Turf.js
• Data Processing: Python (pandas, shapely, pyproj), CSV → GeoJSON/Parquet
• Modeling: XGBoost (planned) with spatial K-fold cross-validation
• Deployment: Netlify / Vercel-ready

⸻

📊 Data Sources
• GBIF — Global Biodiversity Information Facility (occurrence records, 2000–2025)
• NOAA CoastWatch ERDDAP — Daily MUR SST (sea-surface temperature)
• Natural Earth / OSM — Land mask for filtering coastal/ocean points
• Scientific Literature — Shark distribution, ecology, conservation status

⸻

🔍 Roadmap
• ✅ Filter GBIF records with land/ocean mask
• ✅ Enrich occurrences with SST + distance to coast
• ✅ Generate presence–absence dataset (GeoJSON + CSV + Parquet)
• ⏳ Train models (XGBoost + spatial cross-validation)
• ⏳ Produce probability maps and tiles for web integration
• ⏳ Add more oceanographic layers (depth, chlorophyll, currents)
• ⏳ Deploy live site with QR code sharing

⸻

👩‍🚀 Team

Built during NASA Space Apps Hackathon 2025 by:
• Max Antson – Team Lead
• Zurab Metreveli – Full-stack developer, 42 Barcelona
• Kaoli – Data researcher & storytelling
• Carlos L ----------------------------

⸻

🐋 License

Open source under the MIT License.
