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
import { Helmet } from "@dr.pogodin/react-helmet";
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

const popupHtml = (feature) => {
  const species =
    feature?.properties?.species ||
    feature?.properties?.scientificName ||
    "Shark";
  const [lng, lat] = feature?.geometry?.coordinates || [];
  const src =
    feature?.properties?.datasetName || feature?.properties?.publisher || "";
  const sst = feature?.properties?.sst_c;
  const dist = feature?.properties?.dist_coast_km;

  return `<strong>${species}</strong><br/>
          lat: ${lat?.toFixed(3)}, lng: ${lng?.toFixed(3)}
          ${sst != null ? `<br/>SST: ${Number(sst).toFixed(2)} °C` : ""}
          ${
            dist != null
              ? `<br/>Dist. costa: ${Number(dist).toFixed(2)} km`
              : ""
          }
          ${src ? `<br/><span class="muted">${src}</span>` : ""}`;
};

const onEachFeature = (feature, layer) => {
  layer.bindPopup(popupHtml(feature));
};

// --- NUEVO: arrancar centrado en Caribe/Florida ---
function StartInCaribbean() {
  const map = useMap();
  useEffect(() => {
    // Opción simple: centro + zoom
    map.setView([25, -80], 5);

    // Opción alternativa con bounds (descomenta si prefieres):
    // const bounds = [
    //   [8, -98],   // sudoeste (lat, lon)
    //   [34, -60],  // nordeste
    // ];
    // map.fitBounds(bounds, { padding: [20, 20] });
  }, [map]);
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
  // ✅ usa el archivo con SST + distancia (y forzamos recarga con ?v=8)
  const hammerheads = useGeoJson(
    "/data/sphyrna_points_enriched_0_5000_with_dist.geojson?v=10"
  );
  const land = useGeoJson("/data/land.geojson");

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
          center={[25, -80]} // se ignora porque usamos StartInCaribbean
          zoom={5} // idem
          scrollWheelZoom
          style={{ height: 520, width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 👇 centra al Caribe al montar */}
          <StartInCaribbean />

          {/* Si prefieres que ajuste a todos los puntos, quita StartInCaribbean y deja esto */}
          {/* {filteredAll && <FitToData featureCollection={filteredAll} />} */}

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
    </div>
  );
}
// =============================== FIN ===============================
