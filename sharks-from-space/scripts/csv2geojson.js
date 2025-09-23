// scripts/csv2geojson.js
// Convierte un CSV de GBIF a GeoJSON para Leaflet

import fs from "fs";
import csv from "csv-parser";

const inputFile = "./src/data/raw/0004970-250920141307145 2.csv"; // 👈 tu CSV
const outputFile = "./public/data/scalloped_points.geojson"; // 👈 GeoJSON que usará el mapa

const features = [];

fs.createReadStream(inputFile)
  .pipe(csv({ separator: "\t" })) // GBIF usa tabulador (\t)
  .on("data", (row) => {
    const lat = parseFloat(row.decimalLatitude);
    const lon = parseFloat(row.decimalLongitude);

    if (!isNaN(lat) && !isNaN(lon)) {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lon, lat], // formato GeoJSON [lon, lat]
        },
        properties: {
          species: row.species || row.scientificName || "Shark",
          eventDate: row.eventDate || null,
          basisOfRecord: row.basisOfRecord || null,
        },
      });
    }
  })
  .on("end", () => {
    const geojson = {
      type: "FeatureCollection",
      features,
    };

    fs.writeFileSync(outputFile, JSON.stringify(geojson, null, 2));
    console.log(`✅ Saved ${features.length} points to ${outputFile}`);
  });
