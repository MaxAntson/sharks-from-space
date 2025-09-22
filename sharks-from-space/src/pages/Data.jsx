import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

/** Small helper to fetch a GeoJSON and return its feature count.
 *  - If the file no existe (404) o hay error → devuelve null (no rompe la página)
 */
async function fetchGeoCount(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const gj = await res.json();
    const feats = Array.isArray(gj?.features) ? gj.features : [];
    return feats.length;
  } catch {
    return null;
  }
}

/** Hook: recibe lista de "datasets" con {key, label, scientific, status, url}
 *  y rellena counts de forma asíncrona.
 */
function useCounts(datasets) {
  const [rows, setRows] = useState(
    datasets.map((d) => ({ ...d, datapoints: null }))
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = [];
      for (const d of datasets) {
        const c = d.url ? await fetchGeoCount(d.url) : null;
        next.push({ ...d, datapoints: typeof c === "number" ? c : null });
      }
      if (!cancelled) setRows(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [datasets]);

  return rows;
}

const fmt = (n) =>
  typeof n === "number" ? new Intl.NumberFormat("en-US").format(n) : "—";

export default function Data() {
  // 👇 Define aquí tus datasets reales (cambia/añade rutas si quieres)
  const datasets = useMemo(
    () => [
      {
        key: "lewini",
        label: "Scalloped hammerhead",
        scientific: "Sphyrna lewini",
        status: "Critically Endangered",
        url: "/data/scalloped_points.geojson", // ✅ ya lo tienes generado desde GBIF
      },
      {
        key: "bonnet",
        label: "Bonnethead",
        scientific: "Sphyrna tiburo",
        status: "Endangered",
        url: "/data/bonnethead_points.geojson", // si no existe, mostrará "—"
      },
      {
        key: "sphyrna_all",
        label: "All hammerheads (Sphyrna spp.)",
        scientific: "Sphyrna spp.",
        status: "Mixed",
        url: "/data/sphyrna_points.geojson", // opcional (si más tarde haces uno agregado)
      },
    ],
    []
  );

  const rows = useCounts(datasets);

  // orden + dirección
  const [sortBy, setSortBy] = useState("datapoints");
  const [dir, setDir] = useState("desc");

  const sorted = useMemo(() => {
    const mult = dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      if (sortBy === "datapoints") {
        const av = typeof a.datapoints === "number" ? a.datapoints : -1;
        const bv = typeof b.datapoints === "number" ? b.datapoints : -1;
        return (av - bv) * mult;
      }
      if (sortBy === "status") return a.status.localeCompare(b.status) * mult;
      return a.label.localeCompare(b.label) * mult;
    });
  }, [rows, sortBy, dir]);

  const max = useMemo(() => {
    const nums = rows.map((r) =>
      typeof r.datapoints === "number" ? r.datapoints : 0
    );
    return nums.length ? Math.max(...nums) : 0;
  }, [rows]);

  const Th = (key, label) => (
    <th
      onClick={() =>
        sortBy === key
          ? setDir((d) => (d === "asc" ? "desc" : "asc"))
          : setSortBy(key)
      }
      style={{ cursor: "pointer", whiteSpace: "nowrap" }}
      title="Click to sort"
    >
      {label} {sortBy === key ? (dir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div className="section">
      <Helmet>
        <title>Sharks from Space – Data</title>
        <meta
          name="description"
          content="Live dataset overview built from real GeoJSON sightings: counts by species and share vs max."
        />
      </Helmet>

      <h2 className="h2">Datasets overview (live)</h2>

      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              {Th("name", "Species")}
              {Th("status", "Status")}
              {Th("datapoints", "Datapoints")}
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const pct =
                max && typeof r.datapoints === "number"
                  ? Math.max(0, r.datapoints / max)
                  : 0;
              return (
                <tr key={r.key} style={{ borderTop: "1px solid #1f2b3a" }}>
                  <td style={{ padding: "10px 8px" }}>
                    <strong>{r.label}</strong>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {r.scientific}
                    </div>
                  </td>
                  <td style={{ padding: "10px 8px" }}>{r.status}</td>
                  <td style={{ padding: "10px 8px" }}>{fmt(r.datapoints)}</td>
                  <td style={{ padding: "10px 8px", width: 220 }}>
                    {/* tiny bar (SVG) */}
                    <svg
                      width="200"
                      height="12"
                      role="img"
                      aria-label={`${Math.round(pct * 100)}%`}
                    >
                      <rect
                        x="0"
                        y="0"
                        width="200"
                        height="12"
                        fill="#102331"
                      />
                      <rect
                        x="0"
                        y="0"
                        width={Math.round(200 * pct)}
                        height="12"
                        fill="#32d0ff"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="muted" style={{ marginTop: 8 }}>
        Counts are read directly from your GeoJSON files. Update the files and
        this page updates automatically.
      </p>
    </div>
  );
}
