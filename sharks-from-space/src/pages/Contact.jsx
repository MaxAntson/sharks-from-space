import { Helmet } from "react-helmet-async";

export default function Contact() {
  return (
    <div className="section">
      {/* ✅ Helmet SEO */}
      <Helmet>
        <title>Contact – Sharks from Space</title>
        <meta
          name="description"
          content="Get in touch with Sharks from Space. Contact us by email or follow us on Twitter and Instagram."
        />
      </Helmet>

      <h2 className="h2">Contact</h2>
      <div className="card">
        <p className="muted">📧 hello@sharksfrom.space</p>
        <p className="muted">🐦/📸 Twitter &amp; Instagram: @sharksfromspace</p>
      </div>
    </div>
  );
}
