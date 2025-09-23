// scripts/csv2geojson.mjs
// Convierte un CSV/TSV de GBIF a GeoJSON (sin dependencias externas)

import fs from "fs";
import readline from "readline";
import path from "path";

// --- CLI args ---
// Ejemplo: node scripts/csv2geojson.mjs --in "src/data/raw/mi.csv" --out "public/data/scalloped_points.geojson" --limit 50000
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) {
      const k = cur.slice(2);
      const v = arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true;
      acc.push([k, v]);
    }
    return acc;
  }, [])
);

const inputFile = args.in || "./src/data/raw/0004970-250920141307145 2.csv"; // ajusta si hace falta
const outputFile = args.out || "./public/data/scalloped_points.geojson";
const limit = args.limit ? Number(args.limit) : Infinity;

// GBIF “Simple” download es TAB-delimited
const SEP = "\t";

if (!fs.existsSync(inputFile)) {
  console.error(`❌ Input not found: ${inputFile}`);
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(inputFile),
  crlfDelay: Infinity,
});

let headers = null;
const features = [];
let lineNo = 0;

const idx = (h) => headers.indexOf(h);

for await (const line of rl) {
  lineNo++;
  if (!line.trim()) continue;

  // Partimos por TAB (GBIF simple no usa tabs dentro de campos)
  const cols = line.split(SEP);

  // Cabeceras
  if (!headers) {
    headers = cols;
    continue;
  }

  // Campos típicos de GBIF
  const lat = parseFloat(cols[idx("decimalLatitude")]);
  const lon = parseFloat(cols[idx("decimalLongitude")]);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

  // Opcionales
  const species =
    cols[idx("species")] ||
    cols[idx("scientificName")] ||
    cols[idx("acceptedScientificName")] ||
    "Shark";

  const eventDate = cols[idx("eventDate")] || null;
  const basisOfRecord = cols[idx("basisOfRecord")] || null;

  features.push({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lon, lat] },
    properties: { species, eventDate, basisOfRecord },
  });

  if (features.length >= limit) break;
}

const geojson = { type: "FeatureCollection", features };
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(geojson, null, 2));

console.log(
  `✅ Saved ${features.length} points to ${outputFile} (from ${lineNo} lines read)`
);
