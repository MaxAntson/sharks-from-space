import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backdropFilter: "blur(8px)",
        background: "rgba(11,15,20,.7)",
        borderBottom: "1px solid #15202b",
        zIndex: 10,
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 12c5-4 13-4 18 0-3 6-15 6-18 0Z" stroke="#32d0ff" />
            <circle cx="12" cy="12" r="2" fill="#32d0ff" />
          </svg>
          <strong>Sharks from Space</strong>
        </Link>

        {/* ✅ Mobile-friendly flex wrap */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "flex-end",
          }}
        >
          {[
            ["Home", "/"],
            ["Presentation", "/presentation"],
            ["Species", "/species"],
            ["Map", "/map"],
            ["Sources", "/sources"],
            ["Data", "/data"],
            ["Research", "/research"],
            ["Blog", "/blog"],
            ["About", "/about"],
            ["Contact", "/contact"],
          ].map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: isActive ? "#32d0ff" : "#9fb3c8",
                textDecoration: "none",
                transition: "color 0.2s",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
