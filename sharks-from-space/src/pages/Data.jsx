import { useMemo, useState } from "react";
import { SHARKS } from "../data/sharks.js";

const formatNum = (n) =>
  typeof n === "number" ? new Intl.NumberFormat("en-US").format(n) : "—";

export default function Data() {
  const [sortBy, setSortBy] = useState("datapoints");
  const [dir, setDir] = useState("desc");

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
      <h2 className="h2">Datasets overview</h2>

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
        Click headers to sort. “Share” shows the proportion vs the max
        datapoints across species.
      </p>
    </div>
  );
}
