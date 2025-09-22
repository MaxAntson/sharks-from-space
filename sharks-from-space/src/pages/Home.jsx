import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <div className="section">
      <Helmet>
        <title>Sharks from Space 🌍🦈</title>
        <meta
          name="description"
          content="Maps, species intelligence and conservation stories powered by satellites and open data."
        />
      </Helmet>

      <div className="hero">
        <div>
          <div className="badge">Open Ocean • Satellite Data</div>
          <h1 className="h1">Watching sharks from space</h1>
          <p className="muted">
            Maps, species intelligence and conservation stories powered by
            satellites and open data.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <a className="btn" href="/map">
              Open Map
            </a>
            <a className="btn" href="/species">
              Explore Species
            </a>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 12,
              marginTop: 20,
            }}
          >
            <div className="card">
              <div className="kpi">42</div>
              <div className="muted">tracked events</div>
            </div>
            <div className="card">
              <div className="kpi">17</div>
              <div className="muted">species</div>
            </div>
            <div className="card">
              <div className="kpi">6</div>
              <div className="muted">data sources</div>
            </div>
          </div>
        </div>
        <img
          src="https://www.maps.com/app/uploads/2025/02/article-whale-sharks-asset-2.webp"
          alt="Satellite ocean view"
        />
      </div>

      <div className="section">
        <h2 className="h2">What we do</h2>
        <div className="grid cols-3">
          <div className="card">
            <strong>Detect</strong>
            <p className="muted">
              Events and patterns using satellite + open ocean datasets.
            </p>
          </div>
          <div className="card">
            <strong>Explain</strong>
            <p className="muted">
              Species profiles, threats, and conservation context.
            </p>
          </div>

          <div className="card">
            <strong>Act</strong>
            <p className="muted">
              Share insights for NGOs, educators and the public.
            </p>
          </div>
          <div className="section">
            <h2 className="h2">Reference model</h2>
            <div className="card">
              <strong>White shark in the Mediterranean (paper summary)</strong>
              <p className="muted">
                A Bayesian LGCP with barrier effects and observation effort
                (AIS+SAR, EMODnet) highlights coastal hotspots and the
                importance of depth and temperature range. We’ll mirror parts of
                this approach for hammerheads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
