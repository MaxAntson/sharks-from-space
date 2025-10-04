import { useParams, Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { POSTS } from "../data/posts";

export default function BlogPost() {
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="section">
        <h2 className="h2">Post not found</h2>
        <Link className="btn" to="/blog">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="section">
      <Helmet>
        <title>{post.title} – Sharks from Space</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <article className="card" style={{ overflow: "hidden" }}>
        {post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            style={{ width: "100%", maxHeight: 360, objectFit: "cover" }}
          />
        )}
        <div style={{ paddingTop: 10 }}>
          <h1 className="h1" style={{ marginBottom: 8 }}>
            {post.title}
          </h1>
          <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            · {post.author}
          </div>

          {post.content?.map((para, idx) => (
            <p key={idx} className="p" style={{ marginBottom: 12 }}>
              {para}
            </p>
          ))}

          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}
          >
            {post.tags?.map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <Link className="btn" to="/blog">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
