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

// Colors per species
const colorScalloped = "#32d0ff";
const colorBonnethead = "#ffd166";

// Generic hook to load GeoJSON from /public
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

// Fit the map viewport to a FeatureCollection of points
function FitToData({ featureCollection }) {
  const map = useMap();
  useEffect(() => {
    if (!featureCollection || !featureCollection.features?.length) return;
    const coords = featureCollection.features
      .map((f) => f.geometry?.coordinates)
      .filter(Boolean);
    if (!coords.length) return;

    const pts = [];
    const push = (lng, lat) => {
      if (Number.isFinite(lng) && Number.isFinite(lat)) pts.push([lat, lng]);
    };

    for (const c of coords) {
      if (Array.isArray(c[0]) && Array.isArray(c[0][0])) {
        // MultiPoint, etc.
        for (const p of c) push(p[0], p[1]);
      } else {
        // Point
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

export default function Map() {
  // Load species points
  const scalloped = useGeoJson("/data/scalloped_points.geojson");
  const bonnet = useGeoJson("/data/bonnethead_points.geojson");

  // Load land polygons (mask)
  const land = useGeoJson("/data/land.geojson");

  // Filter helper: remove points that fall on land
  const filterSeaPoints = (fc) => {
    if (!fc || !land.data) return fc; // no mask yet -> no filtering
    const landFeatures = land.data.features || [];
    const seaFeatures = (fc.features || []).filter((f) => {
      const coords = f?.geometry?.coordinates;
      if (!coords || !Number.isFinite(coords[0]) || !Number.isFinite(coords[1]))
        return false;
      const pt = point([coords[0], coords[1]]); // [lng, lat]
      // true if point is inside ANY land polygon
      const onLand = landFeatures.some((poly) =>
        booleanPointInPolygon(pt, poly)
      );
      return !onLand;
    });
    return { ...fc, features: seaFeatures };
  };

  // Marker styles (valid opacity 0..1)
  const scallopedPointToLayer = (_feature, latlng) =>
    L.circleMarker(latlng, {
      radius: 4,
      color: colorScalloped,
      fillColor: colorScalloped,
      fillOpacity: 0.75,
      weight: 1,
    });

  const bonnetPointToLayer = (_feature, latlng) =>
    L.circleMarker(latlng, {
      radius: 4,
      color: "#cfa241",
      fillColor: colorBonnethead,
      fillOpacity: 0.75,
      weight: 1,
    });

  // Popups
  const onEachFeature = (feature, layer) => {
    const species = feature?.properties?.species || "Shark";
    const [lng, lat] = feature?.geometry?.coordinates || [];
    layer.bindPopup(
      `<strong>${species}</strong><br/>lat: ${lat?.toFixed(
        3
      )}, lng: ${lng?.toFixed(3)}`
    );
  };

  // Loading / error states
  const loading = scalloped.loading || bonnet.loading || land.loading;
  const error = scalloped.err || bonnet.err || land.err;

  // Choose collection to fit initially (filtered if possible)
  const filteredScalloped = useMemo(
    () => (scalloped.data ? filterSeaPoints(scalloped.data) : null),
    [scalloped.data, land.data]
  );
  const filteredBonnet = useMemo(
    () => (bonnet.data ? filterSeaPoints(bonnet.data) : null),
    [bonnet.data, land.data]
  );

  const fitCollection =
    filteredScalloped || filteredBonnet || scalloped.data || bonnet.data;

  return (
    <div className="section">
      {/* ✅ Helmet for SEO */}
      <Helmet>
        <title>Sharks from Space – Global Map</title>
        <meta
          name="description"
          content="Interactive global map of shark sightings with species layers and land-mask filtering."
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

          {fitCollection && <FitToData featureCollection={fitCollection} />}

          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Scalloped hammerhead">
              <>
                {filteredScalloped && (
                  <GeoJSON
                    key="scalloped"
                    data={filteredScalloped}
                    pointToLayer={scallopedPointToLayer}
                    onEachFeature={onEachFeature}
                  />
                )}
              </>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Bonnethead">
              <>
                {filteredBonnet && (
                  <GeoJSON
                    key="bonnet"
                    data={filteredBonnet}
                    pointToLayer={bonnetPointToLayer}
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
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 12,
              background: colorScalloped,
              borderRadius: 999,
            }}
          />
          Scalloped
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 12,
              height: 12,
              background: colorBonnethead,
              borderRadius: 999,
            }}
          />
          Bonnethead
        </span>
      </div>

      <p className="muted" style={{ marginTop: 4 }}>
        Points falling on land are filtered out using a global land mask
        (GeoJSON) and Turf.
      </p>
    </div>
  );
}
