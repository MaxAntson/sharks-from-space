import { Helmet } from "@dr.pogodin/react-helmet";

export default function Sources() {
  return (
    <div className="section">
      <Helmet>
        <title>Sharks from Space – Sources & Research</title>
        <meta
          name="description"
          content="All sources and research links we used: GBIF datasets, conservation orgs, scientific papers, and the NASA challenge brief."
        />
      </Helmet>

      <h2 className="h2">Sources & Research</h2>
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <p className="muted">
          Here we collect the datasets and readings we’re using for analysis,
          maps and species profiles.
        </p>

        <h3>Datasets</h3>
        <ul>
          <li>
            <a
              href="https://www.gbif.org/dataset/31cc8b55-0455-4faa-aa50-e135d1dcacf0"
              target="_blank"
              rel="noreferrer"
            >
              SharkBase (GBIF dataset)
            </a>
          </li>
          <li>
            <a
              href="https://www.gbif.org/species/5889"
              target="_blank"
              rel="noreferrer"
            >
              Basking Sharks (GBIF)
            </a>
          </li>
          <li>
            <a
              href="https://www.gbif.org/species/2211"
              target="_blank"
              rel="noreferrer"
            >
              Requiem Sharks (GBIF)
            </a>
          </li>
          <li>
            <a
              href="https://www.gbif.org/species/2418052"
              target="_blank"
              rel="noreferrer"
            >
              Oceanic Whitetip (GBIF)
            </a>
          </li>
          <li>
            <a
              href="https://www.gbif.org/species/2418789"
              target="_blank"
              rel="noreferrer"
            >
              Scalloped Hammerhead (GBIF)
            </a>
          </li>
        </ul>

        <h3>Conservation & background</h3>
        <ul>
          <li>
            <a
              href="https://www.worldwildlife.org/species/shark"
              target="_blank"
              rel="noreferrer"
            >
              WWF – Sharks
            </a>
          </li>
          <li>
            <a
              href="https://saveourseas.com/worldofsharks/which-sharks-are-the-most-endangered"
              target="_blank"
              rel="noreferrer"
            >
              Save Our Seas – Endangered sharks
            </a>
          </li>
          <li>
            <a
              href="https://worldpopulationreview.com/country-rankings/shark-population-by-country"
              target="_blank"
              rel="noreferrer"
            >
              Shark population by country
            </a>
          </li>
          <li>
            <a
              href="https://www.nationalgeographic.com.es/mundo-animal/como-consiguen-su-martillo-tiburones-martillo_20825"
              target="_blank"
              rel="noreferrer"
            >
              NatGeo – Hammerhead morphology
            </a>
          </li>
          <li>
            <a
              href="https://www.fundacionaquae.org/la-importancia-de-los-arrecifes-de-coral/"
              target="_blank"
              rel="noreferrer"
            >
              Coral reefs importance
            </a>
          </li>
          <li>
            <a
              href="https://coral-conservation.org/2021/02/14/tiburon-martillo/"
              target="_blank"
              rel="noreferrer"
            >
              Hammerhead & coral conservation
            </a>
          </li>
          <li>
            <a
              href="https://blog.padi.com/es/conservacion-del-tiburon-martillo-lo-que-debes-tener-en-cuenta/"
              target="_blank"
              rel="noreferrer"
            >
              PADI – Hammerhead conservation
            </a>
          </li>
        </ul>

        <h3>NASA Space Apps Challenge</h3>
        <ul>
          <li>
            <a
              href="https://www.spaceappschallenge.org/2025/challenges/sharks-from-space/"
              target="_blank"
              rel="noreferrer"
            >
              Sharks from Space – Challenge brief
            </a>
          </li>
        </ul>

        <h3>Methodology & papers</h3>
        <ul>
          <li>
            <a
              href="https://besjournals.onlinelibrary.wiley.com/doi/full/10.1111/2041-210X.14248"
              target="_blank"
              rel="noreferrer"
            >
              Step-selection functions (SSFs)
            </a>
          </li>
          <li>
            <a
              href="https://onlinelibrary.wiley.com/doi/10.1002/env.2876"
              target="_blank"
              rel="noreferrer"
            >
              White shark distribution via integrated SDM (Mediterranean)
            </a>
          </li>
          <li>
            <a
              href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.dpi.nsw.gov.au/__data/assets/pdf_file/0014/433121/Primefact-1218-Scalloped-Hammerhead-Shark-Sphyrna-lewini.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Scalloped Hammerhead factsheet (NSW DPI)
            </a>
          </li>
        </ul>

        <p className="muted" style={{ fontSize: 12 }}>
          Note: some links are third-party; data accuracy and licenses should be
          checked before redistribution.
        </p>
      </div>
    </div>
  );
}
