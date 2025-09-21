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
          gap: 10,
          color: "#9fb3c8",
        }}
      >
        <span>© {new Date().getFullYear()} Sharks from Space</span>
        <span>Data: satellites, open datasets, conservation</span>
      </div>
    </footer>
  );
}
