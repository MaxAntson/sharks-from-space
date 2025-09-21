import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Species from "./pages/Species";
import Map from "./pages/Map";
import Data from "./pages/Data";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";


export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
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

