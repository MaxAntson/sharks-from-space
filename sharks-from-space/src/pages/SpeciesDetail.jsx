import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SHARKS } from "../data/sharks.js";

// Mapear especie -> archivo GeoJSON (ajusta rutas si cambian)
const GEO_MAP = {
  lewini: "/data/scalloped_points.geojson", // Scalloped hammerhead
  tiburo: "/data/bonnethead_points.geojson", // Bonnethead (si aún no hay, mostrará —)
  sphyrna_all: "/data/sphyrna_points.geojson", // opcional agregado
};

const fmt = (n) =>
  typeof n === "number" ? new Intl.NumberFormat("en-US").format(n) : "—";

async function fetchGeoCount(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const gj = await res.json();
    return Array.isArray(gj?.features) ? gj.features.length : null;
  } catch {
    return null;
  }
}

export default function SpeciesDetail() {
  const { key } = useParams();
  const sp = useMemo(() => SHARKS.find((s) => s.key === key), [key]);

  const [count, setCount] = useState(null);
  useEffect(() => {
    const url = GEO_MAP[key];
    let cancelled = false;
    (async () => {
      if (!url) return setCount(null);
      const c = await fetchGeoCount(url);
      if (!cancelled) setCount(c);
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  if (!sp) {
    return (
      <div className="section">
        <div className="card">
          <p>Species not found.</p>
          <Link className="btn" to="/species">
            ← Back to species
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <Helmet>
        <title>Sharks from Space – {sp.common}</title>
        <meta
          name="description"
          content={`Profile for ${sp.common} (${sp.scientific}). Status: ${sp.status}. Live datapoints from GeoJSON.`}
        />
      </Helmet>

      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h1 className="h1" style={{ margin: 0 }}>
            {sp.common}
          </h1>
          <span className="badge">{sp.status}</span>
        </div>
        <div className="muted" style={{ fontStyle: "italic" }}>
          {sp.scientific}
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div className="card" style={{ padding: "10px 14px" }}>
            <div className="kpi">{fmt(count ?? sp.datapoints)}</div>
            <div className="muted">datapoints</div>
          </div>
          <Link className="btn" to="/map">
            Open on map
          </Link>
          <Link className="btn" to="/species">
            ← Back to list
          </Link>
        </div>

        <p className="muted" style={{ marginTop: 8 }}>
          Datapoints are read live from the corresponding GeoJSON file when
          available.
        </p>
      </div>
    </div>
  );
}
