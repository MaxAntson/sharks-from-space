/* global L */
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  useMap,
} from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

// ============ util & hooks que NO usan contexto de leaflet ============
function useGeoJson(url) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => !cancelled && setData(json))
      .catch((e) => !cancelled && setErr(e))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [url]);
  return { data, err, loading };
}

function filterSeaPoints(fc, land) {
  if (!fc || !land) return fc;
  const landFeatures = land.features || [];
  const seaFeatures = (fc.features || []).filter((f) => {
    const coords = f?.geometry?.coordinates;
    if (!coords || !Number.isFinite(coords[0]) || !Number.isFinite(coords[1]))
      return false;
    const pt = point([coords[0], coords[1]]);
    const onLand = landFeatures.some((poly) => booleanPointInPolygon(pt, poly));
    return !onLand;
  });
  return { ...fc, features: seaFeatures };
}

const COLORS = {
  lewini: "#32d0ff",
  tiburo: "#ffd166",
  mokarran: "#7dd3fc",
  zygaena: "#60a5fa",
  corona: "#9ae6b4",
  default: "#34d399",
};

function colorForFeature(feature) {
  const s = (
    feature?.properties?.species ||
    feature?.properties?.scientificName ||
    ""
  ).toLowerCase();
  if (s.includes("lewini")) return COLORS.lewini;
  if (s.includes("tiburo")) return COLORS.tiburo;
  if (s.includes("mokarran")) return COLORS.mokarran;
  if (s.includes("zygaena")) return COLORS.zygaena;
  if (s.includes("corona")) return COLORS.corona;
  return COLORS.default;
}

const pointToLayer = (feature, latlng) =>
  L.circleMarker(latlng, {
    radius: 3,
    color: colorForFeature(feature),
    fillColor: colorForFeature(feature),
    fillOpacity: 0.75,
    weight: 0.8,
  });

const onEachFeature = (feature, layer) => {
  const species =
    feature?.properties?.species ||
    feature?.properties?.scientificName ||
    "Shark";
  const [lng, lat] = feature?.geometry?.coordinates || [];
  const src =
    feature?.properties?.datasetName || feature?.properties?.publisher || "";
  layer.bindPopup(
    `<strong>${species}</strong><br/>lat: ${lat?.toFixed(
      3
    )}, lng: ${lng?.toFixed(3)}${
      src ? `<br/><span class="muted">${src}</span>` : ""
    }`
  );
};

// ============ componentes que SÍ usan contexto de leaflet ============
// Deben renderizarse DENTRO de <MapContainer>
function FitToData({ featureCollection }) {
  const map = useMap();
  useEffect(() => {
    if (!featureCollection || !featureCollection.features?.length) return;
    const coords = featureCollection.features
      .map((f) => f.geometry?.coordinates)
      .filter(Boolean);
    const pts = [];
    const push = (lng, lat) => {
      if (Number.isFinite(lng) && Number.isFinite(lat)) pts.push([lat, lng]);
    };
    for (const c of coords) {
      if (Array.isArray(c[0]) && Array.isArray(c[0][0])) {
        for (const p of c) push(p[0], p[1]);
      } else {
        push(c[0], c[1]);
      }
    }
    if (!pts.length) return;
    const lats = pts.map((p) => p[0]);
    const lngs = pts.map((p) => p[1]);
    const bounds = [
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    ];
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [featureCollection, map]);
  return null;
}

// =============================== PAGE ===============================
function LegendDot({ color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{ width: 12, height: 12, background: color, borderRadius: 999 }}
      />
      {label}
    </span>
  );
}

export default function Map() {
  const hammerheads = useGeoJson("/data/sphyrna_points.geojson");
  const land = useGeoJson("/data/land.geojson");

  // preparar datos filtrados (sin usar hooks de leaflet)
  const filteredAll = useMemo(
    () =>
      hammerheads.data && land.data
        ? filterSeaPoints(hammerheads.data, land.data)
        : hammerheads.data || null,
    [hammerheads.data, land.data]
  );

  const loading = hammerheads.loading || land.loading;
  const error = hammerheads.err || land.err;

  return (
    <div className="section">
      <Helmet>
        <title>Sharks from Space – Global Map</title>
        <meta
          name="description"
          content="Interactive global map of hammerhead shark (Sphyrna spp.) occurrences from GBIF, filtered to ocean points with a land mask."
        />
      </Helmet>

      <h2 className="h2">Global sightings map (points)</h2>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <MapContainer
          center={[10, -80]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: 520, width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✅ Este componente usa useMap y por eso va DENTRO */}
          {filteredAll && <FitToData featureCollection={filteredAll} />}

          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Hammerheads (GBIF)">
              <>
                {filteredAll && (
                  <GeoJSON
                    key="sphyrna"
                    data={filteredAll}
                    pointToLayer={pointToLayer}
                    onEachFeature={onEachFeature}
                  />
                )}
              </>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>

      {loading && (
        <p className="muted" style={{ marginTop: 8 }}>
          Loading data…
        </p>
      )}
      {error && (
        <p style={{ marginTop: 8, color: "#ff6b6b" }}>
          Error loading data: {String(error.message || error)}
        </p>
      )}

      <div
        style={{ display: "flex", gap: 16, marginTop: 8, alignItems: "center" }}
      >
        <span className="muted">Legend:</span>
        <LegendDot color={COLORS.lewini} label="S. lewini (Scalloped)" />
        <LegendDot color={COLORS.mokarran} label="S. mokarran (Great)" />
        <LegendDot color={COLORS.zygaena} label="S. zygaena (Smooth)" />
        <LegendDot color={COLORS.tiburo} label="S. tiburo (Bonnethead)" />
      </div>

      {/* <p className="muted" style={{ marginTop: 4 }}>
        Points falling on land are filtered out using a global land mask
        (GeoJSON) and Turf. Data: GBIF (2000–2025), genus <em>Sphyrna</em>.
      </p> */}
    </div>
  );
}
