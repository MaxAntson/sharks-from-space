export const POSTS = [
  {
    slug: "why-hammerheads",
    title: "Why we started with hammerheads",
    date: "2025-09-21",
    cover: "/blog/covers/scallopedHammerhead.jpg",
    excerpt:
      "Scalloped and Bonnethead sharks give us enough data to build early maps and test satellite-based predictors.",
    body: `
Hammerheads are both **iconic** and **data-rich**. Scalloped hammerhead alone has ~28k GBIF occurrences, which helps us validate the pipeline from raw points to a clean marine-only layer (we filter land false-positives with a global land mask).

**What we test first**
- Baseline species map with occurrence points
- Remove observation bias near coast using vessel intensity
- Quick SDM to see environmental signal (SST, chlorophyll-a)
- Export filtered datasets and share methodology

**Next**
We’ll incorporate track-based methods (SSF) as soon as we align OCEARCH tracks with daily satellite grids.
`,
  },
  {
    slug: "med-white-shark-model",
    title: "What a Mediterranean white shark model teaches us",
    date: "2025-09-22",
    cover: "/blog/covers/satelite.jpeg",
    excerpt:
      "Barrier-aware models matter: land breaks matter for marine species; observation effort must be modeled.",
    body: `
A recent study models white shark occurrences in the Mediterranean using a **Bayesian LGCP** with **barrier effects** (land) and explicit **detection/effort** components (fishing intensity via AIS+SAR and private boating via EMODnet).

**Key takeaways for our project**
- Model land as a physical barrier so estimates don't 'bleed' over islands/peninsulas.
- Include observation effort; more boats ≠ more sharks, it can just be more observers.
- Depth (negative effect) and temperature range (positive) were significant in that study.

We’ll apply the same principles to hammerheads once our data ingestion is stable.
`,
  },
];
