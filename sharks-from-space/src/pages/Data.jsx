import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

const formatNum = (n) =>
  typeof n === "number" ? new Intl.NumberFormat("en-US").format(n) : "—";

const SPECIES = [
  {
    key: "all",
    common: "All hammerheads (Sphyrna spp.)",
    scientific: "Sphyrna spp.",
    status: "Mixed",
    file: "/data/sphyrna_points.geojson",
  },
  {
    key: "lewini",
    common: "Scalloped hammerhead",
    scientific: "Sphyrna lewini",
    status: "Critically Endangered",
    file: "/data/scalloped_points.geojson",
  },
  {
    key: "mokarran",
    common: "Great hammerhead",
    scientific: "Sphyrna mokarran",
    status: "Critically Endangered",
    file: "/data/mokarran_points.geojson",
  },
  {
    key: "zygaena",
    common: "Smooth hammerhead",
    scientific: "Sphyrna zygaena",
    status: "Vulnerable",
    file: "/data/zygaena_points.geojson",
  },
  {
    key: "tudes",
    common: "Smalleye hammerhead",
    scientific: "Sphyrna tudes",
    status: "Critically Endangered",
    file: "/data/tudes_points.geojson",
  },
  {
    key: "tiburo",
    common: "Bonnethead",
    scientific: "Sphyrna tiburo",
    status: "Endangered",
    file: "/data/bonnethead_points.geojson",
  },
];

// ---------- util helpers ----------
function pickNum(x) {
  const v = Number(x);
  return Number.isFinite(v) ? v : null;
}
function topK(mapCounts, k = 5) {
  return Object.entries(mapCounts)
    .filter(([k]) => k && k !== "null" && k !== "undefined")
    .sort((a, b) => b[1] - a[1])
    .slice(0, k);
}
function describe(arr) {
  const a = arr.filter((n) => Number.isFinite(n)).sort((x, y) => x - y);
  if (!a.length) return { n: 0 };
  const q = (p) => a[Math.min(a.length - 1, Math.floor(p * (a.length - 1)))];
  return {
    n: a.length,
    min: a[0],
    p50: q(0.5),
    p90: q(0.9),
    p95: q(0.95),
    max: a[a.length - 1],
  };
}

// calcula métricas a partir de una FeatureCollection
function summarize(fc) {
  const feats = fc?.features || [];
  const byYear = {};
  const byDataset = {};
  const byPublisher = {};
  const byCountry = {};
  const basis = {};

  const coordUnc = [];
  const depths = [];

  let hasMedia = 0;
  let withCoords = 0;

  for (const f of feats) {
    const p = f.properties || {};
    const y = Number(p.year ?? new Date(p.eventDate || "").getUTCFullYear());
    if (Number.isFinite(y)) byYear[y] = (byYear[y] || 0) + 1;

    if (p.datasetName)
      byDataset[p.datasetName] = (byDataset[p.datasetName] || 0) + 1;
    if (p.publisher)
      byPublisher[p.publisher] = (byPublisher[p.publisher] || 0) + 1;
    if (p.country) byCountry[p.country] = (byCountry[p.country] || 0) + 1;
    if (p.basisOfRecord)
      basis[p.basisOfRecord] = (basis[p.basisOfRecord] || 0) + 1;

    const cu = pickNum(p.coordinateUncertaintyInMeters);
    if (cu != null) coordUnc.push(cu);

    const d1 = pickNum(p.depth);
    const d2 = pickNum(p.minimumDepthInMeters);
    const d3 = pickNum(p.maximumDepthInMeters);
    if (d1 != null) depths.push(d1);
    if (d2 != null) depths.push(d2);
    if (d3 != null) depths.push(d3);

    const hasC =
      Array.isArray(f.geometry?.coordinates) &&
      Number.isFinite(f.geometry.coordinates[0]) &&
      Number.isFinite(f.geometry.coordinates[1]);
    if (hasC) withCoords++;

    if (
      p.mediaType ||
      p.hasMedia === true ||
      (Array.isArray(p.media) && p.media.length)
    )
      hasMedia++;
  }

  const total = feats.length;
  return {
    total,
    withCoordsPct: total ? Math.round((withCoords / total) * 100) : 0,
    hasMediaPct: total ? Math.round((hasMedia / total) * 100) : 0,
    years: topK(byYear, 1000), // lo usas para un sparkline si quieres
    topDatasets: topK(byDataset),
    topPublishers: topK(byPublisher),
    topCountries: topK(byCountry),
    basis: topK(basis),
    coordUncDesc: describe(coordUnc),
    depthDesc: describe(depths),
  };
}

// ---------- UI ----------
export default function Data() {
  const [rows, setRows] = useState(
    SPECIES.map((s) => ({ ...s, datapoints: null, summary: null }))
  );
  const [loading, setLoading] = useState(true);
  const [openKey, setOpenKey] = useState(null); // fila abierta

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const results = await Promise.all(
          SPECIES.map(async (s) => {
            try {
              const r = await fetch(s.file);
              if (!r.ok) throw new Error(`HTTP ${r.status}`);
              const j = await r.json();
              const n = Array.isArray(j.features) ? j.features.length : 0;
              const summary = summarize(j);
              return { ...s, datapoints: n, summary };
            } catch {
              return { ...s, datapoints: 0, summary: null };
            }
          })
        );
        if (!cancelled) setRows(results);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const max = useMemo(
    () => Math.max(...rows.map((r) => r.datapoints ?? 0), 0),
    [rows]
  );
  const sorted = useMemo(
    () => [...rows].sort((a, b) => (b.datapoints ?? -1) - (a.datapoints ?? -1)),
    [rows]
  );
  const open = rows.find((r) => r.key === openKey);

  return (
    <div className="section">
      <Helmet>
        <title>Datasets overview (live)</title>
      </Helmet>
      <h2 className="h2">Datasets overview (live)</h2>

      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Species</th>
              <th>Status</th>
              <th>Datapoints ↓ Share</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const pct = max ? (s.datapoints ?? 0) / max : 0;
              return (
                <tr key={s.key} style={{ borderTop: "1px solid #1f2b3a" }}>
                  <td style={{ padding: "10px 8px" }}>
                    <strong>{s.common}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {s.scientific}
                    </div>
                  </td>
                  <td style={{ padding: "10px 8px" }}>{s.status}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span style={{ width: 90, textAlign: "right" }}>
                        {formatNum(s.datapoints)}
                      </span>
                      <svg width="240" height="12">
                        <rect width="240" height="12" fill="#102331" />
                        <rect
                          width={Math.round(240 * pct)}
                          height="12"
                          fill="#32d0ff"
                        />
                      </svg>
                    </div>
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <button
                      className="btn"
                      onClick={() =>
                        setOpenKey((k) => (k === s.key ? null : s.key))
                      }
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && (
          <p className="muted" style={{ marginTop: 8 }}>
            Loading…
          </p>
        )}
      </div>

      {open?.summary && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>{open.common} — details</h3>
          <div className="grid cols-2">
            <div>
              <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
                <li>
                  <strong>Total</strong>: {formatNum(open.summary.total)}
                </li>
                <li>
                  <strong>With coords</strong>: {open.summary.withCoordsPct}%
                </li>
                <li>
                  <strong>With media</strong>: {open.summary.hasMediaPct}%
                </li>
                <li>
                  <strong>Coord. uncertainty (m)</strong>:{" "}
                  {open.summary.coordUncDesc.n
                    ? `p50 ${formatNum(
                        Math.round(open.summary.coordUncDesc.p50)
                      )}, p95 ${formatNum(
                        Math.round(open.summary.coordUncDesc.p95)
                      )}`
                    : "—"}
                </li>
                <li>
                  <strong>Depth (m)</strong>:{" "}
                  {open.summary.depthDesc.n
                    ? `p50 ${formatNum(
                        Math.round(open.summary.depthDesc.p50)
                      )}, p95 ${formatNum(
                        Math.round(open.summary.depthDesc.p95)
                      )}`
                    : "—"}
                </li>
              </ul>
            </div>
            <div>
              <strong>Top datasets</strong>
              <ol style={{ marginTop: 6 }}>
                {open.summary.topDatasets.map(([name, c]) => (
                  <li key={name}>
                    {name} — {formatNum(c)}
                  </li>
                ))}
              </ol>
              <strong>Top publishers</strong>
              <ol style={{ marginTop: 6 }}>
                {open.summary.topPublishers.map(([name, c]) => (
                  <li key={name}>
                    {name} — {formatNum(c)}
                  </li>
                ))}
              </ol>
              <strong>Top countries</strong>
              <ol style={{ marginTop: 6 }}>
                {open.summary.topCountries.map(([name, c]) => (
                  <li key={name}>
                    {name} — {formatNum(c)}
                  </li>
                ))}
              </ol>
              <strong>Basis of record</strong>
              <ul style={{ marginTop: 6 }}>
                {open.summary.basis.map(([name, c]) => (
                  <li key={name}>
                    {name}: {formatNum(c)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button
            className="btn"
            style={{ marginTop: 12 }}
            onClick={() => setOpenKey(null)}
          >
            Close
          </button>
        </div>
      )}

      <p className="muted" style={{ marginTop: 8 }}>
        All metrics are computed client-side from your GeoJSON. Añade nuevos
        archivos a <code>/public/data</code> y extiende la lista arriba.
      </p>
    </div>
  );
}
