import { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    fetch(`${API}/hero`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setSlides(data); })
      .catch(() => {});
  }, []);

  const go = useCallback(
    (next) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(next);
        setAnimating(false);
      }, 400);
    },
    [animating]
  );

  const next = useCallback(() => {
    if (slides.length) go((current + 1) % slides.length);
  }, [current, go, slides.length]);
  const prev = useCallback(() => {
    if (slides.length) go((current - 1 + slides.length) % slides.length);
  }, [current, go, slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (!slides.length) return null;

  return (
    <section className="relative w-full h-[78vh] sm:h-screen min-h-[520px] sm:min-h-[600px] overflow-hidden pt-[96px] sm:pt-[136px]">
      {/* Background Images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 ${i === current ? 'block' : 'hidden'}`}
          style={{
            zIndex: 0,
          }}
        >
          <img
            src={s.image}
            alt={s.title || 'Hero slide'}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all backdrop-blur-sm"
      >
        <FiChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all backdrop-blur-sm"
      >
        <FiChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs tracking-widest uppercase rotate-90 mb-2">Scroll</span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 w-full bg-white/70 animate-[scrollLine_1.5s_ease-in-out_infinite]" style={{height:'40%'}} />
        </div>
      </div>
    </section>
  );
}
