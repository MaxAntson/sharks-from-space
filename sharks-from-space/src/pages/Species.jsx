import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SHARKS } from "../data/sharks.js";

const STATUS_ORDER = [
  "Critically Endangered",
  "Endangered",
  "Vulnerable",
  "Data Deficient",
  "No population data",
];

const statusColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("critically")) return "#ff6b6b";
  if (s.includes("endangered")) return "#ffb347";
  if (s.includes("vulnerable")) return "#ffd166";
  if (s.includes("deficient") || s.includes("no")) return "#a0aec0";
  return "#9fd7ff";
};

const formatNum = (n) =>
  typeof n === "number" ? new Intl.NumberFormat("en-US").format(n) : "—";

// CSV export of the current filtered list
function exportCSV(rows, filename = "sharks_filtered.csv") {
  const head = [
    "key",
    "common",
    "scientific",
    "status",
    "datapoints",
    "recommended",
  ];
  const escape = (v) => `"${String(v ?? "").replaceAll(`"`, `""`)}"`;
  const data = rows.map((r) =>
    [
      r.key,
      r.common,
      r.scientific,
      r.status,
      r.datapoints ?? "",
      r.recommended ? "yes" : "no",
    ]
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

export default function Species() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("datapoints");
  const [dir, setDir] = useState("desc");
  const [onlyRecommended, setOnlyRecommended] = useState(false);

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase();
    let list = SHARKS.filter((sp) => {
      const matchesQuery =
        !qn ||
        sp.common.toLowerCase().includes(qn) ||
        (sp.scientific || "").toLowerCase().includes(qn);
      const matchesStatus = status === "all" || sp.status === status;
      const matchesRecommended = !onlyRecommended || sp.recommended;
      return matchesQuery && matchesStatus && matchesRecommended;
    });

    list.sort((a, b) => {
      const mult = dir === "asc" ? 1 : -1;
      if (sortBy === "datapoints") {
        const av = typeof a.datapoints === "number" ? a.datapoints : -1;
        const bv = typeof b.datapoints === "number" ? b.datapoints : -1;
        return (av - bv) * mult;
      }
      if (sortBy === "name") return a.common.localeCompare(b.common) * mult;
      if (sortBy === "status") {
        const ai = STATUS_ORDER.indexOf(a.status);
        const bi = STATUS_ORDER.indexOf(b.status);
        return (ai - bi) * mult;
      }
      return 0;
    });

    return list;
  }, [q, status, sortBy, dir, onlyRecommended]);

  return (
    <div className="section">
      {/* SEO per-page */}
      <Helmet>
        <title>Sharks from Space – Species</title>
        <meta
          name="description"
          content="Browse hammerhead shark species with conservation status and datapoints. Filter, sort, and export the current list to CSV."
        />
        <link rel="canonical" href="https://sharksfrom.space/species" />
      </Helmet>

      <h2 className="h2">Hammerhead shark species (10)</h2>

      {/* Controls */}
      <div
        className="card"
        style={{ display: "grid", gap: 12, marginBottom: 16 }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search species or scientific name…"
            aria-label="Search"
            style={inputStyle}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={selectStyle}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={selectStyle}
            aria-label="Sort by"
          >
            <option value="datapoints">Sort: datapoints</option>
            <option value="name">Sort: name</option>
            <option value="status">Sort: status</option>
          </select>
          <button
            className="btn"
            onClick={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}
            aria-label="Toggle sort direction"
          >
            {dir === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>

          {/* Export CSV of the current filtered list */}
          <button
            className="btn"
            onClick={() => exportCSV(filtered)}
            aria-label="Export filtered list as CSV"
          >
            ⬇ Export CSV
          </button>
        </div>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={onlyRecommended}
            onChange={(e) => setOnlyRecommended(e.target.checked)}
          />
          Show only recommended to start
        </label>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card">
          <span className="muted">No species match your filters.</span>
        </div>
      ) : (
        <div className="grid cols-3">
          {filtered.map((sp) => (
            <div key={sp.key} className="card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <strong style={{ fontSize: 18 }}>{sp.common}</strong>
                {sp.recommended && <span className="badge">Recommended</span>}
              </div>
              <div
                className="muted"
                style={{ marginBottom: 10, fontStyle: "italic" }}
              >
                {sp.scientific}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    background: statusColor(sp.status),
                    color: "#0b0f14",
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {sp.status}
                </span>
                <span className="muted">
                  datapoints:{" "}
                  <strong style={{ color: "#eaf2fb" }}>
                    {formatNum(sp.datapoints)}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  flex: "1 1 260px",
  minWidth: 220,
  padding: "10px 12px",
  borderRadius: 10,
  background: "#0e141c",
  border: "1px solid #243243",
  color: "#eaf2fb",
  outline: "none",
};
const selectStyle = { ...inputStyle };
