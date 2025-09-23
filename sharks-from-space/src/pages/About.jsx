import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <div className="section">
      <h2 className="h2">About the project</h2>
      <div className="card" style={{ display: "grid", gap: 16 }}>
        <p>
          <strong>Sharks from Space</strong> was created as part of the{" "}
          <strong>NASA International Space Apps Challenge</strong>, a global
          hackathon where teams around the world use open science and technology
          to solve real challenges for Earth and space.
        </p>

        <p>
          Our team chose to focus on <em>hammerhead sharks</em>, one of the most
          threatened groups of marine species. By combining{" "}
          <strong>
            satellite imagery, open datasets, and geospatial analysis
          </strong>
          , we aim to build tools that improve our understanding of shark
          populations and their critical habitats.
        </p>

        <h3>Our mission</h3>
        <ul>
          <li>
            🛰️ Explore how satellite data can reveal patterns in shark sightings
            and movements
          </li>
          <li>
            📊 Create interactive maps and dashboards that make this information
            accessible to the public
          </li>
          <li>
            🌍 Support global conservation efforts by highlighting endangered
            hammerhead species
          </li>
          <li>
            🤝 Encourage collaboration between students, researchers, and NGOs
          </li>
        </ul>

        <h3>Why it matters</h3>
        <p>
          Sharks play a vital role in maintaining ocean ecosystems, but many
          species face critical threats from overfishing, habitat loss, and lack
          of reliable data. By experimenting with{" "}
          <strong>open science approaches</strong>, we hope to demonstrate how
          technology can support conservation and awareness at a global scale.
        </p>

        <h3>Contribute</h3>
        <p>
          This is an <strong>open project</strong>. We welcome ideas, datasets,
          and contributions from anyone passionate about marine life, data
          science, or space-enabled conservation. Together, we can amplify the
          impact of open science for our oceans.
        </p>
        <p className="muted" style={{ fontSize: 12 }}>
          Sources: GBIF, OCEARCH, Copernicus, Global Fishing Watch (AIS+SAR),
          EMODnet. Methods inspired by recent literature on SSF and Bayesian
          LGCP with barriers.
        </p>
      </div>
    </div>
  );
}
