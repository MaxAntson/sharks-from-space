export default function Footer() {
  return (
    <footer
      style={{
        /* ❌ sin marginTop para evitar el “hueco blanco” */
        width: "100%",
        background: "linear-gradient(to right, #0b0f14, #111a24)",
        borderTop: "1px solid #15202b",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          color: "#9fb3c8",
          fontSize: 14,
          padding: "0 20px",
        }}
      >
        <span>© {new Date().getFullYear()} Sharks from Space</span>
        <span>
          🌊 Data from satellites • open datasets • conservation for our oceans
        </span>
      </div>
    </footer>
  );
}
