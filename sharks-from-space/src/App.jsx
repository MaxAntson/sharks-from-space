import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Species from "./pages/Species";
import SpeciesDetail from "./pages/SpeciesDetail";
import Map from "./pages/Map";
import Data from "./pages/Data";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import PostDetail from "./pages/PostDetail";
import Research from "./pages/Research";
import Sources from "./pages/Sources";
import ErrorBoundary from "./components/ErrorBoundary";
import Presentation from "./pages/Presentation";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<PostDetail />} />
          <Route path="/species" element={<Species />} />
          <Route path="/species/:key" element={<SpeciesDetail />} />
          <Route path="/research" element={<Research />} />
          <Route
            path="/map"
            element={
              <ErrorBoundary>
                <Map />
              </ErrorBoundary>
            }
          />
          <Route path="/data" element={<Data />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
