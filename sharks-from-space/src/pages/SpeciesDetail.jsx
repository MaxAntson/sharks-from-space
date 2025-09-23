import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SHARKS } from "../data/sharks.js";

const statusColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("critically")) return "#ff6b6b";
  if (s.includes("endangered")) return "#ffb347";
  if (s.includes("vulnerable")) return "#ffd166";
  if (s.includes("deficient") || s.includes("no")) return "#a0aec0";
  return "#9fd7ff";
};

export default function SpeciesDetail() {
  const { key } = useParams();

  const sp = useMemo(() => SHARKS.find((s) => s.key === key), [key]);

  if (!sp) {
    return (
      <div className="section">
        <div className="card">
          <p className="muted">Species not found.</p>
          <Link className="btn" to="/species">
            ← Back to Species
          </Link>
        </div>
      </div>
    );
  }

  const title = `${sp.common} – Species Profile`;
  const desc = `${sp.common} (${sp.scientific}). Status: ${
    sp.status
  }. Datapoints: ${sp.datapoints ?? "—"}.`;

  return (
    <div className="section">
      <Helmet>
        <title>{`Sharks from Space – ${sp.common}`}</title>
        <meta name="description" content={desc} />
        <link
          rel="canonical"
          href={`https://sharksfrom.space/species/${sp.key}`}
        />
        {/* Open Graph / Twitter */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <h2 className="h2">{sp.common}</h2>
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div className="muted" style={{ fontStyle: "italic" }}>
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
            <strong style={{ color: "#eaf2fb" }}>{sp.datapoints ?? "—"}</strong>
          </span>
        </div>

        <div
          style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}
        >
          <Link className="btn" to="/map">
            Open on Map
          </Link>
          <Link className="btn" to="/species">
            ← Back to Species
          </Link>
        </div>

        {/* Placeholder para texto (puedes ampliarlo luego) */}
        <p className="muted" style={{ marginTop: 6 }}>
          Short profile: habitat, threats, conservation notes. You can expand
          this section with references (IUCN/GBIF/NOAA) and link it from the
          Blog/Stories.
        </p>
      </div>
    </div>
  );
}
