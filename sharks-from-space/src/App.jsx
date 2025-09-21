import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // ✅ Import Helmet
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Species from "./pages/Species";
import Map from "./pages/Map";
import Data from "./pages/Data";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* ✅ Default Helmet (used if a page doesn’t override it) */}
      <Helmet>
        <title>Sharks from Space 🌍</title>
        <meta
          name="description"
          content="Tracking sharks from space using satellites, open ocean datasets, and conservation insights."
        />
      </Helmet>

      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/species" element={<Species />} />
          <Route path="/map" element={<Map />} />
          <Route path="/data" element={<Data />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
