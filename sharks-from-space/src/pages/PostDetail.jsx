import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { POSTS } from "../data/posts";

const fmt = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
const readingTime = (post) => {
  const words = (post.content || []).join(" ").split(/\s+/).length;
  const min = Math.max(1, Math.round(words / 200));
  return `${min} min read`;
};

export default function PostDetail() {
  const { slug } = useParams();
  const idx = POSTS.findIndex((p) => p.slug === slug);
  const post = idx >= 0 ? POSTS[idx] : null;

  const prev = useMemo(() => (idx > 0 ? POSTS[idx - 1] : null), [idx]);
  const next = useMemo(
    () => (idx >= 0 && idx < POSTS.length - 1 ? POSTS[idx + 1] : null),
    [idx]
  );

  if (!post) {
    return (
      <div className="section">
        <div className="card">
          <h2 className="h2" style={{ marginBottom: 8 }}>
            Post not found
          </h2>
          <Link className="btn" to="/blog">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <Helmet>
        <title>{post.title} — Sharks from Space</title>
        <meta name="description" content={post.excerpt} />
        <link
          rel="canonical"
          href={`https://sharksfrom.space/blog/${post.slug}`}
        />
      </Helmet>

      <article className="card" style={{ overflow: "hidden" }}>
        <img
          src={post.cover || "/blog/covers/placeholder.jpg"}
          alt={post.title}
          className="post-cover"
        />

        <div className="post-body">
          <div className="post-meta">
            <span className="muted">{fmt(post.date)}</span>
            <span className="dot" aria-hidden>
              •
            </span>
            <span className="muted">{readingTime(post)}</span>
            {post.author && (
              <>
                <span className="dot" aria-hidden>
                  •
                </span>
                <span className="muted">by {post.author}</span>
              </>
            )}
          </div>

          <h1 className="h1" style={{ marginTop: 6 }}>
            {post.title}
          </h1>

          <div className="tags" style={{ marginTop: 8 }}>
            {(post.tags || []).map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>

          {/* Contenido: cada item de content es un párrafo */}
          <div className="post-content">
            {(post.content || []).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Navegación siguiente/anterior */}
          <div className="post-nav">
            <div>
              {prev && (
                <Link
                  to={`/blog/${prev.slug}`}
                  className="btn"
                  aria-label={`Previous: ${prev.title}`}
                >
                  ← {prev.title}
                </Link>
              )}
            </div>
            <div>
              {next && (
                <Link
                  to={`/blog/${next.slug}`}
                  className="btn"
                  aria-label={`Next: ${next.title}`}
                >
                  {next.title} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      <div style={{ marginTop: 12 }}>
        <Link className="btn" to="/blog">
          ← Back to all stories
        </Link>
      </div>
    </div>
  );
}
