import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <div className="section">
      {/* ✅ Helmet SEO */}
      <Helmet>
        <title>About – Sharks from Space</title>
        <meta
          name="description"
          content="Learn more about the Sharks from Space project: our story, our goals, and how you can contribute to shark conservation."
        />
      </Helmet>

      <h2 className="h2">About the project</h2>
      <div className="card">
        <p className="muted">Team story, goals, and how to contribute.</p>
      </div>
    </div>
  );
}
