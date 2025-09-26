export const POSTS = [
  {
    slug: "cleaning-gbif-like-a-pro",
    title: "Cleaning GBIF Like a Pro: From Raw Points to a Trustworthy Map",
    date: "2025-09-06",
    author: "Marine Data Lab",
    tags: ["data-quality", "gbif", "filtering", "how-to"],
    cover: "/blog/covers/dollies.jpg",
    excerpt:
      "A practical checklist to clean occurrence data before it hits your map.",
    content: [
      "Raw occurrence data is messy. Here’s how we **de-bias** before mapping:",
      "## Our cleaning checklist",
      "1) **Valid coordinates** only (no 0,0; no swapped lat/lon).",
      "2) **Deduplicate** close-in-time/space records from the same source.",
      "3) **Remove land points** using a global land mask (Turf + GeoJSON).",
      "4) **Taxonomic sanity**: keep accepted names, unify synonyms.",
      "5) **Time bounds**: focus on 2000–2025 to reflect modern conditions.",
      "6) **Effort awareness**: more boats ≠ more sharks—just more eyes.",
      "## Why it matters",
      "Clean data prevents false coastal clusters and makes downstream modelling (SDMs, LGCPs) genuinely useful for conservation.",
    ],
  },

  {
    slug: "biases-you-cant-see",
    title: "What the Map Can’t Show: Hidden Biases in ‘Sharks Near the Coast’",
    date: "2025-09-09",
    author: "Sharks from Space Team",
    tags: ["methods", "bias", "citizen-science", "visualization"],
    cover: "/blog/covers/hammerhead.jpg",
    excerpt:
      "Why coastal hotspots may reflect human presence more than shark preference—and how we correct for that.",
    content: [
      "Maps often light up near coasts—but that’s where **people** are.",
      "## Two big biases",
      "- **Sampling bias**: more observers (fishers, divers, boats) → more sightings.",
      "- **Accessibility bias**: places that are easier to reach get over-represented.",
      "## Our workaround",
      "- Model **detection effort** (AIS + SAR vessel intensity for catch reports, EMODnet for private boating).",
      "- Use **barrier-aware** spatial fields so correlation doesn’t ‘smooth over’ land.",
      "By explicitly modelling effort and barriers, we get a fairer picture of where sharks *really* use habitat.",
    ],
  },

  {
    slug: "designing-a-smarter-tag",
    title:
      "Designing a Smarter Shark Tag: From Location to ‘What Are You Eating?’",
    date: "2025-09-12",
    author: "Marine Hardware Notes",
    tags: ["tagging", "hardware", "concept", "edna"],
    cover: "/blog/covers/scallopedHammerhead.jpg",
    excerpt:
      "A concept tag that senses depth, accelerations, and even prey via eDNA—transmitting in near-real-time.",
    content: [
      "Classic tags track **location, depth, acceleration**. We propose adding:",
      "## New sensing ideas",
      "- **Mouth activity proxy** via accelerometer orientation changes.",
      "- A tiny **microphone/vibration** sensor for feeding events.",
      "- Periodic **eDNA micro-sampling** (filter + rapid sequencing) to infer prey.",
      "## Why care?",
      "Knowing ‘where’ is step 1. Knowing **‘what’** and **‘when’** unlocks behaviour and foraging models that we can link back to satellite-derived habitat.",
      "We’ll prototype the concept on synthetic data first, then explore lab feasibility.",
    ],
  },

  {
    slug: "our-data-pipeline",
    title: "Behind the Scenes: Our Sharks-from-Space Data Pipeline",
    date: "2025-09-15",
    author: "Sharks from Space Team",
    tags: ["pipeline", "engineering", "open-data", "reproducibility"],
    cover: "/blog/covers/placeholder.jpeg",
    excerpt:
      "From downloads to dashboards—how we structure files, scripts, and checks so others can reproduce our work.",
    content: [
      "## Stages",
      "1) **Ingest**: GBIF CSV → converter script → GeoJSON points.",
      "2) **Masks**: global land polygons for ocean-only filtering.",
      "3) **Enrichment**: attach species names, dataset source, year.",
      "4) **Tiles & UI**: Leaflet layers + simplified markers for speed.",
      "5) **QA**: unit checks (counts by species/year, % points on land).",
      "## Why it’s reproducible",
      "- Folder convention (`/public/data`, `/src/data/raw`, `/scripts/`).",
      "- Minimal dependencies; all transform scripts logged and versioned.",
      "The same steps scale from a single species to entire genera.",
    ],
  },

  {
    slug: "hammerhead-habitats-explained",
    title: "Hammerhead Habitats, Threats & Policy: What We’re Learning",
    date: "2025-09-05",
    author: "Marine Data Lab",
    tags: ["species", "habitat", "conservation", "policy"],
    cover: "/blog/covers/hammerhead3.gif",
    excerpt:
      "Where hammerheads roam, how human activity alters behaviour, and which policies are emerging to protect them.",
    content: [
      "Scalloped hammerheads frequent coastal warm-temperate and tropical waters.",
      "Bonnetheads are common in the western Atlantic and Gulf of Mexico.",
      "Threats include **bycatch**, **habitat degradation**, and **targeted fishing**.",
      "## Protecting hammerheads on a larger scale",
      "Much of the existing conservation management of the scalloped hammerhead comes down to state fishing plans.",
      "Western Australia has banned on-shore shark fishing from Perth beaches. A shark fishery covering much of the scalloped hammerhead distribution in the state has not operated for decades.",
      "Queensland banned commercial fishing of hammerheads from Jan 1, and phased out gillnets around the Great Barrier Reef—where scalloped hammerheads have been caught.",
      "Uncertainty remains around the **health of Australian populations**, potentially impacted by fishing in neighbouring countries.",
      "These policies highlight why **cross-border data and coordination** matter—precisely what satellite-informed habitat mapping can support.",
    ],
  },

  {
    slug: "human-interaction-codes",
    title: "Hammerheads Under Pressure: Why Codes of Conduct Matter",
    date: "2025-09-18",
    author: "Conservation Field Notes",
    tags: ["conservation", "ethics", "diving", "policy"],
    cover: "/blog/covers/hammerhead2.webp",
    excerpt:
      "Schools near Perth and the Gold Coast draw anglers and divers—great for awareness, risky for the sharks.",
    content: [
      "## A growing tension",
      "Scalloped hammerheads (*Sphyrna lewini*) are **critically endangered**. In recent years, larger schools have appeared near urban coasts, attracting intense human interaction.",
      "## The risk",
      "- Chasing/crowding may alter behaviour and increase stress.",
      "- Catch-and-release mortality is non-trivial for some species.",
      "## Practical steps",
      "- Clear **no-chase** rules; minimum distances for boats and divers.",
      "- Time-area restrictions during aggregations.",
      "- Public reporting with basic metadata (time, GPS, number of individuals).",
      "These small measures improve data quality and reduce harm—win-win for science and sharks.",
    ],
  },
  {
    slug: "endangered-hammerheads-australia",
    title: "Endangered Hammerheads in Australia: New Sites, New Threats",
    date: "2024-05-06",
    author: "Peter de Kruijff (ABC Science, adapted)",
    tags: ["species", "habitat", "conservation", "policy", "climate-change"],
    cover: "/blog/covers/hammerhead4.webp",
    excerpt:
      "Scientists have recorded new sites where critically endangered scalloped hammerheads are aggregating. Human interactions are increasing — but protections remain uncertain.",
    content: [
      "## A growing concern",
      "Scalloped hammerhead sharks (*Sphyrna lewini*), named for the notches along their distinct head, are **critically endangered**. Despite their global decline, much about their behaviour remains mysterious.",

      "In recent years, **large schools** have been recorded more often — notably on Queensland’s Gold Coast and near Perth, Western Australia. Drone surveys and field observations confirm these aggregations can include **pups only weeks old**.",

      "## Human interactions",
      "The accessible location of these gatherings has led to swimmers, divers, and anglers approaching the sharks. Ecologists warn that:",
      "- Handling or chasing pups can cause lethal stress.",
      "- Driving sharks out of sheltered bays exposes them to predators like bull sharks.",
      "- Even catch-and-release fishing often results in hammerhead mortality.",

      "## Calls for a code of conduct",
      "Marine scientists including Olaf Meynecke and Naima Andrea López have called for **human interaction codes**, similar to those for dolphins, whales and whale sharks. Suggested measures include:",
      "- Minimum approach distances for vessels and swimmers.",
      "- Seasonal fishing bans at aggregation sites (e.g. Burleigh Heads).",
      "- New **sanctuary zones** where hammerheads repeatedly gather.",

      "## Policy gaps",
      "Despite discussions in Western Australia, neither state nor federal governments have moved to implement a scalloped hammerhead code of conduct. Current conservation management is mostly limited to state fishing bans (e.g. WA’s beach ban, Queensland’s phase-out of gillnets).",

      "## Bigger picture",
      "Commercial fishing remains the biggest global threat, but **climate change** may also be shifting hammerhead behaviour. Warmer oceans may explain why Burleigh and Perth are becoming important habitats for both food and shelter.",

      "## Why it matters",
      "Estimated declines of **50–80%** between 1950 and 2021 underline the urgency. Tagging projects are now underway to better understand juvenile habitats and inform protection strategies.",

      "Protecting hammerheads will require **cross-border coordination**, combining satellite monitoring, local science, and public education to balance conservation with human activity.",
    ],
  },
];
