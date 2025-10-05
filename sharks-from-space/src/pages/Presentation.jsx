import React, { useState, useEffect } from "react";

const images = Array.from({ length: 7 }, (_, i) => ({
  src: `/presentation/${i + 1}.png`,
  //   title: `Slide ${i + 1}`,
}));

export default function Presentation({ title = "Presentation" }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i) => {
    setIndex(i);
    setOpen(true);
  };
  const close = () => setOpen(false);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-slate-900/70 border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => openAt(i)}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <img
                src={img.src}
                alt={img.title}
                className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/80 to-transparent">
                <p className="text-sm font-medium truncate">{img.title}</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[index].src}
              alt={images[index].title}
              className="w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 bg-slate-900"
            />
            <div className="mt-3 text-center text-sm text-slate-300">
              {images[index].title}
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-2">
              <button
                onClick={prev}
                className="h-10 w-10 rounded-full bg-slate-900/80 border border-slate-700 grid place-items-center hover:bg-slate-800"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={close}
                className="h-10 px-4 rounded-full bg-slate-900/80 border border-slate-700 hover:bg-slate-800 text-sm"
              >
                Close
              </button>
              <button
                onClick={next}
                className="h-10 w-10 rounded-full bg-slate-900/80 border border-slate-700 grid place-items-center hover:bg-slate-800"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="px-4 py-6 border-t border-slate-800 text-xs text-slate-400">
        <div className="mx-auto max-w-6xl">
          © {new Date().getFullYear()} Presentation
        </div>
      </footer>
    </div>
  );
}
