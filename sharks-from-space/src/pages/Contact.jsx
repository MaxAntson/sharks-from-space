export default function Contact() {
  const people = [
    {
      name: "Max Antson",
      role: "Team Lead",
      email: "max.antson@googlemail.com",
      linkedin: "https://www.linkedin.com/in/max-antson-542975101/",
      initials: "MA",
    },
    {
      name: "Zurab Metreveli",
      role: "Full-stack / Maps",
      email: "metreveli.zura.2014@gmail.com",
      linkedin: "https://www.linkedin.com/in/zurab-metreveli/",
      initials: "ZM",
    },
    {
      name: "Kaoli",
      role: "Research / Data",
      email: "kaolibupe@gmail.com",
      linkedin: null,
      initials: "K",
    },
    {
      name: "Carlos L",
      role: "Hardware Engineer",
      email: "carlosleon@gapp.nthu.edu.tw",
      linkedin: null,
      initials: "CL",
    },
  ];

  return (
    <div className="section">
      <h2 className="h2">Contact</h2>

      {/* General contact card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            aria-hidden
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#102331",
              border: "1px solid #2a4157",
              display: "grid",
              placeItems: "center",
            }}
          >
            <MailIcon />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <strong style={{ display: "block", marginBottom: 4 }}>
              General inquiries
            </strong>
            <p className="muted" style={{ margin: 0 }}>
              For partnerships, dataset tips, or press:{" "}
              <a href="mailto:hello@sharksfrom.space">hello@sharksfrom.space</a>
            </p>
          </div>
        </div>
      </div>

      {/* Team grid */}
      <div className="grid cols-3 contact-grid">
        {people.map((p) => (
          <article
            key={p.email}
            className="card"
            style={{ display: "grid", gap: 12 }}
          >
            {/* Avatar con iniciales */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                aria-hidden
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, rgba(50,208,255,.15), rgba(21,32,43,.6))",
                  border: "1px solid #1f2b3a",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  color: "#bfe8ff",
                }}
              >
                {p.initials}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {p.role}
                </div>
              </div>
            </div>

            {/* Contact rows */}
            <div
              style={{
                display: "grid",
                gap: 8,
                marginTop: 4,
                fontSize: 14,
              }}
            >
              <a
                href={`mailto:${p.email}`}
                className="contact-row"
                style={rowLinkStyle}
              >
                <InlineIcon>
                  <MailIcon />
                </InlineIcon>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.email}
                </span>
              </a>

              {p.linkedin ? (
                <a
                  href={p.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-row"
                  style={rowLinkStyle}
                >
                  <InlineIcon>
                    <LinkedInIcon />
                  </InlineIcon>
                  LinkedIn profile
                </a>
              ) : (
                <div
                  className="muted"
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <InlineIcon muted>
                    <LinkedInIcon />
                  </InlineIcon>
                  Coming soon
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              <a className="btn" href={`mailto:${p.email}`}>
                <InlineIcon small>
                  <MailIcon />
                </InlineIcon>
                Email
              </a>
              {p.linkedin && (
                <a
                  className="btn"
                  href={p.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InlineIcon small>
                    <LinkedInIcon />
                  </InlineIcon>
                  LinkedIn
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Socials / handles */}
      <div className="card" style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <InlineIcon>
            <GlobeIcon />
          </InlineIcon>
          <span className="muted">
            Social: @sharksfromspace on Twitter / IG
          </span>
        </div>
      </div>
    </div>
  );
}

/* ——— Helpers ——— */

const rowLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  textDecoration: "none",
  color: "#eaf2fb",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #1f2b3a",
  background: "#121821",
};

function InlineIcon({ children, small, muted }) {
  return (
    <span
      aria-hidden
      style={{
        width: small ? 14 : 16,
        height: small ? 14 : 16,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: muted ? "#5c708a" : "inherit",
      }}
    >
      {children}
    </span>
  );
}

/* ——— SVG Icons (sin dependencias) ——— */

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4z" stroke="#9fd7ff" />
      <path d="m4 7 8 6 8-6" stroke="#9fd7ff" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#9fd7ff" />
      <circle cx="8" cy="9" r="1" fill="#9fd7ff" />
      <path
        d="M7 11v6M11 11v6M11 13c0-1.2 1-2 2.5-2S16 12 16 13v4"
        stroke="#9fd7ff"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#9fd7ff" />
      <path
        d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"
        stroke="#9fd7ff"
      />
    </svg>
  );
}
