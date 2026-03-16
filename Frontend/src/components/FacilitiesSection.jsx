import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

export default function FacilitiesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    fetch(`${API}/facilities`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) { setFacilities(d); setActiveIdx(0); } })
      .catch(() => {});
  }, []);

  const prev = () => setActiveIdx((a) => (a - 1 + facilities.length) % facilities.length);
  const next = () => setActiveIdx((a) => (a + 1) % facilities.length);

  return (
    <section id="campus" className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">
            Our Facilities
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-primary">
            Exceptional Facilities for Learning & Discovery
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Modern infrastructure that fosters academic excellence, research, and
            all-round student development.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden h-80 lg:h-[500px] mb-8 lg:mb-0 shadow-xl">
            {facilities.map((f, i) => (
              <div
                key={f.label}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === activeIdx ? 1 : 0 }}
              >
                <img
                  src={f.image}
                  alt={f.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                    Available Facility
                  </div>
                  <h3 className="text-2xl font-bold">{f.label}</h3>
                  <p className="text-gray-200 text-sm mt-1 max-w-xs">{f.desc}</p>
                </div>
              </div>
            ))}
            {/* Arrows */}
            <button
              onClick={prev}
              className="absolute top-1/2 -translate-y-1/2 left-4 z-10 w-10 h-10 rounded-full bg-white/25 hover:bg-white/50 text-white flex items-center justify-center backdrop-blur-sm transition-all"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 -translate-y-1/2 right-4 z-10 w-10 h-10 rounded-full bg-white/25 hover:bg-white/50 text-white flex items-center justify-center backdrop-blur-sm transition-all"
            >
              <FiChevronRight size={18} />
            </button>
            {/* Counter */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
              {String(activeIdx + 1).padStart(2, '0')} / {String(facilities.length).padStart(2, '0')}
            </div>
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-3 gap-4">
            {facilities.map((f, i) => (
              <button
                key={f._id || f.label}
                onClick={() => setActiveIdx(i)}
                className={`rounded-xl overflow-hidden relative aspect-[4/3] transition-all duration-300 ${
                  i === activeIdx
                    ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow-lg'
                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={f.image}
                  alt={f.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                  <span className="text-white text-xs font-semibold leading-tight">{f.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
