import { Helmet } from "@dr.pogodin/react-helmet";

export default function Research() {
  return (
    <div className="section">
      <Helmet>
        <title>Research – Sharks from Space</title>
        <meta
          name="description"
          content="Datasets, methods, and references used in Sharks from Space."
        />
      </Helmet>

      <h2 className="h2">Research overview</h2>
      <div className="card" style={{ display: "grid", gap: 14 }}>
        <p className="muted">
          This page collects the main datasets and methods we use for{" "}
          <strong>hammerhead</strong> and other shark species, plus references
          the team is reading during the NASA Space Apps hackathon.
        </p>

        <ul className="muted" style={{ marginLeft: 18 }}>
          <li>
            🛰️ Satellite variables: sea surface temperature (SST),
            chlorophyll-a, turbidity, salinity, currents.
          </li>
          <li>
            🦈 Shark occurrences: GBIF, OCEARCH tracker, published papers.
          </li>
          <li>
            🛥️ Observation effort: AIS & SAR vessel intensity (Global Fishing
            Watch), EMODnet vessel density.
          </li>
          <li>
            🗺️ Modeling ideas: presence-only SDMs, Step-Selection Functions
            (SSF), Bayesian LGCP with barrier effects.
          </li>
        </ul>
      </div>

      <h3 className="h2" style={{ marginTop: 24 }}>
        Key datasets (links)
      </h3>
      <div className="card">
        <ul>
          <li>
            <a
              href="https://www.gbif.org/dataset/31cc8b55-0455-4faa-aa50-e135d1dcacf0"
              target="_blank"
            >
              GBIF SharkBase – global shark occurrences
            </a>
          </li>
          <li>
            <a href="https://www.gbif.org/species/2418789" target="_blank">
              GBIF – Scalloped hammerhead (≈28.5k datapoints)
            </a>
          </li>
          <li>
            <a href="https://www.ocearch.org/tracker/" target="_blank">
              OCEARCH live shark tracker
            </a>
          </li>
          <li>
            <a href="https://marine.copernicus.eu/" target="_blank">
              Copernicus Marine – SST & chlorophyll
            </a>
          </li>
          <li>
            <a href="https://globalfishingwatch.org/" target="_blank">
              Global Fishing Watch – AIS & SAR fishing intensity
            </a>
          </li>
          <li>
            <a
              href="https://emodnet.ec.europa.eu/en/human-activities"
              target="_blank"
            >
              EMODnet – vessel density
            </a>
          </li>
        </ul>
      </div>

      <h3 className="h2" style={{ marginTop: 24 }}>
        Methods we’re testing
      </h3>
      <div className="card" style={{ display: "grid", gap: 10 }}>
        <div>
          <strong>Step-Selection Functions (SSF):</strong> compare where a
          tagged shark moved vs. where it could have moved, given environmental
          conditions (SST, chlorophyll, distance to shore, etc.).
        </div>
        <div>
          <strong>LGCP with barriers:</strong> Bayesian Log-Gaussian Cox Process
          that models presence-only data while accounting for land as a physical
          barrier (prevents smoothing across continents/islands).
        </div>
        <div className="muted">
          We’ll start simple (presence-only SDM) and iterate toward SSF when we
          align the tracker data and the satellite grids.
        </div>
      </div>

      <h3 className="h2" style={{ marginTop: 24 }}>
        Reference reading
      </h3>
      <div className="card">
        <ul>
          <li>
            Panunzi et al. (2025) —{" "}
            <em>
              Estimating the spatial distribution of the white shark in the
              Mediterranean via an integrated SDM with physical barriers.
            </em>
          </li>
          <li>
            Elith & Leathwick (2009) — Species distribution models overview.
          </li>
          <li>SSF intro video/notes (step-selection functions).</li>
        </ul>
        <p className="muted" style={{ marginTop: 8 }}>
          Full reading list and Spanish summaries will be published as blog
          posts.
        </p>
      </div>
    </div>
  );
}
