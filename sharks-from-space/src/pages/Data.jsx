import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { SHARKS } from "../data/sharks.js";

const formatNum = (n) =>
  typeof n === "number" ? new Intl.NumberFormat("en-US").format(n) : "—";

// CSV helper (exporta las filas visibles, en el orden actual)
function exportCSV(rows, filename = "sharks_datasets.csv") {
  const head = ["key", "common", "scientific", "status", "datapoints"];
  const escape = (v) => `"${String(v ?? "").replaceAll(`"`, `""`)}"`;
  const data = rows.map((r) =>
    [r.key, r.common, r.scientific, r.status, r.datapoints ?? ""]
      .map(escape)
      .join(",")
  );
  const csv = [head.join(","), ...data].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Data() {
  const [sortBy, setSortBy] = useState("datapoints");
  const [dir, setDir] = useState("desc");

  // KPIs resumen
  const { totalSpecies, withData, totalDatapoints } = useMemo(() => {
    const total = SHARKS.length;
    const withD = SHARKS.filter(
      (s) => typeof s.datapoints === "number" && s.datapoints > 0
    ).length;
    const sum = SHARKS.reduce(
      (acc, s) => acc + (typeof s.datapoints === "number" ? s.datapoints : 0),
      0
    );
    return { totalSpecies: total, withData: withD, totalDatapoints: sum };
  }, []);

  const max = useMemo(
    () =>
      Math.max(
        ...SHARKS.map((s) =>
          typeof s.datapoints === "number" ? s.datapoints : 0
        )
      ),
    []
  );

  const rows = useMemo(() => {
    const list = [...SHARKS];
    const mult = dir === "asc" ? 1 : -1;

    list.sort((a, b) => {
      if (sortBy === "datapoints") {
        const av = typeof a.datapoints === "number" ? a.datapoints : -1;
        const bv = typeof b.datapoints === "number" ? b.datapoints : -1;
        return (av - bv) * mult;
      }
      if (sortBy === "name") return a.common.localeCompare(b.common) * mult;
      if (sortBy === "status") return a.status.localeCompare(b.status) * mult;
      return 0;
    });
    return list;
  }, [sortBy, dir]);

  const th = (key, label) => (
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
      {/* ✅ Helmet para SEO */}
      <Helmet>
        <title>Sharks from Space – Data Explorer</title>
        <meta
          name="description"
          content="Explore and download shark datasets. Sortable table with per-species datapoints and quick CSV export."
        />
      </Helmet>

      <h2 className="h2" style={{ marginBottom: 12 }}>
        Datasets overview
      </h2>

      {/* Resumen + Export */}
      <div
        className="card"
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="kpi">
            {formatNum(totalSpecies)}
            <div className="muted" style={{ fontSize: 12 }}>
              species
            </div>
          </div>
          <div className="kpi">
            {formatNum(withData)}
            <div className="muted" style={{ fontSize: 12 }}>
              with datapoints
            </div>
          </div>
          <div className="kpi">
            {formatNum(totalDatapoints)}
            <div className="muted" style={{ fontSize: 12 }}>
              total datapoints
            </div>
          </div>
        </div>

        <button
          className="btn"
          onClick={() => exportCSV(rows, "sharks_datasets_sorted.csv")}
          title="Export current table as CSV"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* Tabla */}
      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              {th("name", "Species")}
              {th("status", "Status")}
              {th("datapoints", "Datapoints")}
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const pct = max ? Math.max(0, (s.datapoints ?? 0) / max) : 0;
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
                    {formatNum(s.datapoints)}
                  </td>
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
        Click headers to sort. “Share” shows the proportion vs the maximum
        datapoints across species.
      </p>
    </div>
  );
}
