import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

// ---------- utils ----------
const fmt = (n) =>
  typeof n === "number" ? new Intl.NumberFormat("en-US").format(n) : "—";

function num(x) {
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

// ---------- datasets ----------
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
    key: "tiburo",
    common: "Bonnethead",
    scientific: "Sphyrna tiburo",
    status: "Endangered",
    file: "/data/bonnethead_points.geojson",
  },
];

// ---------- summarizers ----------
function filterFeatures(fc, filters) {
  const feats = fc?.features || [];
  const { yearMin, yearMax, country, basis } = filters;

  return feats.filter((f) => {
    const p = f.properties || {};
    const y = num(p.year ?? new Date(p.eventDate || "").getUTCFullYear());
    if (y != null) {
      if (yearMin != null && y < yearMin) return false;
      if (yearMax != null && y > yearMax) return false;
    }
    if (country && p.country !== country) return false;
    if (basis.size && p.basisOfRecord && !basis.has(p.basisOfRecord))
      return false;
    return true;
  });
}

function summarizeFromFeatures(feats) {
  const byYear = {};
  const byDataset = {};
  const byPublisher = {};
  const byCountry = {};
  const byBasis = {};

  const coordUnc = [];
  const depths = [];

  let hasMedia = 0;
  let withCoords = 0;

  for (const f of feats) {
    const p = f.properties || {};

    const y = num(p.year ?? new Date(p.eventDate || "").getUTCFullYear());
    if (Number.isFinite(y)) byYear[y] = (byYear[y] || 0) + 1;

    if (p.datasetName)
      byDataset[p.datasetName] = (byDataset[p.datasetName] || 0) + 1;
    if (p.publisher)
      byPublisher[p.publisher] = (byPublisher[p.publisher] || 0) + 1;
    if (p.country) byCountry[p.country] = (byCountry[p.country] || 0) + 1;
    if (p.basisOfRecord)
      byBasis[p.basisOfRecord] = (byBasis[p.basisOfRecord] || 0) + 1;

    const cu = num(p.coordinateUncertaintyInMeters);
    if (cu != null) coordUnc.push(cu);

    const d1 = num(p.depth);
    const d2 = num(p.minimumDepthInMeters);
    const d3 = num(p.maximumDepthInMeters);
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
    yearsFull: Object.entries(byYear)
      .map(([y, c]) => [Number(y), c])
      .sort((a, b) => a[0] - b[0]),
    topDatasets: topK(byDataset),
    topPublishers: topK(byPublisher),
    topCountries: topK(byCountry),
    basis: topK(byBasis, 10),
    coordUncDesc: describe(coordUnc),
    depthDesc: describe(depths),
  };
}

function collectGlobalFacets(allFCs) {
  const years = new Set();
  const countries = new Set();
  const basis = new Set();
  for (const fc of allFCs) {
    for (const f of fc?.features || []) {
      const p = f.properties || {};
      const y = num(p.year ?? new Date(p.eventDate || "").getUTCFullYear());
      if (Number.isFinite(y)) years.add(y);
      if (p.country) countries.add(p.country);
      if (p.basisOfRecord) basis.add(p.basisOfRecord);
    }
  }
  const yearsSorted = [...years].sort((a, b) => a - b);
  return {
    yearsSorted,
    countriesSorted: [...countries].sort(),
    basisSorted: [...basis].sort(),
  };
}

// ---------- CSV export ----------
function exportCSVFromFeatures(feats, filename = "sharks_filtered.csv") {
  const head = [
    "scientificName",
    "species",
    "eventDate",
    "year",
    "country",
    "datasetName",
    "publisher",
    "basisOfRecord",
    "decimalLongitude",
    "decimalLatitude",
    "coordinateUncertaintyInMeters",
  ].join(",");

  const esc = (v) => `"${String(v ?? "").replaceAll(`"`, `""`)}"`;

  const rows = feats.map((f) => {
    const p = f.properties || {};
    const [lng, lat] = f.geometry?.coordinates || [];
    return [
      esc(p.scientificName),
      esc(p.species),
      esc(p.eventDate),
      esc(p.year),
      esc(p.country),
      esc(p.datasetName),
      esc(p.publisher),
      esc(p.basisOfRecord),
      esc(lng),
      esc(lat),
      esc(p.coordinateUncertaintyInMeters),
    ].join(",");
  });

  const csv = [head, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- Sparkline ----------
function Sparkline({ series, width = 320, height = 40 }) {
  if (!series?.length) return <svg width={width} height={height} />;
  const years = series.map(([y]) => y);
  const counts = series.map(([, c]) => c);
  const minY = Math.min(...years);
  const maxY = Math.max(...years);
  const maxC = Math.max(...counts, 1);

  const x = (yr) => width * (maxY === minY ? 0.5 : (yr - minY) / (maxY - minY));
  const y = (c) => height - (height - 2) * (c / maxC) - 1;

  const d =
    "M " +
    series
      .map(([yr, c]) => `${x(yr).toFixed(1)} ${y(c).toFixed(1)}`)
      .join(" L ");

  return (
    <svg width={width} height={height} aria-label="Occurrences per year">
      <rect width={width} height={height} fill="#0e141c" />
      <path d={d} fill="none" stroke="#32d0ff" strokeWidth="2" />
    </svg>
  );
}

// ---------- Page ----------
export default function Data() {
  // 1) carga los GeoJSON (crudos)
  const [rawRows, setRawRows] = useState(
    SPECIES.map((s) => ({ ...s, fc: null }))
  );
  const [loading, setLoading] = useState(true);

  // Filtros
  const [yearMin, setYearMin] = useState(null);
  const [yearMax, setYearMax] = useState(null);
  const [country, setCountry] = useState("");
  const [basisSel, setBasisSel] = useState(new Set()); // vacío = no filtra

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const out = await Promise.all(
          SPECIES.map(async (s) => {
            try {
              const r = await fetch(s.file);
              if (!r.ok) throw new Error(`HTTP ${r.status}`);
              const j = await r.json();
              return { ...s, fc: j };
            } catch {
              return { ...s, fc: { type: "FeatureCollection", features: [] } };
            }
          })
        );
        if (!cancelled) {
          setRawRows(out);

          // Inicializa rango de años a partir de TODOS los ficheros
          const facets = collectGlobalFacets(out.map((r) => r.fc));
          if (facets.yearsSorted.length) {
            setYearMin(facets.yearsSorted[0]);
            setYearMax(facets.yearsSorted[facets.yearsSorted.length - 1]);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const facets = useMemo(
    () => collectGlobalFacets(rawRows.map((r) => r.fc || { features: [] })),
    [rawRows]
  );

  // 2) aplica filtros + resume para la tabla
  const filters = useMemo(
    () => ({ yearMin, yearMax, country, basis: basisSel }),
    [yearMin, yearMax, country, basisSel]
  );

  const rows = useMemo(() => {
    return rawRows.map((r) => {
      const feats = filterFeatures(r.fc || { features: [] }, filters);
      const summary = summarizeFromFeatures(feats);
      return {
        ...r,
        featsFiltered: feats,
        datapoints: summary.total,
        summary,
      };
    });
  }, [rawRows, filters]);

  const max = useMemo(
    () => Math.max(...rows.map((r) => r.datapoints ?? 0), 0),
    [rows]
  );
  const sorted = useMemo(
    () => [...rows].sort((a, b) => (b.datapoints ?? -1) - (a.datapoints ?? -1)),
    [rows]
  );

  const [openKey, setOpenKey] = useState(null);
  const open = sorted.find((r) => r.key === openKey);

  // ---------- UI ----------
  return (
    <div className="section">
      <Helmet>
        <title>Datasets overview (live)</title>
      </Helmet>
      <h2 className="h2">Datasets overview (live)</h2>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          }}
        >
          <div>
            <div className="muted" style={{ marginBottom: 6 }}>
              Year range
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                value={yearMin ?? ""}
                onChange={(e) =>
                  setYearMin(e.target.value ? Number(e.target.value) : null)
                }
                placeholder="min"
                className="input"
              />
              <input
                type="number"
                value={yearMax ?? ""}
                onChange={(e) =>
                  setYearMax(e.target.value ? Number(e.target.value) : null)
                }
                placeholder="max"
                className="input"
              />
            </div>
          </div>

          <div>
            <div className="muted" style={{ marginBottom: 6 }}>
              Country
            </div>
            <select
              className="input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">All countries</option>
              {facets.countriesSorted.slice(0, 80).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="muted" style={{ marginBottom: 6 }}>
              Basis of record
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {facets.basisSorted.map((b) => {
                const checked = basisSel.has(b);
                return (
                  <label
                    key={b}
                    style={{
                      display: "inline-flex",
                      gap: 6,
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = new Set(basisSel);
                        if (e.target.checked) next.add(b);
                        else next.delete(b);
                        setBasisSel(next);
                      }}
                    />
                    {b}
                  </label>
                );
              })}
              {!facets.basisSorted.length && (
                <span className="muted">No basis available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla principal */}
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
                        {fmt(s.datapoints)}
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
            {!sorted.length && (
              <tr>
                <td colSpan={4} style={{ padding: 12 }}>
                  <span className="muted">No data.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && (
          <p className="muted" style={{ marginTop: 8 }}>
            Loading…
          </p>
        )}
      </div>

      {/* Panel de detalles */}
      {open && open.summary && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>{open.common} — details</h3>

          <div className="grid cols-2">
            <div>
              <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
                <li>
                  <strong>Total</strong>: {fmt(open.summary.total)}
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
                    ? `p50 ${fmt(
                        Math.round(open.summary.coordUncDesc.p50)
                      )}, p95 ${fmt(Math.round(open.summary.coordUncDesc.p95))}`
                    : "—"}
                </li>
                <li>
                  <strong>Depth (m)</strong>:{" "}
                  {open.summary.depthDesc.n
                    ? `p50 ${fmt(
                        Math.round(open.summary.depthDesc.p50)
                      )}, p95 ${fmt(Math.round(open.summary.depthDesc.p95))}`
                    : "—"}
                </li>
              </ul>

              <div style={{ marginTop: 12 }}>
                <div className="muted" style={{ marginBottom: 6 }}>
                  Occurrences per year
                </div>
                <Sparkline series={open.summary.yearsFull} />
              </div>

              <button
                className="btn"
                style={{ marginTop: 12 }}
                onClick={() =>
                  exportCSVFromFeatures(
                    open.featsFiltered,
                    `${open.key}_filtered.csv`
                  )
                }
              >
                ⬇ Export filtered CSV
              </button>
            </div>

            <div>
              <strong>Top datasets</strong>
              <ol style={{ marginTop: 6 }}>
                {open.summary.topDatasets.map(([name, c]) => (
                  <li key={name}>
                    {name} — {fmt(c)}
                  </li>
                ))}
              </ol>
              <strong>Top publishers</strong>
              <ol style={{ marginTop: 6 }}>
                {open.summary.topPublishers.map(([name, c]) => (
                  <li key={name}>
                    {name} — {fmt(c)}
                  </li>
                ))}
              </ol>
              <strong>Top countries</strong>
              <ol style={{ marginTop: 6 }}>
                {open.summary.topCountries.map(([name, c]) => (
                  <li key={name}>
                    {name} — {fmt(c)}
                  </li>
                ))}
              </ol>
              <strong>Basis of record</strong>
              <ul style={{ marginTop: 6 }}>
                {open.summary.basis.map(([name, c]) => (
                  <li key={name}>
                    {name}: {fmt(c)}
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

      {/* <p className="muted" style={{ marginTop: 8 }}>
        Metrics are computed client-side from your GeoJSON. Add files in{" "}
        <code>/public/data</code> and extend the list at the top.
      </p> */}

      <style>{`
        .input{
          width:100%;
          padding:10px 12px;
          border-radius:10px;
          background:#0e141c;
          border:1px solid #243243;
          color:#eaf2fb;
          outline:none;
        }
      `}</style>
    </div>
  );
}
