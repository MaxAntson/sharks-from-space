import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { POSTS } from "../data/posts";

const fmt = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

const readingTime = (post) => {
  const words = (post.content || []).join(" ").split(/\s+/).length;
  const min = Math.max(1, Math.round(words / 200));
  return `${min} min read`;
};

export default function Blog() {
  const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="section">
      <Helmet>
        <title>Sharks from Space — Stories</title>
        <meta
          name="description"
          content="Stories and research notes: satellites, shark ecology, conservation, and open data."
        />
        <link rel="canonical" href="https://sharksfrom.space/blog" />
      </Helmet>
      <div className="card blog-hero">
        <div className="blog-hero__text">
          <div className="badge">Stories • Research • Field Notes</div>
          <h1 className="h1" style={{ marginTop: 8, marginBottom: 8 }}>
            Shark Stories from Space
          </h1>
          <p className="muted" style={{ maxWidth: 720 }}>
            Long-form posts with maps, imagery and datasets. Follow how we turn
            raw satellite signals into species intelligence for conservation.
          </p>
        </div>
        <div
          style={{
            backgroundImage: "url(/blog/covers/satelite.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "12px",
            minHeight: "260px",
            maxHeight: "320px",
            width: "100%",
          }}
          className="blog-hero__image"
          role="img"
          aria-label="Ocean from space"
        />
      </div>
      <div className="blog-grid">
        {posts.map((p) => (
          <article key={p.slug} className="card blog-card">
            <Link
              to={`/blog/${p.slug}`}
              className="blog-card__coverLink"
              aria-label={p.title}
            >
              <img
                className="blog-card__cover"
                src={p.cover || "/blog/covers/satelite.jpeg"}
                alt={p.title}
                loading="lazy"
              />
            </Link>

            <div className="blog-card__body">
              <div className="blog-card__meta">
                <span className="muted">{fmt(p.date)}</span>
                <span className="dot" aria-hidden>
                  •
                </span>
                <span className="muted">{readingTime(p)}</span>
              </div>

              <h3 className="blog-card__title">
                <Link to={`/blog/${p.slug}`}>{p.title}</Link>
              </h3>

              <p className="muted">{p.excerpt}</p>

              <div className="blog-card__footer">
                <div className="tags">
                  {(p.tags || []).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                <Link to={`/blog/${p.slug}`} className="btn">
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
