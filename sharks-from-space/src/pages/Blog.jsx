import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { POSTS } from "../data/posts";

export default function Blog() {
  return (
    <div className="section">
      <Helmet>
        <title>Blog – Sharks from Space</title>
        <meta
          name="description"
          content="Stories about satellite detection, shark species and conservation."
        />
      </Helmet>

      <h2 className="h2">Stories & Updates</h2>
      <div className="grid cols-3" style={{ gap: 16 }}>
        {POSTS.map((p) => (
          <article key={p.slug} className="card" style={{ overflow: "hidden" }}>
            {p.cover && (
              <img
                src={p.cover}
                alt={p.title}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
              />
            )}
            <div style={{ paddingTop: 8 }}>
              <h3 style={{ margin: "6px 0" }}>
                <Link
                  to={`/blog/${p.slug}`}
                  style={{ textDecoration: "none", color: "#eaf2fb" }}
                >
                  {p.title}
                </Link>
              </h3>
              <div className="muted" style={{ fontSize: 12 }}>
                {new Date(p.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
                · {p.author}
              </div>
              <p className="muted" style={{ marginTop: 8 }}>
                {p.excerpt}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {p.tags?.map((t) => (
                  <span key={t} className="badge">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
