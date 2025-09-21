export default function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid #15202b", marginTop: 32, padding: "20px" }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          color: "#9fb3c8",
          flexWrap: "wrap",
        }}
      >
        <span>© {new Date().getFullYear()} Sharks from Space</span>
        <nav style={{ display: "flex", gap: 16 }}>
          <a href="/about" style={{ color: "#9fb3c8", textDecoration: "none" }}>
            About
          </a>
          <a
            href="/contact"
            style={{ color: "#9fb3c8", textDecoration: "none" }}
          >
            Contact
          </a>
          <a href="/data" style={{ color: "#9fb3c8", textDecoration: "none" }}>
            Data
          </a>
        </nav>
      </div>
    </footer>
  );
}
